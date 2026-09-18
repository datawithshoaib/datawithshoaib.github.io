---
categories: ['Power BI & Power Platform']
description: "A 15-day progressive guide to mastering Data Analysis Expressions (DAX) in Microsoft Power BI."
layout: post
title: 15 Days of DAX Series
date: 2025-03-09
permalink: /posts/2025/03/15-days-of-dax-series/
excerpt_separator: <!--more-->
tags: ['Power BI', 'DAX', 'Data Modeling', 'CALCULATE', 'Time Intelligence']
image: /assets/img/posts/15daysofdax.png
featured: false
toc: true
---

This is the 15 days of DAX series that I have created on LinkedIn. Learn 50+ common DAX functions in Power BI with simple examples.

<!--more-->

## Day 1: Aggregation Functions

Let's begin with **5 essential aggregation functions** that every Power BI developer needs to know.

### SUM()
Adds up all values in a column

`Total Sales = SUM(Sales[Amount])`

**Use Case:** Calculate total revenue from sales data.

---
### AVERAGE()
Calculates the mean of all values in a column

`Avg Sales = AVERAGE(Sales[Amount])`

When averaging cells:
- A **0** is included in the sum and counted in the divisor.
- A **blank cell** is ignored and not counted.

This function **doesn't work** in DirectQuery mode for calculated columns or row-level security (RLS).

**Use Case:** Determine the average order value for a business.

---
### MIN()
Returns the smallest value from a column or two scalar expressions. 

`Min Sales = MIN(Sales[Amount])`

Note:
- Columns can contain **Numbers, Text, Dates, Blanks**
- **Blanks are treated as 0** (e.g., `MIN(1, Blank())` → **0**, `MIN(-1, Blank())` → **-1**)
- **If both values are blank, it returns blank**
- **Errors occur if values are not allowed**
- **TRUE/FALSE values aren't supported** (use **MINA** instead)

**Use Case:** Identify the lowest transaction amount in sales.

---
### MAX()
Returns the largest value in a column, or between two scalar expressions.

`Max Sales = MAX(Sales[Amount])`

The **MAX** function returns the largest value when comparing two expressions:

- **Blanks are treated as 0** (`MAX(1, Blank())` → **1**, `MAX(-1, Blank())` → **0**)
- **If both values are blank, it returns blank**
- **Errors occur if values are not allowed**
- **TRUE/FALSE values aren't supported** (use **MAXA** instead)

**Use Case:** Find the highest sale recorded in a given period.

---
### COUNT()
Counts the number of rows in the table where the specified column has a non-blank value.

`Total Transactions = COUNT(Sales[Amount])`

The **COUNT** function counts rows with:

- **Numbers, Dates, Strings** (blanks are skipped)
- **Returns blank if no rows are found**
- **Doesn't support TRUE/FALSE values** (use **COUNTA** instead)
- **Not supported in DirectQuery for calculated columns or RLS**
- **Best practice:** Use **COUNTROWS** instead of COUNT

**Use Case:** Count the number of completed transactions.

---
Bonus Functions
### COUNTROWS()
Counts all rows in a table  

`Total Orders = COUNTROWS(Sales)`

The **COUNTROWS** function:

- **Counts rows** in a table, often after filtering or applying context
- **Returns BLANK** if the table has no rows
- **Not supported in DirectQuery** for calculated columns or RLS
- **Recommended over COUNT in DAX best practices**

**Use Case:** Get the total number of orders in the dataset.

### DISTINCTCOUNT()
Counts the number of distinct values in a column.

`Unique Customers = DISTINCTCOUNT(Sales[CustomerID])`

The **DISTINCTCOUNT** function:

- **Counts distinct values** in a column
- **Includes BLANK values** (use **DISTINCTCOUNTNOBLANK** to exclude them)
- **Returns BLANK if no rows are found**
- **Not supported in DirectQuery** for calculated columns or RLS

**Use Case:** Count the number of unique customers who made a purchase.

---
### Challenge for Day 1

How does `COUNT()` differ from `COUNTROWS()`?

| Feature                  | `COUNT()`                                                            | `COUNTROWS()`                                        |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------- |
| **What it counts**       | Non-blank values in a **single column**                              | Total rows in a **table**                            |
| **Supported data types** | Numbers, dates, text (ignores blanks)                                | All rows, regardless of data type                    |
| **Returns BLANK when**   | No valid values are found in the column                              | The table has no rows                                |
| **Best practice**        | Use `COUNTROWS()` instead of `COUNT()` when counting rows in a table | Preferred for counting rows, especially with filters |
| **DirectQuery Support**  | Not supported in calculated columns or RLS                           | Not supported in calculated columns or RLS           |

👉 **Use `COUNT()`** when counting **non-blank values** in a column.  
👉 **Use `COUNTROWS()`** when counting **total rows** in a table.

---
## Day 2: Logical Functions

Today we are going to look at logical functions. Logical functions help you create conditions and apply decision-making logic in your Power BI reports.

### IF()

Returns different results based on a condition.

`High Sales = IF(Sales[Amount] > 1000, "High", "Low")`

The **IF** function:

- **Evaluates a condition** and returns one value if TRUE, another if FALSE.
- **Supports nested IFs** for multiple conditions.
- **Can be replaced with SWITCH()** for better readability in complex cases.
- **Works with numbers, text, and Boolean values.**

**Use Case:** Categorize transactions based on sales amount.

---
### SWITCH()

Evaluates multiple conditions and returns a value.

`Category Group = SWITCH(Sales[Category], "Electronics", "Tech", "Clothing", "Apparel", "Other")`

The **SWITCH** function:

- **Simplifies multiple conditions** by replacing nested IFs.
- **Checks for exact matches** (does not support logical operators like `<` or `>`).
- **Requires a default value** if no match is found.
- **Performs better than multiple IF statements** in large datasets.

**Use Case:** Group categories into broader segments.

---
### AND()

Returns TRUE if all conditions are met.

`High Value & Profitable = IF(AND(Sales[Amount] > 1000, Sales[Profit] > 100), "Yes", "No")`

The **AND** function:

- **Returns TRUE only if all conditions are met.**
- **Used inside IF statements** to combine multiple conditions.
- **Can be replaced with `&&`** for more compact syntax.

**Use Case:** Identify transactions that meet multiple conditions.

---
### OR()

Returns TRUE if at least one condition is met.

`Flagged Transaction = IF(OR(Sales[Amount] > 5000, Sales[Discount] > 50), "Flag", "OK")`

