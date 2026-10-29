---
layout: post
title: Building a FastAPI Backend with Supabase
description: "Building a FastAPI Backend with Supabase: Connections, GET vs POST, and JWT Security"
date: 2026-10-12
permalink: /blog/building-fastapi-backend-with-supabase/
excerpt_separator: <!--more-->
tags:
  - FastAPI
  - Supabase
categories:
  - Python & Machine Learning
image: ""
toc: true
---
A FastAPI backend becomes a real application the moment it talks to a database and protects its own routes. This post walks through three building blocks: connecting FastAPI to a Supabase (PostgreSQL) project and testing the connection, choosing between GET and POST, and securing your API with JWT-based authentication.

We will use two small tables as running examples: `students` for ordinary data, and `users` for login. By the end you will know how to create both tables, read and write records through HTTP endpoints, and issue and verify tokens that prove who is calling your API.

This guide assumes you know basic Python and have a Supabase project and a FastAPI app running locally.

## Connecting FastAPI to Supabase and testing it

Supabase gives you a hosted PostgreSQL database with a dashboard and an auto-generated API. Before FastAPI can use it, you need a table to work with.

### Step 1: Create the students table

Open the SQL Editor in your Supabase project, paste the following, and run it:

```sql
CREATE TABLE students(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INTEGER,
  course VARCHAR(100)
);
```

A few design choices are worth noting:

- `BIGSERIAL PRIMARY KEY` gives every student an auto-incrementing id, so you never insert it yourself.
- `NOT NULL` on `name` and `email` means a student record is rejected without them.
- `UNIQUE` on `email` stops two students from registering with the same address. Your API should be ready to handle that error.
- `age` and `course` are optional, so they accept nulls.

### Step 2: Install the dependencies

```bash
pip install fastapi uvicorn supabase python-dotenv
```

### Step 3: Store your credentials safely

In the Supabase dashboard, open Project Settings, then API, and copy your project URL and key. Put them in a `.env` file next to your app and never commit that file to Git.

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-key-here
```

Use the anon key for client-style access governed by Row Level Security. A service-role key bypasses those rules, so keep it on the server only and never ship it to a browser or mobile app.

### Step 4: Create the connection

```python
# database.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
```

### Step 5: Test the connection

Add a quick route that reads from the table. If it returns an empty list, the connection works and the table is simply empty.

```python
# main.py
from fastapi import FastAPI
from database import supabase

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/test-db")
def test_db():
    response = supabase.table("students").select("*").limit(1).execute()
    return {"connected": True, "rows": response.data}
```

Start the server:

```bash
uvicorn main:app --reload
```

Then visit `http://127.0.0.1:8000/docs`. FastAPI generates interactive Swagger documentation automatically, so you can click `/test-db`, choose Try it out, and press Execute. A `200` response with `"connected": true` confirms the whole chain works.

If something fails, check these first:

- **Invalid API key or URL:** re-copy both values and restart the server so the `.env` file is reloaded.
- **Relation "students" does not exist:** the SQL did not run, or you created it in a different project.
- **Empty result with Row Level Security enabled:** with the anon key and no policy, Supabase returns no rows. Add a policy or use a server-side key for testing.

## GET vs POST in FastAPI

GET means "give me something." You are retrieving data. POST means "here, take this." You are submitting data for the server to act on. Almost every endpoint you write will be one or the other, so it pays to be clear about the difference.

### Where the details travel

The details of a request travel in different places:

- With GET, they go in the URL, as a path (`/students/5`) or a query string (`/students?course=Python`).
- With POST, they go in the request body, usually as JSON.

|  | GET | POST |
| --- | --- | --- |
| Purpose | Retrieve data | Send data to create or trigger something |
| Data location | URL (path and query) | Request body (usually JSON) |
| Changes server state | No | Usually yes |
| Safe to repeat | Yes | No, repeating may create duplicates |
| Typical status code | 200 OK | 201 Created |

### GET: retrieving data

A GET request asks the server for a resource. It should not change anything on the server, so repeating it ten times gives the same result and causes no harm. That property is what lets browsers, caches and proxies treat GET requests so freely.

Here are two GET endpoints for the students table: one to list students and one to fetch a single student by id.

```python
from fastapi import FastAPI, HTTPException
from database import supabase

app = FastAPI()

@app.get("/students")
def list_students(course: str | None = None):
    query = supabase.table("students").select("*")
    if course:
        query = query.eq("course", course)
    return query.execute().data

@app.get("/students/{student_id}")
def get_student(student_id: int):
    result = supabase.table("students").select("*").eq("id", student_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Student not found")
    return result.data[0]
```

Notice that `student_id` comes from the path, while `course` is an optional query parameter. FastAPI reads both from the URL and validates their types for you.

### POST: sending data to create or trigger something

A POST request carries a payload, usually JSON, in the body. The server uses that payload to create a record, process a form, kick off a job, and so on.

In FastAPI, you describe the expected body with a Pydantic model. FastAPI then validates incoming JSON automatically and returns a clear `422` error if a field is missing or has the wrong type.

```python
from pydantic import BaseModel, EmailStr

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    age: int | None = None
    course: str | None = None

@app.post("/students", status_code=201)
def create_student(student: StudentCreate):
    try:
        result = supabase.table("students").insert(student.model_dump()).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result.data[0]
```

`EmailStr` needs one extra package: `pip install "pydantic[email]"`.

