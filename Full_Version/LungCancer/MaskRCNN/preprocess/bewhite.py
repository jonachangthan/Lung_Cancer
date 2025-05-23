import numpy as np
import cv2
import math
#img = cv2.imread("C:/Users/user/Desktop/test2/0062.png")
#img = cv2.imread("C:/Users/user/Desktop/hospital/seg_lungimg1_120/001/0062.png")
img = cv2.imread("C:/Users/user/Desktop/hospital/seg_lungimg1_120/007/0044.png")
print(img.shape)

x = 134
y = 249
print(img[y,x])
mask = [img>255-100]
img[img<img[y,x]-10] = 0
img[img>=img[y,x]-10] += 100
img[mask]=200

# mask = [img>255-100]
# mask1 = [img[:,:,0]<=90]
# mask2 = [img[:,:,1]<=50]
# mask3 = [img[:,:,2]<=90]
# mmask = np.array(mask1) & np.array(mask2) & np.array(mask3)
# mmask = mmask.tolist()

#img[mmask] = 0
# img[img<=60]+=10
# img[img>60]+=100
# img[mask]=200
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