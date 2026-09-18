---
layout: post
title: Use a prompt flow to manage conversation in a chat app
date: 2025-05-03
permalink: /posts/2025/05/use-prompt-flow-to-manage-conversation-in-chat-app/
excerpt_separator: <!--more-->
tags:
  - Azure
  - GenAI
  - PromptFlow
  - Azure AI Foundry
image: /assets/img/posts/prmpt-flow.png
toc: true
categories: ["Azure"]

---

Use Azure AI Foundry portal’s prompt flow to create a custom chat app that uses a user prompt and chat history as inputs, and uses a GPT model from Azure OpenAI to generate an output.

<!--more-->

Create a project in Azure AI Foundry by entering the required details like subscription, resource group, hub name, location, connect Azure AI Services or Azure openAI, connect Azure AI search.

## Configure resource authorization

After creating the project,  the next step is to make sure that Azure AI services have access to storage account, especially blob storage, because prompt flow uses folder assets in order to store the details related to Prompt flow.

Open **management center** and go to  project overview page. We can find the resource group link,  click on it to open the resource group related to this hub in the Azure portal.

Select **Azure AI services resource** and under **Resource Management** go to *Identity* and turn on the status. This creates the Microsoft Entra ID for our resource, which can be used to manage access to other resources to use in Azure AI Foundry.

Next go to storage account,  identity and access management (IAM) and add **Storage Blob Data Reader role.**

While adding this role,  we need to select the ID that we have created earlier for our Azure AI services resource.

## Deploy the model

Next, we deploy the required model in this case we are deploying gpt-4o by going to **models+end points** option under **my assets** and deploying a base model.

Now we can create a prompt flow by going to **Prompt flow** in the navigation pane under **build and customise.**

## Create a prompt flow

A prompt flow provides a way to orchestrate prompts and define interacting with the model.

In the prompt flow tab, we can use templates to create a basic structure of the prompt flow and we can make modifications to it based on our needs.

Start the compute session.

We have inputs, outputs and tools that we can configure.

Inputs: we have 2 options - chat history, user question
Outputs: shows model output
Chat LLM tool pane: to connect the our deployed model, and selecting api (chat), deployment name and response format (text)

## Test the flow

Use chat option which is to the right of start compute option at top right corner. Click on it, it opens a chat window on the right side and we can test the flow by chatting with the model.

## Deploy the flow

At top, we have option to deploy.

Once deployed, we can go to **models + endpoints** tab under **my assets** to test the deployment.

We can use this to create the AI apps.

