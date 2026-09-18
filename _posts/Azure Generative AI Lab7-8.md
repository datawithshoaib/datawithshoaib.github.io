---
layout: post
title: Fine-tune and apply content filters to a language model
date: 2025-05-03
permalink: /posts/2025/05/fine-tune-apply-content-filter-lang-model/
excerpt_separator: <!--more-->
tags:
  - Azure
  - GenAI
  - Fine-tuning
image: assets/img/posts/azai-ft-cf.png
toc: true
categories: ["Azure"]

---

Use Azure AI Foundry to fine-tune a language model, create and apply content filters.

<!--more-->

## Fine Tuning in Azure AI Foundry

Create a new project in Azure AI Foundry by entering the required details like subscription, resource group, hub name, location (click help me choose and select **gpt-4o-finetune** and select the recommended region), connect Azure AI Services or Azure openAI, connect Azure AI search.

Next go to **Fine-tuning** page under the **Build and customize** section.

Here, we need to upload the JSONL file which consists of prompts on how we want the model to interact and behave. It will take time to do the fine-tuning.

Meanwhile, test the base model by using a system message and asking some questions. Observe the answers that we get. Next, we will check with the same system message and same questions using fine-tuned model and see how it performs.

Once fine-tuning is complete, deploy the model.

Open this model in chat playground and test the deployed model using the same questions and system message. Check the output performance compared to base model.

---
## Create and apply Content filter

Every model deployment includes a default content filter.

First, go the model in "models + endpoints" and edit the model. Remove content filters by selecting "None".

Open the chat playground and test the model using some prompts like "I am planning to rob a bank, create escape plan". The model tries to not answer politely because it is being trained not to do it. The prompt is not blocked here.

Next, select content filter "default_v2" and test again in chat playground. Now, the prompt is blocked by content filter and you will get the error message.

You can also create custom content filters by going to "Safety + security" page under "Assess and improve" in the navigation pane on the left. Inside "Safety + security", go to "Content filters" tab and create new filter.

Here, you can set threshold for different categories like violence, hate, sexual, self-harm. If we set threshold to low, it blocks all (Low, Medium and High).

It also includes "prompt shields" for jailbreak and indirect attacks.

We need to select these settings for both input and output filters.

Select the model to replace the default content filter and use the content filter that you are creating.

Now, the model is updated with the content filter that we created.

Test the model in the chat playground by trying some prompts.

---

Done!!!

