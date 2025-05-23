import numpy as np
import pandas as pd
import cv2
import os
from level_set.Main import main

#! 調整窗值
def windowing(image, level, width):
    window_min = level - width / 2 # 若低於下界 -> 黑色
    window_max = level + width / 2 # 若超過上界 -> 白色

    image = 255.0 * (image - window_min) / (window_max - window_min)
        
    image[image < 0] = 0
    image[image > 255] = 255 

    image = image - image.min()
    factor = float(255) / image.max()
    image = image * factor
    
    return image.astype(np.uint8)

#! pixel轉hu
def get_pixels_hu(image, slope=1, intercept=-1024):
    image = image.astype(np.int16)
        
    if slope != 1:
        image = slope * image.astype(np.float64)
        image = image.astype(np.int16)
            
    image += np.int16(intercept)
    
    return np.array(image, dtype=np.int16)

#! 取得肺結半徑
def get_radius(image_path, mask_path, nodule):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    image = windowing(gray_image, -600, 1600)
    mask = cv2.imread(mask_path, 0)
    
    #? image = cv2.bitwise_and(image, mask)

    ret, binary = cv2.threshold(image, 45, 255, cv2.THRESH_BINARY)

    coordinate_x = nodule[0]
    coordinate_y = nodule[1]
    final_radius = 0
    for radius in range(3, 20):
        area = binary[coordinate_y - radius : coordinate_y + radius, coordinate_x - radius : coordinate_x + radius]
        final_radius = radius
        if np.sum(np.where(area == 255, 1, 0)) / ((radius * 2) ** 2) < 0.75: # np.where(condition, true, false)
            break
        
    
    return final_radius

#! 取得醫生點選肺結位置
def find_coordinate(patient_index, nodule_path):
    nodule_information = pd.read_csv(nodule_path)
    patient_nodule_coordinate = nodule_information[nodule_information['patientID'] == patient_index].reindex(columns=['cordX', 'cordY', 'filename']).values
    
    patient_nodule_coordinate[:, 2] += 1 # z + 1
    
    return patient_nodule_coordinate