The **OR** function:

- **Returns TRUE if at least one condition is met.**
- **Used inside IF statements** to check multiple conditions.
- **Can be replaced with `||`** for shorter syntax.

**Use Case:** Detect transactions with high value or high discount.

---
Bonus Function
### NOT()

Reverses a logical condition.

`No Discount Applied = IF(NOT(Sales[Discount] > 0), "No Discount", "Discount Applied")`

The **NOT** function:

- **Reverses Boolean expressions.**
- **Commonly used with IF, AND, OR** to create complex conditions.
- **Useful for filtering data dynamically.**

**Use Case:** Identify transactions without any discount.

---
### Challenge for Day 2

You have a **Sales** table with the following columns:

- `Product`
- `Category`
- `Amount`
- `Discount`

Write a DAX formula using **SWITCH** to categorize sales based on the `Amount`:

- **High** if `Amount` is greater than 1000
- **Medium** if `Amount` is between 500 and 1000
- **Low** if `Amount` is below 500

Here's the DAX formula using **SWITCH** to categorize sales based on the `Amount`:

```DAX
Sales Category = 
SWITCH(
    TRUE(), 
    Sales[Amount] > 1000, "High", 
    Sales[Amount] >= 500, "Medium", 
    "Low"
)
```

#### Explanation

- **SWITCH(TRUE(), ...)** allows for multiple conditions by evaluating them in order.
- If `Sales[Amount] > 1000`, it returns **"High"**.
- If `Sales[Amount]` is between **500 and 1000**, it returns **"Medium"**.
- Otherwise, it returns **"Low"**

---
## Day 3: Filter Functions

Today, we explore **filter functions** that help control the visibility of data in your calculations. These functions are essential for refining measures, ignoring or keeping specific filters, and making your reports more dynamic.

### FILTER()

Returns a subset of a table based on a condition.

```D
HighSales = FILTER(Sales, Sales[Amount] > 1000)
```

The **FILTER** function:

- **Returns a table**, not a single value.
- **Used inside functions like CALCULATE** to apply conditions.
- **Can be combined with other filter functions** for advanced logic.
- **Works row by row**, applying conditions to each row.

**Use Case:** Extract sales transactions where the amount is greater than 1000.

---
### ALL()

Removes filters from a column or table.

```D
Total Sales (Ignore Filters) = CALCULATE(SUM(Sales[Amount]), ALL(Sales))
```

The **ALL** function:

- **Removes all filters** from a table or column.
- **Useful for calculating totals** that ignore slicers.
- **Often used in DAX measures** to create percentages and ratios.

**Use Case:** Calculate total sales while ignoring any applied filters.

---
### ALLEXCEPT()

Removes all filters except for specific columns.

```D
Total Sales by Region = CALCULATE(SUM(Sales[Amount]), ALLEXCEPT(Sales, Sales[Region]))
```

The **ALLEXCEPT** function:

- **Removes filters from all columns except the specified ones.**
- **Keeps certain filters while removing others.**
- **Useful when working with hierarchies and drill-through analysis.**
- **Similar to ALL but more selective.**

**Use Case:** Keep the region filter while ignoring others in a calculation.

---
### ALLSELECTED()

Removes filters but respects slicers and visual selections.

```D
Selected Sales Total = CALCULATE(SUM(Sales[Amount]), ALLSELECTED(Sales))
```

The **ALLSELECTED** function:

- **Removes filters within the scope of a visual selection.**
- **Used for dynamic calculations in reports.**
- **Commonly applied in cumulative totals and ranking measures.**
- **Differs from ALL() by keeping slicer selections active.**

**Use Case:** Calculate total sales within the selected slicer range.

---
### KEEPFILTERS()

Modifies a function to respect existing filters.

```D
Filtered Sales = CALCULATE(SUM(Sales[Amount]), KEEPFILTERS(Sales[Category] = "Electronics"))
```

The **KEEPFILTERS** function:

- **Ensures that existing filters remain applied.**
- **Used within CALCULATE to refine results.**
- **Prevents unwanted removal of filters from other functions.**
- **Works best in interactive reports with slicers.**

**Use Case:** Keep slicer selections while applying an additional category filter.

---
Bonus function
### REMOVEFILTERS()

Removes all filters from a table or column.

```D
Total Sales (No Filters) = CALCULATE(SUM(Sales[Amount]), REMOVEFILTERS(Sales))
```

The **REMOVEFILTERS** function:

- **Clears all filters from a table or column.**
- **Similar to ALL but works more explicitly.**
- **Useful for overriding slicers in calculations.**
- **Ensures global totals in reports.**

**Use Case:** Display total sales regardless of any filters applied in visuals.

---
### Difference between REMOVEFILTERS and ALL

Both `REMOVEFILTERS` and `ALL` in DAX are used to remove filters, but they have key differences in behavior.

**REMOVEFILTERS()**

- Used to **remove filters** from specified columns or tables.
- It only removes **filters applied to the specified columns or tables**, but keeps the relationships in the model intact.
- It is equivalent to using `ALL()` but only for removing filters without affecting relationships.

```D
CALCULATE(SUM(Sales[Revenue]), REMOVEFILTERS(Sales[Category]))
```

- This removes filters from the `Category` column but retains filters from other dimensions.

**ALL()**

- Returns **all rows** in a table, effectively removing filters.
- Unlike `REMOVEFILTERS()`, `ALL()` **also disables relationships**, making it useful when calculating **totals** or **percentages**.

**Example:**

```D
CALCULATE(SUM(Sales[Revenue]), ALL(Sales[Category]))
```

- This removes filters from `Category`, returning total revenue across all categories.
- If used on a whole table (e.g., `ALL(Sales)`), it removes all filters from the `Sales` table.

#### **Key Differences**

| Feature               | REMOVEFILTERS()                                       | ALL()                                                     |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| Ignores relationships | ❌ No                                                  | ✅ Yes                                                     |
| Use case              | Removing specific filters while keeping relationships | Ignoring filters and relationships for total calculations |

#### **When to Use Which?**

- Use `REMOVEFILTERS()` when you want to **only remove filters** but still respect model relationships.
- Use `ALL()` when you need to **completely ignore relationships and filters**, such as when calculating grand totals.

---
### Challenge for Day 3

You have a **Sales** table with the following columns:

- `Product`
- `Category`
- `Sales Amount`
- `Order Date`

Write a DAX measure to calculate the **total sales for the last 30 days**, ensuring that all existing filters on the table remain active except for the date filter.

