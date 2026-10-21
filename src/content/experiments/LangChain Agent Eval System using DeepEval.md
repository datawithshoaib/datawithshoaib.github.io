---
layout: post
title: LangChain Agent Evaluation System using DeepEval
author: Shoaib
date: 2026-10-21
permalink: /experiments/LangChain-Agent-Eval-System-DeepEval/
tags:
  - LLM-as-a-Judge
  - Evals
  - DeepEval
  - LangChain
categories:
  - Evaluation & Benchmarks
description: Building and Evaluating a Customer Support Agent with LangChain and DeepEval
---
When building an autonomous LLM agent that handles operations like customer refunds, traditional evaluation methods—such as checking semantic similarity of the final response—are not enough. An agent plans, calls tools sequentially, passes arguments, and makes decisions that must adhere to strict business rules. If it issues a refund for an ineligible item or calls unnecessary tools in an infinite loop, a standard text evaluation might completely miss it.

This walkthrough documents the step-by-step process used to build and evaluate a policy-constrained refund agent using **LangChain**, **LangGraph**, and **DeepEval**.

---

## 1. Defining the Problem and Business Policies

Before writing any agent code, the business rules and constraints were defined. The agent acts as a customer support representative for processing order refunds. 

The core requirements:
- **30-Day Window**: Only purchases made within the last 30 calendar days are eligible for a refund.
- **Identity Verification**: The customer must provide a valid username. If the user cannot be verified, the agent must ask for the username and must not disclose any purchase records.
- **Scoping**: If an order contains multiple items, the agent must refund only the items specifically requested by the customer.
- **Boundary Checks**: Purchases with future dates or items not found in the purchase record must be rejected.
- **No Hallucinated Actions**: The agent must never claim a refund was issued unless the refund tool successfully executed.

---

## 2. Setting Up the Mock Data and Tools

To test the agent deterministically without connecting to a live database, a mock dataset was created in [`agent/data.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/agent/data.py). It includes users with various purchase scenarios: recent purchases, purchases past 30 days, multi-item orders, and invalid dates.

Next, four LangChain tools were implemented in [`agent/tools.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/agent/tools.py):

1. **`get_today_date`**: Returns the current date in ISO format (`YYYY-MM-DD`). The agent uses this rather than guessing or hallucinating the date.
2. **`get_user_purchase_history`**: Accepts a username and returns their purchase records if found.
3. **`calculate_right_refund`**: Takes the username and a list of `PurchaseItem` objects, validates that each item was purchased within the 30-day window, and calculates the total eligible refund amount.
4. **`issue_refund_ticket`**: Accepts the username and approved refund amount, issuing a ticket confirmation.

```python
@tool
def calculate_right_refund(user: str, items: list[PurchaseItem]) -> dict:
    """Takes a list of items to be returned and username,
    returning the total refund amount for eligible items."""
    if not users_data.get(user):
        return {"status": "no user found"}

    total_refund = 0
    for item in items:
        item_name = item.name
        if users_data[user].get(item_name):
            purchase_date = date.fromisoformat(users_data[user][item_name]["date"])
            days_since_purchase = (date.today() - purchase_date).days

            if days_since_purchase <= 30:
                total_refund += users_data[user][item_name]["price"]

    return {"total_refund": total_refund}
```

---

## 3. Implementing Structured Outputs and the Agent

### Structured Output Schema

