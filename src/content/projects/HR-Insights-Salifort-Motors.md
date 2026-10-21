---
title: HR Insights at Salifort Motors
date: 2024-09-13
permalink: /projects/HR-Insights-Salifort-Motors/
categories:
  - Machine Learning & AI
github: https://github.com/theshoaibakthar/Salifort-Motors-Employee-Retention
tags:
  - Python
  - Scikit-learn
  - EDA
excerpt: Analyzed HR data to understand attrition drivers at Salifort Motors. Used EDA and ML (Random Forest, Decision Tree) for prediction. Achieved 96.2% accuracy, 93.8% AUC. Delivered actionable retention insights.
---
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)](https://github.com/theshoaibakthar/Salifort-Motors-Employee-Retention)

---

# Why Do Employees Leave? Predicting Attrition at Salifort Motors with Machine Learning

*A data analytics project on employee retention: from exploratory analysis to a random forest model with 96.2% accuracy.*

---

Hiring is expensive. Finding, interviewing, onboarding and training a replacement takes time and money, and every departure also takes institutional knowledge out the door. So when the HR department at Salifort Motors collected a pile of employee data but didn't know what to do with it, they asked one question:

> **What's likely to make an employee leave the company?**

In this project I set out to answer that in two ways: by digging into the data to find *why* people leave, and by building a model that predicts *who* is likely to leave.

You can find the full code and notebook on GitHub: [Salifort-Motors-Employee-Retention](https://github.com/datawithshoaib/Salifort-Motors-Employee-Retention).

## The Goal and the Stakeholders

The audience for this work is Salifort's senior leadership and the HR department. The deliverables were:

- An executive summary with insights and recommendations
- A model that predicts whether an employee will leave
- A Jupyter notebook with all the code

If HR can spot the employees most at risk of quitting, and understand the factors behind it, they can act before the resignation letter lands.

## The Dataset

The data comes from a [Kaggle HR analytics dataset](https://www.kaggle.com/datasets/mfaisalqureshi/hr-analytics-and-job-prediction?select=HR_comma_sep.csv) with 14,999 rows and 10 columns:

| Variable | Description |
|---|---|
| `satisfaction_level` | Self-reported job satisfaction (0–1) |
| `last_evaluation` | Score from the last performance review (0–1) |
| `number_project` | Number of projects the employee contributes to |
| `average_monthly_hours` | Average hours worked per month |
| `time_spend_company` | Tenure in years |
| `Work_accident` | Whether the employee had a workplace accident |
| `left` | Whether the employee left the company (the target) |
| `promotion_last_5years` | Whether the employee was promoted in the last 5 years |
| `Department` | The employee's department |
| `salary` | Salary level |

## Cleaning the Data

The first pass turned up a few things worth noting:

- **No missing values**, which is rare and welcome.
- **3,008 duplicate rows**, about 20% of the data. I removed them and continued with a clean dataframe.
- **Outliers in tenure.** A boxplot and IQR calculation flagged 824 rows with outlying tenure values. These mattered later, because logistic regression is sensitive to outliers.

## What the Data Says: Exploratory Analysis

This is where the story starts to emerge.

### 1. Too many projects, too many hours

Employees who work on more projects naturally log more hours, but the pattern for people who *left* is striking:

- **Everyone with 7 projects left.** No exceptions.
- Employees with 6 or 7 projects were working roughly 255–295 hours a month.
- The sweet spot appears to be **3–4 projects**, where the ratio of leavers to stayers is very small.
- Leavers fall into two groups: those who worked *far fewer* hours than peers with the same project load (possibly pushed out or already on their way out) and those who worked *far more* (likely burned out and quitting).

For context, a standard Monday-to-Friday schedule works out to about **166.67 hours a month**. Aside from employees on two projects, nearly every group, even those who stayed, worked well above that. Overwork looks like the norm at Salifort.

### 2. Long hours and rock-bottom satisfaction

Plotting monthly hours against satisfaction revealed three groups of leavers:

1. **The overworked and miserable:** 240–320 hours a month (up to ~80 hours a week) with satisfaction close to zero.
2. **The normal-hours and unhappy:** typical hours, but still very low satisfaction, possibly from pressure to match overworked peers.
3. **The overworked but happy:** 210–280 hours a month with satisfaction of 0.7–0.9. Workload doesn't explain why they left.

The odd shapes in these distributions also hint that the dataset may be synthetic or manipulated, which is worth keeping in mind when interpreting results.

### 3. The four-year cliff

Employees who left fall into two camps: dissatisfied people with short tenures, and very satisfied people with medium tenures. Most leavers had **3–5 years** at the company, and four-year employees who left reported unusually low satisfaction. That looks like a signal to investigate: did a policy, promotion cycle or structural change hit people at the four-year mark?

On the flip side, **employees who stayed past six years tended not to leave.** The long-tenured group is small, though, and their salaries weren't disproportionately high.

### 4. Hard work isn't rewarded

- Hours worked and evaluation scores are correlated, but working long hours doesn't *guarantee* a good evaluation.
- Very few of the employees who worked the longest hours were promoted.
- Very few employees who were promoted in the last five years left.

Put those together and you get a frustrating picture: people grind for long hours without the promotion or recognition to match, and then they leave.

### 5. Not a department problem

Attrition didn't differ significantly across departments. This is a company-wide issue, not one rogue team.

### The takeaway from EDA

Leaving is tied to **long hours, heavy project loads and low satisfaction.** A sizeable group of employees at Salifort is probably burned out, and the data points toward management and workload practices as the root cause.

## Building the Model

Predicting whether an employee leaves is a **binary classification** problem (`left` = 1 or 0). I tried two families of models.

### Approach A: Logistic regression

I encoded `department` with dummy variables, converted the ordinal `salary` column to numbers (0–2), and removed the tenure outliers. The model scored:

| Metric | Score (weighted avg) |
|---|---|
| Precision | 79% |
| Recall | 82% |
| F1 | 80% |
| Accuracy | 82% |

Decent, but if the goal is specifically to catch employees who *leave*, the scores for that class were significantly lower.

### Approach B: Tree-based models

I built a decision tree and a random forest, each tuned with cross-validated grid search. The random forest edged out the decision tree on almost every metric (recall was a negligible 0.001 lower).

### A note on data leakage

The first round of models used every variable. That raises a legitimate concern: **data leakage.** In the real world, the company won't have a satisfaction score for every employee, and `average_monthly_hours` could itself be a symptom of someone who has already decided to leave (or been marked for dismissal).

So for round two, I did some feature engineering:

- Dropped `satisfaction_level`
- Created a new binary feature, `overworked`, that captures whether an employee is working excessive hours

## Results

After feature engineering, the final **random forest** achieved the following on the test set:

| Metric | Score |
|---|---|
| AUC | 93.8% |
| Precision | 87.0% |
| Recall | 90.4% |
| F1 | 88.7% |
| Accuracy | 96.2% |

The model produces more false positives than false negatives, meaning it sometimes flags employees as at risk when they aren't. For an HR team, that's a reasonable trade-off: it's better to have a few unnecessary check-in conversations than to miss people who are about to walk.

### What drives the predictions?

Both the decision tree and the random forest ranked the same four features highest, in the same order:

1. `last_evaluation`
2. `number_project`
3. `tenure`
4. `overworked`

That lines up neatly with what the exploratory analysis suggested: workload, performance recognition and time at the company are what matter.

## Recommendations for Salifort Motors

Based on the models and the analysis, here is what I'd put in front of leadership:

1. **Cap the number of projects** any one employee can take on.
2. **Look at the four-year mark.** Consider promoting employees who've been around at least four years, or investigate why people at that tenure are so dissatisfied.
3. **Either reward long hours or stop requiring them.** Working 200+ hours a month shouldn't be an unspoken expectation with no payoff.
4. **Be explicit about overtime pay and time off.** If employees aren't familiar with the policies, tell them. If expectations around workload aren't clear, make them clear.
5. **Talk about the culture.** Hold company-wide and team-level discussions to understand and address work culture.
6. **Don't reserve high evaluation scores for people working 200+ hours.** Build a proportionate scale that rewards contribution and effort, not just time logged.

## Limitations and Next Steps

No model is perfect, and I'd be doing a disservice if I didn't flag where this one could be stronger:

- **Data leakage is still a concern.** It would be wise to see how predictions change when `last_evaluation` is removed, since evaluations may not happen frequently enough to be useful in practice.
- **Evaluation score might be a cause, not just a predictor.** If evaluation determines whether someone stays, it could be more useful to flip the problem and predict performance scores instead.
- **The data may be synthetic.** The unusual distribution shapes suggest results should be treated as illustrative rather than as a definitive picture of any real company.

## Final Thoughts

The headline finding is simple and a bit uncomfortable: **Salifort's employees are overworked, and the people who leave are often the ones carrying the heaviest load without the recognition to match.** The model can flag who is at risk with high accuracy, but the real value is in what it reveals about *why*. Predicting attrition is useful, but fixing the conditions that cause it is better.

If you'd like to dig into the code, charts and notebook, head over to the [GitHub repository](https://github.com/datawithshoaib/Salifort-Motors-Employee-Retention). Feedback and questions are welcome.

---

*Tools used: Python, pandas, matplotlib/seaborn, scikit-learn (logistic regression, decision tree, random forest), Jupyter Notebook.*

