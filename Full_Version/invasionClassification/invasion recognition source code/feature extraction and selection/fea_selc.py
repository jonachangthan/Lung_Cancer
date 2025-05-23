import pandas as pd
import numpy as np
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_selection import SelectKBest, mutual_info_classif
import json

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('features_su.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 24:]
y = df['nrrd_filename'].str[-6].astype(int)

# Apply min-max scaling to X
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Apply feature selection using chi-square test
selector = SelectKBest(score_func=mutual_info_classif, k=1200)
X_selected = selector.fit_transform(X_scaled, y)

# Get the mask of selected features
feature_mask = selector.get_support()

# Get the names of selected features
selected_features = X.columns[feature_mask]

X = X[selected_features]

# Add the nrrd_filename column to the first column of X
X.insert(0, "nrrd_filename", df['nrrd_filename'])

# Save the modified X as a CSV file
X.to_csv('feature_selection/information_gain_1200.csv', index=False)

