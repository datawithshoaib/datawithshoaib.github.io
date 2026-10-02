---
title: PostDraft
date: 2026-08-28
permalink: /portfolio/PostDraft/
domain: Software
area: AI
skills:
  - Python
  - LangGraph
  - Streamlit
excerpt: Linkedin post generator using LangGraph
---
A few weeks ago, I found myself frustrated by the current state of "AI writing assistants."

Almost every AI tool for LinkedIn does the exact same thing: you feed it a topic, it fires a single prompt to an LLM, and it spits back a draft loaded with corporate clichés (*"In today's fast-paced world..."*, *"I am thrilled to announce..."*), 25 hashtag blocks, zero narrative tension, and generic bullet points. 

The fundamental problem isn't the model. The problem is the **architecture**.

Human writers don't publish the first raw words that spill onto the page. Good writing is an iterative editorial process: you write a rough draft, step back, critically evaluate it against specific quality criteria, ruthlessly trim fluff, sharpen the hook, and revise. 

I set out to build **PostDraft** to replicate that exact editorial workflow. Instead of a single-turn prompt wrapper, PostDraft is an **agentic, multi-agent editorial engine** built with **LangGraph**, powered by ultra-fast inference on **Groq** (`llama-3.3-70b-versatile`), backed by **FastAPI** with Server-Sent Events (SSE) streaming, and wrapped in a **Next.js 16 + shadcn/ui** interface that lets you watch the agents think, critique, and revise in real time.

In this article, I’ll walk through the engineering journey of building PostDraft: the architectural decisions, the bugs I ran into (and fixed), the state machine mechanics, and the trade-offs I made while taking this from a raw terminal script to a production-ready application.

---

## Architecture at a Glance

Before diving into the code, here is high-level system architecture of PostDraft:

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js 16 + React 19 + shadcn/ui)"]
        UI["PostForm (Generate or Review Mode)"]
        Stepper["AgentStepper (Real-Time State Transitions)"]
        Scorecard["ReviewerPanel (7-Criteria Rubric & History)"]
        Preview["LinkedInPreview (Interactive Feed Simulation)"]
    end

    subgraph API ["Backend API (FastAPI + Uvicorn)"]
        REST["/api/generate (Sync Fallback)"]
        SSE["/api/generate/stream (Server-Sent Events)"]
        Config["/api/config (Model Discovery & Health)"]
    end

    subgraph Graph ["LangGraph State Machine Engine"]
        StartNode(["START"])
        RouteDecision{"Workflow Mode?<br/>Generate vs. Review"}
        WriterAgent["Writer Agent<br/>(ChatGroq: Llama 3.3 70B, temp=0.7)"]
        ToolDecision{"Tool Calls Needed?"}
        TavilySearch["Tavily Search Tool<br/>(Live Web Intelligence)"]
        ExtractDraft["Extract Draft Node<br/>(Clean Markdown/Quotes)"]
        ReviewerAgent["Reviewer Agent (Critic)<br/>(ChatGroq: Llama 3.3 70B, temp=0.2)"]
        LoopDecision{"Verdict == APPROVED<br/>or Attempt >= Max?"}
        EndNode(["END"])
    end

    UI -->|HTTP POST Payload| SSE
    SSE -->|Stream LangGraph Updates| Stepper
    SSE -->|Stream Scorecard & Verdicts| Scorecard
    SSE -->|Stream Final Draft| Preview

    StartNode --> RouteDecision
    RouteDecision -->|Generate Mode| WriterAgent
    RouteDecision -->|Review Mode (User Draft)| ReviewerAgent

    WriterAgent --> ToolDecision
    ToolDecision -->|Tool Calls Present| TavilySearch
    TavilySearch -->|Return Search Context| WriterAgent
    ToolDecision -->|No Tools| ExtractDraft

    ExtractDraft --> ReviewerAgent

    ReviewerAgent --> LoopDecision
    LoopDecision -->|Rejected & Attempt < Max| WriterAgent
    LoopDecision -->|Approved OR Attempt == Max| EndNode
