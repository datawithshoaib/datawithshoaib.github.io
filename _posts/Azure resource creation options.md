---
layout: post
title: How to create and manage Azure resources?
date: 2025-04-28
permalink: /posts/2025/04/create-and-manage-azure-resources/
excerpt_separator: <!--more-->
tags:
  - Azure
  - Resource Management
  - Infrastructure
image: /assets/img/posts/az-res.png
toc: true
categories: ["Azure"]

---

Discussing about different ways to create and manage Azure resources. There are many ways to interact with Azure resources and the right tool to choose depends on the requirements of a particular task.

<!--more-->

## Azure Portal

- GUI in which you can create and manage resources from browser, clicking buttons
- Easy to use and for simple tasks
- Can easily view the billing and other details

## VS Code Azure Tools Extension Pack

- can install this extension pack from VS Code and do almost all tasks from VS Code itself like creating resources, deploying websites, querying Azure databases etc.

## CLI tools

- Azure CLI and Azure PowerShell
- Both of these can be access from Azure Portal by clicking on the cloud icon at the top menu.
- Azure CLI uses bash, Azure PowerShell uses PowerShell for scripting
- We can use this for running simple scripts to create the resources quickly
- faster than using UI (Azure Portal) as we don't have to click anything.

## Infrastructure as Code tools

- The idea is to create the resources by using declarative syntax to specify the resources that we need and we can use this file (which is basically code) and create our infrastructure.
- This guarantees that the same infrastructure is created no matter how many times we run this code and create our resources.
- These can be automated, repeated and reliable.
- Common tools include - Bicep, Terraform and Ansible

## Azure SDK and REST APIs

- Resources can be created by writing code
- Azure SDK is available in Python, Go, Java, JavaScript, .NET
- We can also use Azure REST API to manage our resources by using the HTTPS requests to RESTful endpoint.