We use the `CALCULATE` function with `FILTER` to modify the date context while keeping other filters intact.

```D
Sales Last 30 Days = 
CALCULATE(
    SUM(Sales[Sales Amount]), 
    FILTER(
        ALL(Sales[Order Date]), 
        Sales[Order Date] >= TODAY() - 30
    )
)
```

#### Explanation

- `SUM(Sales[Sales Amount])` → Calculates total sales.
- `ALL(Sales[Order Date])` → Removes any filters on the date column.
- `FILTER(..., Sales[Order Date] >= TODAY() - 30)` → Keeps only the last 30 days.
- `CALCULATE(...)` → Applies the filter while keeping other filters intact.

---
## Day 4: Date & Time Functions

Today, we explore **Date & Time functions** that help manipulate and analyze dates in DAX. These functions are essential for time-based calculations like aging, comparisons, and forecasting.

### TODAY()

Returns the current date.

```D
Todays Date = TODAY()
```

The **TODAY** function:

- **Returns the current system date** without the time.
- **Updates automatically** when the dataset is refreshed.
- **Commonly used in aging calculations** to determine the difference between today and past dates.

**Use Case:** Calculate the number of days since an order was placed.

---
### NOW()

Returns the current date and time.

```D
Current DateTime = NOW()
```

The **NOW** function:

- **Returns the current system date and time.**
- **Updates automatically** during data refresh.
- **Useful for real-time calculations** in dashboards.
- **Similar to TODAY but includes time.**

**Use Case:** Track the last refresh time of a report.

---
### DATEDIFF()

Calculates the difference between two dates in a specified unit.

```D
Days Since Order = DATEDIFF(Sales[OrderDate], TODAY(), DAY)
```

The **DATEDIFF** function:

- **Returns the difference** between two dates.
- **Allows specifying units** like DAY, MONTH, YEAR, etc.
- **Commonly used for calculating time gaps** in reports.

**Use Case:** Find the number of days since a customer’s last purchase.

---
### EOMONTH()

Returns the last day of the month for a given date.

```D
EndOfMonth = EOMONTH(Sales[OrderDate], 0)
```

The **EOMONTH** function:

- **Returns the last date of the month** for a given date.
- **Can shift months forward or backward** using the second argument.
- **Useful for monthly reporting and forecasting.**

**Use Case:** Find the last day of the month for billing cycles.

---
### YEAR()

Extracts the year from a date.

```D
Order Year = YEAR(Sales[OrderDate])
```

The **YEAR** function:

- **Returns the year** from a date column.
- **Used to create year-based calculations** in reports.
- **Works well with other date functions** for filtering and grouping.

**Use Case:** Summarize sales data by year in a report.

---
Bonus function
### WEEKDAY()

Returns the day of the week for a given date.

```D
Order Weekday = WEEKDAY(Sales[OrderDate], 2)
```

The **WEEKDAY** function:

- **Returns a number representing the day of the week.**
- **Second argument defines start of the week** (1 = Sunday, 2 = Monday, etc.).
- **Useful for analyzing sales trends by day of the week.**

**Use Case:** Identify which day of the week has the highest sales.

---
### Challenge for Day 4

You need to calculate the **number of days left until the end of the month** for each order in the dataset. **Create a calculated column** that returns the remaining days in the month for each order date.

#### Solution

```D
Days_Left_In_Month = 
DATEDIFF(Sales_Orders[Order Date], EOMONTH(Sales_Orders[Order Date], 0), DAY)
```
#### Explanation

- `EOMONTH(Sales_Orders[Order Date], 0)`: Finds the last date of the month for each order date.
- `DATEDIFF(Sales_Orders[Order Date], <end of month date>, DAY)`: Calculates the number of days between the order date and the month's end.

This will return the **remaining days** in the month for each order.

---
## Day 5: Math Functions

Today, we explore **Math functions** in DAX. These functions help in performing numerical transformations, rounding operations, and other mathematical calculations essential for financial and analytical reporting.

### ROUND()

Rounds a number to the specified number of decimal places.

```D
Rounded Sales = ROUND(Sales[Amount], 2)
```

The **ROUND** function:

- **Rounds a number** to a specific number of decimal places.
- **Uses standard rounding rules** (0.5 and above rounds up, otherwise rounds down).
- **Useful for financial reporting** where decimal precision is required.

**Use Case:** Display sales amounts rounded to two decimal places.

---
### CEILING()

Rounds a number up to the nearest multiple of a specified significance.

```D
Ceiling Value = CEILING(Sales[Amount], 10)
```

The **CEILING** function:

- **Always rounds up** to the nearest specified multiple.
- **Useful for setting price thresholds** and grouping numerical values.

**Use Case:** Round up sales amounts to the nearest 10 for simplified reporting.

---
### FLOOR()

Rounds a number down to the nearest multiple of a specified significance.

```D
Floor Value = FLOOR(Sales[Amount], 10)
```

The **FLOOR** function:

- **Always rounds down** to the nearest specified multiple.
- **Useful when working with unit measurements or price groupings.**

**Use Case:** Determine the lower boundary of sales amounts in predefined intervals.

---
### ABS()

Returns the absolute (positive) value of a number.

```D
Absolute Change = ABS(Sales[Profit])
```

The **ABS** function:

- **Removes the sign** from a number (negative values become positive).
- **Commonly used in variance calculations** to compare absolute differences.

**Use Case:** Calculate the absolute profit or loss, ignoring the sign.

---
Bonus function
### MOD()

Returns the remainder of a number after division.

```D
Remainder = MOD(Sales[Amount], 3)
```

The **MOD** function:

- **Returns the remainder** when one number is divided by another.
- **Useful for pattern-based calculations** like cycle-based groupings.

**Use Case:** Identify every third transaction in a dataset.

----
### Challenge for Day 5
  
You need to calculate the **next highest multiple of 10** for each product's sales amount.
**Create a calculated column** that rounds up the sales value to the nearest multiple of 10.

```D
Rounded_Sales = CEILING(Sales_Orders[Sales], 10)
```

#### Explanation

- The **CEILING** function rounds **up** a number to the nearest multiple of a specified value.
- Here, each sales value is rounded **up** to the nearest multiple of **10**.

Output example:

| Sales | Rounded_Sales |
| ----- | ------------- |
| 243   | 250           |
| 198   | 200           |
| 507   | 510           |

This function ensures that sales values are adjusted to the nearest higher multiple of 10.

---
## Day 6: Text Functions