```

---

## Phase 1: The Initial Prototype (V1) & Key Bugs Discovered

I started with a simple prototype in a single Python script (`main.py`) to validate whether a two-agent loop—a **Writer** and a **Reviewer**—could produce noticeably higher-quality output than a single LLM prompt.

In V1, my setup looked like this:
- **Writer Agent**: `ChatOpenAI` running `gpt-4o-mini` with Tavily search bound as a tool.
- **Reviewer Agent**: `ChatGroq` running open-source models with low temperature.
- **Orchestration**: A basic `StateGraph` compiled with LangGraph.

While the concept worked on simple inputs, building and testing V1 exposed two major architectural flaws that forced me to rethink my design.

### Flaw 1: The Broken Graph Routing Edge

In my initial graph implementation, I had written the conditional routing edges like this:

```python
# The buggy edge in V1:
graph.add_edge('tools', 'reviewer')
graph.add_edge('extract_draft', 'reviewer')
```

I noticed that whenever the Writer decided to use Tavily web search to look up current statistics, the post quality plummeted. In fact, it often outputted raw search queries!

**Why?** When the Writer triggered a tool call, LangGraph executed the `tools` node. But my edge routed `tools` directly into the `reviewer`! The Writer never had the opportunity to receive the tool's output messages, reason over the facts, and synthesize them into a draft.

**The Fix:**
Tools must always cycle back to the calling agent so the agent can inspect the observation and produce its final response:

```python
# The corrected cyclic routing in V2:
workflow.add_conditional_edges(
    "writer", 
    should_use_tool, 
    {"tools": "tools", "extract_draft": "extract_draft"}
)
workflow.add_edge("tools", "writer")  # Cycle back to writer with context!
workflow.add_edge("extract_draft", "reviewer")
```

### Flaw 2: Multi-Model Latency and Cost Inefficiencies

In V1, I was splitting workloads between OpenAI (GPT-4o-mini) for writing and Groq for reviewing. This introduced:
1. Dual API key dependencies and credential friction.
2. Latency bottlenecks: An agentic loop requires multiple LLM round-trips (generation → review → revision → review). Waiting 12 to 18 seconds for OpenAI completions ruined the user experience.

I benchmarked Groq’s LPU (Language Processing Unit) inference running Meta’s `llama-3.3-70b-versatile`. Groq was clocking throughput of **300+ tokens per second**, meaning an entire 200-word draft and critique cycle took less than 1.5 seconds. 

I decided to migrate the entire system to be **100% OpenAI-free**, running purely on Groq. The speed gains made an iterative multi-agent loop feel snappy and interactive rather than sluggish.

---

## Phase 2: State Machine Engineering with LangGraph

One of the most important decisions when building agentic systems is choosing the right orchestration layer. Simple chains (like traditional LangChain `RunnableSequence` or sequential pipes) are DAGs (Directed Acyclic Graphs)—they cannot naturally loop, branch conditionally, or self-correct based on feedback.

LangGraph was the clear choice because it models agent interactions as a **stateful, cyclic state machine**.

### 1. Defining the State Schema

Everything in LangGraph revolves around the state object. I defined `AgentState` using Python's `TypedDict`:

```python
# backend/agent.py
class AgentState(TypedDict):
    topic: str
    tone: str
    audience: str
    custom_instructions: str
    use_search: bool
    max_attempts: int
    attempt: int
    messages: Annotated[list, add_messages]
    draft: str
    review_feedback: str
    is_approved: bool
    history: list
    is_user_post: bool
