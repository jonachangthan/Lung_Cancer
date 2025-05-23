import os
import cv2
from PIL import Image
import time

mask_path = 'C:/Users/user/Desktop/nodule/final/mask/'

mask_forder = os.listdir(mask_path)
mask_forder.sort()
print(mask_forder)
for file in mask_forder:
    print(file)
    # if(file!='013'and  file!='166' and file!='175' and file!='176' and file!='181' and file!='188' and file!='196'):
    #     continue
    for nodulefile in os.listdir(mask_path+file):
        for img in os.listdir(mask_path+file+'/'+nodulefile):
            #maskcv = cv2.imread(mask_path+file+'/'+img)
            mask = Image.open(mask_path+file+'/'+nodulefile+'/'+img)
            #print(mask)
            if(mask.mode!='L'): #RGB L
                print(file,nodulefile,img)
                #maskcv = cv2.imread(mask_path+file+'/'+nodulefile+'/'+img) #for img
                maskcv = cv2.imread(mask_path+file+'/'+nodulefile+'/'+img,0) # for mask
                print(maskcv.shape)
                #cv2.imwrite(mask_path+file+'/'+nodulefile+'/'+img,maskcv)
                #time.sleep(20)

