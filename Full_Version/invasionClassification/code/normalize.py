import numpy as np
import pydicom
from PIL import Image
import os
from matplotlib import pyplot as plt

def min_max_normalize(arr):
    min_val = np.ma.min(arr)
    max_val = np.ma.max(arr)
    normalized = (arr - min_val) / (max_val - min_val)
    return normalized

def l1_normalize(arr):
    normalized = arr / np.ma.sum(np.ma.abs(arr))
    return normalized

def l2_normalize(arr):
    normalized = arr / np.sqrt(np.ma.sum(masked_hu ** 2))
    return normalized

def zscore_normalize(arr):
    mean = np.ma.mean(arr)
    std = np.ma.std(arr)
    normalized = (arr - mean) / std
    return normalized

# Define a list of numbers to skip
skip_numbers = [2, 4, 5, 6, 9, 17, 30, 37, 67, 76, 79, 81, 98, 143, 152, 157, 169, 177, 182, 183]

# Set the path to the directory containing the DICOM files
dicom_path = "D:/lung_project/Section2/data/Hospital_data/dicom"

# Set the path to the directory containing the mask files
lung_mask_path = "D:/lung_project/Section2/data/Hospital_data/lung_mask"
nodule_mask_path = "D:/lung_project/Section2/data/Lung_nodule/total/mask"

# Set save path
save_path = "D:/lung_project/Section2/data/normalized"


for i in range(1, 61):

    # Skip the current iteration if the number is in the skip list
    if i in skip_numbers:
        continue

    # create a dir

    # Get the file path of the current DICOM file
    dicom_file_path = os.path.join(dicom_path, str(i))
    dicom_file_path = os.path.join(dicom_file_path, str(os.listdir(dicom_file_path)[0]))

    dcm_files = sorted([f for f in os.listdir(dicom_file_path) if f.endswith('.dcm')])

    # Get the file path of the current mask file
    lung_mask_file_path = os.path.join(lung_mask_path, str(i))
    lung_mask_files = sorted([f for f in os.listdir(lung_mask_file_path)])

    nodule_mask_file_path = os.path.join(nodule_mask_path, str(i).zfill(3))
    nodule_mask_files = sorted([f for f in os.listdir(nodule_mask_file_path)])
    
    for dcm_file, lung_mask_file, nodule_mask_file in zip(dcm_files, lung_mask_files, nodule_mask_files):
    
        # Load the DICOM file
        dcm = pydicom.dcmread(os.path.join(dicom_file_path, dcm_file))

        # Extract the pixel array and convert to HU values
        pixel_array = dcm.pixel_array
        slope = dcm.RescaleSlope
        intercept = dcm.RescaleIntercept
        hu_values = slope * pixel_array + intercept
        
        # Load the mask file using NumPy
        lung_mask = np.array(Image.open(os.path.join(lung_mask_file_path, lung_mask_file)).convert('L'), dtype=np.uint8)
        nodule_mask = np.array(Image.open(os.path.join(nodule_mask_file_path, nodule_mask_file)).convert('L'), dtype=np.uint8)

        # calculate the image which contain nodules
        if np.sum(nodule_mask) == 0:
            continue

        # only calculate the lung_mask
        lung_mask = np.where(lung_mask == 255, True, False)
        masked_hu = np.ma.masked_array(hu_values, mask=~lung_mask)

        # calculate
        min_max = min_max_normalize(masked_hu)
        l1 = l1_normalize(masked_hu)
        l2 = l2_normalize(masked_hu)
        zscore = zscore_normalize(masked_hu)

        # create directories
        np_dir = os.path.join(save_path, str(i).zfill(3))
        mh_dir = os.path.join(np_dir, 'masked_hu')
        minmax_dir = os.path.join(np_dir, 'min_max')
        l1_dir = os.path.join(np_dir, 'l1')
        l2_dir = os.path.join(np_dir, 'l2')
        zscore_dir = os.path.join(np_dir, 'zscore')
        os.makedirs(mh_dir, exist_ok=True)
        os.makedirs(minmax_dir, exist_ok=True)
        os.makedirs(l1_dir, exist_ok=True)
        os.makedirs(l2_dir, exist_ok=True)
        os.makedirs(zscore_dir, exist_ok=True)

        # save results
        filename = nodule_mask_file[:-4]
        np.save(os.path.join(mh_dir, filename + '.npy'), masked_hu.filled(fill_value=np.nan))
        np.save(os.path.join(minmax_dir, filename + '.npy'), min_max.filled(fill_value=np.nan))
        np.save(os.path.join(l1_dir, filename + '.npy'), l1.filled(fill_value=np.nan))
        np.save(os.path.join(l2_dir, filename + '.npy'), l2.filled(fill_value=np.nan))
        np.save(os.path.join(zscore_dir, filename + '.npy'), zscore.filled(fill_value=np.nan))