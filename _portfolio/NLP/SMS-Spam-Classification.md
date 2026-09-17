---
title: SMS Spam Classification
date: 2025-11-01
permalink: /projects/NLP/SMS-Spam-Classification/
categories: [Projects, NLP]
excerpt: "A comprehensive spam detection system implementing multiple text classification approaches including Bag of Words (BOW), \rTF-IDF Vectorization with Multinomial Naive Bayes, \rWord2Vec with Random Forest Classifier"
collection: portfolio
---

[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)](https://github.com/theshoaibakthar/NLP-Projects/tree/main/SMS-Spam-Classification)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Post-blue?logo=linkedin)](https://www.linkedin.com/posts/theshoaibakthar_nlp-machinelearning-textclassification-activity-7409072964102594561-GKa_?utm_source=share&utm_medium=member_desktop&rcm=ACoAADIXWPgB3o5Wgjw5IPYhjP0jJ8OhSknHvh4)

This project implements and compares different Natural Language Processing (NLP) techniques for SMS spam classification using various text vectorization methods and machine learning models.

## Project Overview

The project explores three different approaches to SMS spam classification:
1. Bag of Words (BOW)
2. Term Frequency-Inverse Document Frequency (TF-IDF)
3. Word2Vec with Average Word Embeddings

## Dataset

The project uses the SMS Spam Collection dataset, which contains labeled SMS messages categorized as either spam or ham (legitimate messages). The dataset is loaded from `SMSSpamCollection` with two columns:
- `label`: Indicates whether the message is spam or ham
- `message`: The actual text content of the SMS

## Implementation Details

### Common Preprocessing Steps

- Text cleaning using regular expressions
- Conversion to lowercase
- Removal of stopwords
- Text normalization (stemming/lemmatization)

### 1. Bag of Words (BOW) Approach

- Uses `CountVectorizer` from scikit-learn
- Features:
  - Maximum 2,500 features
  - Includes unigrams and bigrams (ngram_range=(1,2))
- Model: Multinomial Naive Bayes classifier

### 2. TF-IDF Approach

- Uses `TfidfVectorizer` from scikit-learn
- Features:
  - Maximum 2,500 features
  - Includes unigrams and bigrams (ngram_range=(1,2))
- Model: Multinomial Naive Bayes classifier

### 3. Word2Vec with Average Word Embeddings

- Uses `gensim` Word2Vec model
- Features:
  - Custom trained Word2Vec model on the SMS dataset
  - Average word vectors for sentence representation
  - Vector dimension standardization to 100 features
- Model: Random Forest Classifier

## Project Structure

```
|
├── 1_Spam_Classification_using_BOW.ipynb        # BOW implementation
├── 2_Spam_Classification_using_TF-IDF.ipynb     # TF-IDF implementation
├── 3_Spam_Classification_using_Word2Vec_AvgWord2Vec.ipynb  # Word2Vec implementation
└── README.md
```

## Requirements

The project requires the following Python libraries:
- pandas
- numpy
- scikit-learn
- nltk
- gensim
- tqdm

## Model Performance

Each approach was evaluated using standard classification metrics including accuracy, precision, recall, and F1-score. The models were trained on 80% of the data and tested on the remaining 20%.

## Usage

1. Install the required packages:
```bash
pip install pandas numpy scikit-learn nltk gensim tqdm
```

2. Download required NLTK data:
```python
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')
```

3. Run the Jupyter notebooks in sequence to compare different approaches:
   - Start with BOW implementation
   - Move to TF-IDF implementation
   - Finally, try the Word2Vec implementation

