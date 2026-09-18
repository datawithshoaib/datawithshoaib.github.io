---
layout: post
title: Pricing Calculator in Azure
date: 2024-12-18
permalink: /posts/2024/12/pricing-calculator-in-azure/
tags:
  - Azure
  - Calculators
toc: true
categories: ["Azure"]
image: /assets/img/posts/pricing_calc/image.png
---

In this exercise, you use the Pricing calculator to estimate the cost of running a basic web application on Azure.

## Define your requirements
For a basic web application hosted in your datacenter, you might run a configuration similar to the following.

An ASP.NET web application that runs on Windows. 

The web application provides information about product inventory and pricing. 

There are two virtual machines that are connected through a central load balancer. 

The web application connects to a SQL Server database that holds inventory and pricing information.

## To migrate to Azure:

Use Azure Virtual Machines instances, similar to the virtual machines used in your datacenter.

Use Azure Application Gateway for load balancing.

Use Azure SQL Database to hold inventory and pricing information.

![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image.png)

In practice, you would define your requirements in greater detail. But here are some basic facts and requirements to get you started:

- The application is used internally. It's not accessible to customers.
- This application doesn't require a massive amount of computing power.
- The virtual machines and the database run all the time (730 hours per month).
- The network processes about 1 TB of data per month.
- The database doesn't need to be configured for high-performance workloads and requires no more than 32 GB of storage.



Go to the [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)

Notice the following tabs:

![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-1.png)

Products: This is where you choose the Azure services that you want to include in your estimate. You'll likely spend most of your time here.

Example scenarios: Here you'll find several reference architectures, or common cloud-based solutions that you can use as a starting point.

Saved estimates: Here you'll find your previously saved estimates.

FAQs: Here you'll discover answers to frequently asked questions about the Pricing calculator.

---

## Estimate your solution

### Add services to the estimate

On the Products tab, select the service from each of the categories

![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-2.png)

I have selected these services

![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-3.png)

#### Virtual Machines config
![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-4.png)

#### Azure SQL database config
![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-5.png)

#### Application Gateway config
![alt text]({{ site.baseurl }}/assets/img/posts/pricing_calc/image-6.png)

---

## Review, share, and save your estimate
At the bottom of the page, you see the total estimated cost of running the solution. 

You can change the currency type if you want.

At this point, you have a few options:
- Select Export to save your estimate as an Excel document.
- Select Save or Save as to save your estimate to the Saved Estimates tab for later.
- Select Share to generate a URL so you can share the estimate with your team.

---

Done !!!
