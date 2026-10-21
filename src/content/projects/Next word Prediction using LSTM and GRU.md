---
title: Next word Prediction using LSTM and GRU
date: 2025-12-21
permalink: /projects/Next-word-Prediction-LSTM-GRU/
categories:
  - Machine Learning & AI
github: https://github.com/theshoaibakthar/Deep-Learning-Projects/tree/main/Next-Word-Prediction-LSTM-GRU
tags:
  - TensorFlow
  - Keras
  - LSTM
  - GRU
  - NLP
excerpt: Developed a deep learning model for predicting the next word in a given sequence of words, built using LSTM and GRU networks.
---
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)](https://github.com/theshoaibakthar/Deep-Learning-Projects/tree/main/Next-Word-Prediction-LSTM-GRU)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Post-blue?logo=linkedin)](https://www.linkedin.com/posts/theshoaibakthar_nlp-deeplearning-machinelearning-activity-7410160224117940224-LnTK?utm_source=share&utm_medium=member_desktop&rcm=ACoAADIXWPgB3o5Wgjw5IPYhjP0jJ8OhSknHvh4)
[![Demo](https://img.shields.io/badge/App-Demo-FF4B4B?logo=streamlit&logoColor=white)](https://nvp-lstm-gru.streamlit.app/)

---
## Introduction

This project builds a deep learning model that predicts the next word in a sequence of words. The model uses Long Short-Term Memory (LSTM) and Gated Recurrent Unit (GRU) networks, which are well suited to sequence prediction tasks.

## Steps Followed

The project includes the following steps:

- **Data Collection:** We use the text of Shakespeare's *Hamlet* as our dataset. Early Modern English is archaic and complex, which makes it a harder and more interesting test for the model than everyday modern text.

- **Data Preprocessing:** The text is tokenized, converted into sequences, and padded to a uniform length. The sequences are then split into training and test sets.

- **Model Building:** An LSTM model is built with an embedding layer, two LSTM layers, and a dense output layer with a softmax activation that gives the probability of each possible next word. The GRU model follows the same structure.

- **Model Training:** The models are trained on the prepared sequences. Early stopping, which halts training when the validation loss stops improving, was also tried (see the note in the training section).

- **Model Evaluation:** The models are evaluated on example sentences to check how well they predict the next word.

- **Deployment with Streamlit:** A Streamlit web app lets users enter a sequence of words and get the predicted next word in real time.

## Data Collection and Processing

### Data Collection

We use the NLTK library, specifically its Gutenberg corpus, which includes Shakespeare's *Hamlet*.

First, we import NLTK and download the Gutenberg package. Then we load the raw text of `shakespeare-hamlet.txt` and save it to a local file named `hamlet.txt`.

```python
import nltk
nltk.download('gutenberg')
from nltk.corpus import gutenberg

data = gutenberg.raw('shakespeare-hamlet.txt')

with open('hamlet.txt', 'w', encoding='utf-8') as file:
    file.write(data)
```

### Data Preprocessing

For preprocessing, we import NumPy, TensorFlow Keras's `Tokenizer` and `pad_sequences` for text vectorization and sequence padding, and scikit-learn's `train_test_split` for splitting the dataset.

The `Tokenizer` converts text into sequences of integers representing word indices. The `pad_sequences` function gives all sequences the same length, which the model requires for training.

We read the saved `hamlet.txt` file and convert the text to lowercase for uniformity. Then we fit the tokenizer on the text, which builds a word-to-index mapping.

The total vocabulary size is the length of the tokenizer's word index plus one. Word indices start at 1, and index 0 is reserved for padding, so the extra slot is needed.

```python
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split

with open('hamlet.txt', 'r', encoding='utf-8') as file:
    text = file.read().lower()

tokenizer = Tokenizer()
tokenizer.fit_on_texts([text])

total_words = len(tokenizer.word_index) + 1
```

### Creating Input Sequences

To train the model to predict the next word, we turn the text into many input sequences.

We split the text line by line and convert each line into a sequence of word indices using the tokenizer's `texts_to_sequences` method.

For each tokenized line, we generate n-gram sequences by taking slices from the start of the line up to each successive word, and append them to a list. This turns every line into multiple sequences of increasing length.

```python
input_sequences = []
for line in text.split('\n'):
    token_list = tokenizer.texts_to_sequences([line])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i+1]
        input_sequences.append(n_gram_sequence)
```

### Padding Sequences

The model needs inputs of equal length, so we find the longest sequence and pad every other sequence to that length. We use pre-padding, which adds zeros at the beginning.

```python
max_sequence_len = max([len(x) for x in input_sequences])
padded_sequences = pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre')
```

### Creating Predictors and Labels

We split each padded sequence into a predictor (all words except the last) and a label (the last word).

The labels are then one-hot encoded, with the number of classes equal to the vocabulary size. This prepares the data for a classification model that predicts the next word.

```python
import tensorflow as tf

X = padded_sequences[:, :-1]
y = padded_sequences[:, -1]
y = tf.keras.utils.to_categorical(y, num_classes=total_words)
```

### Train-Test Split

Finally, we split the data 80/20 into training and test sets, so the model is evaluated on data it has not seen. Setting `random_state` makes the split reproducible.

```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

## Model Building and Training

### Building the LSTM Model

First, we import the necessary modules from TensorFlow Keras: the `Sequential` model and the `Embedding`, `LSTM`, `Dense` and `Dropout` layers. The dropout layer randomly disables a fraction of neurons during training to reduce overfitting.

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
```

We start with a `Sequential` model and add an embedding layer that takes the vocabulary size and uses an embedding dimension of 100.

```python
model = Sequential()
model.add(Embedding(total_words, 100))
```

Next comes an LSTM layer with 150 units. We set `return_sequences=True` so a second LSTM layer can be stacked on top. A dropout layer then disables 20% of the neurons during training.

```python
model.add(LSTM(150, return_sequences=True))
model.add(Dropout(0.2))
```

The second LSTM layer has 100 units. It does not return sequences because it is the last recurrent layer before the output.

```python
model.add(LSTM(100))
```

Finally, we add a dense output layer with one unit per word in the vocabulary. We use softmax because this is a multi-class classification problem.

```python
model.add(Dense(total_words, activation='softmax'))
```

We compile the model with categorical cross-entropy loss (a multi-class task), the Adam optimizer, and accuracy as the metric.

```python
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
```

The model summary shows the layers and the number of trainable parameters, which helps verify the architecture.

```python
model.summary()
```

### Training the Model

We train the model with the `fit` method, passing the training data, 100 epochs, and the test set as validation data. Setting `verbose=1` displays training progress.

```python
history = model.fit(X_train, y_train, epochs=100, validation_data=(X_test, y_test), verbose=1)
```

**Early stopping.** Early stopping halts training when the validation loss stops improving, which saves time and limits overfitting. It is added through the `EarlyStopping` callback:

```python
from tensorflow.keras.callbacks import EarlyStopping

early_stopping = EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True)

history = model.fit(X_train, y_train, epochs=100, validation_data=(X_test, y_test),
                    verbose=1, callbacks=[early_stopping])
```

> **Note:** With the callback enabled, training stopped very early on this dataset because the validation loss was not improving. This is often a sign of overfitting on a small corpus (a single play), but I haven't confirmed the cause and it needs further investigation. For now, the models were trained without callbacks.

### Building the GRU Model

The GRU model follows the same process. The only change is swapping the LSTM layers for GRU layers:

```python
from tensorflow.keras.layers import GRU

gru_model = Sequential()
gru_model.add(Embedding(total_words, 100))
gru_model.add(GRU(150, return_sequences=True))
gru_model.add(Dropout(0.2))
gru_model.add(GRU(100))
gru_model.add(Dense(total_words, activation='softmax'))

gru_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
```

## Model Evaluation

We write a function that predicts the next word. It takes the model, the tokenizer, the input text, and the maximum sequence length.

1. The tokenizer converts the input text into a list of tokens.
2. If the list is at least as long as the maximum sequence length, we keep only the last `max_sequence_len - 1` tokens. The model was trained on inputs of that length, because one position in each sequence is the label.
3. We pre-pad the list to the required input length.
4. We call the model's `predict` method and take the index with the highest probability.
5. We look that index up in the tokenizer's word index to get the predicted word.

```python
def predict_next_word(model, tokenizer, text, max_sequence_len):
    token_list = tokenizer.texts_to_sequences([text])[0]
    if len(token_list) >= max_sequence_len:
        token_list = token_list[-(max_sequence_len - 1):]
    token_list = pad_sequences([token_list], maxlen=max_sequence_len - 1, padding='pre')
    predicted_probs = model.predict(token_list)
    predicted_index = predicted_probs.argmax(axis=1)[0]
    for word, index in tokenizer.word_index.items():
        if index == predicted_index:
            return word
```

As an example, we use the input text "to be or not to be". The maximum sequence length is taken from the model's input shape plus one, to stay consistent with training. We then call the function and print the prediction.

```python
input_text = "to be or not to be"
max_sequence_len = model.input_shape[1] + 1
next_word = predict_next_word(model, tokenizer, input_text, max_sequence_len)
print(f"Next word prediction: {next_word}")
```

### Saving the Model and Tokenizer

After training and testing, the model is saved as `next_word_lstm.keras`. The tokenizer is saved with Python's `pickle` module as `tokenizer.pickle`, so the same text processing can be reused for later predictions.

```python
import pickle

model.save('next_word_lstm.keras')

with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
```

## Streamlit App

The app lets users enter a short sequence of words and shows the most likely next word, as predicted by a trained neural network. It supports both **LSTM** and **GRU** models, so the two can be compared easily.

**Loading.** The app loads the saved tokenizer and the trained models in `.keras` format. Both models share the same tokenizer, which keeps the word-to-index mapping consistent. To improve performance, the selected model is loaded only when needed, using Streamlit's caching mechanism.

**Interface.** The UI is built with Streamlit components: `selectbox`, `text_input` and `button`. Users pick the model type (LSTM or GRU) from a dropdown, type a sequence of words, and click a button to run the prediction.

**Prediction.** The input text is converted to integers with the tokenizer, trimmed to the model's expected input length, and padded where necessary, so it matches the format used in training. The selected model then outputs a probability distribution over the vocabulary. The word with the highest probability is chosen, and a reverse lookup converts its index back into a readable word.

**Output.** The result is displayed together with the name of the model that produced it, so users can compare LSTM and GRU predictions side by side.

**Deployment.** All required Python libraries are listed in a `requirements.txt` file. The app is deployed on **Streamlit Cloud** by connecting the GitHub repository, then selecting the repository, branch and main app file. Streamlit Cloud builds and deploys the app automatically.

You can try the deployed app [here](https://nvp-lstm-gru.streamlit.app/).

![Screenshot of the Streamlit next-word prediction app](images/Next-word-Prediction_Pasted image 20251225184109.png)
*Screenshot of the Streamlit app*

## Conclusion

This project takes an NLP deep learning model from experimentation all the way to a deployed, user-facing application. By putting both LSTM and GRU architectures into a single Streamlit interface, it demonstrates hands-on work with sequence modeling, text preprocessing and real-time inference.
