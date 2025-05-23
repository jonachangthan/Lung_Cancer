from __future__ import print_function
import six
import csv
import os
from radiomics import featureextractor

imagePath = r'data\nrrd\ct'
maskPath = r'data\nrrd\mask'
paramPath = r'pyradiomic\paramSchema.yaml'
outputPath = r'pyradiomic\features.csv'  # Specify the path where you want to save the CSV file

nrrd_files = os.listdir(imagePath)

# Create an empty list to store the extracted features
features = []

for file in nrrd_files:
    extractor = featureextractor.RadiomicsFeatureExtractor()
    extractor.enableAllFeatures()
    extractor.enableAllImageTypes()

    result = extractor.execute(os.path.join(imagePath, file), os.path.join(maskPath, file))
    
    # Append the filename to the result dictionary
    result['nrrd_filename'] = file
    
    # Append the extracted features to the list
    features.append(result)

# Save the extracted features to a CSV file
with open(outputPath, 'w', newline='') as csvfile:
    fieldnames = ['nrrd_filename'] + list(features[0].keys())  # Include 'filename' as the first column
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(features)
