---
categories: ['Python & Machine Learning']
description: "Understanding how Python dataclasses work under the hood, why they exist, and how they reduce boilerplate."
layout: post
title: Understanding dataclass from first principles
date: 2026-09-17
permalink: /posts/2026/09/understanding-dataclass-from-first-principles/
excerpt_separator: <!--more-->
tags: ['Python', 'Dataclasses', 'OOP', 'Code Quality', 'Python Fundamentals']
toc: true
---
# First: Why do we need `dataclass`?

Suppose we want to represent a user in our program.

We might write:

```python
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email
```

Now let's think about what we're actually doing.

We created a `User` object whose job is basically to **hold data**:

```text
name
age
email
```

But we had to write quite a bit of boilerplate just to store those values.

And this gets worse as the class grows.

---

# What problems do we face?

Imagine this:

```python
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

    def __repr__(self):
        return f"User(name={self.name}, age={self.age}, email={self.email})"

    def __eq__(self, other):
        return (
            self.name == other.name
            and self.age == other.age
            and self.email == other.email
        )
```

Look at all that code.

But what is the class actually doing?

**Mostly holding data.**

We are writing a lot of repetitive code to tell Python:

> "Hey, this object has these fields. Please initialize them, display them nicely, and compare them based on their values."

---

# So what's the root problem?

The root problem is:

> **We're writing repetitive boilerplate code for classes whose main purpose is to store data.**

And this is where we naturally ask:

> **"Can Python generate all this boring code for us?"**

Yes.

That's what `dataclass` helps with.

---

# So what is `dataclass`?

Python provides a built-in module called:

```python
dataclasses
```

Inside it, there is something called:

```python
dataclass
```

So we import it:

```python
from dataclasses import dataclass
```

And then we can write:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str
```

That's it.

We don't need to manually write the `__init__()`.

Python generates it for us.

---

# What did we just gain?

Now we can do:

```python
user = User(
    name="Shoaib",
    age=26,
    email="shoaib@example.com"
)
```

And access the values:

```python
print(user.name)
print(user.age)
```

We can also get a useful representation:

```python
print(user)
```

Something like:

```text
User(name='Shoaib', age=26, email='shoaib@example.com')
```

We didn't write a `__repr__()` ourselves.

**The dataclass generated it.**

---

# Let's slow down and understand the magic

When Python sees:

```python
@dataclass
class User:
    name: str
    age: int
    email: str
```

you're essentially telling Python:

> "This class is mainly a container for data. Please generate the common methods I would otherwise have to write myself."

So Python can automatically generate things such as:

- `__init__()` → creates/initializes the object
    
- `__repr__()` → gives a useful string representation
    
- `__eq__()` → compares objects based on their fields
    

There are also other options you can configure, such as ordering, immutability (`frozen=True`), and more.

---

# But wait... what's the difference from a normal class?

A normal class:

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age
```

You manually tell Python:

> "Create these attributes and assign these values."

With a dataclass:

```python
@dataclass
class User:
    name: str
    age: int
```

You tell Python:

> "These are the fields this object has."

Python figures out the repetitive parts.

---

# Why are the `: str` and `: int` there?

This:

```python
name: str
age: int
```

uses **type annotations**.

You're saying:

```text
name → expected to be a string
age  → expected to be an integer
```

So:

```python
@dataclass
class User:
    name: str
    age: int
```

is basically describing the **shape of the data**.

This is one reason dataclasses are especially nice when working with structured data.

---

# A real-world analogy

Imagine you're creating employee records.

Every employee has:

```text
Name
Age
Department
Salary
```

Without dataclasses, you might repeatedly write forms like:

> "Create name field, assign name. Create age field, assign age. Create department field..."

With a dataclass, you're essentially saying:

> "An employee record has these four fields."

Python handles much of the repetitive machinery.

---

# One important thing beginners should know

`@dataclass` does **not** mean:

> "This is just a dictionary."

It's still a **normal Python class**.

You can still add methods:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

    def is_adult(self):
        return self.age >= 18
```

Now:

```python
user = User("Shoaib", 26)

print(user.is_adult())
```

So dataclasses are useful when you want:

> **A class + structured data + less boilerplate.**

---

# And what does the `@` mean?

This part:

```python
@dataclass
class User:
    ...
```

is a **decorator**.

You can think of it initially as:

> "Take this class and apply some extra behavior to it."

`dataclass` takes your class and modifies/enhances it by generating the methods you would commonly need.

You don't need to deeply understand decorators yet to understand dataclasses.

---

# The whole reasoning in one flow

Let's connect the dots:

**We need an object to store data.**

↓

We create a class.

↓

The class mainly contains fields.

↓

We have to write repetitive `__init__`, `__repr__`, `__eq__`, etc.

↓

**That's boilerplate.**

↓

So we ask:

> "Why should we manually write code that Python can generate from the fields?"

↓

Python gives us:

```python
from dataclasses import dataclass
```

↓

We write:

```python
@dataclass
class User:
    name: str
    age: int
```

↓

Python generates the common boilerplate for us.

---

## Mental model

Remember:

> `@dataclass` = This class mainly holds data. Python, please handle the boring boilerplate.

And:

```python
from dataclasses import dataclass
```

simply means:

> **"Bring Python's `dataclass` tool into this file so I can use it."**

