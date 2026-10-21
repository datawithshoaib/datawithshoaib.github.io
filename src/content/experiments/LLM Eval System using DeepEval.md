---
layout: post
title: LLM Evaluation System using DeepEval
author: Shoaib
date: 2026-10-20
permalink: /experiments/LLM-Eval-System-DeepEval/
tags:
  - LLM-as-a-Judge
  - Groundedness
  - Evals
  - DeepEval
  - LangChain
categories:
  - Evaluation & Benchmarks
description: "Building an LLM Evaluation System for RAG: A Step-by-Step Guide"
---
In this post, I will walk you through how I built an evaluation system for a Retrieval-Augmented Generation (RAG) pipeline. 

Instead of manually checking whether answers look right, this project runs a RAG pipeline against a 20-question test dataset, scores the answers across four metrics using [DeepEval](https://github.com/confident-ai/deepeval), saves experiment runs, and visualizes them on a [Streamlit](https://streamlit.io/) dashboard.

---

## What We Are Building

The project is split into three main parts:
1. **A RAG pipeline** that reads a PDF guide about cats ([`cats_fact_guide.pdf`](file:///c:/Code/datawithshoaib/LLM-Eval-System/pdfs/cats_fact_guide.pdf)), indexes it, and uses a LangGraph ReAct agent to answer questions.
2. **An evaluation runner** that runs the pipeline against a test dataset and scores the answers using DeepEval LLM judges.
3. **An experiment tracker & dashboard** that stores metrics for each run and lets you compare them in the terminal or on a web dashboard.

```
PDF Document  ──>  Extract & Index Chunks (Vector Store)
                           │
                           ▼
                  LangGraph ReAct Agent
                           │
                 Run against 20 Q&A pairs
                           │
                           ▼
                Score with DeepEval
   (Relevancy, Faithfulness, Context Relevancy, Correctness)
                           │
                           ▼
               Save Run & View Dashboard
```

---

## Step 1: Setting Up the Environment

The project is managed with [`uv`](https://github.com/astral-sh/uv) and targets Python 3.13+.

First, install the dependencies declared in [`pyproject.toml`](file:///c:/Code/datawithshoaib/LLM-Eval-System/pyproject.toml):

```bash
uv sync
```

Key dependencies include:
- `langchain` and `langchain-openai` for retrieval and LLM interactions
- `deepeval` for evaluation metrics
- `pymupdf` for extracting text from PDF files
- `streamlit` for the comparison UI

Next, set up the OpenAI API key in `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Step 2: Building the RAG Pipeline

The RAG logic lives in the [`RAG/`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG) folder.

### 1. Extracting text from PDF
In [`RAG/file_reader.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/file_reader.py), we use PyMuPDF to extract text paragraphs from [`pdfs/cats_fact_guide.pdf`](file:///c:/Code/datawithshoaib/LLM-Eval-System/pdfs/cats_fact_guide.pdf):

```python
# RAG/file_reader.py
import fitz

def extract_paragraphs(pdf_path) -> list[str]:
    doc = fitz.open(pdf_path)
    paragraphs = []
    for page in doc:
        blocks = page.get_text("blocks")
        for block in blocks:
            text = block[4].strip()
            if text:
                paragraphs.append(text)
    return paragraphs
```

### 2. Indexing into an In-Memory Vector Store
In [`RAG/indexing.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/indexing.py), chunks are converted to vectors using `text-embedding-3-large` and stored in LangChain's `InMemoryVectorStore`:

```python
# RAG/indexing.py
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings

embedding = OpenAIEmbeddings(model="text-embedding-3-large")
vector_store = InMemoryVectorStore(embedding)

chunks = extract_paragraphs(_PDF_PATH)
vector_store.add_texts(texts=chunks)
```

### 3. Creating the Retrieval Tool
In [`RAG/tools.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/tools.py), we expose a `@tool` function called [`collecting_info`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/tools.py#L12-L22). We also keep track of the retrieved text so we can evaluate retrieval context later:

```python
# RAG/tools.py
from langchain.tools import tool
from .indexing import vector_store

last_retrieved_context: list[str] = []

@tool
def collecting_info(query: str) -> str:
    """Search the PDF knowledge base and return relevant information."""
    global last_retrieved_context
    docs = vector_store.similarity_search(query, k=2)
    last_retrieved_context = [doc.page_content for doc in docs]
    return "\n\n".join(last_retrieved_context)
```

### 4. Creating the ReAct Agent
In [`RAG/agent.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/agent.py), we build a ReAct agent using `create_react_agent` from LangGraph. We use a Pydantic schema ([`Answer`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/objects.py)) to return both the answer and the context:

```python
# RAG/agent.py
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from .objects import Answer
from .prompts import system_agent_prompt
from .tools import collecting_info

llm = ChatOpenAI(model="gpt-4o", temperature=0)

agent = create_react_agent(
    model=llm,
    tools=[collecting_info],
    prompt=system_agent_prompt,
    response_format=Answer,
)
```

Calling [`ask(question)`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/agent.py#L25-L45) returns a dictionary: `{"answer": ..., "context": ...}`.

---

## Step 3: Preparing the Evaluation Dataset

To evaluate accurately, we need ground-truth questions and answers.

In [`src/llm_eval_system/eval_dataset.jsonl`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/eval_dataset.jsonl), we defined 20 questions based on facts in the PDF. Each line has:

```json
{"question": "Where do domestic cats live?", "expected_answer": "Domestic cats are kept as companions and working animals on every continent except Antarctica."}
{"question": "Why can cats squeeze through very tight gaps?", "expected_answer": "A cat's collarbone is small and floats free of the other bones, so a cat can squeeze through any gap that its head can pass through."}
```

---

## Step 4: Selecting Evaluation Metrics

We use [DeepEval](https://github.com/confident-ai/deepeval) to evaluate four distinct qualities of each response in [`src/llm_eval_system/metrics.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/metrics.py):

| Metric | What it evaluates | Inputs used |
|---|---|---|
| **Answer Relevancy** | Did the model answer the question directly? | Question + Generated Answer |
| **Faithfulness** | Is the answer grounded in the retrieved text (no hallucinations)? | Generated Answer + Retrieved Context |
| **Context Relevancy** | Was the retrieved context actually useful for answering? | Question + Retrieved Context |
| **Correctness** | Is the answer factually correct according to the expected answer? | Generated Answer + Expected Answer |

We set a threshold of `0.7` for each metric. The metrics are configured in [`make_metrics()`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/metrics.py#L17-L35):

```python
# src/llm_eval_system/metrics.py
from deepeval.metrics import (
    AnswerRelevancyMetric,
    ContextualRelevancyMetric,
    FaithfulnessMetric,
    GEval,
)
from deepeval.test_case import SingleTurnParams

def make_metrics(threshold: float = 0.7) -> list:
    return [
        AnswerRelevancyMetric(threshold=threshold),
        FaithfulnessMetric(threshold=threshold),
        ContextualRelevancyMetric(threshold=threshold),
        GEval(
            name="Correctness",
            criteria="Determine whether the actual output is factually correct based on the expected output.",
            evaluation_params=[
                SingleTurnParams.ACTUAL_OUTPUT,
                SingleTurnParams.EXPECTED_OUTPUT,
            ],
            threshold=threshold,
        ),
    ]
```

---

## Step 5: Running the Evaluation

The evaluation process is done in two simple steps:

### 1. Generate answers for all questions
[`src/llm_eval_system/runner.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/runner.py) loops through each question in the dataset, runs [`ask(question)`](file:///c:/Code/datawithshoaib/LLM-Eval-System/RAG/agent.py#L25-L45), and saves raw answers to a JSONL file:

```bash
uv run --env-file .env python versions/v3/eval_runner3.py
```
This produces `versions/v3/results3.jsonl`.

### 2. Score the answers with DeepEval
[`src/llm_eval_system/metrics.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/metrics.py) converts results into `LLMTestCase` objects and runs all four metrics in parallel using `deepeval.evaluate(...)`:

```bash
uv run --env-file .env python versions/v3/eval_all_metrics3_fast.py
```
This produces `versions/v3/evaluated_results3.jsonl`, adding scores for all 4 metrics to each question row.

> **Tip:** You can also test a single metric on one example during debugging using scripts in [`src/llm_eval_system/single_evals/`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/single_evals):
> ```bash
> uv run --env-file .env python -m llm_eval_system.single_evals.single_eval_faithfulness
> ```

---

## Step 6: Saving and Comparing Experiments

Once an evaluation run finishes, we calculate average scores across all 20 test cases and save an experiment summary.

### 1. Save the experiment summary
Run [`src/llm_eval_system/save_experiment.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/save_experiment.py):

```bash
uv run python -m llm_eval_system.save_experiment versions/v3 experiment_v3_k2 2
```

This calculates the mean for each metric and outputs a JSON summary:

```json
{
    "experiment": "experiment_v3_k2",
    "retriever_k": 2,
    "number_of_test_cases": 20,
    "metrics": {
        "answer_relevancy": 1.0,
        "faithfulness": 1.0,
        "context_relevancy": 0.787,
        "correctness": 0.890
    }
}
```

### 2. Compare two runs in the terminal
Run [`src/llm_eval_system/compare_experiments.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/compare_experiments.py) to compare two versions:

```bash
uv run python -m llm_eval_system.compare_experiments \
    src/llm_eval_system/experiment_v1.jsonl \
    src/llm_eval_system/experiment_v3.jsonl
```

Terminal output:
```text
========== EXPERIMENT COMPARISON ==========

Metric                 experiment_v1_k3     experiment_v3_k2     Change    
---------------------------------------------------------------------------
Answer Relevancy       0.99                 1.00                 +0.01
Faithfulness           1.00                 1.00                 +0.00
Context Relevancy      0.73                 0.79                 +0.05
Correctness            0.90                 0.89                 -0.01
```

---

## Step 7: Viewing the Streamlit Dashboard

To inspect runs visually, we built a Streamlit app in [`src/llm_eval_system/dashboard.py`](file:///c:/Code/datawithshoaib/LLM-Eval-System/src/llm_eval_system/dashboard.py).

Start the dashboard:

```bash
uv run llm-eval-system
# or: uv run streamlit run src/llm_eval_system/dashboard.py
```

The dashboard includes:
1. **Saved Runs Table:** A clean table showing all runs and their scores.
2. **Metric Comparison:** A grouped bar chart comparing metrics across runs.
3. **Inspect Run:** Detailed score cards for a selected run.
4. **Best Score by Metric:** Identifies which run scored highest on each metric.

### Results Across 3 Saved Runs

| Run | Retriever $k$ | Answer Relevancy | Faithfulness | Context Relevancy | Correctness |
|---|:---:|:---:|:---:|:---:|:---:|
| `v1` (`experiment_v1_k3`) | 3 | 0.988 | 1.000 | 0.733 | 0.900 |
| `v2` (`experiment_v2_k1`) | 3 | 1.000 | 1.000 | 0.781 | 0.915 |
| `v3` (`experiment_v3_k2`) | 3 | 1.000 | 1.000 | 0.787 | 0.890 |

---

## Summary and Practical Takeaways

1. **Separate generation from evaluation:** Writing answers to disk before scoring them saves money and time. If you need to re-score or add a new metric, you do not have to rerun the RAG agent.
2. **Track retrieved context:** For metrics like Faithfulness and Context Relevancy to work, the agent must save the exact chunks retrieved for each query.
3. **Parallel evaluation is essential:** Evaluating 20 questions across 4 metrics equals 80 LLM calls. Doing this sequentially is slow; using `deepeval.evaluate` batches requests and runs them concurrently.
4. **Experiment tracking makes iteration visible:** Having saved JSON summaries and a simple dashboard makes it clear whether changing prompts or retrieval parameters ($k$) helped or hurt performance.

