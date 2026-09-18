---
layout: post
title: Understanding GridSearchCV
date: 2026-06-30
permalink: /posts/2026/06/understanding-gridsearchcv/
excerpt_separator: <!--more-->
tags:
  - GridSearchCV
  - ML
categories:
  - ML
toc: true
---
When building a machine learning model, one common question is:

> **Which algorithm should I choose, and what settings should I use?**

For example:

- Should I use **Linear Regression**?
- Should I use **Lasso Regression** with `alpha=1` or `alpha=2`?
- Should a **Decision Tree** use `best` splitting or `random` splitting?

Instead of manually trying every combination, **GridSearchCV automates the entire process**.

## Full Code

```python
from sklearn.model_selection import GridSearchCV, ShuffleSplit
from sklearn.linear_model import LinearRegression, Lasso
from sklearn.tree import DecisionTreeRegressor


def find_best_model_using_gridsearchcv(X, y):

    algos = {

        'linear_regression': {
            'model': LinearRegression(),
            'params': {}
        },

        'lasso': {
            'model': Lasso(),
            'params': {
                'alpha': [1, 2],
                'selection': ['random', 'cyclic']
            }
        },

        'decision_tree': {
            'model': DecisionTreeRegressor(),
            'params': {
                'criterion': ['squared_error', 'friedman_mse'],
                'splitter': ['best', 'random']
            }
        }

    }

    scores = []

    cv = ShuffleSplit(
        n_splits=5,
        test_size=0.2,
        random_state=0
    )

    for algo_name, config in algos.items():

        gs = GridSearchCV(
            estimator=config['model'],
            param_grid=config['params'],
            cv=cv,
            return_train_score=False
        )

        gs.fit(X, y)

        scores.append({
            'model': algo_name,
            'best_score': gs.best_score_,
            'best_params': gs.best_params_
        })

    return pd.DataFrame(scores, columns=['model', 'best_score', 'best_params'])

# run
find_best_model_using_gridsearchcv(X, y)
```

## Step 1: Define Candidate Models

We create a dictionary containing all models and their hyperparameters.

```python
algos = {

    'linear_regression': {
        'model': LinearRegression(),
        'params': {}
    },

    'lasso': {
        'model': Lasso(),
        'params': {
            'alpha': [1, 2],
            'selection': ['random', 'cyclic']
        }
    },

    'decision_tree': {
        'model': DecisionTreeRegressor(),
        'params': {
            'criterion': ['squared_error', 'friedman_mse'],
            'splitter': ['best', 'random']
        }
    }

}
```

Think of this as creating a **menu of experiments**.

| Model             | Hyperparameters to Test                 |
| ----------------- | --------------------------------------- |
| Linear Regression | None                                    |
| Lasso             | alpha = 1,2                             |
| Lasso             | selection = random, cyclic              |
| Decision Tree     | criterion = squared_error, friedman_mse |
| Decision Tree     | splitter = best, random                 |

## Step 2: What is Grid Search?

Grid Search simply means:

> Try **every possible combination** of hyperparameters.

For Lasso:

```python
'alpha': [1,2]
'selection':['random','cyclic']
```

GridSearchCV generates:

|Experiment|alpha|selection|
|---|---|---|
|1|1|random|
|2|1|cyclic|
|3|2|random|
|4|2|cyclic|

So Lasso gives us **4 models**.

Similarly for Decision Tree:

```python
criterion:
[
'squared_error',
'friedman_mse'
]

splitter:
[
'best',
'random'
]
```

Possible combinations:

|Experiment|criterion|splitter|
|---|---|---|
|1|squared_error|best|
|2|squared_error|random|
|3|friedman_mse|best|
|4|friedman_mse|random|

Again **4 models**.

Linear Regression has no parameters.

So:

- Linear Regression → 1 model
- Lasso → 4 models
- Decision Tree → 4 models

Total experiments:

```text
1 + 4 + 4 = 9 models
```

## Step 3: What is Cross Validation?