Today, we explore **Text functions** in DAX, which help in manipulating, formatting, and extracting text values. These functions are essential for cleaning data, creating dynamic labels, and improving report readability.

### CONCATENATE()

Joins two text strings into one.

```D
Full Name = CONCATENATE(Sales[FirstName], Sales[LastName])
```

The **CONCATENATE** function:

- **Joins two text values** into a single string.
- **Works with only two arguments** (use `&` or `CONCATENATEX` for more flexibility).
- **Useful for combining names, codes, or descriptions.**

**Use Case:** Create full customer names by combining first and last names.

---
### FORMAT()

Formats a value as a string using a specified format.

```D
Formatted Sales = FORMAT(Sales[Amount], "Currency")
```

The **FORMAT** function:

- **Converts numbers or dates** into formatted text.
- **Supports custom date and number formats.**
- **Returns a text value**, so it's not suitable for numeric calculations.

**Use Case:** Display sales amounts in currency format.

---
### LEFT()

Extracts a specified number of characters from the beginning of a text string.

```D
First Three Letters = LEFT(Sales[ProductCode], 3)
```

The **LEFT** function:

- **Returns the first N characters** from a text string.
- **Commonly used to extract codes, prefixes, or categories.**

**Use Case:** Extract the first three characters from a product code.

---
### RIGHT()

Extracts a specified number of characters from the end of a text string.

```D
Last Four Digits = RIGHT(Sales[CustomerID], 4)
```

The **RIGHT** function:

- **Returns the last N characters** from a text string.
- **Useful for extracting IDs, suffixes, or standard formatting.**

**Use Case:** Retrieve the last four digits of a customer ID for anonymization.

---
Bonus
### MID()

Extracts a substring from a text value based on a starting position and length.

```D
Extracted Part = MID(Sales[ProductCode], 2, 3)
```

The **MID** function:

- **Extracts a specific part** of a text string based on position.
- **Useful for breaking down structured text values** like serial numbers or product codes.

**Use Case:** Extract the second to fourth characters from a product code.

---
### Challenge for Day 6

You need to extract the **first three letters** of each product name and concatenate it with its category.
**Create a calculated column** that follows this pattern:  
**"PRO - Electronics"** (if the product name is "ProductX" and the category is "Electronics").

```D
Product_Code = LEFT(Sales_Orders[Product], 3) & " - " & Sales_Orders[Category]
```

- **LEFT()** extracts the **first three characters** of the product name.
- **"&"** is used to concatenate text values.
- **" - "** is added as a separator between the extracted code and the category.

**Example Outputs:**

| Product | Category    | Product_Code      |
| ------- | ----------- | ----------------- |
| Laptop  | Electronics | Lap - Electronics |
| Chair   | Furniture   | Cha - Furniture   |
| Monitor | Electronics | Mon - Electronics |

This method is useful for **creating product codes or shorthand labels**.

---
## Day 7: Statistical Functions

Today, we explore **Statistical functions** in DAX, which help analyze data distribution, ranking, and variability. These functions are useful for identifying trends, measuring central tendency, and making data-driven decisions.

### MEDIAN()

Returns the median (middle value) of a column.

```D
Median Sales = MEDIAN(Sales[Amount])
```

The **MEDIAN** function:

- **Finds the middle value** when data is sorted.
- **Ignores BLANK values** in calculations.
- **Useful for understanding typical values in skewed datasets.**

**Use Case:** Determine the median sales amount to understand central pricing trends.

---
### RANKX()

Ranks a value in a column based on an expression.

```D
Sales Rank = RANKX(ALL(Sales), Sales[Amount], , DESC, DENSE)
```

The **RANKX** function:

- **Ranks values dynamically** based on an expression.
- **Allows ascending or descending ranking.**
- **Supports different ranking methods (DENSE, SKIP).**

**Use Case:** Rank products based on total sales.

---
### COUNTX()

Counts the number of rows where an expression returns a non-blank value.

```D
Valid Orders = COUNTX(Sales, Sales[Amount])
```

The **COUNTX** function:

- **Counts values within a table using an expression.**
- **Ignores BLANK values.**
- **More flexible than COUNT() when filtering data.**

**Use Case:** Count the number of non-zero sales transactions.

---
Bonus
### VAR.P()

Calculates variance based on the entire population. Ignores logical values and text in the population.

```D
Sales Variance = VAR.P(Sales[Amount])
```

The **VAR.P** function:

- **Measures how spread out the data is.**
- **Helps in understanding sales fluctuations.**
- **Used in statistical analysis to compare datasets.**

**Use Case:** Measure sales variance to identify inconsistencies in revenue.

---
### Challenge for Day 7

You have a **Sales_Orders** table with the following columns:

- **Order ID** (Unique identifier)
- **Sales** (Total sales amount)
- **Profit** (Profit earned from the order)
- **Quantity** (Number of items sold)

Write a **DAX measure** to calculate the **median sales value** across all orders.
Also, create a **RANKX measure** that ranks orders based on **profit** in descending order.

1️⃣ **Median Sales Measure**

```D
Median_Sales = MEDIAN(Sales_Orders[Sales])
```

2️⃣ **Profit Rank Measure**

```D
Profit_Rank = RANKX(ALL(Sales_Orders), Sales_Orders[Profit], , DESC, DENSE)
```

✅ The **MEDIAN function** calculates the middle value of all sales.  
✅ The **RANKX function** ranks orders based on profit, where the highest profit gets rank 1.

---
## Day 8: Table Manipulation Functions

Today, we explore **Table Manipulation functions** in DAX. These functions allow us to create, modify, and extract data from tables, making them essential for dynamic data modeling in Power BI.

### SUMMARIZE()

Creates a summary table with grouped data.

```c
SUMMARIZE (<table>, <groupBy_columnName>[, <groupBy_columnName>]…[, <name>, <expression>]…)
```

**Use Case:** Create a summary table showing total sales by category.

```c
SummaryTable = 
SUMMARIZE(Sales, Sales[Category], "Total Sales", SUM(Sales[Amount]))
```

The **SUMMARIZE** function:

- Groups data by specified columns.
- Commonly used for creating aggregated tables.

---
### ADDCOLUMNS()

Returns a table with new columns specified by the DAX expressions.

**Use Case:** Add a profit column to an existing sales table.

```c
SalesWithProfit = ADDCOLUMNS(Sales, "Profit", Sales[Amount] - Sales[Cost])
```

The **ADDCOLUMNS** function:

- Creates new columns dynamically.
- Does not modify the original table but returns a new one.
- Useful for adding calculated values based on existing data.

