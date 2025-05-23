import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
import random


# num = random.random()
# num = int(num * 10000)
# # num = 1325
# # num = 1935
# num = 8441
# print(num)


# Read the CSV file into a pandas DataFrame
df = pd.read_csv('feature_selection/chi2_300.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 1:]
y = df['nrrd_filename'].str[-6].astype(int)

# Create lists to store the accuracy, confusion matrices, AUC, sensitivity, and specificity for each fold
accuracy_scores = []
confusion_matrices = []
auc_scores = []
sensitivity_scores = []
specificity_scores = []

for i in range(10):
    num = random.random()
    num = int(num * 10000)
    
    X = shuffle(X, random_state=num)
    y = shuffle(y, random_state=num)

    X_p = X[y == 1]
    X_n = X[y == 0]

    X_train_p, X_test_p = X_p.iloc[48:, :], X_p.iloc[:48, :]
    X_train_n, X_test_n = X_n.iloc[9:, :] ,X_n.iloc[:9, :]

    # test
    X_test = pd.concat([X_test_p, X_test_n], axis=0)
    y_test = np.concatenate((np.ones(48), np.zeros(9)), axis=0)
    X_test, y_test = shuffle(X_test, y_test, random_state=num)

    # train
    X_train = pd.concat([X_train_p, X_train_n], axis=0)
    y_train = np.concatenate((np.ones(112), np.zeros(21)), axis=0)
    X_train, y_train = shuffle(X_train, y_train, random_state=num)


    clf_list = []
    for i in range(5):
        inner_X_train_p = X_train_p.iloc[i * 21:(i + 1) * 21, :]

        inner_X_train = pd.concat([inner_X_train_p, X_train_n], axis=0)

        inner_y_train = np.concatenate((np.ones(21), np.zeros(21)), axis=0)

        inner_X_train, inner_y_train = shuffle(inner_X_train, inner_y_train, random_state=num)

        clf = RandomForestClassifier(random_state=i)
        # clf = LinearDiscriminantAnalysis()
        # clf = XGBClassifier(random_state=i)
        clf.fit(inner_X_train, inner_y_train)
        clf_list.append(clf)

    weights = [roc_auc_score(y_train, clf.predict(X_train)) for clf in clf_list]
    # weights = [clf.score(X_train, y_train) for clf in clf_list]
    weights = [(w - min(weights)) / (max(weights) - min(weights)) for w in weights]

    # # Make predictions using each individual classifier and apply weights
    # weighted_predictions = [weights[i] * clf.predict_proba(X_test) for i, clf in enumerate(clf_list)]

    # # Perform weighted voting by summing the weighted predictions
    # y_pred_weighted = np.sum(weighted_predictions, axis=0)
    # y_pred_majority = [np.argmax(probabilities) for probabilities in y_pred_weighted]

    # Make predictions using each individual classifier and apply weights
    weighted_predictions = [weights[i] * clf.predict(X_test) for i, clf in enumerate(clf_list)]

    # Perform weighted voting by summing the weighted predictions
    y_pred_weighted = np.sum(weighted_predictions, axis=0)
    y_pred_majority = np.where(y_pred_weighted >= 0.5, 1, 0)

    # Calculate the accuracy score
    accuracy = accuracy_score(y_test, y_pred_majority)

    # Calculate the confusion matrix
    confusion = confusion_matrix(y_test, y_pred_majority)

    # Calculate the AUC score
    auc = roc_auc_score(y_test, y_pred_majority)

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
