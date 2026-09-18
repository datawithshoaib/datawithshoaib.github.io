---
layout: post
title: Why do we need to subtract 3 in word index in IMDb dataset from Tensorflow?
date: 2025-12-20
permalink: /posts/2025/12/why-subtract-3-in-word-index-in-IMDb-dataset-tensorflow/
tags:
  - IMDb
  - Tensorflow
  - Keras
excerpt_separator: <!--more-->
toc: true
categories: ["General"]

---
As I was working with IMDb dataset, I noticed while decoding, we need to subtract 3 in the word index to get the corresponding word. Let's understand why.

<!--more-->

We subtract **3** because **IMDB reserves the first 3 indices for special tokens**, not real words.

(i - 3) shifts the index back so it correctly maps to the actual word.

## What’s really happening under the hood

In the **IMDB dataset**, word indices start like this:

|Index|Meaning|
|---|---|
|0|`<PAD>` (padding)|
|1|`<START>` (start of review)|
|2|`<UNK>` (unknown word)|
|3|First real word|
|4|Second real word|
|...|...|

So **actual vocabulary words start from index 3**.

---
## `word_index` vs encoded reviews

### `imdb.get_word_index()`

Returns a dictionary like:

```python
{
  "the": 1,
  "and": 2,
  "a": 3,
  ...
}
```

### But encoded reviews look like:

```python
[1, 14, 22, 16, 43, ...]
```

⚠️ These numbers are **shifted by +3** to make room for special tokens.

---
## Why subtract 3 during decoding?

When decoding:

```python
reverse_word_index.get(i - 3, '?')
```

We are saying:

> This word index includes special tokens — remove that offset so I can map it back to the original word.

---

## Example

Suppose:

```python
i = 6
```

Then:

```python
i - 3 = 3
```

And:

```python
reverse_word_index[3] → "movie"
```

Without subtracting 3:

- You’d get the **wrong word**
- Or `'?'` (key not found)

---
## Full decoding logic

```python
reverse_word_index = {value: key for key, value in imdb.get_word_index().items()}

decoded_review = ' '.join(
    reverse_word_index.get(i - 3, '?') for i in sample_review
)
```

