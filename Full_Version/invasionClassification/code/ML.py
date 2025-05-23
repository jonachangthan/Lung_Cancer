import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from xgboost import XGBClassifier
from sklearn.metrics import confusion_matrix

# Load the stack of vectors
stack = np.load('hu_norm_truth.npy')

# Split the data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(stack[:, :5], stack[:, 5], test_size=0.25, random_state=42)

# Train and evaluate a KNN model
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)
knn_pred = knn.predict(X_test)
knn_cm = confusion_matrix(y_test, knn_pred)
print("KNN Confusion Matrix:")
print(knn_cm)

# Train and evaluate an XGBoost model
xgb = XGBClassifier()
xgb.fit(X_train, y_train)
xgb_pred = xgb.predict(X_test)
xgb_cm = confusion_matrix(y_test, xgb_pred)
print("XGBoost Confusion Matrix:")
print(xgb_cm)
