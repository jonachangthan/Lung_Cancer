import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, accuracy_score
from tensorflow.keras import models
import cv2
from cv2 import INTER_AREA
import os
import tensorflow as tf
import tensorflow.keras.backend as K

def dice_coef(y_true, y_pred, smooth=1):
    y_true_f = K.flatten(y_true)
    y_pred_f = K.flatten(y_pred)
    
    union = K.sum(y_true_f) + K.sum(y_pred_f)
    intersection = K.sum(y_true_f * y_pred_f)
    
    dice = (2.0 * intersection + smooth) / (union + smooth)

    return dice

def dice_coef_loss(y_true, y_pred):
    return 1 - dice_coef(y_true, y_pred)

"""
dice(ground truth)
"""
def dice_coef_test(y_true, y_pred):
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    union = np.sum(y_true_f) + np.sum(y_pred_f)
    if union == 0: return 1
    intersection = np.sum(y_true_f * y_pred_f)
    return 2. * intersection / union

"""
隨機取樣
"""
def random_sample(x_val, y_val, preds, patient_index):
    
    all_ind = [5, 15, 30, 45, 60] # random samples [5, 15, 30, 45, 60]
    all_ind = np.array(all_ind)

    fig, ax = plt.subplots(5, 3, figsize=(20, 15))
    for i in range(len(all_ind)):
        #pred = (pred > 0.5).astype(np.uint8).reshape(IMAGE_H, IMAGE_W)
        ax[i, 0].imshow(np.uint16(x_val[all_ind[i]].squeeze()), cmap="gray")
        ax[i, 1].imshow(y_val[all_ind[i]].squeeze(), cmap='gray')
        ax[i, 2].imshow(preds[all_ind[i]].squeeze(), cmap='gray')
        #ax[i, 3].text(0.5, 0.5, str(np.round(dice_coef_test(y_val[all_ind[i]], preds[all_ind[i]]), decimals=3)), fontsize=20, ha='center')
    plt.savefig('C:/Users/user/Desktop/Kevin/lung_segmentation/result/41_5.png')

    for i in range(5):
        image = preds[all_ind[i]].squeeze()
        image = cv2.resize(image, (512,512), interpolation=INTER_AREA)
        cv2.imwrite("C:/Users/user/Desktop/Kevin/lung_segmentation/result/" + str(patient_index) + "/" + str(i + 1) + ".tif", image)

"""
全部取樣
"""
def all_sample(x_val, preds, save_path):
    '''
    fig, ax = plt.subplots(len(x_val), 3, figsize=(5, 50))
    for i, pred in enumerate(preds):
        #pred = (pred > 0.5).astype(np.uint8).reshape(IMAGE_H, IMAGE_W)
        ax[i, 0].imshow(np.uint16(x_val[i].squeeze()), cmap="gray")
        ax[i, 1].imshow(y_val[i].squeeze(), cmap='gray')
        ax[i, 2].imshow(pred.squeeze(), cmap='gray')
        #ax[i, 3].text(0.5, 0.5, str(np.round(dice_coef_test(y_val[i], pred), decimals=3)), fontsize=20, ha='center')
    plt.savefig('C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/result/model1/1.png')
    '''
    for i, pred in enumerate(preds):
        #print(np.round(dice_coef_test(y_val[i], pred), decimals=3))
        image = pred.squeeze()
        image = cv2.resize(image, (512,512), interpolation=INTER_AREA)
        image = (image * 255).astype('uint8')
        cv2.imwrite(save_path + str(i + 1).zfill(4) + ".tif", image)

'''
x_val = np.load('C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/data/model5/test/x_val.npy')
y_val = np.load('C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/data/model5/test/y_val.npy')

preds = model.predict(x_val)
preds[preds >= 0.5] = 1.0
preds[preds < 0.5] = 0.0

# print(np.round(dice_coef_test(y_val, preds), decimals=3)) #overall dice

all_sample(x_val, y_val, preds)
'''
'''
for i in range(5):
    patient_index = i + 1
    print(patient_index)

    model = models.load_model('C:/Users/user/Desktop/Kevin/lung_nodule_segmentation/model/model' + str(patient_index) + '.h5')

    x_val = np.load('C:/Users/user/Desktop/Kevin/lung_nodule_segmentation/data/model' + str(patient_index) + '/test/x_val.npy')
    y_val = np.load('C:/Users/user/Desktop/Kevin/lung_nodule_segmentation/data/model' + str(patient_index) + '/test/y_val.npy')
    
    save_path = 'C:/Users/user/Desktop/Kevin/lung_nodule_segmentation/result/model' + str(patient_index) + '/'
    if not os.path.isdir(save_path): os.mkdir(save_path)

    preds = model.predict(x_val)
    preds[preds >= 0.5] = 1.0
    preds[preds < 0.5] = 0.0

    print(np.round(dice_coef_test(y_val, preds), decimals=3)) # overall dice

    all_sample(x_val, preds, save_path)
'''

test_data_path = "C:/Users/user/Desktop/Supervised_ResUNet/data/test/"
for i in os.listdir(test_data_path):
    test_data = test_data_path + i + "/"

    model = models.load_model('C:/Users/user/Desktop/Supervised_ResUNet/model/model4.h5', custom_objects={"dice_coef_loss":dice_coef_loss, "dice_coef": dice_coef})

    x_val = np.load(test_data + 'x_val.npy')
    y_val = np.load(test_data + 'y_val.npy')
    
    save_path = 'C:/Users/user/Desktop/Supervised_ResUNet/result/4/' + i + '/'
    if not os.path.isdir(save_path): os.mkdir(save_path)

    preds = model.predict(x_val)
    preds[preds >= 0.5] = 1.0
    preds[preds < 0.5] = 0.0

    print(np.round(dice_coef_test(y_val, preds), decimals=3)) # overall dice

    all_sample(x_val, preds, save_path)
