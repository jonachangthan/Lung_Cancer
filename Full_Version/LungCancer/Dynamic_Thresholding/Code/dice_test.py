import cv2
import numpy as np
import os
from cv2 import INTER_AREA
import pandas as pd

#! Dice
def dice(y_true, y_pred):
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    
    union = np.sum(y_true_f) + np.sum(y_pred_f)
    intersection = np.sum(y_true_f * y_pred_f)
    
    if union == 0:
        return 1
    else:
        return 2.0 * intersection / union
    
answer = np.load('C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/data/model5/test/y_val.npy')
print(answer.shape)
df = pd.DataFrame(columns=["image_no", "dice"])
pred_path = "C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/result/model5/"
for i in range(len(os.listdir(pred_path))):
    predict = cv2.imread(pred_path + str(i + 1) + '.tif', 2)
    predict = (predict * 255).astype('uint8')
    predict = cv2.resize(predict, (256,256), interpolation=INTER_AREA)

    final_dice = dice(answer[i], predict/255.)
    df.loc[len(df.index)] = [i + 1, final_dice]

with pd.ExcelWriter(engine='openpyxl', path='C:/Users/user/Desktop/Kevin/Stage1/Lung_Segmentation/UNet/result/result.xlsx', mode='a') as writer:
    df.to_excel(writer, sheet_name='model5', index=False)