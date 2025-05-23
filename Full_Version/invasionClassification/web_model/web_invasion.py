from __future__ import print_function
import six
import csv
import os
from radiomics import featureextractor
import json
import SimpleITK as sitk
from PIL import Image
import numpy as np
import pydicom
import cv2
import nrrd
import joblib
from collections import Counter


# Specify the file path
file_path = "./sel_fea.json"

# Load the list from the JSON file
with open(file_path, 'r') as file:
    selected_feature_name = json.load(file)

dicomPath = "./test/dicom/"
maskPath = "./test/mask/"

slices = []
for file in os.listdir(dicomPath):
    ds = pydicom.dcmread(dicomPath + file)
    dicom = ds.pixel_array
    slices.append(dicom)
    volume = np.stack(slices, axis=0)
    nrrd.write('./dicom.nrrd', volume)

mask_slices = []
for file in os.listdir(maskPath):
    mask_image = cv2.imread(maskPath + file, cv2.IMREAD_GRAYSCALE)
    mask_slices.append(mask_image)
    mask_volume = np.stack(mask_slices, axis=0)
    mask_volume = (mask_volume > 0).astype(np.uint8)
    nrrd.write('./mask.nrrd', mask_volume)

# Create an empty list to store the extracted features
features = []

extractor = featureextractor.RadiomicsFeatureExtractor()
extractor.enableAllFeatures()
extractor.enableAllImageTypes()

result = extractor.execute('./dicom.nrrd', './mask.nrrd')

# Append the extracted features to the list
features.append(result)

# save the selected features
sel_features = []
for feature in features:
    sel_features.append({k: feature[k] for k in selected_feature_name})

loaded_classifiers = []
for i in range(1, 6):  
    clf = joblib.load(f'./su_model_{i}.joblib')
    loaded_classifiers.append(clf)


# Iterate through the list of dictionaries and make predictions for each set of features
for selected_features_dict in sel_features:
    # Extract feature values from the dictionary and convert to a numpy array
    selected_features_values = [selected_features_dict[key] for key in selected_features_dict]
    selected_features_array = np.array(selected_features_values).reshape(1, -1)

# print(selected_features_array)
# Make predictions using each individual classifier
predictions = [clf.predict(selected_features_array) for clf in loaded_classifiers]

# Flatten the list of arrays
flat_list = [item[0] for item in predictions]

# Count the occurrences of each number
counter = Counter(flat_list)

# Find the most common number (majority)
majority_number = counter.most_common(1)[0][0]

print(int(majority_number))