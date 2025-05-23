import cv2
import numpy as np
import os
from sklearn.model_selection import train_test_split
from skimage.transform import resize

data_path = "D:/Hospital_data/region.txt"
base_image_path = "D:/Hospital_data/hu_-900_400/normalize/"
base_mask_path = "D:/Hospital_data/mask/"
base_nodule_path = "D:/Hospital_data/nodule/total/mask/"
base_blood_vessel_mask_path = "D:/Blood_vessel_recognition/"
save_path = "C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/"

with open(data_path, 'r', encoding='utf-8') as file:
    content = file.read()
    data = content.split('\n')

data = data[14:]

array = np.zeros((60, 2), dtype=np.int16)
k = 0
for i in data:
    if i[:2] == '1.':
        array[k, 0] = int(i[3:].split('~')[1])
    elif i[:2] == '6.':
        array[k, 1] = int(i[3:].split('~')[0])
        k += 1

print(array)

x_data = []
y_data = []
for patient_id in range(51, 61):
    image_path = base_image_path + str(patient_id) + ".npy"
    mask_path = base_mask_path + str(patient_id) + "/"
    nodule_path = base_nodule_path + str(patient_id).zfill(3) + "/"
    blood_vessel_mask_path = base_blood_vessel_mask_path + str(patient_id) + "/"
        
    if os.path.isdir(nodule_path):
        print('\npatient ' + str(patient_id) + ':')
        # if not os.path.isdir(blood_vessel_mask_path): os.mkdir(blood_vessel_mask_path)

        for i in range(len(os.listdir(mask_path))):
            image = np.load(image_path)
            mask = mask_path + str(i + 1).zfill(4) + '.tif'
            nodule = nodule_path + str(i).zfill(4) + '.png'
            blood_vessel_mask = blood_vessel_mask_path + str(i + 1).zfill(4) + '.tif'
                
            if i + 1 > array[patient_id - 1, 0] and i + 1 < array[patient_id - 1, 1]:
                mask = cv2.imread(mask, 0)
                mask = mask / 255
                blood_vessel_mask = cv2.imread(blood_vessel_mask, 0)
                blood_vessel_mask = blood_vessel_mask / 255

                superimpose = image[i] * mask
                superimpose = resize(superimpose, output_shape=(256, 256, 1), preserve_range=True)
                x_data.append(superimpose)

                blood_vessel_mask = resize(blood_vessel_mask, output_shape=(256, 256, 1), preserve_range=True)
                y_data.append(blood_vessel_mask)

"""
x_train, x_val, y_train, y_val = train_test_split(np.array(x_data), np.array(y_data), test_size=0.2)
np.save(save_path + 'train2/' + 'x_train.npy', x_train)
np.save(save_path + 'train2/' + 'y_train.npy', y_train)
np.save(save_path + 'train2/' + 'x_val.npy', x_val)
np.save(save_path + 'train2/' + 'y_val.npy', y_val)
"""
"""
np.save(save_path + 'test2/' + 'x_val.npy', x_data)
np.save(save_path + 'test2/' + 'y_val.npy', y_data)
"""
'''
x_train = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/train1/x_train.npy")
x_val = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/train1/x_val.npy")
y_train = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/train1/y_train.npy")
y_val = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/train1/y_val.npy")
x_test = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/test1/x_val.npy")
y_test = np.load("C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/test1/y_val.npy")
print(len(x_train), len(x_val), len(y_train), len(y_val), len(x_test), len(y_test))
print(x_train[0][x_train[0] > 0])
'''