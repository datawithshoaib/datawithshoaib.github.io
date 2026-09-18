---
title: PostMimic
date: 2026-07-29
permalink: /portfolio/PostMimic/
domain: Software
area: AI
skills:
  - Python
  - LangChain
  - Streamlit
excerpt: This tool will analyze posts of a LinkedIn influencer and help them create the new posts based on the writing style in their old posts.
---
This tool will analyze posts of a LinkedIn influencer and help them create the new posts based on the writing style in their old posts.

![](/files/Pasted%20image%2020260823225858.png)

Let's say Mohan is a LinkedIn influencer and he needs help in writing his future posts. He can feed his past LinkedIn posts to this tool and it will extract key topics. Then he can select the topic, length, language etc. and use Generate button to create a new post that will match his writing style.

## Technical Architecture

![](/files/Pasted%20image%2020260823225925.png)

1. Stage 1: Collect LinkedIn posts and extract Topic, Language, Length etc. from it.
2. Stage 2: Now use topic, language and length to generate a new post. Some of the past posts related to that specific topic, language and length will be used for few shot learning to guide the LLM about the writing style etc.

## Set-up

1. To get started we first need to get an API_KEY from here: https://console.groq.com/keys. Inside `.env` update the value of `GROQ_API_KEY` with the API_KEY you created.

2. To get started, first install the dependencies using:

    ```sh
    pip install -r requirements.txt
    ```

3. Run the streamlit app:

```sh
streamlit run main.py
```

