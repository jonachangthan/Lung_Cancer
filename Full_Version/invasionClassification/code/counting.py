import numpy as np
import pydicom
from PIL import Image
import os
from matplotlib import pyplot as plt

# Define a list of numbers to skip
skip_numbers = [2, 4, 5, 6, 9, 17, 30, 37, 67, 76, 79, 81, 98, 143, 152, 157, 169, 177, 182, 183]

# Set the path to the directory containing the mask files
lung_mask_path = "D:/lung_project/Section2/data/Hospital_data/lung_mask"
nodule_mask_path = "D:/lung_project/Section2/data/Lung_nodule/total/mask"
vessel_mask_path = "D:/lung_project/Section2/data/Blood_vessel_recognition"

# sum
sum_lung = 0
sum_vessel = 0
sum_nodule = 0

for i in range(1, 61):

    # Skip the current iteration if the number is in the skip list
    if i in skip_numbers:
        continue

    # Get the file path of the current mask file
    lung_mask_file_path = os.path.join(lung_mask_path, str(i))
    lung_mask_files = sorted([f for f in os.listdir(lung_mask_file_path)])

    nodule_mask_file_path = os.path.join(nodule_mask_path, str(i).zfill(3))
    nodule_mask_files = sorted([f for f in os.listdir(nodule_mask_file_path)])

    vessel_mask_file_path = os.path.join(vessel_mask_path, str(i))
    vessel_mask_files = sorted([f for f in os.listdir(vessel_mask_file_path)])

    for lung_mask_file, nodule_mask_file, vessel_mask_file in zip(lung_mask_files, nodule_mask_files, vessel_mask_files):
        
        # Load the mask file using NumPy
        lung_mask = np.array(Image.open(os.path.join(lung_mask_file_path, lung_mask_file)).convert('L'), dtype=np.uint8)
        nodule_mask = np.array(Image.open(os.path.join(nodule_mask_file_path, nodule_mask_file)).convert('L'), dtype=np.uint8)
        vessel_mask = np.array(Image.open(os.path.join(vessel_mask_file_path, vessel_mask_file)).convert('L'), dtype=np.uint8)

        # calculate the image which contain nodules
        if np.sum(nodule_mask) == 0:
            continue

        for row in range(nodule_mask.shape[0]):
            for col in range(nodule_mask.shape[1]):

                if nodule_mask[row, col] == 255:
                    sum_nodule += 1
                elif vessel_mask[row, col] == 255:
                    sum_vessel += 1
                elif lung_mask[row, col] == 255:
                    sum_lung += 1

print(sum_nodule, sum_vessel, sum_lung)
