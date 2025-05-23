import cv2
import pandas as pd
nodulescsv = pd.read_csv("C:/Users/user/Desktop/nodule/nodules.csv")
fordername = '007'
filename = '001'
img_id = '0064'
index_loc = nodulescsv.loc[(nodulescsv['patientID'] ==int(fordername)) &(nodulescsv['num'] ==int(filename)) &(nodulescsv['filename'] == int(img_id))]
x,y = index_loc.iloc[0]['cordX'],index_loc.iloc[0]['cordY']
img = cv2.imread('C:/Users/user/Desktop/nodule/final/image/'+fordername+'/'+filename+'/'+img_id+'.png')
print(img.shape)
img[y,x] = [0,0,255]
cv2.imshow('img',img)
cv2.waitKey()

#001/001/0061
#007/001/0064
#008/001/0073
#013/006/0071
#014/001/0048
#014/001/0049
#014/001/0050
#015/002/0015
#015/002/0016
#015/002/0017
#016/002/0023
#016/004/0042
#023/005/0045
#024/003/0040
#024/005/0089
#029/002/0070
#029/002/0071
#029/002/0074
#034/001/0030
#034/001/0032
#034/001/0033
#034/001/0034
#035/002/0060
#036/002/0028
#036/008/0061