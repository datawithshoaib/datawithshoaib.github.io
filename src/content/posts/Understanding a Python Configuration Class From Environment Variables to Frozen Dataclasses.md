---
categories: ['Python & Machine Learning']
description: "Deep dive into building robust, type-safe, immutable application configuration classes in modern Python."
layout: post
title: Understanding a Python Configuration Class From Environment Variables to Frozen Dataclasses
date: 2026-09-17
permalink: /posts/2026/09/understanding-a-python-configuration-class-from-environment-variables-to-frozen-dataclasses/
excerpt_separator: <!--more-->
toc: true
tags: ['Python', 'Dataclasses', 'Configuration', 'Clean Code', 'Environment Variables']

---
When you see code like this for the first time:

```python
from __future__ import annotations
from dataclasses import dataclass
import os
from dotenv import load_dotenv

DEFAULT_MODEL = "llama-3.3-70b-versatile"

@dataclass(frozen=True)
class PlannerSettings:
    """Runtime configuration for the planner and its research workers."""

    model_name: str = DEFAULT_MODEL
    groq_api_key: str | None = None
    tavily_api_key: str | None = None

    @classmethod
    def from_environment(cls) -> "PlannerSettings":
        load_dotenv()
        return cls(
            model_name=os.getenv("PLANNER_MODEL", DEFAULT_MODEL),
            groq_api_key=os.getenv("GROQ_API_KEY"),
            tavily_api_key=os.getenv("TAVILY_API_KEY"),
        )
```

it can feel like a lot of unrelated Python features thrown together.

But there is actually a simple idea behind the whole code:

> **We want one clean, reliable object that contains all the configuration our application needs.**

Let's understand how we arrive at that solution.

---

# 1. First, what problem are we trying to solve?

Imagine our application needs three things:

```text
Model name
Groq API key
Tavily API key
```

We could write:

```python
model_name = "llama-3.3-70b-versatile"
groq_api_key = "..."
tavily_api_key = "..."
```

But there are problems.

Where should these values come from?

Should we hardcode them?

```python
groq_api_key = "gsk_abc123..."
```

Definitely not. 😬

API keys are secrets and shouldn't normally be hardcoded into our source code.

So we need a better way.

---

# 2. Where should configuration come from?

A common solution is to put configuration in **environment variables**.

For example, we might have a `.env` file:

```text
GROQ_API_KEY=gsk_xxxxxxxxx
TAVILY_API_KEY=tvly_xxxxxxxxx
PLANNER_MODEL=llama-3.3-70b-versatile
```

Now our Python application can read these values instead of putting secrets directly into the code.

So we now have a new question:

> **How can Python read environment variables?**

That's where `os` comes in.

---

# 3. What is `import os` doing?

```python
import os
```

Python's `os` module gives us tools for interacting with the operating system.

One of those tools is:

```python
os.getenv()
```

For example:

```python
os.getenv("GROQ_API_KEY")
```

means:

> "Operating system, do you have an environment variable called `GROQ_API_KEY`?"

If it exists, Python gets its value.

If it doesn't exist, `os.getenv()` returns:

```python
None
```

---

# 4. But what about the `.env` file?

Here's the catch.

We might have:

```text
.env
```

containing:

```text
GROQ_API_KEY=gsk_xxxxxxxxx
```

But Python's `os.getenv()` doesn't automatically read `.env` files.

So we need something that loads the `.env` values into the environment.

That's what **python-dotenv** provides.

We write:

```python
from dotenv import load_dotenv
```

Then:

```python
load_dotenv()
```

This basically says:

> **"Read the `.env` file and load those variables so my Python program can access them."**

Now this works:

```python
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
```

---

# 5. Now we have another problem

We could simply do this:

```python
model_name = os.getenv("PLANNER_MODEL")
groq_api_key = os.getenv("GROQ_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")
```

But imagine a bigger application.

Soon we might have:

