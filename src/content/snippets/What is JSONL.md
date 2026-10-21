# What is JSONL?

JSONL stands for JSON Lines. It's a text file where each line is one complete, standalone JSON object, with no commas between lines and no outer brackets.

Here is how it differs from regular JSON:

```
Regular JSON (one big array):
[
  {"question": "Q1", "expected_answer": "A1"},
  {"question": "Q2", "expected_answer": "A2"}
]

JSONL (one object per line):
{"question": "Q1", "expected_answer": "A1"}
{"question": "Q2", "expected_answer": "A2"}
```

Each line must be valid JSON on its own, so a record can't be split across several lines. Newlines inside text have to be written as `\n`.

It's popular for datasets like your RAG evaluation set for a few reasons:

- **Streaming:** you can read one line at a time without loading the whole file into memory.
- **Appending:** adding a record just means adding a line at the end.
- **Fault tolerance:** one bad line doesn't break the rest of the file.
- **Tooling:** most evaluation tools accept it, and `head`, `wc -l` and `grep` work on it directly.

In Python, you read it like this:

```python
import json
with open("cats_eval_dataset.jsonl") as f:
    data = [json.loads(line) for line in f]
```

