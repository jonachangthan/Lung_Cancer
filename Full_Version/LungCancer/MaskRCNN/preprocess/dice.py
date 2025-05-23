import cv2
import numpy as np
import os
levelset_forder_path = 'C:/Users/user/Desktop/nodule/final/mask/'
mask_forder_path = 'C:/Users/user/Desktop/0712img/'
img_path = "C:/Users/user/Desktop/nodule/final/image/"
save_combine_img_path = 'C:/Users/user/Desktop/check_img/'
levelset_forder = os.listdir(mask_forder_path)
levelset_forder.sort()
print(levelset_forder)
level_array = np.zeros([273,512,512])
mask_array = np.zeros([273,512,512])
dice = 0
imgcnt = 0
cntt= 0
zeromask = 0
for forder in levelset_forder:
    levelset_file = os.listdir(mask_forder_path+forder)
    for file in levelset_file:
        for img in os.listdir(mask_forder_path+forder+'/'+file):
            imgcnt+=1
            #print(levelset_forder_path+forder+'/'+file+'/'+img)
            #print(mask_forder_path+forder.zfill(3)+'/'+str(int(file.split('.')[0])-1)+'.png')
            if(os.path.isfile(levelset_forder_path+forder+'/'+file+'/'+img) and os.path.isfile(mask_forder_path+forder+'/'+file+'/'+img)):
                level = cv2.imread(levelset_forder_path+forder+'/'+file+'/'+img,0)
                mask = cv2.imread(mask_forder_path+forder+'/'+file+'/'+img,0)
                if(np.sum(mask)==0):
                    zeromask+=1
                level = level/255
                mask_forcombine = mask
                mask = mask/255
                level_array[imgcnt-1] = level
                mask_array[imgcnt-1] = mask
                imgdice = 2*np.sum(level*mask)/(np.sum(level)+np.sum(mask))
                dice += 2*np.sum(level*mask)/(np.sum(level)+np.sum(mask))
                print(levelset_forder_path+forder+'/'+file+'/'+img)
                # print(ori.shape)
                # level = cv2.addWeighted(ori,0.7,level,0.3,0)\

                # ori = cv2.imread(img_path+forder+'/'+file+'/'+img,0)
                # combine = cv2.addWeighted(ori,0.7,mask_forcombine,0.3,0)
                # if not os.path.isdir(save_combine_img_path+'/'+forder+'/'+file):
                #     os.makedirs(save_combine_img_path+'/'+forder+'/'+file)
                #     print("Create_file : "+save_combine_img_path+'/'+forder+'/'+file)
                # cv2.imwrite(save_combine_img_path+'/'+forder+'/'+file+'/'+img,combine)
                # cv2.imshow('ori',level)
                # cv2.imshow('mask',mask)
                # cv2.waitKey()
                # cv2.destroyAllWindows()

                # if(imgdice>=0.8):
                #     cntt+=1
                #     print(levelset_forder_path+forder+'/'+file+'/'+img)
                #     cv2.imshow('ori',level)
                #     cv2.imshow('mask',mask)
                #     cv2.waitKey()
                #     cv2.destroyAllWindows()

print('dd',level_array.shape)
a = level_array.flatten()
b = mask_array.flatten()

print(zeromask)
# print(cntt)
# print(dice)
print(imgcnt)
# print(dice/imgcnt)
print('-'*50)
print(a.shape)
print(b.shape)
print(a[a>1])
print(b[b>1])
print(2*np.sum(a*b)/(np.sum(a)+np.sum(b)))