---
### SELECTCOLUMNS()

Returns a table with specific columns.

**Use Case:** Create a table with only product names and revenue.

```c
SelectedData = SELECTCOLUMNS(Sales, "Product", Sales[Product], "Revenue", Sales[Amount])
```

The **SELECTCOLUMNS** function:

- Extracts specific columns from a table.
- Allows renaming columns.
- Creates a new table without modifying the original data.

---
### GENERATE()

Performs a cross join between two tables.

**Use Case:** Create all possible combinations of products and sales data.

```c
CrossJoinTable = GENERATE(Products, Sales)
```

The **GENERATE** function:

- Combines each row of the first table with rows from the second table (like a nested iteration).
- Useful for simulating all possible row-level combinations.
- Often used in advanced data modeling and scenario analysis.

---
Bonus
### GENERATESERIES()

Creates a table with a numeric series.

**Use Case:** Create a table with numbers from 1 to 10, incrementing by 2.

```c
SeriesTable = GENERATESERIES(1, 10, 2)
```

The **GENERATESERIES** function:

- Creates a single-column table of values in a defined range with a specified step.
- Useful for generating time series, numeric bins, or intervals.
- Commonly used in scenarios like custom ranking, bucketing, or dynamic axis generation.

---
### Challenge for Day 8

You have a **Sales_Orders** table with the following columns:

- **Order ID**
- **Customer Name**
- **Sales**
- **Profit**
- **Category**

Write a **DAX table formula** that creates a **summary table** showing total sales and total profit for each category. Modify the table to include only categories where total sales exceed **$10,000**.

1️⃣ **Summary Table with Total Sales & Profit**

```c
Category_Summary = 
SUMMARIZE(Sales_Orders, 
          Sales_Orders[Category], 
          "Total Sales", SUM(Sales_Orders[Sales]), 
          "Total Profit", SUM(Sales_Orders[Profit])
)
```

2️⃣ **Filtered Summary Table (Sales > $10,000)**

```c
Filtered_Category_Summary = 
FILTER(
    SUMMARIZE(Sales_Orders, 
              Sales_Orders[Category], 
              "Total Sales", SUM(Sales_Orders[Sales]), 
              "Total Profit", SUM(Sales_Orders[Profit])
    ),
    [Total Sales] > 10000
)
```

✅ The **SUMMARIZE function** creates a new table grouping by category.  
✅ The **FILTER function** removes categories with total sales below $10,000.

---
## Day 9: Time Intelligence Basic

Today, we explore **Time Intelligence functions** in DAX. These functions help analyze data over time, making them essential for trend analysis, year-over-year comparisons, and cumulative calculations in Power BI.

### TOTALYTD()

Calculates the **year-to-date (YTD) total** for a measure. Evaluates the specified expression over the interval which begins on the first day of the year and ends with the last date in the specified date column after applying specified filters.

```c
TOTALYTD(<expression>,<dates>[,<filter>][,<year_end_date>])
```

**Use Case:** Calculate total sales from the beginning of the year to the selected date.

```c
TotalSalesYTD = TOTALYTD(SUM(Sales[Amount]), Sales[Date])
```

The **TOTALYTD** function:

- Aggregates values from the beginning of the year up to the selected date.
- Requires a valid date column to perform accurate calculations.
- Works best with a continuous and properly formatted date table (with no gaps).

---
### SAMEPERIODLASTYEAR()

Returns a table of dates from the same period in the previous year.

```c
SAMEPERIODLASTYEAR(<dates>)
```

**Use Case:** Compare this year’s sales with the same period last year.

```c
SalesLY = CALCULATE(SUM(Sales[Amount]), SAMEPERIODLASTYEAR(Sales[Date]))
```

The **SAMEPERIODLASTYEAR** function:

- Shifts the date range by exactly one year.
- Works well for year-over-year (YoY) comparisons.
- Supports day, month, and quarter comparisons.

---
### PARALLELPERIOD()

Shifts the date range forward or backward by a specified number of periods.

> This function takes the current set of dates in the column specified by Dates, shifts the first date and the last date the specified number of intervals, and then returns all contiguous dates between the two shifted dates. If the interval is a partial range of month, quarter, or year then any partial months in the result are also filled out to complete the entire interval.

```c
PARALLELPERIOD(<dates>,<number_of_intervals>,<interval>)
```

**Use Case:** Compare sales from the previous month.

```c
SalesLastMonth = 
CALCULATE(
	SUM(Sales[Amount]), 
	PARALLELPERIOD(Sales[Date], -1, MONTH)
)
```

The **PARALLELPERIOD** function:

- Shifts the date context by a defined interval (days, months, quarters, or years).
- Useful for period-over-period comparisons.
- Returns the full shifted period, not just matching dates - unlike SAMEPERIODLASTYEAR.

---
### DATEADD()

Shifts the date context forward or backward by a specified interval.

**Use Case:** Analyze sales performance from 30 days ago.

```c
Sales30DaysAgo = CALCULATE(SUM(Sales[Amount]), DATEADD(Sales[Date], -30, DAY))
```

The **DATEADD** function:

- Works like PARALLELPERIOD but preserves granularity.
- Supports positive (future) and negative (past) shifts.
- More flexible for dynamic date calculations.

---
Bonus
### DATESYTD()

Returns a set of dates in the year up to the last date visible in the filter context.

**Use Case:** Retrieve all dates for the current year's YTD calculations.

```c
YTD_Dates = DATESYTD(Sales[Date])
```

The **DATESYTD** function:

- Returns a dynamic date range for YTD calculations.
- Works well inside CALCULATE for custom aggregations.
- Used internally by TOTALYTD.

---
### Challenge for Day 9

You have a **Sales_Orders** table with the following columns:

- **Order Date**
- **Sales**

Write a **DAX measure** to calculate the **Year-to-Date (YTD) Sales** based on the **Order Date**.
Create another measure to calculate the **Sales for the Same Period Last Year**

1️⃣ **Year-to-Date (YTD) Sales**

```c
YTD_Sales = 
TOTALYTD(SUM(Sales_Orders[Sales]), Sales_Orders[Order Date])
```

2️⃣ **Same Period Last Year Sales**

```c
SPLY_Sales = 
CALCULATE(SUM(Sales_Orders[Sales]), SAMEPERIODLASTYEAR(Sales_Orders[Order Date]))
```

✅ **TOTALYTD** accumulates sales from the start of the year to the selected date.  
✅ **SAMEPERIODLASTYEAR** shifts the date range to the previous year.