```text
model
API keys
temperature
max tokens
database URL
logging level
timeout
worker count
etc.
```

If these variables are scattered throughout our application, things become messy.

So we ask:

> **"Can we put all our configuration in one place?"**

Yes.

And that's why we create a configuration class.

---

# 6. Let's create a dataclass

We write:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class PlannerSettings:
    model_name: str
    groq_api_key: str | None
    tavily_api_key: str | None
```

Now we have one object representing our application's configuration.

For example:

```python
settings = PlannerSettings(
    model_name="llama-3.3-70b-versatile",
    groq_api_key="gsk_xxx",
    tavily_api_key="tvly_xxx"
)
```

Instead of passing three separate variables everywhere, we can simply pass:

```python
settings
```

Much cleaner.

---

# 7. Why `@dataclass`?

Remember what a dataclass does.

Without it, we'd have to write something like:

```python
class PlannerSettings:

    def __init__(
        self,
        model_name,
        groq_api_key,
        tavily_api_key
    ):
        self.model_name = model_name
        self.groq_api_key = groq_api_key
        self.tavily_api_key = tavily_api_key
```

That's mostly boilerplate.

The class is primarily there to **hold data**.

So:

```python
@dataclass
```

tells Python:

> "This class is mainly a container for data. Handle the common boilerplate for me."

---

# 8. Why `frozen=True`?

Now look at this:

```python
@dataclass(frozen=True)
```

Why freeze the configuration?

Think about what configuration represents.

When our application starts, we might load:

```text
Model → llama-3.3-70b-versatile
Groq API key → xxx
Tavily API key → xxx
```

We probably don't want some random part of the application to suddenly do:

```python
settings.model_name = "some-other-model"
```

That could create confusing behavior.

So we freeze the object.

```python
@dataclass(frozen=True)
```

means:

> **"Once the settings object is created, don't allow its fields to be reassigned."**

This makes our configuration object safer and more predictable.

---

# 9. What is `DEFAULT_MODEL`?

Now we have:

```python
DEFAULT_MODEL = "llama-3.3-70b-versatile"
```

Why do we need this?

Because maybe the user doesn't specify a model in the `.env` file.

For example:

```text
GROQ_API_KEY=...
TAVILY_API_KEY=...
```

There is no:

```text
PLANNER_MODEL=...
```

So what should our application use?

We need a **fallback**.

That's what this constant provides:

```python
DEFAULT_MODEL
```

Then:

```python
model_name: str = DEFAULT_MODEL
```

means:

> "If nobody provides a model name, use the default model."

---

# 10. Understanding `str | None`

Look at:

```python
groq_api_key: str | None = None
```

This looks complicated, but it's simple.

It means:

> "The value can either be a string or `None`."

Why?

Because the API key might exist:

```python
"gsk_xxxxxxxxx"
```

or it might not exist:

```python
None
```

So:

```python
str | None
```

describes both possibilities.

And:

```python
= None
```

provides the default value.

---

# 11. Now comes the interesting part: `from_environment()`

Instead of forcing the developer to manually create:

```python
PlannerSettings(
    model_name=...,
    groq_api_key=...,
    tavily_api_key=...
)
```

we can make the class create itself from environment variables.

That's what this method does:

```python
@classmethod
def from_environment(cls) -> "PlannerSettings":
```

Think of it as:

> **"Create a `PlannerSettings` object using whatever configuration is available in the environment."**

---

# 12. Why `@classmethod`?

Normally, we call a method on an object:

```python
settings.some_method()
```

But here we don't have a settings object yet!

We're trying to **create** the settings object.

So calling:

```python
PlannerSettings.from_environment()
```

makes more sense.

`@classmethod` allows the method to work with the **class itself**.

Inside the method:

```python
cls
```

refers to:

```python
PlannerSettings
```

So:

```python
return cls(...)
```

is essentially creating:

```python
PlannerSettings(...)
```

---

# 13. What does `-> "PlannerSettings"` mean?

We have:

```python
def from_environment(cls) -> "PlannerSettings":
```

We're saying:

> "This method returns a `PlannerSettings` object."

But notice the quotes:

```python
"PlannerSettings"
```

Why?

This relates to something we discussed earlier.

The class is still being defined when this method is being defined.

So Python might not be able to resolve `PlannerSettings` immediately.

The annotation is therefore written as a forward reference.

And because we have:

```python
from __future__ import annotations
```

we can even write:

```python
-> PlannerSettings
```

without the quotes in modern Python.

---

# 14. Now let's follow the method step by step

Here's the method:

```python
@classmethod
def from_environment(cls) -> "PlannerSettings":

    load_dotenv()

    return cls(
        model_name=os.getenv("PLANNER_MODEL", DEFAULT_MODEL),
        groq_api_key=os.getenv("GROQ_API_KEY"),
        tavily_api_key=os.getenv("TAVILY_API_KEY"),
    )
