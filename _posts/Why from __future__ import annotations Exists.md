---
layout: post
title: Why from __future__ import annotations Exists?
date: 2026-09-17
permalink: /posts/2026/09/why-from-__future__-import-annotations-exists/
excerpt_separator: <!--more-->
tags:
  - Python
categories:
  - Python
image: ""
toc: true
---
Have you ever wondered why some Python files start with this strange line?

```python
from __future__ import annotations
```

At first, it looks like some advanced Python magic. But the idea is actually quite simple.

## The Problem

Python Tries to Evaluate Annotations

Consider this:

```python
class User:
    def get_friend(self) -> User:
        pass
```

We want to say:

> “`get_friend()` returns a `User`.”

Makes perfect sense, right?

But there is a small problem.

While Python is creating the `User` class, `User` isn't completely defined yet. So Python may try to evaluate `User` in the type annotation before the class is ready.

The problem isn't really the type itself.

**The problem is timing.**

We want to refer to `User`, but we don't need Python to figure out what `User` is immediately.

## So How Do We Fix It?

One traditional solution is to put the type in quotes:

```python
class User:
    def get_friend(self) -> "User":
        pass
```

The quotes tell Python:

> “Don't evaluate this right now. This is a reference to a type.”

But imagine doing this everywhere.

It gets annoying.

So Python gives us a cleaner solution:

```python
from __future__ import annotations
```

Now we can simply write:

```python
from __future__ import annotations

class User:
    def get_friend(self) -> User:
        pass
```

Python postpones the evaluation of the annotation instead of trying to resolve it immediately.

## Why Is This Useful?

This becomes especially helpful when types refer to themselves or to types that are defined later.

For example:

```python
from __future__ import annotations

class Employee:
    manager: Employee
```

Here, `Employee` refers to itself.

Without deferred annotation behavior, Python can run into problems because the class is still being defined.

With `from __future__ import annotations`, Python can safely keep the annotation without immediately resolving it.

## The Root Cause

Let's boil everything down:

**Problem:**  
We want to use a type that isn't available yet.

↓

**Why?**  
Python normally evaluates annotations too early.

↓

**What do we actually need?**  
We don't need the type resolved immediately. We just need to record the annotation.

↓

**Solution:**

```python
from __future__ import annotations
```

↓

**Result:**  
Type annotations are postponed, making forward references easier to write.

## A Simple Mental Model

Think of it like writing a person's name on a guest list.

You write:

> `John`

You don't need John to be standing in front of you **right now**.

You can write his name down and figure out who he is later.

That's essentially the idea behind deferred annotations.

### Without it

> “Who is `User`? Tell me right now!”

### With it

> “Okay, I'll record `User` and figure it out when necessary.”

## The One-Line Takeaway

Remember this:

> **`from __future__ import annotations` = Don't rush to evaluate type hints.**

It is especially useful for **forward references, self-referencing classes, and cleaner type annotations**.

