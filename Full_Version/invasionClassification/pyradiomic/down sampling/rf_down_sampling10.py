import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.ensemble import RandomForestClassifier


num=4123
print(num)

df = pd.read_csv('features_su.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 24:]
y = df['nrrd_filename'].str[-6].astype(int)

accuracy10 = []
auc10 = []
sensitivity10 = []
specificity10 = []

for i in range(1, 11):
    accuracy_scores = []
    confusion_matrices = []
    auc_scores = []
    sensitivity_scores = []
    specificity_scores = []

    # Perform cross-validation with stratified k-fold
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=num)
    for train_index, test_index in skf.split(X, y):
        X_train, X_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

        X_train_p = X_train[y_train == 1]
        X_train_n = X_train[y_train == 0]

        inner_X_train_p = X_train_p.sample(n=24, replace=False, axis=0)

        inner_X_train = pd.concat([inner_X_train_p, X_train_n], axis=0)

        inner_y_train = np.concatenate((np.ones(24), np.zeros(24)), axis=0)

        inner_X_train, inner_y_train = shuffle(inner_X_train, inner_y_train, random_state=num)
        
        # Train the random forest classifier
        clf = RandomForestClassifier()
        clf.fit(inner_X_train, inner_y_train)
        
        # Predict labels for the test data
        y_pred = clf.predict(X_test)

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
    print("========", i, "========")
    print("Average Accuracy:", average_accuracy)
    print("Average AUC:", average_auc)
    print("Average Sensitivity:", average_sensitivity)
    print("Average Specificity:", average_specificity)
    # print("Total Confusion Matrix:")
    # print(total_confusion_matrix)
    accuracy10.append(average_accuracy)
    auc10.append(average_auc)
    sensitivity10.append(average_sensitivity)
    specificity10.append(average_specificity)
    print("========", i, "========")

print("======== total ========")
print("10 average Accuracy:", np.mean(accuracy10))
print("10 Average AUC:", np.mean(auc10))
print("10 Average Sensitivity:", np.mean(sensitivity10))
print("10 Average Specificity:", np.mean(specificity10))
