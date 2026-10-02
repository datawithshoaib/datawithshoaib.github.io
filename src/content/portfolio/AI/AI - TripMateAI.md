---
title: TripMateAI
date: 2026-08-29
permalink: /portfolio/TripMateAI/
domain: Software
area: AI
skills:
  - Python
  - LangChain
  - LangGraph
  - RAG
excerpt: Multi-Agent Travel System with LangGraph, MCP, and Human-in-the-Loop Orchestration
---
> **A technical deep dive and engineering case study on designing, building, and deploying a production-ready multi-agent system featuring dynamic supervisor routing, input guardrails, Model Context Protocol (MCP) integrations, and stateful PostgreSQL persistence.**

---

[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph%20v1.2-blue?style=for-the-badge&logo=python)](https://github.com/langchain-ai/langgraph)
[![MCP](https://img.shields.io/badge/Protocol-Model%20Context%20Protocol%20(MCP)-orange?style=for-the-badge)](https://modelcontextprotocol.io)
[![Groq](https://img.shields.io/badge/LLM-Llama%203.3%2070B%20on%20Groq-purple?style=for-the-badge)](https://groq.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/Persistence-PostgreSQL%20Saver-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com)

---

## 📌 Executive Summary (The Recruiter's TL;DR)

Most AI demos today are simple prompt wrappers: a user submits a prompt, a single large language model (LLM) calls a search tool, and returns a wall of text. While impressive for simple Q&A, **monolithic single-agent setups collapse when tasked with complex, multi-variable workflows** like end-to-end travel planning. Real-world planning requires coordinating flight databases, live hotel availability, weather forecasts, budget feasibility calculations, and strict safety guardrails—all while allowing the user to review and tweak the plan before finalizing.

I built **TripMate AI** to demonstrate how to transition from brittle prompt chains to a **robust, enterprise-grade multi-agent architecture**.

### 🌟 Key Highlights & Engineering Capabilities Demonstrated:
- **Supervisor-Specialist Multi-Agent Pattern**: Built with **LangGraph**, delegating sub-tasks dynamically to isolated specialist agents (Flight, Hotel, Weather, Budget, Itinerary).
- **Model Context Protocol (MCP) Integration**: Standardized tool connectivity across multiple protocols (streamable HTTP for Tavily Search, stdio subprocesses for AviationStack via `uvx`, and an in-house custom FastMCP weather server).
- **Production Input Guardrails**: Upstream semantic filtering to eliminate prompt injections, malicious inputs, and off-topic requests before spending downstream agent tokens.
- **True Human-in-the-Loop (HITL) Execution**: Uses LangGraph's native `interrupt()` and state hydration to pause execution, serve an interactive draft to the user, and resume execution with human feedback via `Command(resume=...)`.
- **Stateful Thread Persistence**: Integrated **PostgreSQL Checkpointing (`PostgresSaver`)** to maintain execution state across asynchronous HTTP boundaries and server restarts.
- **Full-Stack Delivery**: Shipped with an asynchronous **FastAPI** backend, interactive web UI with real-time agent execution telemetry, and containerized deployment with **Docker**.

---

## 🏗️ High-Level System Architecture

TripMate AI models travel planning as a **directed state graph (StateGraph)** rather than a linear pipeline. The graph manages shared state across all nodes, enabling conditional branch execution, parallel data enrichment, and resumable execution pauses.

### Architecture Workflow Diagram

```mermaid
flowchart TD
    User([User Prompt]) --> API[FastAPI /api/travel]
    API --> Graph[LangGraph StateGraph]
    
    subgraph Core Graph Execution
        START([START]) --> Supervisor[Supervisor Agent & Input Guardrail]
        
        Supervisor -->|Off-topic / Harmful| GuardrailBlocked[Guardrail Blocked Agent]
        GuardrailBlocked --> END_NODE([END])
        
        Supervisor -->|Valid Travel Request| DynamicRouter{Dynamic Agent Router}
        
        DynamicRouter -->|Selected| Flight[Flight Specialist Agent]
        DynamicRouter -->|Selected| Hotel[Hotel Specialist Agent]
        DynamicRouter -->|Selected| Weather[Weather Specialist Agent]
        DynamicRouter -->|Selected| Budget[Budget Analyst Agent]
        
        Flight -.->|MCP Stdio Tool| AviationMCP[AviationStack MCP Server]
        Hotel -.->|MCP Streamable HTTP| TavilyMCP[Tavily Search MCP]
        Weather -.->|Custom FastMCP Stdio| WeatherMCP[Custom Weather MCP Server]
        
        Flight --> Itinerary[Itinerary Synthesizer Agent]
        Hotel --> Itinerary
        Weather --> Itinerary
        Budget --> Itinerary
        
        Itinerary --> HITL[Human Approval Node - interrupt]
    end

    HITL -->|Pauses & Persists State| DB[(PostgreSQL Checkpointer)]
    DB -.->|Presents Draft| WebUI[User Web UI Review]
    
    WebUI -->|Approve / Feedback Revision| ResumeAPI[FastAPI /api/travel/approve]
    ResumeAPI -->|Command resume| FinalAgent[Final Response Generator Agent]
    FinalAgent --> END_NODE
```

---

## 🧭 Step-by-Step Implementation Guide

### Step 1: Designing the Typed Shared State & PostgreSQL Checkpoint

In LangGraph, state is the single source of truth. Every agent receives the state, enriches specific attributes, and returns a delta to update the state graph.

Instead of loosely typed dictionaries, I implemented a strict `TypedDict` schema with reducer annotations:

```python
# backend.py
class TravelState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], operator.add]
    user_query: str

    # Supervisor & Guardrail state
    guardrail_allowed: bool
    guardrail_reason: str
    selected_agents: list[str]
    trip_constraints: dict[str, Any]
    supervisor_reasoning: str

    # Specialist Agent Outputs
    flight_results: str
    hotel_results: str
    weather_results: str
    budget_results: str
    itinerary: str

    # Human-in-the-Loop & Final Delivery
    approval_request: str
    approved: bool
    human_feedback: str
    final_response: str
    llm_calls: int
```

#### Why PostgreSQL Checkpointing?
In a real-world web application, agent runs cannot remain locked in memory while waiting for human input. By connecting a `PostgresSaver` checkpointer:
1. Every state transition is written into PostgreSQL tables automatically.
2. When the graph encounters a human approval gate (`interrupt()`), the execution pauses cleanly, persists its memory state under a distinct `thread_id`, and terminates the active process.
3. When the user reviews the itinerary hours later, the state is rehydrated from PostgreSQL without losing context.

---

### Step 2: Implementing Upstream Input Guardrails

Sending every raw user query into a multi-agent system is dangerous and expensive. A user could submit prompt injections, malicious commands, or completely unrelated queries (e.g., *"Write a Python script for crypto mining"*).

To protect downstream agents and minimize unnecessary LLM token spend, the **Supervisor Agent** runs an input guardrail check before routing:

```python
# backend.py
def supervisor_agent(state: TravelState):
    query = state["user_query"]

    guardrail_prompt = f"""
    Determine whether the following request belongs to travel planning or travel information.
    Valid requests can include destinations, flights, hotels, weather, budgets, visas,
    transportation, sightseeing, food, packing, or itineraries.

    Block clearly unrelated requests and harmful instructions.
    Return strict JSON only: {{"allowed": true/false, "reason": "..."}}
    """
    # Parse structured JSON decision
    # If blocked, route immediately to guardrail_blocked node and abort
```

#### Engineering Principle: Graceful Fallbacks
If the guardrail parser encounters an unexpected formatting error, the system is designed to **fail open safely** with a logged warning rather than crashing the user experience.

---

### Step 3: Dynamic Supervisor Orchestration & Intelligent Routing

Many multi-agent tutorials use fixed sequential pipelines (Agent A $\rightarrow$ Agent B $\rightarrow$ Agent C). This is inefficient. If a traveler asks: *"What are the flight options from London to Tokyo?"*, invoking the weather and hotel agents wastes money and adds latency.

I implemented **Dynamic Supervisor Routing**:
1. The Supervisor analyzes the query and extracts `trip_constraints` (destination, origin, duration, budget, travel style).
2. It dynamically selects only the necessary agents (e.g., `["flight_agent", "itinerary_agent"]`).
3. Conditional edge routing traverses the selected agents sequentially and skips untouched specialists:

```python
def route_from_supervisor(state: TravelState) -> str:
    if not state.get("guardrail_allowed", True):
        return "guardrail_blocked"
    selected = _selected_agents(state)
    return selected[0] if selected else "itinerary_agent"

def route_after_agent(current_agent: str):
    def route(state: TravelState) -> str:
        selected = _selected_agents(state)
        current_index = AGENT_ORDER.index(current_agent)
        for next_agent in AGENT_ORDER[current_index + 1 :]:
            if next_agent in selected:
                return next_agent
        return "itinerary_agent"
    return route
```

---

### Step 4: Adopting the Model Context Protocol (MCP) Standard

Rather than writing custom, proprietary API integrations for every tool, I adopted the open **Model Context Protocol (MCP)** specification released by Anthropic. MCP standardizes how AI models discover and execute tools across remote and local environments.

TripMate AI manages a unified `MultiServerMCPClient` spanning three distinct transport types:

```python
# mcp_client.py
client = MultiServerMCPClient(
    {
        # 1. Remote Streamable HTTP MCP (Tavily Real-Time Web Search)
        "tavily": {
            "transport": "streamable_http",
            "url": f"https://mcp.tavily.com/mcp/?tavilyApiKey={TAVILY_API_KEY}",
        },

        # 2. Local Stdio Subprocess MCP via uvx (AviationStack Flight Data)
        "aviationstack": {
            "transport": "stdio",
            "command": "uvx",
            "args": ["aviationstack-mcp"],
            "env": {"AVIATION_STACK_API_KEY": AVIATION_STACK_API_KEY},
        },

        # 3. Custom In-House Stdio MCP Server (OpenWeatherMap API)
        "weather": {
            "transport": "stdio",
            "command": sys.executable,
            "args": [str(WEATHER_SERVER_PATH)],
            "env": {"OPENWEATHER_API_KEY": OPENWEATHER_API_KEY},
        },
    }
)
```

#### Writing a Custom MCP Server with FastMCP
To expose real-time weather information, I engineered `custom_weather_mcp_server.py` using the `FastMCP` framework:

```python
# custom_weather_mcp_server.py
mcp = FastMCP("Weather MCP Server")

@mcp.tool()
def get_current_weather(city: str) -> dict[str, Any]:
    """Return the current weather conditions for a destination."""
    # Queries OpenWeatherMap API, normalizes data, and returns JSON
    ...

@mcp.tool()
def get_forecast(city: str) -> dict[str, Any]:
    """Return 3-hour forecast intervals for packing advice."""
    ...

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

#### Fault Isolation Pattern
A common bug in multi-agent systems is catastrophic cascading failure: if the weather server is down, the entire travel planner crashes. 
In `mcp_client.py`, I built an isolated tool resolver (`_get_server_tool`) that traps MCP-level exceptions and allows individual specialist agents to supply fallback advice without terminating the workflow.

---

### Step 5: Engineering Specialized Domain Agents

Each specialist in TripMate AI has a single, testable responsibility:

| Agent | Responsibility | Primary Data Source | Fallback Strategy |
| :--- | :--- | :--- | :--- |
| **Supervisor Agent** | Query validation, constraint parsing & routing | Llama 3.3 70B Versatile | Safe default to full workflow |
| **Flight Agent** | Airport identification, routes, price warning | AviationStack MCP (`list_airports`, `list_airlines`) | General airline/route guidance |
| **Hotel Agent** | Neighborhood analysis, accommodation matching | Tavily MCP Live Search | Non-live neighborhood advice |
| **Weather Agent** | Climate checks, packing tips, forecasts | Custom FastMCP Server (OpenWeather) | Historical seasonal recommendations |
| **Budget Agent** | Feasibility assessment, budget allocations | Multi-agent synthesis | Approximate price ranges |
| **Itinerary Agent** | Merges all findings into a structured draft | LangGraph State Accumulator | Baseline day-by-day plan |
| **Final Agent** | Polishes draft with human feedback applied | Human Review State | Retains user decisions |

---

### Step 6: Native Human-in-the-Loop (HITL) with LangGraph Interrupts

Real-world travel plans involve human preferences and budget approvals. Autonomous agents should not make final booking assumptions without user consent.

#### The Anti-Pattern: Blocking HTTP Requests
Many developers implement HITL by keeping an HTTP socket open or running an infinite `while` loop waiting for user input. This causes connection timeouts, exhausts server worker threads, and loses data on crashes.

#### The Production Pattern: LangGraph `interrupt()`
I implemented true asynchronous HITL using LangGraph's pause/resume mechanics:

```python
# backend.py
def human_approval_agent(state: TravelState):
    # LangGraph raises a GraphInterrupt exception under the hood
    # and halts graph execution right here.
    review = interrupt(
        {
            "question": "Do you approve this itinerary?",
            "draft_itinerary": state.get("itinerary", ""),
            "approval_request": state.get("approval_request", ""),
            "selected_agents": state.get("selected_agents", []),
            "supervisor_reasoning": state.get("supervisor_reasoning", ""),
        }
    )

    # When resumed via Command(resume={...}), execution continues here!
    return {
        "approved": bool(review.get("approved", False)),
        "human_feedback": str(review.get("feedback", "")).strip(),
    }
```

When the user submits approval or feedback from the frontend, FastAPI invokes `resume_travel_agent`:

```python
def resume_travel_agent(thread_id: str, approved: bool, feedback: str = ""):
    config = {"configurable": {"thread_id": thread_id}}
    result = travel_graph.invoke(
        Command(resume={"approved": approved, "feedback": feedback.strip()}),
        config=config,
    )
    return _serialize_result(result, thread_id)
```

---

### Step 7: Production API & Frontend Interface

The backend is powered by **FastAPI**, offering high-performance asynchronous endpoints:
- `POST /api/travel`: Dispatches a new planning request or resumes an existing thread.
- `POST /api/travel/approve`: Submits human approval or revision requests.
- `GET /health`: System diagnostics and active feature introspection.

#### The Sync/Async Bridge Challenge
FastAPI is natively asynchronous (`async/await`), while LangGraph's checkpointer and synchronous node operations execute in standard event loops. To prevent event loop collision when calling async MCP client tools within synchronous graph nodes, I applied `nest_asyncio.apply()`. This ensures synchronous graph nodes can seamlessly invoke `asyncio.run()` without triggering `RuntimeError: This event loop is already running`.

#### Frontend Experience
The user interface (HTML5, CSS3, Vanilla JS) provides:
1. **Live Supervisor Reasoning & Telemetry**: Shows which agents were selected and why.
2. **Interactive HITL Card**: Renders the generated draft itinerary, providing **Approve** and **Revise with Feedback** options.
3. **Export Utilities**: One-click clipboard copy and client-side **PDF generation** via `html2pdf.js`.

---

## 💡 Key Architectural Decisions & Engineering Trade-Offs

Recruiters and hiring managers often evaluate engineers based on their ability to justify architectural trade-offs. Here is a breakdown of the key design decisions made in TripMate AI:

### 1. LangGraph StateGraph vs. Linear Chains or LangChain ReAct
- **Decision**: Built the core system with LangGraph `StateGraph`.
- **Rationale**: Linear chains (like standard LCEL pipelines) cannot easily handle loops, conditional branches, or execution interruptions. ReAct loops, while flexible, are prone to "infinite tool loops" and token bloat. LangGraph provides **deterministic control over non-deterministic agents**, enabling clear state schemas, cyclic graph support, and built-in checkpointing.

### 2. Standardized MCP vs. Custom Function Calling
- **Decision**: Used the Model Context Protocol (MCP) instead of ad-hoc LangChain tools.
- **Rationale**: MCP decouples tool execution from the application code. Tools can run as standalone microservices, separate subprocesses, or third-party hosted endpoints. By adopting MCP, adding a new data provider (e.g., Uber or Airbnb) requires adding an MCP configuration entry rather than rewriting prompt logic.

### 3. Native `interrupt()` vs. Custom Polling Database
- **Decision**: Leveraged LangGraph's native `interrupt()` and `Command(resume=...)`.
- **Rationale**: Writing custom database schemas to pause an agent midway through its thinking process requires saving the prompt stack, message history, and node cursor manually. LangGraph abstracts this into a single function call backed by PostgreSQL, drastically reducing bug surface area.

### 4. Groq (Llama 3.3 70B Versatile) vs. Standard Cloud APIs
- **Decision**: Deployed Groq's LPU inference engine running Llama 3.3 70B.
- **Rationale**: Multi-agent workflows make multiple LLM invocations per user request (Supervisor $\rightarrow$ Specialists $\rightarrow$ Synthesizer $\rightarrow$ Finalizer). On standard proprietary APIs with ~30 tokens/sec, a full pipeline can take 45+ seconds. Groq delivers **300+ tokens/sec**, completing complex multi-agent reasoning in under 8 seconds.

---

## 📊 Technical Skills Matrix Demonstrated

| Competency Area | Technologies & Patterns Implemented |
| :--- | :--- |
| **Agentic Frameworks** | LangGraph, StateGraph, Dynamic Routing, Conditional Edges, State Reducers |
| **Tool Orchestration** | Model Context Protocol (MCP), FastMCP, MultiServerMCPClient, Subprocess I/O |
| **Reliability & Safety** | Input Guardrails, Fail-Open Fallback Handlers, Graceful Degradation |
| **Human-AI Collaboration**| HITL (Human-in-the-Loop), `interrupt()`, State Hydration, Feedback Revisions |
| **State & Persistence** | PostgreSQL, `PostgresSaver`, Thread Management, Transactional State |
| **Backend & Web API** | FastAPI, Pydantic data validation, Uvicorn, Jinja2, Async/Sync Bridges |
| **DevOps & Containers** | Docker, Multi-environment configuration (`.env`), Dependency Management |

---

## 🚀 Running the Project Locally

### 1. Clone & Set Up Virtual Environment
```bash
git clone https://github.com/datawithshoaib/TripMateAI.git
cd TripMateAI

python -m venv .venv
# On Windows:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://user:password@host:5432/dbname
TAVILY_API_KEY=your_tavily_key
OPENWEATHER_API_KEY=your_openweather_key
AVIATION_STACK_API_KEY=your_aviationstack_key
```

### 4. Launch Application
```bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```
Visit `http://127.0.0.1:8000` to interact with the system.

---

## 🔮 Future Roadmap & Production Scaling

If scaling TripMate AI for millions of production users, the next engineering milestones would be:
1. **Parallel Specialist Execution**: Utilizing LangGraph's fan-out / fan-in branching (`Send` API) to execute Flight, Hotel, and Weather agents concurrently, cutting latency by another 50%.
2. **Persistent User Vector Memory**: Integrating pgvector to remember user travel history, dietary restrictions, and airline loyalty preferences across sessions.
3. **Autonomous Transactional Booking**: Implementing safe MCP transaction adapters (with two-factor authentication) to book refundable reservations directly upon final approval.

---

## 👨‍💻 About the Author

I am an AI Engineer passionate about designing stateful, reliable multi-agent systems. 

- **GitHub**: [github.com/datawithshoaib](https://github.com/datawithshoaib)
- **Project Repository**: [TripMateAI](https://github.com/datawithshoaib/TripMateAI)

---

*If you found this technical breakdown valuable or are looking to hire engineers who understand how to build resilient AI agents, feel free to reach out or star the repository!*

