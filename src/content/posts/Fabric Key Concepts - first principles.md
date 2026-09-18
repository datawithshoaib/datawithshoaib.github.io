---
layout: post
title: Fabric Key Concepts (first principles explanation)
date: 2026-06-28
permalink: /posts/2026/06/fabric-key-concepts/
excerpt_separator: <!--more-->
tags:
  - Fabric
  - DP-600
toc: true
categories: ['Azure & Cloud']
---
Instead of memorizing definitions, think about the fundamental problem each component solves.

# 1. Lakehouse

**Where do we store huge amounts of data cheaply while keeping it easy to analyze?**

Traditionally there were two choices:

|System|Strength|Weakness|
|---|---|---|
|Data Lake|Cheap, flexible|Slow analytics|
|Data Warehouse|Fast analytics|Expensive, rigid|

The idea behind a **Lakehouse** is:

> Can we combine the flexibility of a data lake with the analytical capabilities of a warehouse?

A Lakehouse stores files directly in cloud storage but organizes them in a structured way.

```text
Cloud Storage
│
├── sales.parquet
├── customers.parquet
├── inventory.parquet
```

But with metadata, schemas, transactions and query optimization.

In Fabric:

**Lakehouse = scalable file storage + tables + Spark processing**

Used for:
- raw data ingestion
- data engineering
- machine learning
- big data workloads

For example:

```text
ERP Data
CRM Data
API Data
↓
Fabric Lakehouse
↓
Transformations
↓
Analytics
```

---

# 2. Warehouse

**How do we make business reporting extremely fast?**

Business users need:

- SQL
- dashboards
- aggregations
- joins
- predictable performance

A warehouse is designed specifically for that.

```text
Fact Sales
Fact Orders

Dim Customer
Dim Product
Dim Date
```

Everything is optimized for:

```sql
SELECT SUM(Sales)
FROM FactSales
GROUP BY Region
```

Fast execution.

Warehouse sacrifices flexibility for speed.

In Fabric:

> Warehouse = SQL-first analytical database

Good for:

- Power BI
- reporting
- star schemas
- dimensional modeling

---
## Lakehouse vs Warehouse

|Lakehouse|Warehouse|
|---|---|
|File based|Database based|
|Spark friendly|SQL friendly|
|Flexible|Structured|
|ML workloads|BI workloads|
|Semi-structured data|Relational data|
|Cheap storage|Query optimized|

Lakehouse:

> Store everything.

Warehouse:

> Store curated business data.

---
# 3. OneLake

**Why do organizations create hundreds of copies of data?**

Traditionally:

```text
Sales DB
↓
Copy
↓
Data Lake
↓
Copy
↓
Warehouse
↓
Copy
↓
Power BI Dataset
↓
Copy
↓
ML Platform
```

Lots of duplication.

Problems:

- storage cost    
- synchronization
- governance
- version issues

Microsoft asked:

> Why not have one storage layer for everything?

That's OneLake.

Think of it as:

```text
OneDrive for enterprise data
```

Everything lives here.

```text
OneLake
│
├── Lakehouse
├── Warehouse
├── Eventhouse
├── Semantic Models
```

Single source of truth.

One copy of data.

Multiple consumers.

---
# 4. Semantic Model

**Why can't business users query raw tables directly?**

Raw tables:

```text
customer_id
cust_key
sales_amt
prod_id
```

Business users think differently.

They think:

```text
Revenue
Profit
Customer
Year
Margin
Growth
```

Semantic layer translates technical data into business concepts.

Example:

Raw:

```sql
SUM(order_value)-SUM(cost)
```

Semantic model:

```DAX
Profit =
SUM(Sales[Revenue])
-
SUM(Sales[Cost])
```

Users simply see these in Power BI visuals, with the ability to view by different dimensions.

```text
Profit
Region
Month
```

Semantic Model contains:

- measures
- relationships
- hierarchies
- business logic
- security

Think:

> Semantic Model = business language built on top of data.

It answers:

> What does revenue mean in our company?

---
# 5. Pipeline

**How do we automate movement and transformation of data?**

Without pipelines:

```text
Man downloads CSV
↓
Runs notebook
↓
Runs SQL
↓
Refreshes reports
```

