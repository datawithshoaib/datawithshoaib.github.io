---
layout: post
title: Connecting FastAPI to Supabase
description: FastAPI to Supabase connection
date: 2026-10-12
permalink: /posts/2026/10/connecting-fastapi-to-supabase/
excerpt_separator: <!--more-->
tags:
  - FastAPI
  - Supabase
categories:
  - Python & Machine Learning
image: ""
toc: true
---
## Connection and testing process

Create this table in Supabase project.

```sql
CREATE TABLE students(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INTEGER,
  course VARCHAR(100)
);
```

## GET vs. Post in FastAPI

- **GET** means “give me something.” You’re _retrieving_ data.
- **POST** means “here, take this.” You’re _submitting_ data for the server to act on.

The details of a request travel in different places:
- With GET, they go **in the URL**.
- With POST, they go **in the request body**.

### GET: retrieving data

- A GET request asks the server for a resource.
- It shouldn’t change anything on the server, so repeating it ten times gives the same result and causes no harm.

### POST: sending data to create or trigger something

- A POST request carries a payload, usually JSON, in the body.
- The server uses that payload to create a record, process a form, kick off a job, and so on.

---
## FastAPI Security

Create this table in Supabase.

```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

JWT - JSON Web Token

