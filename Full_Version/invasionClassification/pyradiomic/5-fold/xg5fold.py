import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, confusion_matrix
import xgboost as xgb
import random

num = random.random()
num = int(num * 10000)
num = 3707
print(num)

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('pyradiomic/features.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 24:]
y = df['nrrd_filename'].str[-6].astype(int)

# Create a list to store the accuracy and confusion matrices for each fold
accuracy_scores = []
confusion_matrices = []
wrong_indices = []

# Perform stratified k-fold cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=num)
for train_index, test_index in skf.split(X, y):
    # Get the training and testing data for the current fold
    X_train, X_test = X.iloc[train_index], X.iloc[test_index]
    y_train, y_test = y.iloc[train_index], y.iloc[test_index]

    # Train the XGBoost classifier
    clf = xgb.XGBClassifier(random_state=num)
    clf.fit(X_train, y_train)

    # Predict labels for the test data
    y_pred = clf.predict(X_test)

    # Calculate the accuracy score
    accuracy = accuracy_score(y_test, y_pred)

    # Calculate the confusion matrix
    confusion = confusion_matrix(y_test, y_pred)

    # Append the accuracy score and confusion matrix to the respective lists
    accuracy_scores.append(accuracy)
    confusion_matrices.append(confusion)

    # Find the indices of the wrong answers
    wrong_indices_fold = np.where(y_pred != y_test)[0]
    wrong_indices.extend(test_index[wrong_indices_fold])

    # Print the accuracy and confusion matrix for the current fold
    print(f"Fold Accuracy: {accuracy}")
    print(f"Fold Confusion Matrix:")
    print(confusion)
    print("-----------------------------------")

# Calculate the average accuracy across all folds
average_accuracy = np.mean(accuracy_scores)

# Concatenate the confusion matrices for all folds
total_confusion_matrix = np.sum(confusion_matrices, axis=0)

# Print the average accuracy and total confusion matrix
print("Average Accuracy:", average_accuracy)
print("Total Confusion Matrix:")
print(total_confusion_matrix)

# Print the indices of the wrong answers
print("Indices of Wrong Answers:")
wrong_indices.sort()
print(wrong_indices)
