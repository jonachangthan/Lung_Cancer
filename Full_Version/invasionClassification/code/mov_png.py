import os
import shutil

# Define a list of numbers to skip
skip_numbers = [2, 4, 5, 6, 9, 17, 30, 37, 67, 76, 79, 81, 98, 143, 152, 157, 169, 177, 182, 183]


for i in range(1, 121):

    # Skip the current iteration if the number is in the skip list
    if i in skip_numbers:
        continue

    # Define the source and destination directories
    source_dir = 'data/mask1_120/' + str(i).zfill(3)

    dest_dir = 'D:/lung_project/Section2/data/Lung_nodule/total/mask/' + str(i).zfill(3)

    # Loop through all files in the source directory
    for filename in os.listdir(source_dir):
        if filename.endswith('.png'):  # Check if the file is a PNG file
            src_file = os.path.join(source_dir, filename)
            dest_file = os.path.join(dest_dir, filename)
            shutil.move(src_file, dest_file)  # Move the file to the destination directory
