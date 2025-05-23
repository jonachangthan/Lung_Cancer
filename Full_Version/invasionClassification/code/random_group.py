import numpy as np

# Define the list of numbers to split
numbers = [i for i in range(1, 61) if i not in [2, 4, 5, 6, 9, 17, 30, 37]]

# Randomly shuffle the list
np.random.shuffle(numbers)

# Split the list into 5 groups
groups = np.array_split(numbers, 5)

# Print the groups
for i, group in enumerate(groups):
    group = sorted(group)
    print(f"Group {i+1}: {group}")
