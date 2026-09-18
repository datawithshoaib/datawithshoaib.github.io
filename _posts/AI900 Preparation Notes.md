---
layout: post
title: AI-900 Preparation Notes
date: 2025-03-06
permalink: /posts/2025/03/ai-900-preparation-notes/
excerpt_separator: <!--more-->
tags:
  - Azure
  - AI-900
image: /files/AI900-Prep.png
toc: true
categories: ["Azure"]

---

I have created this notes while I was preparing for AI-900 exam. It includes some important concepts essential for this exam.

<!--more-->

## Microsoft's 6 principles for responsible AI

- Fairness
- Inclusiveness
- Reliability and safety
- Transparency
- Accountability
- Privacy and security

### Inclusiveness

- AI system that empowers everyone (including ppl with hearing, visual, and other disabilities), gender, race.

### Reliability and safety

- operate according to original design
- respond to unanticipated conditions - like self driving car during unexpected condition
- resist to harmful manipulation
- how to make sure this step in AI model? - include AI model validation step in the AI development lifecycle

### Accountability

- follow frame of governance & organizational requirements with defined legal and ethical standards.
- ensure decisions made by AI systems can be overridden by humans.
- AI should not be final decision maker

### Privacy and security

- Provide consumers with info and controls on how their data is collected, used and stored.
- How to ensure this? - establish a risk governance committee (which includes members from legal team, risk management team, and a privacy officer)

### Fairness

- AI systems should not reflect biases from data used to train the systems.
- for ex: it should provide same results to people living in rural and urban areas. (if this is not relevant for its output)
### Transparency

- show how the AI model works, its possibilities and limitations.
- Include documentation
- Ex: AI system for loan approval - factors used to make the decision should be explained.
- You want to ensure model meets this principle -> enable Explain best model

---
## Anomaly Detection

- Identifying transactions that are potentially fraudulent
- Network intrusion (which is not normal)
- Suspicious sign-in (different from normal pattern)
- Finding abnormal clusters of patients
- Checking values entered into a system

---

**Computer Vision** – Analyzes the world visually through cameras, images, and videos.  
**Conversational AI** – An automated chatbot that answers questions using a knowledge base.  
**Knowledge Mining** – Extracts insights from unstructured data to provide relevant answers, such as those about refunds and exchanges.  
**Natural Language Processing (NLP)** – Enables machines to understand, interpret, and generate human language.
**Image Classification** – Categorizes images based on their contents.
**Text Classification** – Categorizes documents into predefined topics.

---
## Azure AI Language Services

### 1. Text Analytics

- **Sentiment Analysis** – Determines the sentiment of text (positive, negative, neutral, or mixed).
- **Key Phrase Extraction** – Identifies important phrases within a text.
- **Language Detection** – Detects the language of a given text.
- **Named Entity Recognition (NER)** – Identifies entities like names, organizations, locations, and dates.
- **Personally Identifiable Information (PII) Detection** – Redacts sensitive data like phone numbers and credit card details.
- **Text Summarization** – Generates concise summaries from large text content.

### 2. Conversational Language Understanding (CLU) (Previously LUIS)

- **Intent Recognition** – Identifies user intent from natural language input.
- **Entity Extraction** – Extracts key pieces of information from user input.
- **Custom Model Training** – Allows training custom language models for domain-specific applications.

### 3. Question Answering (Previously QnA Maker)

- **Custom Knowledge Base** – Builds a chatbot that answers questions from a predefined knowledge base.
- **Unstructured Text Answering** – Extracts answers from unstructured documents.
- **Multi-turn Conversations** – Handles follow-up questions dynamically.

### 4. Custom Text Classification

- **Automated Text Categorization** – Assigns text to predefined categories based on content.
- **Custom Model Training** – Allows users to create and train models specific to their industry.

### 5. Custom Named Entity Recognition (NER)

- **Domain-Specific Entity Extraction** – Identifies and labels custom entities relevant to a specific business or industry.
- **Custom Model Training** – Allows users to define and train models to extract specific information.

Read more - [Azure AI Language](https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview)

---

## Azure Bot Service

- Enables conversational interactions with customers
- Can access a knowledge base but cannot create one
- Can be integrated with Microsoft Teams, Slack, and Azure Cognitive Services

---

Understand voice or text command - Language Understanding Intelligent System (LUIS)

---
## 3 Key Elements for Language Model Training

- **Utterances** – User's input or phrase given to the model.
- **Entities** – Key words or phrases that provide specific details. _Example:_ "light" in _"Turn on the light."_
- **Intents** – The purpose or action the user wants to perform. _Example:_ "Turn on" in _"Turn on the light."_

---

- **Speech synthesis →** Converts text to speech.
- **Spatial analysis (part of Azure AI Vision Service) →** Analyzes video streams from camera devices in real time.
- **Copilots →** Provide plugins that allow end users to get assistance with common tasks using a generative AI model.
- **Azure Kubernetes Service (AKS) →** A compute target environment in Azure ML for real-time inferencing.

## AutoML (Limitations)

- Cannot automatically infer training data.
- Cannot automatically determine which label needs to be predicted.
- Cannot include custom Python scripts in the training pipeline.
- Cannot visually connect datasets and modules on an interactive canvas.

---
## Confusion Matrix

TP - actual label is true, model predicts true
TN - actual label is false, model predicts false
FP - actual label is false, model predicts true  (Type I error)
FN - actual label is true, model predicts false (Type II error)

### Key Metrics

- **Accuracy** = (TP + TN) / (TP + TN + FP + FN)
- **Precision** = TP / (TP + FP) _(How many predicted positives are actually correct?)_
- **Recall (Sensitivity)** = TP / (TP + FN) _(How many actual positives were correctly predicted?)_
- **F1-score** = 2 × (Precision × Recall) / (Precision + Recall) _(Balance between precision & recall)_
- **Specificity** = TN / (TN + FP) _(How well negatives are identified?)_

---
## Tokenization

- breaking down large text into tokens. A token is a part of the text, for example, if we have a sentence, tokens can be words in this sentence which are assigned a numerical value. So, if a word is repeating more than once, it will have a single numeric value to represent it.

Depending on the NLP problem, these techniques are used as part of Tokenization:
- Text normalization: normalizing text to make the text suitable for further analysis. For example, removing punctuations, changing all text to lower case.
- Stop word removal: removing the words which do not add meaning, like "a", "the", "it"
- N-grams: based on no. of words, phrases are called n-grams.
	- 1 word phrase - unigram
	- 2 word phrase - bigram
	- 3 word phrase - trigram
- Stemming: consolidating words before counting them based on root word - power, powerful, powered are considered a single token

---

The Azure Speech Translation service is accessible through the Speech SDK and the Speech CLI, but it doesn't offer a dedicated REST API. While other features of the Azure Speech service, such as speech-to-text and text-to-speech, do provide REST APIs, speech translation specifically requires the use of the SDK or CLI. Therefore, to integrate speech translation capabilities into your applications, you'll need to utilize the Speech SDK or the Speech CLI.

---

Ensuring that numeric variables in training data are on a similar scale refers to techniques like **normalization or standardization**, which are part of **feature engineering**—the process of transforming raw data into a format that improves model performance.

**Feature selection**, on the other hand, involves choosing the most relevant features for a model and removing irrelevant or redundant ones.


