---
title: Kindle Review Sentiment Analysis
date: 2025-11-01
permalink: /projects/NLP/Kindle-Review-Sentiment-Analysis/
categories: [Projects, NLP]
excerpt: "Sentiment analysis on Amazon Kindle reviews using various NLP techniques: Implemented multiple text vectorization methods (BOW, TF-IDF, Word2Vec), \rbuilt and compared different classification models, processed and analyzed the Kindle Reviews dataset."
collection: portfolio
---

[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)](https://github.com/theshoaibakthar/NLP-Projects/tree/main/Kindle-Review-Sentiment-Analysis)
<!-- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Post-blue?logo=linkedin)]() -->

This project performs sentiment analysis on Amazon Kindle Store reviews using various Natural Language Processing (NLP) techniques. The analysis compares three different text vectorization approaches: Bag of Words (BOW), TF-IDF, and Word2Vec, combined with machine learning models to classify review sentiments.

## About the Dataset

### Context

This dataset is a curated subset of Amazon product reviews from the Kindle Store category, offering valuable insights into customer opinions, product quality, and review behaviors spanning nearly two decades (May 1996 to July 2014).

### Content

- Part of Amazon's 5-core collection (each product and reviewer has at least 5 reviews)
- Total entries: 982,619
- Time span: May 1996 to July 2014

### Columns

| Column           | Description                                  |
| ---------------- | -------------------------------------------- |
| `asin`           | Unique product ID (e.g., B000FA64PK)         |
| `helpful`        | Helpfulness rating of the review (e.g., 2/3) |
| `overall`        | Overall product rating (numeric)             |
| `reviewText`     | Full text of the review                      |
| `reviewTime`     | Original review date                         |
| `reviewerID`     | Unique reviewer ID                           |
| `reviewerName`   | Name of the reviewer                         |
| `summary`        | Short summary/title of the review            |
| `unixReviewTime` | Review timestamp (Unix format)               |

## Implementation Details

### Data Preprocessing

1. Text Cleaning:
   - Converting text to lowercase
   - Removing special characters
   - Removing URLs and HTML tags
   - Removing stopwords
   - Applying lemmatization
   
2. Feature Engineering:
   - Binary sentiment classification (ratings < 3 are negative, ≥ 3 are positive)
   - Text vectorization using three different approaches:
     - Bag of Words (BOW)
     - TF-IDF (Term Frequency-Inverse Document Frequency)
     - Word2Vec with averaged word embeddings

### Model Architecture

The project implements and compares three approaches:
1. BOW + Gaussian Naive Bayes
2. TF-IDF + Gaussian Naive Bayes
3. Word2Vec + Gaussian Naive Bayes

### Performance Results

Model accuracies on the test set (20% of data):
- BOW Model: Accuracy of 59%
- TF-IDF Model: Accuracy of 59%
- Word2Vec Model: Accuracy of 75%

## Requirements

- Python 3.x
- pandas
- numpy
- scikit-learn
- nltk
- gensim
- BeautifulSoup4
- tqdm

## Setup and Installation

```bash
# Install required packages
pip install pandas numpy scikit-learn nltk gensim beautifulsoup4 tqdm

# Download required NLTK data
python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('punkt_tab')"
```

## Usage

1. Load and preprocess the data:
```python
import pandas as pd
data = pd.read_csv('all_kindle_review.csv')
```

2. Perform text preprocessing:
- Lowercase conversion
- Special character removal
- Stopword removal
- Lemmatization

3. Choose a vectorization method (BOW, TF-IDF, or Word2Vec)
4. Train the model and evaluate results

## Best Practices

1. Data Preprocessing & Cleaning:
   - Handle missing values and duplicates
   - Normalize text
   - Apply lemmatization

2. Train-Test Split:
   - Use 80-20 split
   - Consider stratified sampling for balanced classes

3. Feature Extraction:
   - Compare different vectorization methods
   - Consider dimensionality reduction if needed

4. Model Training & Evaluation:
   - Use appropriate evaluation metrics
   - Consider cross-validation
   - Compare model performances

## Acknowledgements

- Dataset source: Amazon Product Data compiled by Julian McAuley and team at UC San Diego (UCSD)
- Source: [Amazon Product Data – UCSD](https://jmcauley.ucsd.edu/data/amazon/)
- All rights and licenses belong to the original authors

