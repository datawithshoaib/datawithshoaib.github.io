---
layout: post
title: Sampling Distributions
date: 2024-10-19
permalink: /posts/2024/10/sampling-distributions/
tags:
  - Statistics
  - Maths
toc: true
categories: ["Statistics"]

---

Revising sampling distribution concept in statistics.

![alt text](/assets/img/posts/smpl.png)

## What is Sampling Distribution?

Sampling is the process of creating samples from a larger population. 

The distribution of these samples based on a statistic which is used to infer the population parameter is known as sampling distribution.

## Sampling distribution of sample proportion

### Imagine This Scenario:

You want to know the proportion of people in a city who like chocolate ice cream. But instead of asking everyone in the city (the **population**), you randomly survey a smaller group of people (a **sample**). Let’s say in your sample, 60% of people like chocolate ice cream.

- The sample proportion is the percentage or fraction of people in your sample who like chocolate ice cream.
- In this case, the sample proportion is **60% (or 0.6)**.

If you repeat this process - taking multiple random samples of the same size from the population - the sample proportion won’t always be 60%. It might vary a little from sample to sample. For example:
- In one sample, 58% like chocolate ice cream
- In another sample, 62%
- In another, 59%

The **sampling distribution** of the sample proportion is the pattern you get if you plot all the sample proportions from all the samples you’ve taken.

### Key Features of the Sampling Distribution:

1. **Shape**: If the sample size is large and random, the sampling distribution looks like a **bell curve** (normal distribution).
2. **Mean**: The center of the sampling distribution is the **true proportion** of the population (e.g., the actual percentage of all people in the city who like chocolate ice cream).
3. **Spread**: The variability (spread) of the sample proportions depends on:
    - The size of the sample (larger samples reduce variability)
    - The population proportion itself (e.g., 60%)

Understanding the sampling distribution helps us:
- Estimate how much our sample proportion might differ from the true population proportion.
- Build confidence intervals to estimate the population proportion.
- Perform hypothesis testing.

The sampling distribution of a sample proportion tells us how the sample proportions vary when we repeatedly take samples.

## Normal conditions for sampling distributions of sample proportions:

np >= 10

n(1-p) >= 10

>We need at least 10 expected "successes" and at least 10 expected "failures" for the sampling distribution of the sample proportion to be approximately normal

If above conditions are satisfied, the shape of sampling distribution of the sample proportions is normal.

If any of the conditions is not satisfied, then the distribution is skewed to the left or to the right.

## Central Limit Theorem

Best [video](https://www.youtube.com/watch?v=zeJD6dqJ5lo) on Central Limit Theorem