```

Key architectural details here:
- `messages: Annotated[list, add_messages]`: By using LangGraph's `add_messages` reducer, incoming messages append to existing conversation history rather than overwriting it. This is mandatory for tool-use loops where tool call requests and tool execution results must maintain strict alternating ordering.
- `attempt` and `max_attempts`: Acts as an explicit loop guardrail. AI agents without strict halting bounds risk infinite revision loops, burning API rate limits and compute credits.
- `history`: Accumulates per-attempt draft snapshots, word counts, and reviewer critiques so the frontend can render an audit log.

### 2. Node Calibration: Actor vs. Critic

A common trap in agent design is using the same prompt style and temperature across all nodes. In PostDraft, the Writer and Reviewer have diametrically opposed jobs, so their configurations must reflect that:

| Dimension | Writer Agent (Actor) | Reviewer Agent (Critic) |
|---|---|---|
| **Model** | `llama-3.3-70b-versatile` | `llama-3.3-70b-versatile` |
| **Temperature** | `0.7` (Encourages voice, storytelling, cadence) | `0.2` (Strict, deterministic rubric adherence) |
| **Tools** | Tavily Web Search (dynamically bound) | None (Pure evaluation) |
| **Role** | Synthesize insights into engaging copy | Ruthlessly identify flaws against quality gates |

#### The 7-Point Editorial Rubric

The Reviewer agent is grounded by a strict prompt enforcing 7 non-negotiable criteria for LinkedIn posts:

1. **Strong hook in the first line**: Must stop scrolling immediately without cheap clickbait.
2. **One clear takeaway**: Posts that try to teach five things end up teaching nothing.
3. **High skimmability**: 1–3 sentence paragraphs with clean whitespace.
4. **Optimal length**: 150–200 words (the algorithm sweet spot for dwell time).
5. **Engaging CTA/Question**: Must spark discussion in the comments.
6. **Authentic, human voice**: Zero corporate fluff, robotic jargon, or generic AI buzzwords (*"dive in"*, *"delve"*, *"game-changer"*).
7. **Zero hashtags**: Hashtags no longer aid organic reach on LinkedIn and clutter visual readability.

#### Structured Output Parsing: Why Text Format Beat JSON Mode

Early on, I experimented with JSON mode for the Reviewer:
```json
{
  "verdict": "APPROVED" | "REJECTED",
  "feedback": "..."
}
```

However, smaller or open-source models occasionally produced malformed JSON when outputting lengthy editorial feedback with unescaped quotation marks or line breaks. 

Instead, I enforced an explicit, bulletproof string format:
```text
VERDICT: APPROVED or REJECTED
FEEDBACK: <one concise paragraph explaining why it passed or what specific improvements must be made>
```

In the node logic, extracting the verdict is trivial and 100% resilient:
```python
review_text = response.content.strip()
verdict_part = review_text.split("FEEDBACK:")[0].upper()
is_approved = "APPROVED" in verdict_part and "REJECTED" not in verdict_part

feedback = review_text.split("FEEDBACK:", 1)[1].strip() if "FEEDBACK:" in review_text else review_text
```

This simple architectural choice eliminated parsing crashes completely.

---

## Phase 3: Supporting Dual Workflows (The "Review My Post" Feature)

While testing PostDraft, I realized an essential product insight: **experienced creators rarely want an AI to write a post from scratch.** They already have a draft they wrote themselves; what they want is an objective, automated editor to stress-test their copy against platform standards.

This required introducing a dual workflow mode:
1. **Generate Mode**: Topic → Writer → Reviewer → Loop.
2. **Review Mode**: User Draft → Reviewer → Writer (only if rejected) → Loop.

To implement this cleanly without creating two separate graphs, I leveraged LangGraph's dynamic conditional entry point:

```python
def route_start(state: AgentState):
    # If the user supplied their own post, start directly at the reviewer!
    if state.get("is_user_post", False) and state.get("draft", "").strip():
        return "reviewer"
    return "writer"

