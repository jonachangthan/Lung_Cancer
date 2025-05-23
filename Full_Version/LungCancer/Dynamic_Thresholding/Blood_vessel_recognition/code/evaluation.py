import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, accuracy_score
from tensorflow.keras import models
import cv2
from cv2 import INTER_AREA
import os

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
全部取樣
"""
def all_sample(x_val, y_val, preds):
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
        cv2.imwrite("C:/Users/user/Desktop/Blood_vessel_recognition/result/HU/2/" + str(i + 1).zfill(4) + ".tif", image)
    

model = models.load_model('C:/Users/user/Desktop/Blood_vessel_recognition/model/HU/model2.h5')

x_val = np.load('C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/test2/x_val.npy')
y_val = np.load('C:/Users/user/Desktop/Blood_vessel_recognition/data/HU/test2/y_val.npy')

preds = model.predict(x_val)
preds[preds >= 0.5] = 1.0
preds[preds < 0.5] = 0.0

# print(np.round(dice_coef_test(y_val, preds), decimals=3)) #overall dice

all_sample(x_val, y_val, preds)
