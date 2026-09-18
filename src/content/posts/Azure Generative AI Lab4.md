---
layout: post
title: Develop a multimodal generative AI app
date: 2025-05-01
permalink: /posts/2025/05/develop-a-multimodal-generative-ai-app/
excerpt_separator: <!--more-->
tags:
  - Azure
  - GenAI
  - Multimodal
image:
  path: /assets/img/posts/mmdl.png
toc: true
categories: ["Azure"]

---

Use the Phi-4-multimodal-instruct generative AI model to generate responses to prompts that include text, images, and audio.

<!--more-->

Lab 3: [Create a generative AI chat app](https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/02a-AI-foundry-sdk.html)

---

Okay now let's talk about how we can develop a multimodal generative AI app in Azure AI Foundry.

As we all know, in order to use any a model first we need to create a project in Azure AI Foundry.

After creating the project, we need to deploy the model so the model that we are going to use for this exercise will be Phi-4-multimodal-instruct.

In order to deploy that model we need to go to **models+endpoints** under **my assets** and there we can deploy the base model by searching for Phi-4-multimodal-instruct and we can deploy the model from there.

After deploying the model, we need to go back to Azure portal and open the cloud shell  and select the PowerShell option. If you are already using Bash then you need to switch it to PowerShell because you are going to write some code and for that we need this. Also, we need to make sure that we are in the Classic version of PowerShell.

Now, we can clone the repository of this lab (the details are available in the reference link that I have provided in this post), from there we can clone the repository and go to the python folder, after that we need to create a virtual environment and activate the environment.

Next we install the libraries that we need for this lab including python-dotenv, Azure identity, Azure AI projects and Azure AI inference. 

In the  .env file we need to specify project string and model name which we can copy from Azure AI Foundry portal for our project and the model that we are going to use.

Since this is a multimodal task, we need to add three different input prompts - they are text prompt, image prompt and audio prompt and we can test our model that we have deployed by running the python code for the script that we have created.

All the details related to the python code are available in the reference link which is attached below.

---
## References

- [Develop a multimodal generative AI app](https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/02b-multimodal.html)

