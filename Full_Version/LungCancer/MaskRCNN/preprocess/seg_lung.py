import numpy as np
import cv2
import os
img_file = 'D:\Hospital_data\image'
mask_file = 'D:\Hospital_data\mask'
patient_file = os.listdir('//tsclient/C/Users/aa235/Desktop/partial/image')
print(patient_file)
for i in patient_file:
    if(int(i)<84):
        continue
    for j in os.listdir('//tsclient/C/Users/aa235/Desktop/partial/image/'+i):
        print(str(int(i)),j[:-4])
        img = cv2.imread('//tsclient/C/Users/aa235/Desktop/partial/image/'+i+'/'+j)
        mask = cv2.imread('D:/Hospital_data/mask/'+str(int(i))+'/'+j[:4]+'.tif')

        # print(img.shape)
        # print(mask.shape)
        seg_img = cv2.bitwise_and(img,mask)
        if not os.path.isdir('//tsclient/D/Lungcancer/seg_lungimg/'+str(i).zfill(3)):
            os.mkdir('//tsclient/D/Lungcancer/seg_lungimg/'+str(i).zfill(3))
        cv2.imwrite("//tsclient/D/Lungcancer/seg_lungimg/"+str(i).zfill(3)+'/'+j,seg_img)
        # cv2.imshow("seg",seg_img)
        # cv2.waitKey()
        # cv2.destroyAllWindows()

# img = cv2.imread("D:\Hospital_data\image/1/0062.tif")
# mask = cv2.imread("D:\Hospital_data\mask/1/0062.tif")

# seg_img = cv2.bitwise_and(img,mask)
# #cv2.imshow("seg",seg_img)
# cv2.imwrite("C:/Users/user/Desktop/test2/0062.png",seg_img)
#cv2.waitKey()
#cv2.destroyAllWindows()