```

Let's follow the flow.

### Step 1: Load `.env`

```python
load_dotenv()
```

Python reads the `.env` file.

For example:

```text
PLANNER_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=gsk_xxx
TAVILY_API_KEY=tvly_xxx
```

---

### Step 2: Get the model

```python
os.getenv("PLANNER_MODEL", DEFAULT_MODEL)
```

This means:

> "Look for `PLANNER_MODEL`."

If it exists:

```text
PLANNER_MODEL → its value
```

If it doesn't:

```text
→ DEFAULT_MODEL
```

So we always have a model name.

---

### Step 3: Get the Groq key

```python
os.getenv("GROQ_API_KEY")
```

If the variable exists:

```text
→ "gsk_xxx"
```

If it doesn't:

```text
→ None
```

---

### Step 4: Get the Tavily key

Same idea:

```python
os.getenv("TAVILY_API_KEY")
```

It either gives us the key or:

```python
None
```

---

### Step 5: Build the configuration object

Finally:

```python
return cls(...)
```

creates:

```python
PlannerSettings(
    model_name="llama-3.3-70b-versatile",
    groq_api_key="gsk_xxx",
    tavily_api_key="tvly_xxx"
)
```

And returns it.

---

# 15. So the entire design makes sense now

Let's connect everything.

We started with a problem:

> **Our application needs configuration.**

↓

We don't want secrets hardcoded in Python.

↓

So we put configuration in environment variables / `.env`.

↓

We need to read those values.

↓

`os.getenv()` reads environment variables.

↓

`.env` isn't automatically loaded.

↓

`load_dotenv()` loads `.env`.

↓

Now we have several configuration values.

↓

Scattering them throughout the application would become messy.

↓

So we create one configuration object.

↓

`@dataclass` removes boilerplate.

↓

`frozen=True` prevents accidental modification.

↓

`DEFAULT_MODEL` gives us a fallback.

↓

`@classmethod from_environment()` gives us a convenient way to construct the object.

↓

And finally:

```python
settings = PlannerSettings.from_environment()
```

gives the application **one clean source of configuration**.

---

# 16. The complete mental model

Think of `PlannerSettings` as a **configuration box**.

```text
              .env / Environment
                     │
                     ▼
              load_dotenv()
                     │
                     ▼
               os.getenv()
                     │
                     ▼
          ┌─────────────────────┐
          │   PlannerSettings   │
          │                     │
          │ model_name           │
          │ groq_api_key         │
          │ tavily_api_key       │
          └─────────────────────┘
                     │
                     ▼
              Rest of the app
```

The application doesn't need to worry about **where** the configuration came from.

It simply gets:

```python
settings = PlannerSettings.from_environment()
```

and then uses:

```python
settings.model_name
settings.groq_api_key
settings.tavily_api_key
```

That's the real purpose of this code.

> **It separates configuration loading from the rest of the application and puts all runtime settings into one clean, immutable object.**

