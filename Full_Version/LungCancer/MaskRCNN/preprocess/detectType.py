import os
import cv2
from PIL import Image
import time
mask_path = 'C:/Users/user/Desktop/hospital/mask1_120/'

mask_forder = os.listdir(mask_path)
mask_forder.sort()
print(mask_forder)
for file in mask_forder:
    print(file)
    # if(file!='013'and  file!='166' and file!='175' and file!='176' and file!='181' and file!='188' and file!='196'):
    #     continue
    for img in os.listdir(mask_path+file):
        #maskcv = cv2.imread(mask_path+file+'/'+img)
        mask = Image.open(mask_path+file+'/'+img)
        print(mask)
        if(mask.mode!='L'):
            print(file,img)
            maskcv = cv2.imread(mask_path+file+'/'+img,0)
            print(maskcv.shape)
            #cv2.imwrite(mask_path+file+'/'+img,maskcv)
            #time.sleep(10)