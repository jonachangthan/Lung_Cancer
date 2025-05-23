import numpy as np
import cv2
import os
import sys

patientID = sys.argv[1]
filename = sys.argv[2]
cordX = sys.argv[3]
cordY = sys.argv[4]

segmentation = "public/final/2/"+str(int(patientID))+"/"+ str(int(filename)+1)+".png"

path = "public/"+patientID+"/"+filename+".png"
list = [[int(cordX), int(cordY)]]

def label_nodule(img_path, coordinate):

    coordinate = np.array(coordinate)
    #讀入圖片
    img = cv2.imread(img_path)

    copy_img = img.copy()

    segmentation_image = cv2.imread(segmentation)

    
    #轉成灰度圖
    superimpose_image = cv2.bitwise_and(img, segmentation_image)

    gray = cv2.cvtColor(superimpose_image, cv2.COLOR_BGR2GRAY)

    #印出原始影像
    cv2.imshow('Original', gray)

    #高斯濾波、除噪
    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    #二值化
    ret, binary = cv2.threshold(blur, 63, 255, cv2.THRESH_BINARY)
    '''
    #影像膨脹
    kernel2 = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)) #定義結構元素用於捲積
    bin_clo = cv2.dilate(binary, kernel2, iterations=2)
    '''
    #連通域分析
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary, connectivity=8) #4連通
    '''
    #num_labels: 連通域數目
    print('num_labels = ', num_labels)
    #labels: 像素的標記
    print('labels = ', labels)
    #stats: 標記的統計訊息，n*5矩陣，x、y、width、height、面積
    print('stats = ', stats)
    #centroids: 連通域中心點
    print('centroids = ', centroids)
    '''

    #不同連通域賦予不同元素(隨機三原色)
    total = np.zeros((img.shape[0], img.shape[1], 3), np.uint8)
    for i in range(1, num_labels):
        mask = labels == i
        total[:, :, 0][mask] = np.random.randint(0, 255)
        total[:, :, 1][mask] = np.random.randint(0, 255)
        total[:, :, 2][mask] = np.random.randint(0, 255)

    #cv2.imshow('All Labels', total)

    #找出特定座標點之連通域
    target = np.zeros((img.shape[0], img.shape[1], 3), np.uint8)
    for i in range(coordinate.shape[0]):
        if labels[coordinate[i][1], coordinate[i][0]] == 0:
            cv2.circle(target, (coordinate[i][0],coordinate[i][1]), 5, (0,0,255), 1)
        elif labels[coordinate[i][1], coordinate[i][0]] == 1:
            cv2.rectangle(target, (coordinate[i][0]-5,coordinate[i][1]-5), (coordinate[i][0]+5,coordinate[i][1]+5), (0,0,255), -1)
        else:
            mask = labels == labels[coordinate[i][1], coordinate[i][0]]
            target[:, :, 0][mask] = 0
            target[:, :, 1][mask] = 0
            target[:, :, 2][mask] = 255

    #cv2.imshow('Targets', target)

    #兩圖疊合
    final = cv2.bitwise_or(copy_img, target)
    if os.path.isfile("public/"+patientID+"/"+filename+"_original.png"):
        cv2.imwrite("public/"+patientID+"/"+filename+".png", final)
    else:
        os.rename("public/"+patientID+"/"+filename+".png","public/"+patientID+"/"+filename+"_original.png")
        cv2.imwrite("public/"+patientID+"/"+filename+".png", final)

    # cv2.waitKey()
    # cv2.destroyAllWindows()

label_nodule(path, list)