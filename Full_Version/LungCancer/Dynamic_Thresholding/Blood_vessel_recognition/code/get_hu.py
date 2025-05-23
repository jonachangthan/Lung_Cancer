import numpy as np
import os
import medical_image_preprocessing as mip

base_path = "D:/Hospital_data/dicom/"
save_path = "D:/Hospital_data/hu_-900_400/normalize/"

for patient in range(60):
    patient_path = os.path.join(base_path, str(patient + 1))
    #? if not os.path.isdir(save_path + str(patient + 1)): os.mkdir(save_path + str(patient + 1))
    for i in os.listdir(patient_path):
        dicom_path = os.path.join(patient_path, i)
        patient_slices = mip.load_dicom(dicom_path)
        patient_pixel = mip.get_pixels_hu(patient_slices)
        #? image_resampled, spacing = mip.resample(patient_pixel, patient_slices, [1,1,1])
        

        patient_array = []
        for j in range(len(patient_pixel)):
            normalize_image = mip.normalize(patient_pixel[j], -900, 400)
            min_pixel = np.min(normalize_image)
            normalize_image = normalize_image - min_pixel
            patient_array.append(normalize_image)

        np.save(save_path + str(patient + 1) + '.npy', patient_pixel)

'''
patient1 = np.load("D:/Hospital_data/hu_-900_400/normalize/1.npy")
print(patient1[0][patient1[0] > 0])
'''