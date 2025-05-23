import numpy as np
from sklearn.model_selection import train_test_split
import keras

# Load the stack of vectors
stack = np.load('hu_norm_truth.npy')

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(stack[:, :-1], stack[:, -1], test_size=0.25)

# Create a neural network model
model = keras.models.Sequential([
    keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
    keras.layers.Dense(16, activation='relu'),
    keras.layers.Dense(3, activation='softmax')
])

# Compile the model
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))

# Evaluate the model on the test set
test_loss, test_acc = model.evaluate(X_test, y_test)
print('Test accuracy:', test_acc)