A request to create a student looks like this:

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "age": 21,
  "course": "Data Science"
}
```

Send the same POST twice and the second one fails, because of the `UNIQUE` constraint on `email` from earlier. That is a good illustration of why POST is not safe to repeat blindly, and why database constraints are a useful second line of defence.

### Testing both methods

Open `/docs` and try each endpoint. You can also test from the terminal:

```bash
curl http://127.0.0.1:8000/students

curl -X POST http://127.0.0.1:8000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Rao","email":"asha@example.com","age":21,"course":"Data Science"}'
```

### Rule of thumb

If the request only reads, use GET. If it creates something or has side effects, use POST. Never put secrets such as passwords in a GET URL, since URLs end up in browser history and server logs. That is exactly why login endpoints use POST.

## FastAPI security: users and passwords

So far anyone can call every endpoint. To fix that, your API needs to know who is calling. That starts with a place to store users.

### Create the users table

Run this in the Supabase SQL Editor:

```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

- `GENERATED ALWAYS AS IDENTITY` is the modern PostgreSQL way to auto-number rows. It is the standard-compliant alternative to `BIGSERIAL`, and the database refuses manual id values unless you explicitly override it.
- `username` is `UNIQUE`, so two accounts cannot share a name.
- The `password` column is named plainly, but it must never hold a plain-text password. It stores a hash.

### Never store passwords as plain text

If your database leaks, plain-text passwords expose every user, including on other sites where they reused the same password. Instead, store a salted hash from a slow algorithm such as bcrypt. You cannot reverse a hash, but you can hash a login attempt and compare the two.

```bash
pip install bcrypt
```

```python
# security.py
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

### A registration endpoint

Registration is a POST, since it creates a record and carries a password in the body.

```python
from pydantic import BaseModel
from security import hash_password

class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/register", status_code=201)
def register(user: UserCreate):
    existing = supabase.table("users").select("id").eq("username", user.username).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Username already taken")
    supabase.table("users").insert({
        "username": user.username,
        "password": hash_password(user.password),
    }).execute()
    return {"message": "User created"}
```

Never return the password field in any response, hashed or not.

## JWT: JSON Web Token

A JSON Web Token is a compact, signed string that proves a user logged in. After a successful login, the server hands the client a token. The client sends it back with every later request, and the server checks the signature instead of asking for the password again.

### What a JWT looks like

A JWT has three parts separated by dots: `header.payload.signature`.

| Part | What it holds |
| --- | --- |
| Header | The token type and the signing algorithm, for example HS256 |
| Payload | Claims such as the username (`sub`) and an expiry time (`exp`) |
| Signature | A hash of the header and payload made with your secret key |

The header and payload are only Base64-encoded, not encrypted. Anyone holding the token can read them, so never put passwords or other secrets in the payload. What the signature gives you is tamper detection: if someone edits the payload, the signature no longer matches and the server rejects the token.

### The login flow

1. The client sends a username and password in a POST to `/login`.
2. The server looks up the user and verifies the password hash.
3. If it matches, the server creates a JWT with an expiry and signs it with a secret key.
4. The client stores the token and sends it in the `Authorization: Bearer <token>` header on later requests.
5. For each protected route, the server verifies the signature and expiry, then identifies the user from the payload.

### Implementing it

Install PyJWT and add a secret to your `.env` file. Generate a long random value, for example with `openssl rand -hex 32`.

```bash
pip install pyjwt
```

```text
JWT_SECRET=paste-a-long-random-string-here
```

Create and verify tokens:

```python
# auth.py
import os
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
TOKEN_MINUTES = 30

bearer_scheme = HTTPBearer()

def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_MINUTES)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]
```

Add the login endpoint:

```python
from security import verify_password
from auth import create_access_token, get_current_user

@app.post("/login")
def login(user: UserCreate):
    result = supabase.table("users").select("*").eq("username", user.username).execute()
    if not result.data or not verify_password(user.password, result.data[0]["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
```

The error message is deliberately the same whether the username or the password is wrong, so attackers cannot learn which usernames exist.

### Protecting your routes

Add `Depends(get_current_user)` to any endpoint that should require a login. Here the students list becomes private, and creating a student requires a valid token too:

```python
@app.get("/students")
def list_students(current_user: str = Depends(get_current_user)):
    return supabase.table("students").select("*").execute().data

@app.post("/students", status_code=201)
def create_student(student: StudentCreate, current_user: str = Depends(get_current_user)):
    return supabase.table("students").insert(student.model_dump()).execute().data[0]
```

In the Swagger UI at `/docs`, click Authorize, paste the token from `/login`, and the protected routes start working. Without a token, FastAPI returns `401` or `403` before your code even runs.

### Security checklist

- Keep `JWT_SECRET` and your Supabase keys in environment variables, never in source code.
- Serve the API over HTTPS in production, since a bearer token sent over plain HTTP can be stolen.
- Keep access tokens short-lived, around 15 to 30 minutes, and add refresh tokens if users need longer sessions.
- Hash every password with bcrypt or a similar slow algorithm.
- Add rate limiting on `/login` to slow down guessing attacks.
- Decide whether to use your own users table, as in this post, or Supabase Auth, which manages signup, login and tokens for you.

## Conclusion and next steps

You now have a FastAPI app that connects to Supabase, reads data with GET, writes data with POST, and guards its routes with JWT. The pattern is simple and repeats everywhere: validate input with Pydantic, talk to the database, and return a clear status code.

From here, good next steps are:

- Add `PUT` or `PATCH` and `DELETE` endpoints to complete CRUD for students.
- Restrict who can modify records by adding roles to your `users` table and to the token payload.
- Turn on Row Level Security in Supabase and write policies so the database enforces access rules too.
- Split the app into routers and add tests with FastAPI's `TestClient`.