---
## Day 10: Advanced Time Intelligence

Today, we explore **advanced time intelligence functions** in DAX. These functions allow for deeper date-based analysis, such as finding the first and last date in a period, calculating date ranges, and determining month-end values.

### DATESBETWEEN()

Returns a table containing dates within a specified range.

```c
DATESBETWEEN(<Dates>, <StartDate>, <EndDate>)
```

**Use Case:** Calculate total sales in the last 90 days.

```c
SalesLast90Days = 
CALCULATE(SUM(Sales[Amount]), DATESBETWEEN(Sales[Date], TODAY() - 90, TODAY()))
```

The **DATESBETWEEN** function:

- Defines a custom date range dynamically.
- Useful for rolling period or flexible time-based calculations.
- Commonly used inside **CALCULATE** to filter measures based on specific date intervals.

---
### FIRSTDATE()

Returns the earliest (first) date in a column or filter context.

**Use Case:** Identify the date of the first recorded sale.

```c
FirstSaleDate = FIRSTDATE(Sales[Date])
```

The **FIRSTDATE** function:

- Returns the **earliest date** in the current filter context.
- Always returns a **single date value** (wrapped as a table).
- Commonly used with **time intelligence functions** for dynamic period calculations.

---
### LASTDATE()

Returns the latest (last) date in a column or filter context.

**Use Case:** Find the most recent sales date in the dataset.

```c
LastSaleDate = LASTDATE(Sales[Date])
```

The **LASTDATE** function:

- Returns the **latest date** in the current filter context.
- Works just like **FIRSTDATE**, but retrieves the **last date** instead.
- Commonly used for **trend analysis**, **cumulative measures**, and **time-based comparisons**.

---
### ENDOFMONTH()

Returns the last day of the month for the specified column or context.

**Use Case:** Get total sales for the last day of each month.

```c
EndOfMonthSales = CALCULATE(SUM(Sales[Amount]), ENDOFMONTH(Sales[Date]))
```

The **ENDOFMONTH** function:

- Returns the **last date of the month** in the current filter context.
- Useful for **time-based aggregations** and period-closing calculations.
- Often combined with **CALCULATE** for **month-end analysis** and reporting.

---
Bonus
### STARTOFMONTH()

Returns the first day of the month for the specified column or context.

**Use Case:** Analyze sales performance at the beginning of each month.

```c
StartOfMonthSales = CALCULATE(SUM(Sales[Amount]), STARTOFMONTH(Sales[Date]))
```

The **STARTOFMONTH** function:

- Returns the **first date of the month** in the current filter context.
- Commonly used for **monthly trend analysis** and calculating **opening balances**.
- Complements **ENDOFMONTH** for comparisons and reporting.

---
### Challenge for Day 10

You have a **Sales_Orders** table with the following columns:

- **Order Date**
- **Sales**

Write a DAX measure to calculate the Total Sales for the Last 3 Complete Months - dynamically based on the selected date range.

```c
Last_3_Complete_Months_Sales = 
CALCULATE(
    SUM(Sales_Orders[Sales]),
    DATESBETWEEN(
        Sales_Orders[Order Date],
        STARTOFMONTH(DATEADD(SELECTEDDATE(Sales_Orders[Order Date]), -3, MONTH)),
        ENDOFMONTH(DATEADD(SELECTEDDATE(Sales_Orders[Order Date]), -1, MONTH))
    )
)
```

#### Explanation

- `DATESBETWEEN` defines the date range for the calculation.
- `SELECTEDDATE(Sales_Orders[Order Date])` retrieves the date from the **current filter context** (the selected date range).
- `STARTOFMONTH(DATEADD(SELECTEDDATE(Sales_Orders[Order Date]), -3, MONTH))` gets the **first day of the month** from 3 months prior to the selected date.
- `ENDOFMONTH(DATEADD(SELECTEDDATE(Sales_Orders[Order Date]), -1, MONTH))` finds the **last day of the previous month** relative to the selected date.
- `CALCULATE` applies the new filter context to sum **Sales** within this range.

---
## Day 11: Ranking & Percentile Functions

Today, we focus on **ranking and percentile functions** in DAX. These functions help in identifying top-performing entities, calculating percentiles, and ranking values dynamically within different contexts.

### RANKX()

Ranks values in a column based on a specified measure or expression.

```text
RANKX(<table>, <expression>[, <value>[, <order>[, <ties>]]])
```

**Use Case:** Rank products based on total sales.

```text
SalesRank = RANKX(ALL(Sales), SUM(Sales[Amount]), , DESC, DENSE)
```

The **RANKX** function:

- Assigns a rank to each row based on the evaluation of a measure.
- Uses different ranking methods (default is Skip ranking, DENSE can be specified).
- Requires a table as input and works best with ALL() or REMOVEFILTERS() for global ranking by removing filters.

---
### TOPN()

Returns the top N rows from a table based on a measure.

```text
TOPN(<N_Value>, <Table>, <OrderBy_Expression>, [<Order>[, <OrderBy_Expression>, [<Order>]]…])
```

**Use Case:** Identify the top 5 customers based on total purchases.

```text
Top5Customers = TOPN(5, Sales, SUM(Sales[Amount]), DESC)
```

The **TOPN** function:

- Filters the dataset to return only the top N values.
- Can be used inside CALCULATE to modify context.
- Works well for leaderboard-style reporting.

#### Example

```text
 top 10 sold products = SUMX(
    TOPN(
        10, 
        SUMMARIZE(
            InternetSales, 
            InternetSales[ProductKey], 
            "TotalSales", SUM(InternetSales[SalesAmount])
        ),
        [TotalSales], DESC
    ),
    [TotalSales]
)
```

**What does it do?**

It calculates the **sum of sales from the top 10 products (by sales amount)** in the `InternetSales` table.

✅ **1️⃣ `SUMMARIZE(...)`**  
This creates a _temporary table_ that groups the `InternetSales` table **by ProductKey** and adds a calculated column:

- **"TotalSales"** → which sums `SalesAmount` for each product.

So at this point, you have a table like:

| ProductKey | TotalSales |
| ---------- | ---------- |
| 101        | 50,000     |
| 102        | 75,000     |
| ...        | ...        |

✅ **2️⃣ `TOPN(10, ..., [TotalSales], DESC)`**  
From that summarized table, it **selects the top 10 products** with the highest `TotalSales`.

This returns only the rows for the top-selling 10 products.