#! 肺結範圍
def label_nodule(original_path, mask_path, nodule_path, coordinate):
    start = coordinate[2]
    radius = coordinate[3]
    print('Start from', start)
    print(coordinate)
    
    with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
        file.write('[image ' + str(start) + ']\n')
        file.write('coordinate_x: ' + str(coordinate[0]) + '\n')
        file.write('coordinate_y: ' + str(coordinate[1]) + '\n')
    
    original_path = original_path + str(start).zfill(4) + '.tif'
    mask_path = mask_path + str(start).zfill(4) + '.tif'
    nodule_path = nodule_path + str(start).zfill(4) + '.tif'

    image = cv2.imread(original_path, 0)
    mask = cv2.imread(mask_path, 0)
    nodule_image = cv2.imread(nodule_path)
    
    #TODO: level-set找肺結區域
    not_found = 0
    #* 若點位於lung mask內
    if mask[coordinate[1], coordinate[0]] == 255:
        print('--- In Lung mask ---')
        with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
            file.write('--- In Lung mask ---\n')
            
        for step in range(2):
            #* 原圖
            if step == 0: 
                windowing_image = windowing(image, -600, 1600)
                windowing_image[windowing_image < 45] = 0
                windowing_image = cv2.bitwise_and(windowing_image, mask)
                
                coordinate_region = main(windowing_image, coordinate[0], coordinate[1], radius)
                
                #* 判斷有無肺結區域
                if len(coordinate_region):
                    break
                else:
                    not_found += 1
            #* 二值化
            elif step == 1:
                windowing_image = windowing(image, -600, 1600)
                ret, windowing_image = cv2.threshold(windowing_image, 45, 255, cv2.THRESH_BINARY)
                windowing_image = cv2.bitwise_and(windowing_image, mask)
                
                coordinate_region = main(windowing_image, coordinate[0], coordinate[1], radius)
                
                #* 判斷有無延續肺結
                if len(coordinate_region):
                    break
                else:
                    not_found += 1
    #* 若點位於lung mask外
    else:
        print('--- Not in Lung mask ---')
        with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
            file.write('--- Not in Lung mask ---\n')
            
        for step in range(2):
            #* 原圖
            if step == 0: 
                windowing_image = windowing(image, -600, 1600)
                windowing_image[windowing_image < 45] = 0
                
                coordinate_region = main(windowing_image, coordinate[0], coordinate[1], radius)
                
                #* 判斷有無肺結區域
                if len(coordinate_region):
                    break
                else:
                    not_found += 1
            #* 二值化
            elif step == 1:
                windowing_image = windowing(image, -600, 1600)
                ret, windowing_image = cv2.threshold(windowing_image, 45, 255, cv2.THRESH_BINARY)
                
                coordinate_region = main(windowing_image, coordinate[0], coordinate[1], radius)
                
                #* 判斷有無延續肺結
                if len(coordinate_region):
                    break
                else:
                    not_found += 1
    
    #* nodule mask
    print(not_found)
    if not_found == 2:
        print('*** Not found! ***')
        with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
            file.write('[ ' + str(not_found) + ' ]\n')
            file.write('*** Not found! ***\n\n')
    else:
        for i in coordinate_region:
            nodule_image[i[0], i[1]] = 255
        
        #* 資訊存檔
        with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
            file.write('[ ' + str(not_found) + ' ]\n')
            file.write('radius: ' + str(radius) + '\n\n')
    
    #? cv2.imshow('Start' + str(start), nodule_image)
    nodule_image = cv2.cvtColor(nodule_image, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(nodule_path, nodule_image)

    #? cv2.waitKey()
    #? cv2.destroyAllWindows()

#! 計算資料夾內檔案總數
def file_num(file_path):
    num = 0
    for file in os.listdir(file_path):
        if os.path.isfile(os.path.join(file_path, file)):
            num += 1
    return num

#! 初始化圖(全黑)
def initial(save_path):
    initial_array = np.zeros((512, 512), np.uint8)
    cv2.imwrite(save_path, initial_array)

#! 分割結果
def dice(y_true, y_pred):
    y_true_f = y_true.flatten()
    y_pred_f = y_pred.flatten()
    union = np.sum(y_true_f) + np.sum(y_pred_f)
    if union == 0:
        return 0
    intersection = np.sum(y_true_f * y_pred_f)
    return 2.0 * intersection / union

#! 主函式
def total_main():
    base_path = "C:/Users/user/Desktop/Kevin/Stage1/Hospital_data/"
    nodule_csv_path = base_path + "nodules.csv"

    for patient_id in range(1, 201):
        if os.path.isdir("C:/Users/user/Desktop/partial/" + str(patient_id).zfill(3) + "/"):
            #* 資訊存檔
            with open("C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/result/level_set_partial3.txt", 'a+') as file:
                file.write('\npatient ' + str(patient_id) + ':\n')
            
            print('\npatient ' + str(patient_id) + ':')
            
            image_path = base_path + "image/" + str(patient_id) + "/"
            mask_path = base_path + "mask/" + str(patient_id) + "/"
            nodule_path = "C:/Users/user/Desktop/Kevin/Stage1/Lung_Nodule_Segmentation/levelset_nodule_partial3/" + str(patient_id) + "/"
            if not os.path.isdir(nodule_path): os.mkdir(nodule_path)
            
            #* 取得醫生點選肺結位置
            nodules_coordinate = find_coordinate(patient_id, nodule_csv_path)
            nodules_coordinate = nodules_coordinate.tolist()
            
            for i in range(len(nodules_coordinate)):
                image_name = str(nodules_coordinate[i][2]).zfill(4) + '.tif'
                
                #* 初始化nodule圖
                if not os.path.isfile(nodule_path + image_name):
                    initial(nodule_path + image_name)
                
                #* 估計初始範圍半徑
                radius = get_radius(image_path + image_name, mask_path + image_name, nodules_coordinate[i])
                nodules_coordinate[i].append(radius)
                #? print(nodules_coordinate[i])
                
                #* 肺結範圍
                label_nodule(image_path, mask_path, nodule_path, nodules_coordinate[i])
            
total_main()