workflow.add_conditional_edges(
    START, 
    route_start, 
    {"writer": "writer", "reviewer": "reviewer"}
)
```

If the user's post passes all 7 criteria on Attempt 1, it exits immediately with an approval badge. If it fails, the graph routes to the Writer, with a specialized prompt that instructs the model to preserve the original author's voice while fixing the flagged issues:

```python
user_prompt = (
    f"The author's original submitted draft was reviewed and rejected by the editorial reviewer.\n\n"
    f"Draft to Improve:\n\"\"\"\n{previous_draft}\n\"\"\"\n\n"
    f"Reviewer Feedback:\n{previous_feedback}\n\n"
    f"Please rewrite and improve this LinkedIn post so that it addresses every critique in the feedback, "
    f"while preserving the author's core ideas, message, and authentic voice."
)
```

---

## Phase 4: Backend Architecture & Server-Sent Events (SSE)

Running a multi-agent loop with web searches and multiple revision attempts can take anywhere from 3 to 10 seconds. In modern web applications, forcing a client to wait on a blocking synchronous HTTP `POST` request creates terrible UX. The user is left staring at an unresponsive spinner with no insight into whether the system is researching, writing, or reviewing.

To solve this, I designed a real-time event streaming pipeline using **Server-Sent Events (SSE)** over FastAPI.

### Streaming LangGraph State Updates

LangGraph provides an asynchronous streaming API (`app.astream`) that yields state updates as each node in the graph finishes execution:

```python
# backend/agent.py
async def run_agent_generator(request: GenerateRequest) -> AsyncGenerator[Dict[str, Any], None]:
    ...
    async for output in app.astream(initial_state, stream_mode="updates"):
        for node_name, node_update in output.items():
            if node_name == "writer":
                # Check if the writer emitted tool calls or completed text
                messages = node_update.get("messages", [])
                last_msg = messages[-1] if messages else None
                if getattr(last_msg, "tool_calls", None):
                    yield {
                        "event": "step",
                        "step": "researching",
                        "status": "Gathering context via web search..."
                    }
                else:
                    yield {
                        "event": "step",
                        "step": "drafting",
                        "status": f"Drafting post (Attempt {current_attempt})..."
                    }
            elif node_name == "reviewer":
                yield {
                    "event": "review_verdict",
                    "attempt": current_state["attempt"],
                    "verdict": "APPROVED" if node_update["is_approved"] else "REJECTED",
                    "feedback": node_update["review_feedback"],
                    "history": node_update["history"]
                }
```

In FastAPI, this is exposed through a streaming endpoint:

```python
# backend/main.py
@app.post("/api/generate/stream")
async def generate_post_stream(request: GenerateRequest):
    async def event_generator():
        try:
            async for event_data in run_agent_generator(request):
                yield f"data: {json.dumps(event_data)}\n\n"
                await asyncio.sleep(0.01)  # Buffer flush
        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
