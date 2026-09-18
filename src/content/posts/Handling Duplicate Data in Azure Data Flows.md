---
layout: post
title: Handling Duplicate Data in Azure Data Flows
date: 2024-12-20
permalink: /posts/2024/12/handling-duplicate-data-in-azure-data-flows/
tags:
  - Azure
  - Data Flow
  - Azure Data Factory
toc: true
categories: ["Azure"]

---

In this task, we are going to remove duplicates from a csv file present in a container.

![alt text]({{ site.baseurl }}/assets/img/posts/dataflowduprem/image.png)

## Open data factory

### 1. Create linked service to blob storage

### 2. Create datasets for source and sink

### 3. Create new data flow

We can modify the data flow using a script as well. Click on script icon at the top right to write script to do the transformations.

We use distinct Rows transformation to remove the duplicates.

![alt text]({{ site.baseurl }}/assets/img/posts/dataflowduprem/image-1.png)

### 4. Create new pipeline and run it

Now, if we check the container, we have a new file.

![alt text]({{ site.baseurl }}/assets/img/posts/dataflowduprem/image-2.png)

---

Done !!!