Manual. Not scalable.

Pipeline is orchestration.

Think:

```text
Step 1:
Copy Data
↓
Step 2:
Run Notebook
↓
Step 3:
Execute SQL
↓
Step 4:
Refresh Semantic Model
↓
Done
```

Pipelines answer:

> What runs?

> In what order?

> When?

Example:

```text
Daily at 2 AM
↓
Load ERP Data
↓
Clean Data
↓
Update Warehouse
↓
Refresh Power BI
```

Pipeline ≠ transformation.

Pipeline = coordinator.

Like a movie director.

---
# 6. Notebook

**How do data scientists and engineers write flexible code close to the data?**

Notebook provides the ability to write complex logic in code:

```python
import pandas as pd

df = spark.read.table("sales")

df.groupBy("Region").sum()
```

Notebook combines:

- code
- outputs
- charts
- documentation

in one place.

Supported languages:

- Python
- PySpark
- Scala
- SQL

Notebook = interactive workspace for experimentation.

Data Scientists use notebooks because they can:

```text
Write code
↓
Run immediately
↓
Inspect results
↓
Modify
↓
Run again
```

---
# 7. Spark

**What happens when data no longer fits into one computer?**

Suppose you have 5 TB dataset.

Laptop cannot process it.

Solution: Split work across many machines.

Spark does this.

Example: 100 GB file. Spark divides it.

```text
Machine 1
25 GB

Machine 2
25 GB

Machine 3
25 GB

Machine 4
25 GB
```

All process simultaneously.

Results merged.

Spark provides:

- distributed processing
- fault tolerance
- scalability
- in-memory computation

Think:

> Spark = engine for parallel computing.

Without Spark:

```text
One worker
```

With Spark:

```text
100 workers together
```

Fabric Lakehouse heavily uses Spark.

---
# 8. Eventhouse

**What if data arrives continuously instead of once per day?**

Examples:

- IoT sensors
- clickstreams
- application logs
- telemetry
- stock ticks

Traditional systems assume:

```text
Batch data
```

Eventhouse assumes:

```text
Data never stops arriving
```

Example:

```text
Temperature Sensor
↓
22.1
↓
22.3
↓
22.5
↓
22.4
↓
22.6
```

Thousands every second.

Eventhouse is optimized for:

- streaming ingestion
- real-time analytics
- time-series queries
- logs

Warehouse:

> What happened last month?

Eventhouse:

> What is happening right now?

---
# 9. KQL

KQL stands for: **Kusto Query Language**

**SQL is good for tables, but is it ideal for logs and streaming data?**

Consider logs:

```text
2026-06-28 10:01 Login Success
2026-06-28 10:02 API Error
2026-06-28 10:03 Login Failed
```

Searching patterns with SQL becomes cumbersome.

KQL is designed for this.

Example:

```kql
Logs
| where Status == "Error"
| summarize count()
by bin(Timestamp,1h)
```

Meaning:

```text
Find errors
↓
Group by hour
↓
Count them
```

KQL excels at:

- telemetry
- monitoring
- anomaly detection
- security logs
- event analytics

Common with:

- Eventhouse
- Real-Time Intelligence
- Azure Data Explorer
---
# The Entire Fabric Picture

```text
            OneLake
               │
 ┌─────────────┼─────────────┐
 │             │             │
Lakehouse  Warehouse   Eventhouse
 │             │             │
Spark        SQL           KQL
 │             │             │
Notebook   Semantic Model  Real-time Analytics
        \       │       /
         \      │      /
            Pipeline
               │
         Power BI Reports
```

| Component      | Think of it as                     |
| -------------- | ---------------------------------- |
| OneLake        | Hard drive for the entire company  |
| Lakehouse      | Flexible data repository           |
| Warehouse      | Optimized SQL database             |
| Semantic Model | Business vocabulary layer          |
| Pipeline       | Workflow orchestrator              |
| Notebook       | Coding workspace                   |
| Spark          | Distributed compute engine         |
| Eventhouse     | Real-time data store               |
| KQL            | Query language for events and logs |

That's it. You now know the most important concepts in Microsoft Fabric. And most importantly you got to know why we need each component with proper understanding.

