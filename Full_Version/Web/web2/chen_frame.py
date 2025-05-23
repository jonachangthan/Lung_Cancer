from email.mime import image
import cv2
import numpy as np
import os
import sys

def frame(input_path, coordinate, save_path):
    image = cv2.imread(input_path)
    cv2.rectangle(image, coordinate[0], coordinate[1], (0, 255, 0), 1)
    cv2.imwrite(save_path, image)

base_path = "C:/VS_Code/web2/public/final/3/"
save_base_path = "C:/VS_Code/web2/public/final/3/"

sys.argv

region = [int(sys.argv[1]), int(sys.argv[2]), (int(sys.argv[3]), int(sys.argv[4])), (int(sys.argv[5]), int(sys.argv[6]))]
region = np.array(region, dtype=object)

patient_index = region[0]
image_index = region[1]
rectangle_coordinate = region[-2:]

if os.path.isfile("public/final/3/"+str(patient_index)+"/"+str(image_index)+"_original.png"):
    image_path = base_path + str(patient_index) + '/' + str(image_index) + '.png'
else:
    os.rename("public/final/3/"+str(patient_index)+"/"+str(image_index)+".png","public/final/3/"+str(patient_index)+"/"+str(image_index)+"_original.png")
    image_path = base_path + str(patient_index) + '/' + str(image_index) + '_original.png'

save_image_path = save_base_path + str(patient_index) + '/' + str(image_index) + '.png'
frame(image_path, rectangle_coordinate, save_image_path)