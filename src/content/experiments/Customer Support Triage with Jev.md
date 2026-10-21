---
layout: post
title: Customer Support Triage with Jev
author: Shoaib
date: 2026-10-10
permalink: /experiments/Customer-Support-Triage-with-Jev/
tags:
  - Jev
  - System-1-Model
categories:
  - Agentic AI
description: Building a Smart Customer Support Triage System with Jev, FastAPI, and LangChain
---
*Let a structured AI model make the routing decision, keep the business rules in plain code, and use an LLM only for what it's good at: writing the reply.*

---

Every support team knows the pattern. Tickets pour into one inbox, and someone has to read each one, decide which team owns it, judge how urgent it is, notice whether money is involved, and figure out whether it's safe to handle automatically. Do that wrong and a double-charged customer waits in the general queue while a simple question gets escalated to a specialist.

In this project I built **Jev Smart Support Triage**, a small web app that reads a customer ticket and returns:

- the **department** that should own it (billing, technical, account, or general)
- an **urgency score** on a 0–3 scale
- the **probability that it's refund-related**
- the **probability that a human should review it** before anything automated happens
- a **final route** (a normal queue, or escalation to a human specialist)
- a **drafted reply** for the customer

The code is on GitHub: [Customer-Support-Triage-with-Jev](https://github.com/datawithshoaib/Customer-Support-Triage-with-Jev)

## The Core Idea: Separate Decisions from Prose

The most important design choice in this project is a division of labor between three components:

| Layer | Tool | Job |
|---|---|---|
| **Decision** | Jev (via the TypeSafe API) | Classify the ticket and return structured scores and confidences |
| **Policy** | Plain Python | Turn those numbers into a route using explicit, auditable rules |
| **Language** | LangChain + Groq | Draft a customer-facing reply *after* the decision is made |

A lot of AI support demos hand the whole ticket to a chat model and ask it to "figure it out." That's hard to test and hard to trust: you can't easily tell *why* it routed something a certain way, or adjust its risk tolerance. Here, the model returns numbers with confidences, the business rules live in a few readable lines of code, and the LLM never decides anything. It only writes text.

## Architecture at a Glance

```
Customer ticket
      │
      ▼
POST /api/analyze  (FastAPI)
      │
      ├──► Jev (TypeSafe API) ──► department, urgency, refund prob., human-review prob.
      │
      ├──► choose_route()  ──► "Billing queue"  or  "Billing → Human specialist"
      │
      └──► LangChain + Groq ──► suggested customer reply  (optional, non-blocking)
```

The project layout is small and easy to follow:

```
├── app.py                  # FastAPI app, routing rules, API endpoints
├── services/
│   ├── jev_service.py      # Calls the Jev API and parses the answers
│   └── response_chain.py   # LangChain + Groq reply drafting
├── templates/              # Jinja2 HTML (index.html)
├── static/                 # Front-end assets
├── demo_tickets.json       # Sample tickets for demos
└── requirements.txt
```

The dependencies are equally lean: `fastapi`, `uvicorn`, `jinja2`, `python-multipart`, `python-dotenv`, `httpx`, `langchain-core` and `langchain-groq`.

## Step 1: Asking Jev the Right Questions

The heart of the triage is `services/jev_service.py`. It sends the ticket to the TypeSafe API along with four structured questions, and Jev answers each one with a value *and* a confidence.

The code calls the documented HTTPS endpoint directly with `httpx` rather than depending on an SDK. As the module's docstring puts it, that keeps the demo small and transparent, and less sensitive to SDK version changes.

The questions are defined right in the request payload:

- **`department`** is a choice among `billing`, `technical`, `account` and `general`. Each option carries a plain-English description, for example "Charges, invoices, payments, refunds, subscriptions, or pricing already paid" for billing, and "Bugs, errors, integrations, login failures, or product functionality problems" for technical.
- **`urgency`** is a score against four written levels: *Low* (informational), *Medium* (inconvenienced but can wait), *High* (business impact or an explicit need for fast help), and *Critical* (severe ongoing financial or security impact).
- **`refund_related`** returns a probability that the customer is asking for, expecting or discussing a refund or reversal of money.
- **`human_review`** returns a probability that the ticket is ambiguous, sensitive, high impact, or could create financial or account risk if handled automatically.

What I like about this approach is that the *definitions* of the categories are part of the request. Changing what "urgent" means, or adding a new department, is an edit to a small dictionary instead of a retraining job.

The response is parsed into a simple dataclass:

```python
@dataclass
class JevDecision:
    department: str
    department_confidence: float
    urgency_score: float
    urgency_confidence: float
    refund_probability: float
    human_review_probability: float
    model: str | None = None
```

Parsing is defensive. A helper converts values to floats with a safe default, and a missing answer raises a clear error ("Jev response is missing the 'department' answer") instead of failing somewhere deep in the stack. Connection problems, HTTP errors and non-JSON responses each get their own readable message.

Configuration comes from environment variables: `TYPESAFE_API_KEY` (required), plus optional `TYPESAFE_MODEL` (defaults to `jev-latest`), `TYPESAFE_API_URL` and `TYPESAFE_TIMEOUT` (30 seconds by default).

## Step 2: Business Rules Belong in Normal Code

Once Jev has produced its scores, `app.py` decides what to *do* with them. This is deliberately not an AI call. The function's docstring says it plainly: "Deterministic business rules belong in normal code."

```python
def choose_route(department, dept_conf, urgency, human_prob):
    needs_human = human_prob >= 0.65 or dept_conf < 0.60 or urgency >= 2.5
    if needs_human:
        return (f"{department.title()} → Human specialist",
                True,
                "Escalated by confidence/risk threshold")
    return (f"{department.title()} queue",
            False,
            "Safe for normal queue routing")
```

A ticket is escalated to a human when **any** of these is true:

1. The model thinks a human should review it (probability ≥ 0.65)
2. The model isn't confident about the department (confidence < 0.60)
3. The urgency score is very high (≥ 2.5 on the 0–3 scale)

Otherwise it goes to the normal queue for that department. This is the part a support lead can read, argue about and tune. Want to be more cautious with money-related tickets? Add a rule on `refund_probability`. Want fewer escalations? Raise a threshold. No prompt engineering is needed, and the behavior is fully predictable.

## Step 3: Drafting the Reply with LangChain and Groq

Only after the decision is made does a language model get involved. `services/response_chain.py` builds a small LangChain pipeline (prompt → model → string parser) using Groq's `ChatGroq`, defaulting to `llama-3.1-8b-instant` at a low temperature of 0.2 with two retries.

The prompt gives the model the ticket *and* Jev's decision, and constrains it tightly. The assistant is told to:

- stay concise and keep the reply under 120 words
- **not promise refunds, credits, account changes or fixes that haven't been confirmed**
- say the case is being escalated for review if it was routed to a human specialist

That second rule matters. A drafted reply that says "we've refunded you" before anyone has verified the charge is worse than no reply at all. Feeding the final route into the prompt means the tone of the reply matches what will actually happen to the ticket.

## Designed to Degrade Gracefully

A few small decisions make the app resilient, which matters for a demo that depends on two external APIs:

- **Reply generation is non-blocking.** If Groq fails or `GROQ_API_KEY` isn't set, the app still returns Jev's analysis, with an explanatory message in place of the reply. The core triage keeps working.
- **Upstream errors are explicit.** If the Jev call fails, the API returns a `502` with the error detail, so it's clear the problem is with the upstream service and not the client.
- **Input is validated.** Tickets must be between 5 and 8,000 characters, enforced by a Pydantic model.
- **Windows-friendly paths.** All paths are resolved relative to the file rather than the working directory, which avoids the classic `FileNotFoundError` when running from a different folder. The app also removes an `SSL_CERT_FILE` environment variable if it points to a file that doesn't exist.

There's also a `/health` endpoint that returns the status and app version.

## The API

The main endpoint is `POST /api/analyze`. You send a ticket:

```json
{ "ticket": "I was charged twice for my Pro subscription this morning. Please refund the duplicate charge ASAP." }
```

and get back a response shaped like this (values are illustrative):

```json
{
  "ticket": "...",
  "jev": {
    "model": "jev-latest",
    "department": "billing",
    "department_confidence": 0.97,
    "urgency_score": 2.1,
    "urgency_confidence": 0.88,
    "refund_probability": 0.99,
    "human_review_probability": 0.42
  },
  "automation": {
    "route": "Billing queue",
    "needs_human": false,
    "reason": "Safe for normal queue routing"
  },
  "suggested_reply": "..."
}
```

Everything the UI needs is in one response: the raw model outputs, the routing decision with its reason, and the drafted reply. Keeping the model's numbers visible next to the final route makes the system explainable.

The root route (`/`) serves a Jinja2-rendered page where you can try tickets in the browser.

## Try It Yourself

The repo ships with `demo_tickets.json`, three sample tickets covering common cases:

- **Billing + refund:** a customer charged twice for a Pro subscription, with finance closing the books that day
- **Technical bug:** a CSV export that broke after an update, needed for a report the next day
- **Account access:** a user locked out of a workspace after an admin changed their email

To run it locally:

1. Clone the repo and install dependencies with `pip install -r requirements.txt`.
2. Create a `.env` file in the project root with your keys:
   ```
   TYPESAFE_API_KEY=your_typesafe_api_key
   GROQ_API_KEY=your_groq_api_key   # optional, enables reply drafting
   ```
3. Start the server with `python app.py`. It runs on port 8080 with auto-reload.
4. Open `http://localhost:8080` and paste in a ticket.

The Groq key is optional. Without it you still get the full triage decision.

## What I'd Do Next

This is a compact demo, and there's plenty of room to grow it:

- **Evaluate on real tickets.** Run labeled historical tickets through the pipeline and measure routing accuracy and escalation rates, then tune the thresholds against actual outcomes instead of intuition.
- **Add more rules.** For example, always escalate refund-related tickets above a certain urgency, or route by customer tier.
- **Close the loop.** Log each decision and the human's final handling, so overrides become data for adjusting thresholds.
- **Connect a real helpdesk.** Replace the demo input with a webhook from the ticketing system and push the route back as a tag or assignment.

## Takeaways

The pattern here travels well beyond support tickets:

1. **Let a model produce structured signals, and let code make the decision.** Thresholds you can read are easier to trust, test and change than behavior buried in a prompt.
2. **Use confidence as a first-class input.** Routing on "how sure is the model?" is what makes safe automation possible.
3. **Keep the generative part optional and constrained.** The reply drafter can fail without taking the system down, and its prompt forbids promises nobody has verified.

If you'd like to explore the code, it's all in the [GitHub repo](https://github.com/datawithshoaib/Customer-Support-Triage-with-Jev)

---

*Built with: Python, FastAPI, Uvicorn, Jinja2, httpx, Pydantic, the TypeSafe Jev API, LangChain and Groq.*

