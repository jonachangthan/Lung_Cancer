#! 複製圖片並合併
import os
import cv2
import shutil
def copy_picture(file_path, save_path):
    for file in os.listdir(file_path):
        picture_path = os.path.join(file_path, file)
        save = os.path.join(save_path, file)
        if not os.path.isdir(save): os.mkdir(save)
        
        for picture in os.listdir(picture_path):
            pic_path = os.path.join(picture_path, picture)
            
            for pic in os.listdir(pic_path):
                if os.path.isfile(os.path.join(save, pic)):
                    image1 = cv2.imread(os.path.join(save, pic))
                    image2 = cv2.imread(os.path.join(pic_path, pic))
                    final_image = cv2.bitwise_or(image1, image2)
                    cv2.imwrite(os.path.join(save, pic), final_image)
                else:
                    shutil.copyfile(os.path.join(pic_path, pic), os.path.join(save, pic))

copy_picture('C:/Users/user/Desktop/hospital/mask1_120','C:/Users/user/Desktop/hospital/mask')