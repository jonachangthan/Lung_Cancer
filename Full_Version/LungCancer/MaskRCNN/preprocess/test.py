import os
import cv2
from PIL import Image
import time
import numpy as np
mask_path = 'C:/Users/user/Desktop/hospital/'
mask = Image.open(mask_path+'0061.tif')
img = cv2.imread(mask_path+'0061.tif')
mask = [img>255-150]
# mask1 = [img[:,:,0]<=90]
# mask2 = [img[:,:,1]<=50]
# mask3 = [img[:,:,2]<=90]
# mmask = np.array(mask1) & np.array(mask2) & np.array(mask3)
# mmask = mmask.tolist()
#img[mmask] = 0
img[img<=40]+=10
img[img>40]+=150
img[mask]=200
#print(img[img>35])4
# for i in img[img[:,:,1]!=0]:
#     print(i,end=' ')
# img[img*2>255]=255
# img[img>35]+=0
# img[img>80]=255


#ret, th1 = cv2.threshold(img, 40, 255, cv2.THRESH_BINARY)
# img[img>40]+=105
# img2 = img
#cv2.imwrite("C:/Users/user/Desktop/test2/0062_2.png",img)
cv2.imshow("img2",img)
cv2.waitKey()
cv2.destroyAllWindows()
# maskcv = cv2.imread(mask_path+'0061.tif',0)
# print(maskcv[maskcv>255])
# print(maskcv.shape)