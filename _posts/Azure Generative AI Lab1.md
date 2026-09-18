---
layout: post
title: Prepare for an AI development project
date: 2025-04-30
permalink: /posts/2025/04/prepare-for-an-ai-development-project/
tags:
  - Azure
  - GenAI
  - AI Foundry
image: /assets/img/posts/prep-aidev.png
toc: true
categories: ["Azure"]

---

Use Azure AI Foundry portal to create a hub and project to build an AI solution.

In order to prepare for an AI development project, go to Azure AI Foundry portal.

https://ai.azure.com

## Create a project

On the home page, we have an option to create project, click on it.

It will automatically create new resources and hub (if we don't have one).

![img]({{ site.baseurl }}/assets/img/posts/ai-foundry-project-creation.png)

Here, we can see:
- Hub name
- subscription
- resource group
- location: select **help me choose** option and selection gpt4o (under global standard) and select the recommended location.
- Azure AI services
- Connect Azure AI Search: Skip connecting

Click on management center at the bottom left and view the hubs and projects.

In the navigation pane, we can view and manage hubs and projects assets. Both includes
- Overview
- Users
- Models + endpoints
- Connected resources
- Compute (only for hubs)

On the hub overview page, we can click on resource group and it opens the Azure portal. We can see all the resources it has created.

We can also add the Azure AI services resource by clicking on **+Create** option in the resource group page and searching for Azure AI services.

Make sure you select the same resource group while creating the new Azure AI services resource.

Then, to use this resource that we created, we need to go back to the Azure AI Foundry Management Center and click on connected resources under projects.

Now, click on **+ New connection**, select Azure AI services, browser and click on Add connection for our new resource. It will be added to our project and our hub and anyone who have access to the hub can use this resource.

## Explore AI services

On the project page, on left navigation, select AI services.

Select Language + Translator

Under explore language capabilities, select Translation.

Go to **Try with your own** tab.

Now, we can select our AI services resource and try translation.

## Deploy and test generative AI model

On project page, on navigation pane on left, we have "Models + endpoints" under "My assets"

Click on it and see that at the top we have **+ Deploy model** option.

select **Deploy base model** option.

Choose gpt-4o and deploy it.

In the deployment overview page, we have an option **Open in playground**. Click on it.

Now, we can give instructions to the model in **Give the model instructions and context** box.

Test the model.

> We have explored Azure AI Foundry, how to create a project, how to connect an Azure AI Services resource, and how use AI services, deploy and test generative AI models.

