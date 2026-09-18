---
layout: post
title: AZ-900 Practice Questions
date: 2025-01-18
permalink: /posts/2025/01/az-900-practice-questions/
excerpt_separator: <!--more-->
tags: ['AZ-900', 'Azure Fundamentals', 'Cloud Concepts', 'Certification Prep']
image: /assets/img/posts/az900-qns.png
toc: true
categories: ['Azure & Cloud']
description: "Curated practice questions and explanations covering core Azure architecture, governance, and cloud services."

---
Some practice questions to prepare for AZ-900 exam.

<!--more-->

## Q1
Your company has virtual machines (VMs) hosted in Microsoft Azure. The VMs are located in a single Azure virtual network named VNet1.  
The company has users that work remotely. The remote workers require access to the VMs on VNet1. You need to provide access for the remote workers. What should you do?  
- A. Configure a Site-to-Site (S2S) VPN.
- B. Configure a VNet-toVNet VPN.
- C. Configure a Point-to-Site (P2S) VPN.
- D. Configure DirectAccess on a Windows Server 2012 server VM.
- E. Configure a Multi-Site VPN

Answer: C
A Point-to-Site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. P2S VPN is useful solution instead of S2S VPN when you have only a few clients that need to connect to a VNet.

## Q2
Your company has an Azure Active Directory (Azure AD) environment. Users occasionally connect to Azure AD via the Internet.  
You have been tasked with making sure that users who connect to Azure AD via the internet from an unidentified IP address, are automatically encouraged to change passwords.

Solution: You configure the use of Azure AD Identity Protection.

## Q3
When you are implementing a SaaS solution, you are responsible for
- A. Configuring the SaaS solution
- B. Installing the SaaS solution
- C. Configuring high availability
- D. Defining scalability rules

Answer: A

## Q4
What are two characteristics of the public cloud?
- A. dedicated hardware
- B. unsecured connections
- C. limited storage
- D. metered pricing
- E. self-service management

Answer: D, E

## Q5
When planning to migrate a public website to Azure, you must plan to
- A. deploy a VPN
- B. pay monthly usage costs
- C. pay to transfer all website data to Azure
- D. reduce the no. of connections to website

Answer: When planning to migrate a public website to Azure, you must plan to pay monthly usage costs. This is because Azure uses the pay-as-you-go model.

## Q6
Azure Site Recovery provides
- A. Fault tolerance
- B. Disaster recovery
- C. Elasticity
- D. High availability

Answer: A

## Q7
Yes/No questions:
1. You can create a resource group inside another resource group - No
2. An Azure virtual machine can be in multiple resource groups - No
3. A resource group can contain resources from multiple Azure regions - Yes

---
## Key points

Fault tolerance is the ability of a service to remain available after a failure of one of the components of the service. For example, a service running on multiple servers can withstand the failure of one of the servers.

Disaster recovery is the recovery of a service after a failure. For example, restoring a virtual machine from backup after a virtual machine failure.  

Dynamic scalability is the ability for compute resources to be added to a service when the service is under heavy load. For example, in a virtual machine scale set, additional instances of the virtual machine are added when the existing virtual machines are under heavy load.

Latency is the time a service takes to respond to requests. For example, the time it takes for a web page to be returned from a web server. Low latency means low response time which means a quicker response.