```python
cv = ShuffleSplit(
    n_splits=5,
    test_size=0.2,
    random_state=0
)
```

This means:

- Create **5 different train-test splits**
- 80% training data
- 20% testing data
- Randomly shuffle before splitting

Suppose we have 1000 samples.

Split 1:

```text
Train : 800
Test  : 200
```

Split 2:

```text
Different random 800
Different random 200
```

Split 3:

```text
Another random split
```

And so on.

Total:

```text
5 train-test experiments
```

## Step 4: How GridSearchCV Actually Works

Suppose we are evaluating Lasso.

GridSearchCV starts with:

```python
alpha=1
selection='random'
```

Then:

### Split 1

Train on 80%

Test on 20%

Score = 0.78

### Split 2

Train on another 80%

Test on another 20%

Score = 0.80

### Split 3

Score = 0.77

### Split 4

Score = 0.79

### Split 5

Score = 0.81

Average:

```text
(0.78+0.80+0.77+0.79+0.81)/5

= 0.79
```

GridSearchCV stores:

```text
alpha=1
selection=random

mean score = 0.79
```

Then it moves to:

```python
alpha=1
selection='cyclic'
```

Again performs 5 splits.

Then:

```python
alpha=2
selection='random'
```

Again 5 splits.

Then:

```python
alpha=2
selection='cyclic'
```

Again 5 splits.

Finally it compares all averages.

| alpha | selection | Mean CV Score |
| ----- | --------- | ------------- |
| 1     | random    | 0.79          |
| 1     | cyclic    | 0.81          |
| 2     | random    | 0.76          |
| 2     | cyclic    | 0.83          |

Best:

```text
alpha=2
selection=cyclic
score=0.83
```

## Step 5: Same Process for Decision Tree

GridSearchCV tries:

```text
squared_error + best

squared_error + random

friedman_mse + best

friedman_mse + random
```

Each combination is trained:

```text
5 times
```

because:

```python
n_splits = 5
```

Then average performance is calculated.

## Step 6: Understanding the Loop

Next, iterate through each algorithm.

```python
for algo_name, config in algos.items():
```

First iteration:

```text
Linear Regression
```

GridSearchCV runs.

Finds best score.

Stores result.


Second iteration:

```text
Lasso
```

GridSearchCV evaluates:

```text
4 parameter combinations
×
5 CV splits

=
20 model trainings
```


Third iteration:

```text
Decision Tree
```

Again:

```text
4 combinations
×
5 splits

=
20 trainings
```

## Step 7: Fitting GridSearchCV

```python
gs.fit(X, y)
```

This single line performs:

```text
Generate parameter combinations
↓
Perform Cross Validation
↓
Train models
↓
Evaluate scores
↓
Average scores
↓
Choose best combination
↓
Store results
```

All automatically.

## Step 8: Best Parameters

After training:

```python
gs.best_score_
```

might return:

```text
0.8477
```

And:

```python
gs.best_params_
```

might return:

```python
{'alpha':2,'selection':'cyclic'}
```

These values correspond to the model configuration that achieved the highest average cross-validation score.

## Step 9: Final Result

The function returns:

```python
pd.DataFrame(scores)
```

Output:

|model|best_score|best_params|
|---|---|---|
|linear_regression|0.8478|{}|
|lasso|0.7268|{'alpha':2,'selection':'random'}|
|decision_tree|0.7190|{'criterion':'squared_error','splitter':'best'}|

## Visualizing the Entire Workflow

```text
Define Models
      │
      ▼

Generate Hyperparameter Combinations
      │
      ▼

For each combination
      │
      ▼

Perform 5 ShuffleSplit validations
      │
      ▼

Train Model
      │
      ▼

Evaluate Score
      │
      ▼

Average Scores
      │
      ▼

Pick Best Parameters
      │
      ▼

Compare Algorithms
      │
      ▼

Return Best Model Information
```

> GridSearchCV is an automated system that tests every hyperparameter combination, evaluates each one using cross-validation, calculates average performance, and selects the configuration that generalizes best on unseen data.

