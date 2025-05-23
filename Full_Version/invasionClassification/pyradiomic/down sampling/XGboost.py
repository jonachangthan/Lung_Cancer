import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import MinMaxScaler

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('pyradiomic/features.csv')

# Separate invasion and non-invasion samples
invasion_samples = df[df['nrrd_filename'].str[-6] == "1"]
non_invasion_samples = df[df['nrrd_filename'].str[-6] == "0"]

# Determine the minority class and its count
minority_class = invasion_samples if len(invasion_samples) < len(non_invasion_samples) else non_invasion_samples
minority_count = len(minority_class)

# Randomly sample the majority class to match the count of the minority class
majority_class = non_invasion_samples if minority_class is invasion_samples else invasion_samples
majority_sampled = majority_class.sample(n=minority_count)

# Combine the balanced invasion and non-invasion samples into a new DataFrame
balanced_data = pd.concat([minority_class, majority_sampled])

# Shuffle the new DataFrame randomly
balanced_data = shuffle(balanced_data)

# Split the shuffled data into features (X) and labels (y)
X = balanced_data.iloc[:, 24:]
y = balanced_data['nrrd_filename'].str[-6].astype(int)

# Normalize the features using Min-Max scaling
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(X)

# Define the best parameters obtained from the grid search
best_params = {
    'learning_rate': 0.1,
    'n_estimators': 100,
    'max_depth': 3,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'gamma': 0
}

# Create an instance of the XGBClassifier with the best parameters
clf = XGBClassifier(**best_params)

accuracy_scores = []  # List to store accuracy scores for each fold

# Perform cross-validation with stratified k-fold
skf = StratifiedKFold(n_splits=5)
for train_index, test_index in skf.split(X_normalized, y):
    X_train, X_test = X_normalized[train_index], X_normalized[test_index]
    y_train, y_test = y.iloc[train_index], y.iloc[test_index]
    
    # Train the XGBoost classifier
    
    clf.fit(X_train, y_train)
    
    # Evaluate the classifier on the test set
    accuracy = clf.score(X_test, y_test)
    accuracy_scores.append(accuracy)
    print("Accuracy:", accuracy)

# Calculate the average accuracy across all folds
average_accuracy = np.mean(accuracy_scores)

print("Average Accuracy:", average_accuracy)
