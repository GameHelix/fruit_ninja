# Fake News Detection Model

This project involves building a machine learning model to classify news articles as either "Fake" or "Real". The model is trained using logistic regression and uses the TF-IDF (Term Frequency-Inverse Document Frequency) method to transform text data into numerical features. 

## Table of Contents
- [Installation](#installation)
- [Dataset](#dataset)
- [Modeling Steps](#modeling-steps)
  - [1. Data Preprocessing](#1-data-preprocessing)
  - [2. Text Vectorization](#2-text-vectorization)
  - [3. Model Training](#3-model-training)
  - [4. Model Evaluation](#4-model-evaluation)
  - [5. Model Saving](#5-model-saving)
- [Usage](#usage)
- [Results](#results)
- [Contributing](#contributing)

## Installation

To run this project locally, follow the steps below:

1. **Clone the repository**:
    ```bash
    https://github.com/Ismat-Samadov/Fake_News_Detection.git
    ```

2. **Install the required packages**:
    ```bash
    pip install pandas scikit-learn joblib
    ```

3. **Download or place your dataset** in the same directory. Ensure the dataset is named `news_articles.csv` or modify the path in the code accordingly.

## Dataset

The dataset used for this project contains two main columns:
- `text`: The content of the news article.
- `label`: The classification label indicating whether the news is "Fake" or "Real".

Ensure that the dataset has no missing values in these columns for better performance.

## Modeling Steps

### 1. Data Preprocessing

First, we load the dataset and retain only the `text` and `label` columns. Missing values are dropped. The `text` column contains the news articles, while the `label` column contains the target classification (Fake or Real).

```python
data = pd.read_csv('news_articles.csv')
data = data[['text', 'label']].dropna()
```

### 2. Text Vectorization

The textual data from the `text` column is converted into numerical format using TF-IDF (Term Frequency-Inverse Document Frequency). This vectorization is essential for transforming text into features that can be processed by a machine learning model.

```python
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
X_test_tfidf = tfidf_vectorizer.transform(X_test)
```

### 3. Model Training

A Logistic Regression model is trained on the transformed text data. Logistic Regression is a simple yet effective model for binary classification tasks such as this one.

```python
model = LogisticRegression(max_iter=1000)
model.fit(X_train_tfidf, y_train)
```

### 4. Model Evaluation

The model is evaluated on the test set using accuracy, precision, recall, and F1-score. These metrics give insight into how well the model is performing, particularly in distinguishing between real and fake news.

```python
y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)
```

### 5. Model Saving

The trained Logistic Regression model and the TF-IDF vectorizer are saved using `joblib` for future use in deployment.

```python
joblib.dump(model, 'fake_news_detection_model.pkl')
joblib.dump(tfidf_vectorizer, 'tfidf_vectorizer.pkl')
```

## Usage

Once the model and vectorizer are saved, they can be loaded and used for predictions on new news articles. To load the model and vectorizer:

```python
import joblib
model = joblib.load('fake_news_detection_model.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')

# To make predictions on new data
new_text = ["Insert new news text here."]
transformed_text = tfidf_vectorizer.transform(new_text)
prediction = model.predict(transformed_text)
```

## Results

The model achieved an accuracy of **69%** on the test dataset. The classification report is as follows:

```
Accuracy: 0.6926829268292682
Classification Report:
              precision    recall  f1-score   support

        Fake       0.67      0.96      0.79       249
        Real       0.83      0.27      0.41       161

    accuracy                           0.69       410
   macro avg       0.75      0.62      0.60       410
weighted avg       0.73      0.69      0.64       410
```

- **Precision for Fake news**: 67%
- **Recall for Fake news**: 96%
- **Precision for Real news**: 83%
- **Recall for Real news**: 27%

The model performs well on detecting fake news but could be improved on detecting real news. This imbalance could be addressed by further tuning the model or gathering more balanced training data.

## Contributing

Contributions are welcome! If you'd like to improve the model or add more features to this project, feel free to open an issue or submit a pull request.
