import numpy as np
import pandas as pd
from scipy.stats import pearsonr  # Import Pearson correlation function

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('features_su.csv')

# Separate the features (X) and labels (y)
X = df.iloc[:, 24:]
y = df['nrrd_filename'].str[-6].astype(int)

# Calculate Pearson correlation coefficients for each feature
correlation_scores = []
for feature in X.columns:
    corr, _ = pearsonr(X[feature], y)
    correlation_scores.append(abs(corr))  # Take the absolute value for feature importance

# Sort features based on correlation scores
feature_indices = np.argsort(correlation_scores)[::-1]  # Sort in descending order
top_k = 1200  # Number of top features to select
selected_feature_indices = feature_indices[:top_k]

# Extract the selected features from X
selected_features = X.columns[selected_feature_indices]

# Create a new DataFrame with selected features and 'nrrd_filename'
selected_data = df[['nrrd_filename'] + list(selected_features)]

# Save the modified DataFrame as a CSV file
selected_data.to_csv('feature_selection/pearson_1200.csv', index=False)
