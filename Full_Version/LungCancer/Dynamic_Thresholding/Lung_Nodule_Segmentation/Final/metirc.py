import numpy as np
import os
import cv2

#! Dice
def dice(y_true, y_pred):
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    
    union = np.sum(y_true_f) + np.sum(y_pred_f)
    intersection = np.sum(y_true_f * y_pred_f)
    
    if union == 0:
        return 0
    else:
        return 2.0 * intersection / union

#! Coverage
def coverage(y_true, y_pred): 
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    
    intersection = np.sum(y_true_f * y_pred_f)
    
    if np.sum(y_true_f) == 0:
        return 0
    else:
        return intersection / np.sum(y_true_f)

#! Precision
def precision(y_true, y_pred):
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    
    intersection = np.sum(y_true_f * y_pred_f)
    
    if np.sum(y_pred_f) == 0:
        return 0
    else:
        return intersection / np.sum(y_pred_f)

result1_path = "C:/Users/user/Desktop/Lung_Nodule_Segmentation/result1/"
result3_path = "C:/Users/user/Desktop/Lung_Nodule_Segmentation/result3/"
accuracy_path = "D:/Hospital_data/nodule/final/mask/"

result1_more_find = 0
result3_more_find = 0
result1_less_find = 0
result3_less_find = 0
result1_dice = []
result1_coverage = []
result1_precision = []
result1_dice_remove = []
result1_coverage_remove = []
result1_precision_remove = []
result3_dice = []
result3_coverage = []
result3_precision = []
result3_dice_remove = []
result3_coverage_remove = []
result3_precision_remove = []
result1_total = 0
result3_total = 0
accuracy_total = 0
for i in os.listdir(result1_path):
    patient_result1 = result1_path + i + '/'
    patient_result3 = result3_path + i + '/'
    patient_accuracy = accuracy_path + i.zfill(3) + '/'
    for j in os.listdir(patient_result1):
        nodule_result1 = patient_result1 + j + '/'
        nodule_result3 = patient_result3 + j + '/'
        nodule_accuracy = patient_accuracy + j.zfill(3) + '/'
        
        for result1_image in os.listdir(nodule_result1):
            result1 = cv2.imread(nodule_result1 + result1_image, 0)
            result1_total += 1
            if not os.path.isfile(nodule_accuracy + str(int(result1_image[:-4]) - 1).zfill(4) + '.png'):
                result1_more_find += 1
            else:
                accuracy = cv2.imread(nodule_accuracy + str(int(result1_image[:-4]) - 1).zfill(4) + '.png', 0)
                result1_dice_remove.append(dice(accuracy / 255, result1 / 255))
                result1_coverage_remove.append(coverage(accuracy / 255, result1 / 255))
                result1_precision_remove.append(precision(accuracy / 255, result1 / 255))


        for result3_image in os.listdir(nodule_result3):
            result3 = cv2.imread(nodule_result3 + result3_image, 0)
            result3_total += 1 
            if not os.path.isfile(nodule_accuracy + str(int(result3_image[:-4]) - 1).zfill(4) + '.png'):
                result3_more_find += 1
            else:
                accuracy = cv2.imread(nodule_accuracy + str(int(result3_image[:-4]) - 1).zfill(4) + '.png', 0)
                result3_dice_remove.append(dice(accuracy / 255, result3 / 255))
                result3_coverage_remove.append(coverage(accuracy / 255, result3 / 255))
                result3_precision_remove.append(precision(accuracy / 255, result3 / 255))
                
        for accuracy_image in os.listdir(nodule_accuracy):
            accuracy_total += 1
            if not os.path.isfile(nodule_result1 + str(int(accuracy_image[:-4]) + 1).zfill(4) + '.png'):
                result1_less_find += 1
                result1_dice.append(0)
                result1_coverage.append(0)
                result1_precision.append(0)
            else:
                accuracy = cv2.imread(nodule_accuracy + accuracy_image, 0)
                result1 = cv2.imread(nodule_result1 + str(int(accuracy_image[:-4]) + 1).zfill(4) + '.png', 0)
                result1_dice.append(dice(accuracy / 255, result1 / 255))
                result1_coverage.append(coverage(accuracy / 255, result1 / 255))
                result1_precision.append(precision(accuracy / 255, result1 / 255))


            if not os.path.isfile(nodule_result3 + str(int(accuracy_image[:-4]) + 1).zfill(4) + '.png'):
                result3_less_find += 1
                result3_dice.append(0)
                result3_coverage.append(0)
                result3_precision.append(0)
            else:
                accuracy = cv2.imread(nodule_accuracy + accuracy_image, 0)
                result3 = cv2.imread(nodule_result3 + str(int(accuracy_image[:-4]) + 1).zfill(4) + '.png', 0)
                result3_dice.append(dice(accuracy / 255, result3 / 255))
                result3_coverage.append(coverage(accuracy / 255, result3 / 255))
                result3_precision.append(precision(accuracy / 255, result3 / 255))
                
            
print('accuracy_total: ', accuracy_total)

print('result1_total: ', result1_total)
print('result1_more_find: ', result1_more_find)
print('result1_less_find: ', result1_less_find)
print('result1_dice: ', np.mean(result1_dice))
print('result1_coverage: ', np.mean(result1_coverage))
print('result1_precision: ', np.mean(result1_precision))
print('result1_dice_remove: ', np.mean(result1_dice_remove))
print('result1_coverage_remove: ', np.mean(result1_coverage_remove))
print('result1_precision_remove: ', np.mean(result1_precision_remove))

print('result3_total: ', result3_total)
print('result3_more_find: ', result3_more_find)
print('result3_less_find: ', result3_less_find)
print('result3_dice: ', np.mean(result3_dice))
print('result3_coverage: ', np.mean(result3_coverage))
print('result3_precision: ', np.mean(result3_precision))
print('result3_dice_remove: ', np.mean(result3_dice_remove))
print('result3_coverage_remove: ', np.mean(result3_coverage_remove))
print('result3_precision_remove: ', np.mean(result3_precision_remove))