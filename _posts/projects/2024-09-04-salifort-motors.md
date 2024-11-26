---
layout: post
title: Salifort Motors - Providing data-driven suggestions for HR
date: 2024-09-04 00:00 +0530
categories: [Projects, Python]
tags: [python, pandas, numpy, matpotlib, seaborn, scikit-learn, machine learning]
project: true
hidden: true
image: assets/images/projects/salifort_motors/sm.png
---

## Business scenario and Problem Statement:
The HR department at Salifort Motors wants to take some initiatives to improve employee satisfaction levels at the company. They collected data from employees, but now they don’t know what to do with it. They refer to you as a data analytics professional and ask you to provide data-driven suggestions based on your understanding of the data. They have the following question: what’s likely to make the employee leave the company?

Our goals in this project are to analyze the data collected by the HR department and to build a model that predicts whether or not an employee will leave the company. 

If we can predict employees likely to quit, it might be possible to identify factors that contribute to their leaving. Because it is time-consuming and expensive to find, interview, and hire new employees, increasing employee retention will be beneficial to the company.

## Familiarize with the HR dataset 

In this [dataset](https://www.kaggle.com/datasets/mfaisalqureshi/hr-analytics-and-job-prediction?select=HR_comma_sep.csv), there are 14,999 rows, 10 columns, and these variables: 

| Variable              | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| satisfaction_level    | Employee-reported job satisfaction level [0&ndash;1]              |
| last_evaluation       | Score of employee's last performance review [0&ndash;1]           |
| number_project        | Number of projects employee contributes to                        |
| average_monthly_hours | Average number of hours employee worked per month                 |
| time_spend_company    | How long the employee has been with the company (years)           |
| Work_accident         | Whether or not the employee experienced an accident while at work |
| left                  | Whether or not the employee left the company                      |
| promotion_last_5years | Whether or not the employee was promoted in the last 5 years      |
| Department            | The employee's department                                         |
| salary                | The employee's salary (U.S. dollars)                              |

View my full project in [Github](https://github.com/shaikshoaibakthar/salifort-motors)
