import pandas as pd
import time
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os

nodulescsv = pd.read_csv("C:/Users/user/Desktop/hospital/nodules.csv")
img_path = "C:/Users/user/Desktop/hospital/seg_lungimg1_120/"
save_img_path = "C:/Users/user/Desktop/output_an15_p100/"

patient = os.listdir('C:/Users/user/Desktop/hospital/seg_lungimg1_120')

for i in range(len(nodulescsv)):      
    #folder_filenames = os.listdir(img_path+str(nodulescsv.iloc[i]["patientID"]).zfill(3))
    # if(str(nodulescsv.iloc[i]["patientID"]).zfill(3)not in patient or int(str(nodulescsv.iloc[i]["patientID"]))<21 or int(str(nodulescsv.iloc[i]["patientID"]))>24 or (int(str(nodulescsv.iloc[i]["patientID"]))==21 and int(str(nodulescsv.iloc[i]["num"]))<4) or (int(str(nodulescsv.iloc[i]["patientID"]))==21 and int(str(nodulescsv.iloc[i]["num"]))==4 and int(str(nodulescsv.iloc[i]["filename"]))<=68)): 
    #     continue
    if(str(nodulescsv.iloc[i]["patientID"]).zfill(3)not in patient ): 
        continue

    print(img_path+str(nodulescsv.iloc[i]["patientID"]).zfill(3)+'/'+str(nodulescsv.iloc[i]["filename"]).zfill(4)+'.png')
    
    img = cv2.imread(img_path+str(nodulescsv.iloc[i]["patientID"]).zfill(3)+'/'+str(nodulescsv.iloc[i]["filename"]).zfill(4)+'.png')
    image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    lung_mask = cv2.imread('D:/Hospital_data/mask/'+str(nodulescsv.iloc[i]["patientID"])+'/'+str(nodulescsv.iloc[i]["filename"]).zfill(4)+'.tif',0)


    x = int(nodulescsv.iloc[i]["cordX"])
    y = int(nodulescsv.iloc[i]["cordY"])
    print(image[y,x])
    # mask = [image>=255-51]
    # mask1 = [image>=image[y,x]-15]
    # mask2 = [image<=image[y,x]+15]
    # #mmask = np.array(mask1) & np.array(mask2)
    # mmask = np.bitwise_and(np.array(mask1),np.array(mask2))
    # mmask = mmask.tolist()
    print(image[y,x].all())
    if(image[y,x].all()):
        # image[image<image[y,x]-15] = 0
        # image[image>image[y,x]+15] = 0
        # print('1-'*30)
        # fir = image[y,x]
        # print(image[y,x])
        # #image[mmask] = cv2.add(image[mmask],50)
        # image[mmask] += 50
        # print(image[y,x])
        # sec = image[y,x]
        # if(fir[0]>sec[1]):
        #     image[mmask] = 250
        # print('2-'*30)
        # image[mask]=250
        ret, th1 = cv2.threshold(img, int(img[y,x,0])-10, int(img[y,x,0])+10, cv2.THRESH_BINARY)
        print(th1[y,x])
        print('3-'*30)
        # for k in range(-2,3):
        #     for j in range(-2,3):
        #         image[y+k,x+j] = [255,0,0]
        

        th1[th1>1] = 250
        th1[th1!=250] = 30
        th1 = cv2.bitwise_and(th1,th1,mask=lung_mask)
        for k in range(-3,3):
            for j in range(-3,3):
                th1[y+k,x+j] = [250,250,250]
        for k in range(-2,3):
            for j in range(-2,3):
                th1[y+k,x+j] = [255,0,0]

        
        
        img[y,x] = [255,0,0]
        cv2.imshow("img",image)
        cv2.imshow("th1",th1)
        cv2.imshow("ori",img)
        cv2.waitKey()
        cv2.destroyAllWindows()
    else:
        mask_k = [image>255-50]
        image[image<=55]=0
        image[image>55]+=50
        image[mask_k]=250

        for k in range(-2,3):
            for j in range(-2,3):
                image[y+k,x+j] = [255,0,0]
        cv2.imshow("img",image)
        cv2.waitKey()
        cv2.destroyAllWindows()


    # for i in range(-2,3):
    #     for j in range(-2,3):
    #         image[y+i,x+j] = [255,0,0]
    
    # for i in range(-2,3):
    #     for j in range(-2,3):
    #         th1[y+i,x+j] = [255,0,0]

    # mask_k = [image>255-50]
    # image[image<=55]=0
    # image[image>55]+=50
    # image[mask_k]=250

    # cv2.imshow("img2",image)
    # cv2.imshow("oriimg",img)
    # cv2.waitKey()
    # cv2.destroyAllWindows()