Instead of returning unstructured markdown, the agent uses a Pydantic model (`Answer` in [`agent/objects.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/agent/objects.py)) to return both its textual answer and a boolean state flag:

```python
from pydantic import BaseModel, Field

class Answer(BaseModel):
    answer: str = Field(description="A clear and relevant response to the user's question.")
    conversation: bool = Field(
        default=True,
        description="Set to True if follow-up info is needed, False when fully resolved."
    )
```

The `conversation` boolean allows the interactive runner to automatically determine when the conversation should terminate.

### System Prompt and Policy Enforcement

In [`agent/prompts.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/agent/prompts.py), the prompt provides explicit, step-by-step instructions:
1. Obtain the current date.
2. Verify the customer username.
3. Identify requested items and match against purchase records.
4. Verify eligibility and calculate the refund via tools.
5. Issue the ticket and present a clear success or rejection message.

### Agent Construction

The agent is instantiated in [`agent/agent.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/agent/agent.py) using `create_agent` from LangChain, configured with `InMemorySaver` for multi-turn conversational checkpointing:

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()

agent = create_agent(
    model=model,
    tools=[
        get_user_purchase_history,
        calculate_right_refund,
        issue_refund_ticket,
        get_today_date,
    ],
    system_prompt=agent_system_prompt,
    response_format=Answer,
    checkpointer=checkpointer,
)
```

---

## 4. Constructing the Golden Evaluation Dataset

To evaluate whether the agent behaves as expected across diverse scenarios, a golden evaluation dataset was created in [`evaluations/dataset.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/dataset.py). 

The dataset contains 9 targeted test cases:
1. **Full Refund for Multiple Items**: User requests refund for eligible items within the 30-day window.
2. **Partial Order Refund**: Multi-item purchase where the user requests a refund for only one item (checks that the agent does not over-refund).
3. **Information-Only Inquiry**: User asks what they purchased without requesting a refund (verifies that no ticket is issued).
4. **Invalid Username Lookup**: Customer provides a nonexistent username (checks that access is denied).
5. **Expired Policy Window**: Item purchased more than 30 days ago (checks rejection reasoning).
6. **Mixed Eligibility**: One eligible item and one expired item in the same request.
7. **Non-Existent Item**: User asks for an item they never purchased.
8. **Future-Dated Item**: Item with a future date (tests boundary validation).
9. **Exact 30-Day Boundary**: Evaluates eligibility right at the 30-day cutoff.

Each golden entry defines the user input, the expected final output, and the sequence of `expected_tools` along with their expected parameters.

---

## 5. Designing the 7-Metric Evaluation Framework

Agent behavior cannot be evaluated through a single score. The evaluation framework in [`evaluations/`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/) is divided into two distinct categories:

### A. Trace-Based Metrics (Evaluating Agent Trajectory)

Using DeepEval's `CallbackHandler` integrated into LangChain, the internal execution trace (including tool calls, thoughts, and plans) is captured:

1. **Task Completion Metric** ([`1_task_completion.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/1_task_completion.py)): Evaluates whether the agent completed the task according to policy specifications.
2. **Step Efficiency Metric** ([`2_step_efficiency.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/2_step_efficiency.py)): Checks whether the agent reached the solution directly or took redundant steps and duplicate tool calls.
3. **Plan Quality Metric** ([`3_plan_quality.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/3_plan_quality.py)): Analyzes whether the agent's plan was logical and covered all necessary verification steps.
4. **Plan Adherence Metric** ([`4_plan_adherence.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/4_plan_adherence.py)): Checks if the agent followed its stated plan during execution.

### B. Unit & Output-Based Metrics (Evaluating Actions and Output)

5. **Tool Correctness Metric** ([`5_tool_correctness.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/5_tool_correctness.py)): Verifies that the tools called match the `expected_tools`.
6. **Argument Correctness Metric** ([`6_argument_correctness.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/6_argument_correctness.py)): Verifies that parameters passed into each tool match the expected inputs (e.g. username and item list).
7. **Answer Correctness (`GEval`)** ([`7_answer_correctness.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/7_answer_correctness.py)): An LLM-as-a-judge metric verifying that the agent's natural language answer reaches the same logical conclusion as the reference answer.

---

## 6. Unifying the Evaluation Pipeline

Running each evaluation metric in isolation means executing the agent 7 separate times per test case. To optimize this, [`evaluations/eval_all.py`](file:///c:/Code/datawithshoaib/LangChain-Agent-Eval-System/evaluations/eval_all.py) runs the entire suite in a single unified pass:

1. Loops through the golden dataset once using `evals_iterator` with the trace-based metrics.
2. Captures the LangChain execution trace via `CallbackHandler`.
3. Records all actual tool calls and the final structured answer.
4. Constructs `LLMTestCase` objects and evaluates the single-turn metrics (`ToolCorrectness`, `ArgumentCorrectness`, and `GEval`) on the collected results.

```python
# evaluations/eval_all.py excerpt
trace_metrics, single_turn_metrics = build_metrics()
test_cases = []

for golden in dataset.evals_iterator(metrics=trace_metrics, ...):
    response = agent.invoke(
        {"messages": [{"role": "user", "content": golden.input}]},
        config={"configurable": {"thread_id": str(uuid4())}, "callbacks": [CallbackHandler()]},
    )

    tools_called = [
        ToolCall(name=call["name"], input_parameters=call["args"])
        for msg in response["messages"]
        for call in getattr(msg, "tool_calls", []) or []
    ]

    test_cases.append(
        LLMTestCase(
            input=golden.input,
            actual_output=response["structured_response"].answer,
            expected_output=golden.expected_output,
            tools_called=tools_called,
            expected_tools=golden.expected_tools,
        )
    )

evaluate(test_cases=test_cases, metrics=single_turn_metrics, ...)
```

---

## 7. How to Run the Project

### Interactive Mode

To interact with the agent in the terminal:

```bash
python agent/agent.py
```

### Running Individual Metric Tests

Each metric can be run individually to focus on a specific failure mode:

```bash
python evaluations/1_task_completion.py
python evaluations/5_tool_correctness.py
```

### Running the Full Evaluation Suite

To run all 7 metrics across all golden scenarios:

```bash
python evaluations/eval_all.py
```

---

## Summary of Key Takeaways

1. **Policy Enforcement via Tools**: Allowing the LLM to calculate dates or refund amounts directly leads to hallucinations. Offloading calculations and date lookups to deterministic tools makes the agent reliable.
2. **Structured Outputs for Flow Control**: Using Pydantic models for responses simplifies multi-turn conversational state and allows deterministic programmatic handling of agent responses.
3. **Multi-Faceted Evaluation**: Testing agents requires checking both the final answer and the execution path (tool choices, argument validity, and plan execution). Tracing with tools like DeepEval provides visibility into why an agent succeeded or failed.
