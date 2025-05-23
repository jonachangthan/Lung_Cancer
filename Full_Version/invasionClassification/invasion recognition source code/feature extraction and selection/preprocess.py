import json
import os
import numpy as np
import pydicom
import nrrd
import cv2

with open("pyradiomic/mainTumor.json", "r") as file:
    tumor = json.load(file)

tumor_mask_path = r"data\Tumor_mask"
dicom_path = r"data\Hospital_data\dicom"

nrrd_ct_save_path = r"data\nrrd\ct"
nrrd_mask_save_path = r"data\nrrd\mask"

grouped_data = {}

for tumor_data in tumor:
    patientID = tumor_data['patientID']
    num = tumor_data['num']
    
    # Check if a group exists for the patientID and num combination
    group_key = (patientID, num)
    if group_key not in grouped_data:
        grouped_data[group_key] = []

    # Append the tumor data to the corresponding group
    grouped_data[group_key].append(tumor_data)

# Process each group of tumor data
for group_key, group_data in grouped_data.items():
    patientID, num = group_key
    invasion = group_data[0]['invasion']
    file_name_list = []
    dicom_file_name_list = []

    for tumor_data in group_data:
        file_name_list.append(tumor_data['filename'])
        dicom_file_name_list.append(int(tumor_data['filename'][:-4]) + 1)

    tumor_mask_files = os.path.join(tumor_mask_path, patientID, str(num).zfill(3))
    patient_ct_path = os.path.join(dicom_path, str(int(patientID)), os.listdir(os.path.join(dicom_path, str(int(patientID))))[0])
    dicom_files = os.listdir(patient_ct_path)

    # Load DICOM series and extract relevant slices
    slices = []
    for dicom_file in sorted(dicom_files):
        if int(dicom_file[3:-4]) in dicom_file_name_list:
            ds = pydicom.dcmread(os.path.join(patient_ct_path, dicom_file))
            slices.append(ds.pixel_array)

    # Convert slices to a 3D array
    volume = np.stack(slices, axis=0)

    # Create a binary mask from the tumor mask images
    mask_slices = []
    for mask_filename in file_name_list:
        tumor_mask_file = os.path.join(tumor_mask_files, mask_filename)
        mask_image = cv2.imread(tumor_mask_file, cv2.IMREAD_GRAYSCALE)
        mask_slices.append(mask_image)

    # Convert mask slices to a 3D array
    mask_volume = np.stack(mask_slices, axis=0)
    mask_volume = (mask_volume > 0).astype(np.uint8)

    # Save the DICOM volume as .nrrd file with invasion value in the filename
    nrrd_ct_save_file = os.path.join(nrrd_ct_save_path, f"{patientID}_{num}_{invasion}.nrrd")
    nrrd.write(nrrd_ct_save_file, volume)

    # Save the mask volume as .nrrd file with invasion value in the filename
    nrrd_mask_save_file = os.path.join(nrrd_mask_save_path, f"{patientID}_{num}_{invasion}.nrrd")
    nrrd.write(nrrd_mask_save_file, mask_volume)
