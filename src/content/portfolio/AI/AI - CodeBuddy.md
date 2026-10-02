---
title: CodeBuddy
date: 2026-03-22
permalink: /portfolio/CodeBuddy/
domain: Software
area: AI
skills:
  - Python
  - LangChain
  - LangGraph
excerpt: An AI-powered coding assistant built with LangGraph. It works like a multi-agent development team that can take a natural language request and transform it into a working project.
---
_How I used LangGraph, Groq, FastAPI, and Next.js to turn one sentence into a multi-file codebase, and what building it taught me about production agent design._

---

Ask an LLM to "build a Markdown note-taking app," and you'll usually get one of two things: a single bloated file, or a multi-file project where `app.js` calls functions that `utils.js` never defined.

I wanted to understand why, and whether the problem could be fixed with better architecture instead of a bigger model. That became **CodeBuddy**, an autonomous multi-agent system that takes a natural-language prompt and produces a structured, multi-file project, with every step streamed live to a web dashboard.

This post covers how it works, the design decisions behind it, what went wrong along the way, and what I'd build next.

**Stack:** LangGraph · LangChain · Groq · FastAPI (SSE) · Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Docker

**Code:** [github.com/datawithshoaib/CodeBuddy](https://github.com/datawithshoaib/CodeBuddy)

---

## Why single-prompt code generation breaks down

A single "write me a full app" prompt fails in predictable ways, and each failure points to a design requirement:

|What goes wrong|Why|What CodeBuddy does instead|
|---|---|---|
|Context gets bloated|Every file is generated in one giant pass|Each agent sees only the context its phase needs|
|Files disagree with each other|The model forgets names and signatures it defined earlier|The coder reads existing files before writing new ones|
|Files are written in the wrong order|UI is generated before the models it depends on|The architect orders tasks by dependency|
|Output is hard to parse|Free-form markdown fences, stray commentary|Pydantic schemas enforced through structured output|
|The model can't check its work|It has no view of the project on disk|The coder has sandboxed file tools|

The insight is that this isn't mainly a model-capability problem. It's a **workflow design** problem. Real teams don't build software in one breath: someone scopes it, someone designs it, someone implements it step by step. So I modeled the system the same way.

---

## The architecture: three agents, one state machine

```
User prompt
    │
    ▼
┌─────────┐    ┌───────────┐    ┌──────────────────┐
│ Planner │ ─▶ │ Architect │ ─▶ │  Coder (loops)   │ ──▶ DONE
└─────────┘    └───────────┘    │  read / write /  │
 what to build   in what order  │  list file tools │
                                └──────────────────┘
```

- **Planner:** turns the raw prompt into a blueprint with app name, description, tech stack, feature list, and the files to create.
- **Architect:** converts that blueprint into an ordered list of implementation tasks. Each task names the file, the functions and exports it must contain, and how it connects to earlier tasks.
- **Coder:** works through the tasks one at a time. For each, it reads what already exists, writes the complete file, and moves on.

Orchestrating this is a **LangGraph `StateGraph`**: the state is shared and typed, the nodes are the agents, and a conditional edge decides whether to loop or finish.

### Why LangGraph, and not a chain or a free-running agent?

I considered three approaches:

- **A linear chain** is too rigid. The number of tasks isn't known until the architect finishes, and a chain can't loop.
- **An AutoGPT-style autonomous loop** is flexible but risks goal drift and runaway sub-tasks, which is a bad trade when you want a predictable result.
- **LangGraph** gives explicit nodes and explicit routing, so the flow is controlled, with autonomy only where it's useful: inside the coder's tool use.

The result is bounded autonomy: the agent decides _how_ to write each file, but the graph decides _what happens next_.

---

## Engineering decisions that mattered

### 1. Typed state with Pydantic

State is the contract between agents, so I made it strict:

```python
class Plan(BaseModel):
    name: str
    description: str
    techstack: str
    features: list[str]
    files: list[File]

class ImplementationTask(BaseModel):
    filepath: str
    task_description: str   # variables, functions, imports to implement

class WorkflowState(TypedDict, total=False):
    user_prompt: str
    plan: Plan
    task_plan: TaskPlan
    coder_state: CoderState
    status: Literal["DONE"]
```

The planner and architect use `llm.with_structured_output(...)` against these schemas, so downstream nodes receive validated objects instead of text that has to be scraped. This removed an entire class of "the model added a sentence before the JSON" failures. (Schema enforcement sharply reduces malformed output, but it isn't magic. Validation errors still need handling, which I come back to below.)

### 2. Specialized prompts instead of one mega-prompt

Each agent has a narrow job and a prompt to match:

- **Planner:** scope, compatible libraries, idiomatic folder layout.
- **Architect:** _dependency ordering_ (config and models before routers, helpers before components) and _explicit interface contracts_ (exact function names, parameters, exports).
- **Coder:** read existing code first, write complete files, never leave `// TODO` placeholders, and follow the architect's interfaces.

The architect's interface contracts did the most to fix cross-file inconsistency. If task 3 says "export `formatDate(ts: number): string`," the coder in task 5 can't invent a different name.

### 3. Sandboxing an agent that can write files

Giving an LLM a `write_file` tool means treating its output as untrusted input. A model that emits `../../etc/passwd` as a path, by accident or via prompt injection, must not be able to write outside the workspace. All file tools route through a single guard:

```python
def safe_path_for_project(path: str) -> Path:
    root = PROJECT_ROOT.resolve()
    p = (root / path).resolve()
    if not p.is_relative_to(root):
        raise ValueError("Path escapes project root")
    return p
```

Resolving the path _before_ checking it is what defeats `..` tricks and symlink games. The tools also adapt to their environment: on read-only serverless platforms like Vercel or Lambda, the project root switches to `/tmp/generated_project`.

### 4. Streaming with SSE and a worker thread

A full generation run takes long enough that a blocking request would feel broken, and might hit gateway timeouts. So the backend streams progress over **Server-Sent Events**.

The catch is that LangGraph's `agent.stream()` is synchronous, and running it directly inside FastAPI's event loop would stall every other request. The fix is to run the graph in a worker thread and hand events back to the async side through a queue:

```python
queue = asyncio.Queue()

def stream_worker():
    try:
        for chunk in agent.stream({"user_prompt": prompt},
                                  {"recursion_limit": recursion_limit}):
            loop.call_soon_threadsafe(queue.put_nowait, ("chunk", chunk))
        loop.call_soon_threadsafe(queue.put_nowait, ("done", None))
    except Exception as e:
        loop.call_soon_threadsafe(queue.put_nowait, ("error", e))

loop.run_in_executor(None, stream_worker)

while True:
    kind, payload = await queue.get()
    ...  # yield SSE events to the client
```

**Why SSE over WebSockets?** The traffic pattern is one request in, many events out. SSE does exactly that over plain HTTP, reconnects automatically, and works cleanly behind proxies and load balancers. WebSockets would have added complexity with no benefit.

### 5. Why Groq

One generation run involves a planning call, an architecture call, and one coding call per file. That's easily 5 to 15 sequential LLM invocations. At typical API speeds, that adds up to a wait long enough that users stop watching. Running on Groq's high-throughput inference (with models like `llama-3.3-70b-versatile` and `gpt-oss-120b`) keeps the loop fast enough that the live pipeline view feels interactive. _(Add your measured end-to-end time for a typical project here, such as "a todo app in X seconds". A real number is more persuasive than an adjective.)_

---

## The frontend: making the agent's work visible

An agent is hard to trust when it's a black box. The Next.js dashboard shows what's happening:

- **A live pipeline tracker** moving through Planner → Architect → Coder with progress.
- **An inspector** with a Blueprint tab (stack and features), a Tasks tab (the architect's checklist), and an Activity stream of timestamped agent and tool events.
- **A file explorer and code viewer** with a tree, line numbers, and copy buttons.
- **One-click ZIP export** and a **workspace reset**.
- **Cancellation** through abort controllers, so a user can stop a run midway.

Watching the plan form, then the tasks, then files appearing one by one makes the system's reasoning visible, which makes it far easier to debug and to demo.

For deployment, a cross-platform `run.py` boots the backend and frontend with one command (checking the `.env` file, installing dependencies, opening the browser, and cleaning up the whole process tree on Ctrl+C). I also configured Docker, Vercel, and Render targets.

---

## What I tested

I ran CodeBuddy on a range of prompts, including a todo app with category filtering, dark mode and `localStorage` persistence; a FastAPI CRUD microservice (models, schemas, database layer, routes); and a split-pane Markdown editor with live preview and autosave.

Results were good for small-to-medium apps, with consistent file ordering and interfaces that matched across files. They were not flawless, and which prompts failed and why is where I learned the most.

---

## Limitations, and what I'd build next

This is the part I'd want to read as a hiring manager, so here it is plainly:

1. **The generated code isn't executed.** The coder writes files but never runs them, so a syntax error or a wrong import can slip through. The most important next step is a **tester node**: run `pytest` or `npm test`, feed stderr back to the coder, and loop until it passes. LangGraph's conditional edges make this a natural extension.
2. **No human checkpoint.** If the architect makes a bad plan, the coder faithfully implements it. LangGraph supports interrupts (`interrupt_before=["coder"]`), which would let a user review and edit the task list first.
3. **Quality isn't measured.** I validated by hand. A real evaluation harness, with a fixed prompt set, automated "does it build and run" checks, and tracked pass rates, would turn "it seems to work" into evidence.
4. **No version control integration.** Committing each step with a semantic message and opening a PR would make the output fit real workflows.

---

## What this project taught me

- **Architecture beats prompting.** Splitting one hard task into three focused roles improved reliability more than prompt tweaking did.
- **Structure is a feature.** Typed state and schema-enforced outputs make agents debuggable.
- **Agents need guardrails.** Tool access is an attack surface. Sandboxing belongs in the design from day one, not as an afterthought.
- **Latency shapes design.** Fast inference changes which multi-step architectures are practical.
- **Observability is part of the product.** Streaming the agent's progress changed how usable and trustworthy it felt.

---

## Let's talk

I'm looking for roles in **AI engineering, agentic systems, and full-stack AI development**. CodeBuddy shows how I approach this work: orchestrate carefully, constrain outputs, sandbox tools, ship something people can use, and be honest about what's left to improve.

**Shoaib Akthar** · [GitHub: CodeBuddy](https://github.com/datawithshoaib/CodeBuddy)

If this was useful, a star on the repo or a message is always appreciated.