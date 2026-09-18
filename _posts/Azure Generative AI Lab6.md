---
layout: post
title: Create a generative AI app that uses your own data
date: 2025-05-03
permalink: /posts/2025/05/create-a-generative-ai-app-that-uses-your-own-data/
excerpt_separator: <!--more-->
tags:
  - Azure
  - GenAI
  - RAG
  - Azure AI Foundry
image: /assets/img/posts/genai-rag.png
toc: true
categories: ["Azure"]

---

Use Azure AI Foundry to integrate custom data using RAG into a generative AI app.

<!--more-->

Create a project in Azure AI Foundry by entering the required details like subscription, resource group, hub name, location, connect Azure AI Services or Azure openAI, connect Azure AI search.

For this task, we need two types of generative AI models.
- One for creating vector embeddings to create indexes.
- One for generating the responses in the chat (gpt)

We use **text-embedding-ada-002** and **gpt-4o** models in this case.

For RAG, we need data.

Go to "data + indexes" tab under "my assets" to add data.

Select "+ New data" and upload the folder with pdfs.

Using this data, we need to create Index.

Go to "Indexes" tab and create new index by using "Data in Azure AI Foundry" as the data source.

Select "Azure AI Search" resource in the configuration. Make sure you have the resource in the resource group, if not you need to create the resource and add the resource to the project. You can do that by going to "Connected resources" for the project.

We can also test the index in the playground (wait till the index gets created)

Go to playground and go to "Add your data" tab and select this index that we created.

Test by asking a question related to your data. You should see that the response is based on the data that you have provided. This is the RAG implementation. It grounds the prompt with the data that you provide along with the prompt, uses the embeddings models to search relevant indexes from the index and provides output based on our data.

## Create RAG client app using Azure AI Foundry and Azure OpenAI SDKs

Now, we are ready to write code to create our client app which uses RAG.

The code is available in the lab (check the link below).

Open Azure PowerShell in Azure portal and go to classic version.

Clone the github repo, create virtual env, install required libraries.

Add project connection string, model deployment name, and other details in .env file.

Check the code for RAG implementation.

Run the code to check if it's working.

## References

[Create a generative AI app that uses your own data](https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/04-Use-own-data.html)

