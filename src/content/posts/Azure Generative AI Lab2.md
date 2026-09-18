---
layout: post
title: Choose and deploy a language model
date: 2025-05-01
permalink: /posts/2025/05/choose-and-deploy-a-language-model/
tags:
  - Azure
  - GenAI
  - Model Deployment
image: /assets/img/posts/llm-deploy.png
toc: true
categories: ["Azure"]

---

Use Azure AI Foundry portal to choose, compare and deploy the models from model catalog.

Create a new project.

## Configure Azure AI Inference service deployment

Enable this option under preview features.

![img](/assets/img/posts/enable-azureai-model-inference-service.png)

## Model catalog

Search for any models in the model catalog and view its details in the details tab of the selected model.

Click on benchmarks tab to compare with other similar models.

On the Benchmarks tab we can compare different models based on different parameters like AI quality, cost, time to first token and generated tokens per second.

So we can select the model based on the metrics and based on our needs. This is about Benchmarks tab under each model.

## Compare models

Next, we can also compare the models by going to the model catalogue and there we have an option called **compare models**, when we click on compare models, it will display the chart to compare different model metrics.

On the compare models tab we need to select the models that we want to compare by clicking on **+model to compare** option at the bottom. There are different parameters based on which we can compare, like in quality: we have quality index, accuracy, coherence, fluency, groundedness and relevance. Based on these properties we can compare our models of interest. In the chart we have two axes, for which we can change the properties that I mention before and view the details based on our selections and compare different models.

## Deploy models

Let's talk about deploying the models.

We can deploy the model of our interest in 2 ways, the first way is to directly deploying it from the model catalogue. When we select a model it will display a button to deploy at the top which is in blue color so when we click on it, we can deploy the model.

Other option to deploy is by going to **models + endpoints** option under my assets on the left navigation bar and from there we can deploy base model by selecting the model and deploy it.

Once we deploy the models,  we can test these models by going to the chat playground. 
We can navigate to playgrounds on the left navigation bar and select chat playground there. 

We can start by giving the model instructions and context and start chatting with the model on the right side.  So this is how we compare different models and we have a good starting point to choose our model based on the outputs that we get. Here, basically we get the output the model generates based on its abilities, so we can compare the models which we want to use and we can decide whether we need to move forward with the models that we have selected.
