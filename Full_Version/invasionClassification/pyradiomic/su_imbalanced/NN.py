import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
import random
from tensorflow import keras
from tensorflow.keras import layers

num = 4123
print(num)

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('feature_selection/pearson_300.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 1:]
y = df['nrrd_filename'].str[-6].astype(int)

# Create a list to store the accuracy and confusion matrices for each fold
accuracy_scores = []
confusion_matrices = []
auc_scores = []
sensitivity_scores = []
specificity_scores = []

# Perform stratified k-fold cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=num)
for train_index, test_index in skf.split(X, y):
    # Get the training and testing data for the current fold
    X_train, X_test = X.iloc[train_index], X.iloc[test_index]
    y_train, y_test = y.iloc[train_index], y.iloc[test_index]

    # Create a simple neural network model
    model = keras.Sequential([
        layers.Input(shape=(300,)),  # Input layer with 1408 features
        layers.Dense(256, activation='relu'),
        layers.Dense(1, activation='sigmoid')  # Output layer with sigmoid activation
    ])

    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Train the model
    model.fit(X_train, y_train, epochs=10, batch_size=5)

    # Predict labels for the test data
    y_pred = model.predict(X_test)

    # Convert the voted predictions to an array
    y_pred = np.array(y_pred)

    # Convert probabilities to binary labels using a threshold (e.g., 0.5)
    threshold = 0.5
    y_pred = np.where(y_pred > threshold, 1, 0)

    # Calculate the accuracy score
    accuracy = accuracy_score(y_test, y_pred)

    # Calculate the confusion matrix
    confusion = confusion_matrix(y_test, y_pred)

    # Calculate the AUC score
    auc = roc_auc_score(y_test, y_pred)

    # Calculate sensitivity and specificity
    tn, fp, fn, tp = confusion.ravel()
    sensitivity = tp / (tp + fn)
    specificity = tn / (tn + fp)

    # Append the accuracy, confusion matrix, AUC, sensitivity, and specificity to the respective lists
    accuracy_scores.append(accuracy)
    confusion_matrices.append(confusion)
    auc_scores.append(auc)
    sensitivity_scores.append(sensitivity)
    specificity_scores.append(specificity)

# Calculate the average accuracy, AUC, sensitivity, and specificity across all folds
average_accuracy = np.mean(accuracy_scores)
average_auc = np.mean(auc_scores)
average_sensitivity = np.mean(sensitivity_scores)
average_specificity = np.mean(specificity_scores)

# Concatenate the confusion matrices for all folds
total_confusion_matrix = np.sum(confusion_matrices, axis=0)

# Print the average accuracy, AUC, sensitivity, specificity, and total confusion matrix
print("Average Accuracy:", average_accuracy)
print("Average AUC:", average_auc)
print("Average Sensitivity:", average_sensitivity)
print("Average Specificity:", average_specificity)
print("Total Confusion Matrix:")
print(total_confusion_matrix)