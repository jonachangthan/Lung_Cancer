import shutil
import os
image_path = "C:/VS_Code/web2/public/onlineSegementation_mul/image"
destination_directory = "C:/VS_Code/web2/public/onlineSegementation_mul/nodule_overlapped/"
for file in os.listdir(image_path):
    source_file = os.path.join(image_path, file)

    shutil.copy(source_file, destination_directory + file)

shutil.make_archive("C:/VS_Code/web2/public/onlineSegementation_mul/original_image", 'zip', image_path)