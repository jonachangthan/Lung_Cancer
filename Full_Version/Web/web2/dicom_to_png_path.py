import os
import numpy as np
import SimpleITK as sitk
import sys
# sys.argv[1]
# sys.argv[2]
src_path=sys.argv[1]

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
    for i, dcmfile in enumerate(os.listdir(src_path)):
        path = os.path.join(src_path, dcmfile) 
        
        image = sitk.ReadImage(path)

        image_array = sitk.GetArrayFromImage(image) 
        
        windowing_image = windowing(image_array, -600, 1600) # level, width

        output = sitk.GetImageFromArray(windowing_image)

        filename = str((i+1)).zfill(4) + ".png"

        sitk.WriteImage(output, os.path.join(save_path, filename))

save_path = sys.argv[2]
picture()
