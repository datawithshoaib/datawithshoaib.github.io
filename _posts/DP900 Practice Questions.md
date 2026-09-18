---
layout: post
title: DP-900 Practice Questions
date: 2025-01-23
permalink: /posts/2025/01/dp-900-practice-questions/
excerpt_separator: <!--more-->
tags:
  - Azure
  - DP-900
image: /assets/img/posts/dp900-qns.png
toc: true
categories: ["Azure"]

---

Some practice questions to prepare for DP-900 exam.

<!--more-->

## Q1
Which Azure storage solution provides native support for POSIX-compliant access control lists (ACLs)? 

A. Azure Table storage Question

B. Azure Data Lake Storage 

C. Azure Queue storage 

D. Azure Files

Answer: B

## Q2 (yes/no)
Normalizing a database increases the throughput of writing transactions - No
Analytical systems are more normalized than transactional systems - No
Normalizing a database results in queries that require more joins - Yes

## Q3
Which command line tool can you use to query the Azure SQL databases?

A. sqlcmd

B. bcp

C. azdata

D. Azure CLI

Answer: A

Explanation:
**SQLCMD** is a command-line utility that allows you to:
    - Connect to Azure SQL databases.
    - Execute SQL queries.
    - Automate database tasks through scripts.
- It comes with **Microsoft SQL Server tools** and can also be installed separately.

Key Features:
1. **Interactive Mode**: Run queries directly in the command line.
2. **Script Execution**: Execute `.sql` files containing SQL commands.
3. **Connection Support**: Works with both on-premises and Azure SQL databases.

## Q4 (yes/no)
You can use Azure Data Studio to query Microsoft SQL server big data cluster - Yes

You can use Microsoft SQL Server Management Studio (SSMS) to query Azure Synapse Analytics data warehouse - Yes

You can use MySQL workbench to query Azure Database for MariaDB databases - Yes

## Q5 (yes/no)
You can use existing SQL server licenses to reduce the cost of Azure SQL databases - Yes

Explanation: 

Azure Hybrid Benefit allows you to use SQL Server licenses with Software Assurance or qualifying subscription licenses to pay a reduced base rate for these products and services for SQL Server on Azure: 
vCPU-based service tiers of Azure SQL Database (excluding serverless). 
Azure SQL Managed Instance. 
SQL Server in Azure Virtual Machines. 
SQL Server Integration Services.

## Q6 (yes/no)
Azure Data Studio can be used to query an Azure SQL database from a device that runs MacOS - Yes

Microsoft SQL Server Management Studio (SSMS) is enables users to create and use SQL notebooks - No

Azure Data Studio can be used to restore a database - Yes

Explanation:

Azure Data Studio is a cross-platform database tool for data professionals using on-premises and cloud data platforms on Windows, macOS, and Linux. You can use Azure Data Studio to connect to an Azure SQL Database server. You'll then run Transact-SQL (T- SQL) statements to create and query Azure SQL databases.

SQL Server Management Studio is for configuring, managing, and administering all components within Microsoft SQL Server, not to create SQL notebooks. Instead use Azure Data Studio to create SQL notebook. 

You can use the Azure Data Studio to restore databases.

## Q7

Who is responsible for identifying which business rules must be applied to the data of a company?

A. Data Analyst

B. Data Engineer

C. Data Scientist

Answer: A

## Q8 (yes/no)

Batch processing can output data to a file store - yes

Batch processing can output data to a relational database - no

Batch processing can output data to a NoSQL database - no

## Q9

Each Azure SQL managed instance supports multiple databases that can be accessed by using cross-database queries. - **Yes**

Elastic pools are used to share resources across multiple instances of SQL Server on Azure Virtual Machines. - **No**

Azure SQL Database is fully compatible with both on-premises physical instances and virtualized instances of Microsoft SQL Server.  - **No**

## Q10

Microsoft SQL Server Management Studio (SSMS) - an integrated environment for managing any SQL infrastructure, from SQL Server to Azure SQL Database.  
  
Azure Data Studio - Azure Data Studio offers a modern, keyboard-focused SQL coding experience that makes your everyday tasks easier with built-in features, such as multiple tab windows, a rich SQL editor, IntelliSense, keyword completion, code snippets, code navigation, and source control integration (Git). Run on-demand SQL queries, view and save results as text, JSON, or Excel. Edit data, organize your favorite database connections, and browse database objects in a familiar object browsing experience.

Microsoft SQL Server Data Tools (SSDT) - a modern development tool for building SQL Server relational databases, databases in Azure SQL, Analysis Services (AS) data models, Integration Services (IS) packages, and Reporting Services (RS) reports. With SSDT, you can design and deploy any SQL Server content type with the same ease as you would develop an application in Visual Studio.