✅ **3️⃣ `SUMX(..., [TotalSales])`**  
Finally, `SUMX` **iterates over the 10 rows** and sums up the `TotalSales` values.

This gives you **the total combined sales amount of the top 10 products**.

This measure returns **a single value** - the total sales of the 10 best-selling products.

You’d use it when:

- You want to **highlight the impact of your top products** on overall sales.
- You want to **create visuals or KPIs** showing “Top 10 products contribution”.
- You want to **compare top performers vs. total sales** for performance insights.

---
### PERCENTILEX()

Returns the k-th percentile of an expression values in a table.

```text
PERCENTILEX.INC(<table>, <expression>, k)
```

**Use Case:** Find the 90th percentile of sales transactions.

```text
Percentile90 = PERCENTILEX.INC(Sales, Sales[Amount], 0.90)
```

The **PERCENTILEX** function:

- Computes a specified percentile (e.g., 90th percentile).
- Has two variations:
    - **PERCENTILEX.INC** (inclusive method)
    - **PERCENTILEX.EXC** (exclusive method)
- Useful for statistical analysis in datasets.

---
Bonus
### PERCENTILE.INC()

Returns the k-th (inclusive) percentile of values in a column.

```text
PERCENTILE.INC(<column>, <k>)
```

**Use Case:** Find the median sales transaction amount.

```text
MedianSales = PERCENTILE.INC(Sales[Amount], 0.50)
```

The **PERCENTILE.INC** function:

- Returns the interpolated percentile value.
- Works similarly to PERCENTILEX but without an iterator.
- Used for median and other percentile calculations.

---
### Challenge for Day 11

You have a **Sales_Orders** table with the following columns:

- **Customer Name**
- **Sales**

Write a **DAX measure** to rank customers based on their total sales, with 1 being the highest sales.

```text
Customer_Rank = 
RANKX(
    ALL(Sales_Orders[Customer Name]), 
    CALCULATE(SUM(Sales_Orders[Sales])), 
    , 
    DESC, 
    DENSE
)
```

✅ **RANKX** ranks customers based on their total sales.  
✅ **ALL(Sales_Orders[Customer Name])** ensures ranking is across all customers.  
✅ **DESC** orders from highest to lowest.  
✅ **DENSE** ensures ranks are consecutive (no gaps).

---
## Day 12: Iterators in DAX

Today, we explore **iterator functions** in DAX. Unlike simple aggregations, these functions **iterate** over a table row by row, applying a calculation for each row before aggregating the results.

### SUMX()

Calculates the sum of an expression evaluated for each row in a table.

```text
Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[Price])
```

The **SUMX** function:

- **Iterates over a table**, evaluating an expression for each row.
- **Performs row-level calculations before aggregation.**
- **Slower than SUM() but more flexible.**

**Use Case:** Compute total revenue by multiplying quantity and price per row.

---
### AVERAGEX()

Calculates the average of an expression evaluated for each row in a table.

```text
Avg Revenue Per Product = AVERAGEX(Sales, Sales[Quantity] * Sales[Price])
```

The **AVERAGEX** function:

- **Iterates over a table, computing a custom expression per row.**
- **Returns the mean of the calculated values.**
- **Useful when simple AVERAGE() isn’t sufficient.**

**Use Case:** Find the average revenue per product sold.

---
### COUNTX()

Counts the number of rows where an expression evaluates to a non-blank value.

```text
OrdersWithDiscount = COUNTX(Sales, IF(Sales[Discount] > 0, Sales[OrderID]))
```

The **COUNTX** function:

- **Counts rows where a condition is met.**
- **Ignores blank values.**
- **Can be used for conditional row counting.**

**Use Case:** Count the number of orders with a discount applied.

---
Bonus
### MINX() & MAXX()

Return the minimum or maximum value of an expression evaluated row by row.

```text
MinRevenuePerOrder = MINX(Sales, Sales[Quantity] * Sales[Price])
MaxRevenuePerOrder = MAXX(Sales, Sales[Quantity] * Sales[Price])
```

The **MINX & MAXX** functions:

- **Iterate over a table to find the min/max value of an expression.**
- **Useful when working with calculated measures.**
- **Can be used in conditional logic.**

**Use Case:** Identify the lowest and highest revenue generated per order.

---
### Challenge for Day 12

You have a **Sales_Orders** table with the following columns:

- **Order ID**
- **Sales**
- **Discount (%)**

Write a **DAX measure** to calculate the total discount amount applied across all sales orders.

```text
Total_Discount_Amount = 
SUMX(Sales_Orders, Sales_Orders[Sales] * Sales_Orders[Discount (%)] / 100)
```

✅ **SUMX** iterates over each row to compute the discount for every order.  
✅ It multiplies **Sales** by **Discount (%)** and sums up the total discount.

---
## Day 13: Advanced Filter & Context in DAX

Today, we explore **advanced filtering functions** in DAX. These functions allow you to modify and control the evaluation context of your calculations, making them essential for dynamic and complex data analysis.

### CALCULATE()

Modifies the filter context of an expression.

```text
Total Sales (USA) = CALCULATE(SUM(Sales[Amount]), Sales[Country] = "USA")
```

The **CALCULATE** function:

- **Applies filters to an expression dynamically.**
- **Can combine multiple filters using AND/OR logic.**
- **Changes the evaluation context of a measure.**

**Use Case:** Calculate total sales only for transactions in the USA.

---
### CALCULATETABLE()

Returns a table with modified filter context.

```text
USASalesTable = CALCULATETABLE(Sales, Sales[Country] = "USA")
```

The **CALCULATETABLE** function:

- **Returns a filtered table instead of a single value.**
- **Useful when working with table functions.**
- **Works similarly to CALCULATE but returns a table.**

**Use Case:** Create a filtered table containing only sales from the USA.

---
### USERELATIONSHIP()

Forces the use of an inactive relationship between tables.

```text
Revenue (Inactive Date) = CALCULATE(SUM(Sales[Amount]), USERELATIONSHIP(Sales[Order Date], Calendar[Date]))
```

The **USERELATIONSHIP** function:

- **Activates an inactive relationship between tables.**
- **Useful when working with multiple date columns (e.g., Order Date vs. Ship Date).**
- **Must be used inside CALCULATE.**

**Use Case:** Calculate revenue based on an alternative date column.

---
Bonus
### CROSSFILTER()

Changes the cross-filtering direction between two related tables.

```text
Total Sales (Cross-Filtered) = CALCULATE(SUM(Sales[Amount]), CROSSFILTER(Sales[CustomerID], Customers[CustomerID], BOTH))
```

