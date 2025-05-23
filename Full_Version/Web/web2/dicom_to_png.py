import os
import numpy as np
import SimpleITK as sitk

pic="C:/VS_Code/web2/uploadfiles"

def windowing(image, level, width):
    window_min = level - width / 2 #若低於下界 -> 黑色
    window_max = level + width / 2 #若超過上界 -> 白色

    for i in range(image.shape[0]):
        image[i] = 255.0 * (image[i] - window_min) / (window_max - window_min)
        
        image[i][image[i] < 0] = 0
        image[i][image[i] > 255] = 255 

        image[i] = image[i] - image[i].min()
        factor = float(255) / image[i].max()
        image[i] = image[i] * factor
    
    return image.astype(np.uint8)

def picture():
    for i in os.listdir(pic):
        path = os.path.join(pic, i) 
        image = sitk.ReadImage(path)

        image_array = sitk.GetArrayFromImage(image) 
        image_array2 = sitk.GetArrayFromImage(image)   
        windowing_image = windowing(image_array, -600, 1600) # level, width
        windowing_image2 = windowing(image_array2, 50, 350) # level, width

        output = sitk.GetImageFromArray(windowing_image)
        output2 = sitk.GetImageFromArray(windowing_image2)

        sitk.WriteImage(output, save_path + str(int(i[:-4].split('-')[1] )-1)+ '.png')
        sitk.WriteImage(output2, save_path2 + str(int(i[:-4].split('-')[1] )-1)+ '.png')

save_path = "C:/VS_Code/web2/public/onlinePicture/lungpic/"
save_path2 = "C:/VS_Code/web2/public/onlinePicture/softpic/"
picture()