```

### Resilient Fallback Mechanism

WebSockets and SSE streams can occasionally terminate prematurely due to aggressive client timeouts, reverse proxies, or network hiccups. To guarantee 100% system reliability, I implemented a client-side fallback in `frontend/src/app/page.tsx`: if the SSE stream encounters an unexpected disconnect, the frontend automatically falls back to the synchronous `/api/generate` REST endpoint, ensuring the user always receives their final post without having to restart.

---

## Phase 5: Frontend Design & The Trust Factor in AI UX

A common failure in AI products is the "black box" syndrome: users click a button, something invisible happens, and text appears. When the user doesn't know *why* an AI wrote what it wrote, trust evaporates.

I designed the PostDraft UI (Next.js 16, React 19, Tailwind CSS, shadcn/ui) around **transparency and inspectability**.

```
+-----------------------------------------------------------------------------------------+
|                                    PostDraft Header                                     |
+-----------------------------------------------------------------------------------------+
|  [ Live Research ] -> [ Writer LLM ] -> [ Strict Reviewer ] -> [ Revision ] -> [ Ready ]|
|  Attempt 2 of 3 | Status: Revising post based on reviewer critique...                  |
+---------------------------------------------------+-------------------------------------+
|  Left Column: Controls & Scorecard                | Right Column: Interactive Preview   |
|                                                   |                                     |
|  [ Generate from Topic ] [ Review My Post ]       |  +-------------------------------+  |
|  Topic Input / Post Paste Area                    |  | User Avatar • Just now • 🌐   |  |
|  Tone Selector (Thought Leadership, etc.)         |  |                               |  |
|  Audience Specification                           |  | Post Draft Content...         |  |
|  [x] Tavily Web Search Integration                |  |                               |  |
|                                                   |  |                               |  |
|  ---------------------------------------------    |  +-------------------------------+  |
|  Strict Editorial Rubric (7 Criteria Scorecard)   |  Word Count: 172 words (Optimal)    |
|  [x] Strong Hook        [x] One Takeaway          |  [ Edit ] [ Copy Post ]             |
|  [x] High Skimmability  [x] 150-200 Words         |                                     |
|  [x] Engaging CTA       [x] Human Voice           |  👍 348 reactions • 52 comments     |
|  [x] Zero Hashtags                                |  [Like] [Comment] [Repost] [Send]   |
|                                                   |                                     |
|  Review & Revision History (Audit Trail)          |                                     |
|  [ Your Draft (110w) ❌ ] [ Attempt 2 (175w) ✅ ]  |                                     |
|  Reviewer Critique: "First draft lacked CTA..."   |                                     |
+---------------------------------------------------+-------------------------------------+
```

### 1. The Visual Agent Stepper (`AgentStepper.tsx`)
Rather than a generic loader, the stepper visually highlights the current node executing in the graph:
- `researching`: Tavily search active.
- `drafting`: Writer node active.
- `reviewing`: Reviewer inspecting the 7 criteria.
- `revising`: Cyclical edge returning back to the Writer with feedback.
- `approved`: Terminal success state reached.

### 2. Full Revision Audit Trail (`ReviewerPanel.tsx`)
Every pass through the Reviewer node appends a snapshot of the draft, the word count, the binary verdict, and the exact written critique to the history state. Users can click through previous revision tabs to inspect how the draft evolved across attempts. This turns the AI from a magic black box into a collaborative partner whose editorial logic you can scrutinize.

### 3. The Desktop LinkedIn Reality Simulator (`LinkedInPreview.tsx`)
Context matters. Reading copy in a generic text box feels completely different from seeing it rendered in LinkedIn's desktop feed format with realistic avatars, reaction badges, and social action buttons.
- **Word Count Sweet Spot Indicator**: Real-time badge that turns emerald when the word count sits in the algorithmic sweet spot (140–220 words).
- **Inline Editing**: Allows the user to toggle into an inline textarea to manually tweak sentences before copying.
- **One-Click Clipboard Export**: Cleanly extracts the post without any Markdown formatting artifacts.

---

## Phase 6: Fullstack Orchestration (`run.py`)

A minor but critical detail in fullstack engineering is developer experience. Running a Python FastAPI backend and a Next.js Node frontend usually requires opening two separate terminal tabs, activating virtual environments, and manually killing processes when finished.

I wrote an orchestration launcher in `run.py` that handles this seamlessly:

```python
# Starts FastAPI and Next.js concurrently, monitors health, 
# and handles cross-platform process tree cleanup:
python run.py
```

### Key Engineering Decisions in `run.py`:
1. **Automated Environment Resolution**: Automatically locates `.venv/Scripts/python.exe` on Windows or the active Python binary on POSIX.
2. **Dependency Checking**: Checks whether `frontend/node_modules` exists before running `npm run dev`; if missing, it runs `npm install` automatically.
3. **Clean Process Tree Termination**: On Windows, child processes spawned by Node or Uvicorn often become orphaned zombies when the parent script exits. I implemented Windows-specific `taskkill /F /T /PID` calls alongside POSIX `signal.SIGTERM` to ensure that pressing `Ctrl+C` cleans up every port and thread immediately.

---

## Technical Decisions & Trade-Offs Analyzed

When evaluating an engineering project, the *why* matters just as much as the *what*. Here are the key technical trade-offs I navigated:

### 1. Why Groq (Llama 3.3 70B) over OpenAI (GPT-4o)?
- **Inference Speed**: An agentic loop involves multiple sequential model invocations. On traditional cloud GPU providers, multi-step generation took 15+ seconds. On Groq LPUs, token generation rates exceed 300 tokens/sec. The entire 3-attempt cycle executes in under 5 seconds.
- **Cost & Rate Limits**: Running multi-turn agent evaluations on proprietary closed models gets expensive quickly. Llama 3.3 70B on Groq provides GPT-4-class reasoning at a fraction of the cost, making the tool sustainable to operate.

### 2. Why LangGraph over a Simple Python Loop?
- A naive `while attempt < 3` loop in Python could technically implement a prompt-and-review cycle. However, as complexity grows (adding tool use, conditional entry points for user drafts, branching based on search needs), raw procedural code becomes tangled with nested state mutations.
- LangGraph gives us:
  - **Explicit state transitions**: Clear separation of nodes and routing functions.
  - **Built-in checkpointing and streaming**: Native support for emitting state diffs over SSE (`stream_mode="updates"`).
  - **Extensibility**: Adding new nodes (e.g., an automated image generator or a fact-checking node) requires only adding a node and an edge, without rewriting core application flow.

### 3. Why Strict 7-Point Quality Gates?
- Generic prompts like *"make this post better"* produce marginal, subjective edits.
- By codifying specific, measurable criteria (hook in line 1, exactly 1 thesis, short paragraphs, 150-200 words, closing CTA question, human tone, zero hashtags), the Reviewer's feedback becomes actionable delta instructions for the Writer agent to correct on the subsequent attempt.

---

## Results & Sample Output

Here is an example of PostDraft in action on a challenging, technical topic:

> **Topic:** *Why simple architecture beats clever complexity every time*  
> **Tone:** *Thought Leadership*  
> **Audience:** *Senior Engineers & Tech Leads*

### Attempt 1 (Rejected by Reviewer):
> **Draft:**  
> In modern software development, we often see teams building microservices and distributed caching before they have 100 users. Why do we over-engineer? It creates tech debt, increases onboarding time, and slows down releases. Simple architectures are easier to maintain, easier to scale, and cheaper to operate. Always choose boring technology. Let me know what you think in the comments! #Architecture #Coding #SoftwareEngineering
>
> **Reviewer Verdict:** `REJECTED`  
> **Feedback:** *The draft has a solid premise, but failed criterion 4 (too short at only 68 words; fails to provide concrete technical examples) and criterion 7 (contains 3 hashtags). The closing CTA is also generic.*

### Attempt 2 (Revised by Writer based on Feedback):
> **Draft:**  
> The most dangerous engineer on your team isn’t the junior who writes buggy code. 
> 
> It’s the senior engineer who designs a distributed Kubernetes microservices cluster for a problem that needed a single Postgres table and a cron job.
> 
> Clever architectures feel like progress. They look impressive on a promotion packet. You get to play with Kafka, distributed caches, and event-driven sagas.
> 
> But clever architectures carry an invisible tax:
> 
> Every extra network boundary is a new failure mode. Every added service triples your monitoring overhead. And when production breaks at 2:00 AM, nobody knows how the system actually behaves.
> 
> Great engineering isn’t measured by how complex a system you can build. It’s measured by how simple a solution you can maintain under real-world pressure.
> 
> Choose boring tools. Maximize simplicity until the business forces you not to.
> 
> What is one piece of 'clever' tech your team adopted that you later regretted?
>
> **Reviewer Verdict:** `APPROVED`  
> **Word Count:** 168 words  
> **Feedback:** *Exceptional hook in the first two lines. Exactly one cohesive thesis about maintenance tax. Paragraphs are skimmable with clean spacing. Sits perfectly within the 150-200 word sweet spot. Ends with a high-engagement question. Zero hashtags. Ready to publish.*

---

## Lessons Learned & Future Roadmap

Building PostDraft reinforced three foundational principles of real-world AI engineering:

1. **Prompts are code—test them adversarially**: An agent prompt without explicit boundaries will drift. Constraining the Reviewer with a strict binary verdict and concrete criteria turned an unreliable feedback cycle into a dependable engine.
2. **Latency is a first-class UX constraint**: Fast inference doesn't just make an app feel faster; it fundamentally enables architectures (like multi-turn agent critic loops) that would be unusable on slower APIs.
3. **State visibility builds user trust**: When users can see the agent's internal monologue, reviewer scores, and revision history, the tool transitions from an unpredictable toy to a transparent, professional workflow.

### What's Next for PostDraft:
- **Multimodal Visual Pairing**: Adding an agent node that uses Flux or Stable Diffusion to generate matching editorial diagrams or LinkedIn carousel slides.
- **Direct LinkedIn OAuth Integration**: One-click scheduling and automated posting directly from the preview card.
- **Personalized Voice Calibration**: Ingesting a user's past 10 top-performing LinkedIn posts to fine-tune the Writer agent's tone vector.

---

## Project Repository & Quickstart

PostDraft is completely open-source and easy to run locally:

```powershell
# Clone the repository
git clone https://github.com/datawithshoaib/PostDraft.git
cd PostDraft

# Set up environment
cp .env.example .env
# Add your free GROQ_API_KEY to .env

# Launch both Backend & Frontend with one command
python run.py
```

- **Backend API**: `http://127.0.0.1:8000` (Docs: `/docs`)
- **Web UI**: `http://localhost:3000`

---

*If you’re hiring for AI engineering, fullstack systems, or agentic workflow roles, I’d love to connect. Check out the code in this repo or reach out to me directly.*