The **CROSSFILTER** function:

- **Controls the direction of a relationship (One-way, Both, or None).**
- **Useful when dealing with bi-directional filtering issues.**
- **Works only inside CALCULATE.**

**Use Case:** Modify filtering direction to ensure correct aggregations in complex data models.

---
### Challenge for Day 13

You have a **Sales_Orders** table with the following columns:

- **Order ID**
- **Product Name**
- **Sales**
- **Category**

Write a **DAX measure** to calculate the total sales for the "Electronics" category only, regardless of any filters applied to the report.

```text
Total_Electronics_Sales = 
CALCULATE(
    SUM(Sales_Orders[Sales]), 
    FILTER(Sales_Orders, Sales_Orders[Category] = "Electronics")
)
```

✅ **CALCULATE** modifies the filter context to apply a specific condition.  
✅ **FILTER** ensures only rows where **Category = "Electronics"** are considered.

---
## Day 14: Row & Column Context in DAX

Today, we explore **row and column context** in DAX. These functions help retrieve related data across tables and work with row-by-row calculations, making them essential for advanced data modeling.

### EARLIER()

Returns the value of an expression evaluated in an earlier row context.

```text
Rank by Sales = 
CALCULATE(
    COUNT(Sales[OrderID]), 
    FILTER(Sales, Sales[Amount] > EARLIER(Sales[Amount]))
) + 1
```

The **EARLIER** function:

- **Used inside a row context to refer to an earlier row’s value.**
- **Commonly used for ranking calculations.**
- **Useful for comparing the current row to other rows in a column.**

**Use Case:** Rank sales amounts within the dataset.

---
### RELATED()

Fetches a related column value from another table using an existing relationship.

```text
Customer Category = RELATED(Customers[Category])
```

The **RELATED** function:

- **Works like a LOOKUP function between related tables.**
- **Brings data from a "one" side of a relationship to the "many" side.**
- **Requires an active relationship between tables.**

**Use Case:** Retrieve the customer category from the Customers table in a Sales table.

---
### RELATEDTABLE()

Returns a table of all related rows from another table.

```text
CustomerOrders = COUNTROWS(RELATEDTABLE(Sales))
```

The **RELATEDTABLE** function:

- **Brings all related rows from a child table.**
- **Works in the "one" side of a relationship to pull data from the "many" side.**
- **Useful for counting related records.**

**Use Case:** Count the number of orders for each customer.

---
Bonus
### LOOKUPVALUE()

Returns the value of a column for a row that meets specific conditions.

```text
Customer Region = LOOKUPVALUE(Customers[Region], Customers[CustomerID], Sales[CustomerID])
```

The **LOOKUPVALUE** function:

- **Works like a VLOOKUP in Excel.**
- **Finds a value based on matching criteria.**
- **Doesn’t require an explicit relationship between tables.**

**Use Case:** Retrieve the region of a customer based on their Customer ID.

---
### Challenge for Day 14

You have a **Sales_Orders** table with the following columns:

- **Order ID**
- **Customer ID**
- **Product ID**
- **Sales**
- **Customer Region** _(from a related Customers table)_

Create a **calculated column** that fetches the **Customer Region** from the related **Customers** table into the **Sales_Orders** table.

```text
Customer_Region = RELATED(Customers[Region])
```

✅ **RELATED** fetches a value from a related table based on an existing relationship.  
✅ This helps in bringing in additional context without duplicating data.

---
## Day 15: Must-Know DAX

Today, we explore must-know DAX functions that enhance flexibility and efficiency in calculations. These functions help create reusable formulas, generate dynamic series, and control filtering in complex models.

### VAR

Defines a variable that stores an intermediate result to be used later in a calculation.

```text
Sales Margin = 
VAR TotalCost = SUM(Sales[Cost])
VAR TotalRevenue = SUM(Sales[Amount])
RETURN TotalRevenue - TotalCost
```

The **VAR** function:

- **Stores values or expressions temporarily** to improve performance.
- **Simplifies complex calculations** by breaking them into smaller steps.
- **Used with RETURN** to finalize the computation.

**Use Case:** Calculate profit margin by defining cost and revenue separately.

---
### RETURN

Outputs the final result of a VAR calculation.

```text
Discounted Sales = 
VAR Discount = 0.1 * SUM(Sales[Amount])
RETURN SUM(Sales[Amount]) - Discount
```

The **RETURN** function:

- **Used with VAR to return the final computed value.**
- **Enhances readability by separating logic from output.**
- **Improves debugging and optimization of complex calculations.**

**Use Case:** Calculate sales after applying a discount.

---
### GENERATESERIES()

Creates a table with a sequence of numbers within a defined range.

```text
Numbers = GENERATESERIES(1, 10, 2)
```

The **GENERATESERIES** function:

- **Generates a sequential numeric column.**
- **Takes start, end, and optional step values.**
- **Useful for dynamic calculations and simulations.**

**Use Case:** Create a series of numbers from 1 to 10, increasing by 2.

---
Bonus
### ISFILTERED()

Checks if a column is being filtered in the current context.

```text
Is Category Filtered = IF(ISFILTERED(Sales[Category]), "Filtered", "Not Filtered")
```

The **ISFILTERED** function:

- **Returns TRUE if a column is actively filtered.**
- **Helps control calculations based on filtering conditions.**
- **Useful in dynamic report visualizations.**

**Use Case:** Display a message indicating whether a category filter is applied.

---
### Challenge for Day 15

You have a **Sales_Orders** table with the following columns:

- **Order ID**
- **Product**
- **Quantity**
- **Sales**

Create a **DAX measure** that calculates total revenue but applies a **10% discount** for orders where the **quantity is greater than 5**.

```text
Total_Revenue_With_Discount = 
VAR DiscountedSales = 
    SUMX(Sales_Orders, 
        IF(Sales_Orders[Quantity] > 5, 
            Sales_Orders[Sales] * 0.9, 
            Sales_Orders[Sales]
        )
    )
RETURN
    DiscountedSales
```

✅ **VAR** stores the intermediate calculation for better readability and performance.  
✅ **SUMX** iterates over the table to apply conditional logic for each row.  
✅ **RETURN** ensures the final discounted total revenue is displayed.

---

That’s the end of our **15-Day DAX Series!** 🚀 

Let me know which function you found most interesting and useful!

---
## References

- [Microsoft DAX Reference](https://learn.microsoft.com/en-us/dax/)
- [DAX Guide](https://dax.guide/)


