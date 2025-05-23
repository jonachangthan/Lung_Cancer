import numpy as np
import os
import glob
from skimage import io
from skimage.morphology import disk, binary_erosion, binary_closing
from skimage.measure import label
from skimage.filters import roberts
from skimage.segmentation import clear_border
from skimage.transform import resize
from skimage import *
from skimage.filters import (threshold_otsu, threshold_niblack, threshold_sauvola)
from scipy import ndimage as ndi
import SimpleITK as sitk
import pydicom
import cv2
from cv2 import INTER_AREA
from keras import models
import shutil

def read_ct_scan(folder_name): # 讀取dicom檔，並存取其pixel值
    slices = [pydicom.read_file(folder_name + filename) for filename in os.listdir(folder_name)]
        
    slices.sort(key = lambda x: int(x.InstanceNumber))

    return slices 

def get_pixels_hu(slices):
    image = np.stack([s.pixel_array for s in slices])
    image = image.astype(np.int16)

    image[image <= -2000] = 0
    
    #* Convert to Hounsfield units (HU)
    for slice_number in range(len(slices)):
        intercept = slices[slice_number].RescaleIntercept
        slope = slices[slice_number].RescaleSlope
        
        if slope != 1:
            image[slice_number] = slope * image[slice_number].astype(np.float64)
            image[slice_number] = image[slice_number].astype(np.int16)
            
        image[slice_number] += np.int16(intercept)
    
    return np.array(image, dtype=np.int16)

def get_lung_segmentation(im):
    #* 將圖像轉換成binary 
    binary = im < threshold_otsu(im)
        
    #* 清除圖像邊界
    cleared = clear_border(binary)

    #* 對圖像進行標記
    label_image = label(cleared)
        
    #* 保留2個最大區域的標籤  *** 注意: lower時調為3 ***
    '''
    areas = [r.area for r in regionprops(label_image)]
    areas.sort()
    if len(areas) > 3:
        for region in regionprops(label_image):
            if region.area < areas[-3]:
                for coordinates in region.coords:                
                    label_image[coordinates[0], coordinates[1]] = 0
    '''
    binary = label_image > 0

    #* 用半徑為2的圓平面進行erosion(腐蝕)，分離附著在血管上的肺結節。
    selem = disk(2)
    binary = binary_erosion(binary, selem)
        
    #* 用半徑為10的圓平面進行closure(閉合隱藏)，使結節附著在肺壁
    selem = disk(10)
    binary = binary_closing(binary, selem)

    #* 填充binary mask內的孔隙
    edges = roberts(binary)
    binary = ndi.binary_fill_holes(edges)

    return binary
    
def lung_segmentation_from_ct_scan(ct_scan):
    return np.asarray([get_lung_segmentation(slice) for slice in ct_scan])

def lung_segmentation_resunet(image_path, mask_path, model_path):
    image = sorted(glob.glob(image_path + '/*.tif'))
    #? print(len(image))
    model = models.load_model(model_path)
    
    x_data = np.empty((len(image), 256, 256, 1), dtype=np.float32)
    for i, img_path in enumerate(image):
        img = io.imread(img_path)
        img = resize(img, output_shape=(256, 256, 1), preserve_range=True)
        x_data[i] = img
    #? print(x_data.shape)
    preds = model.predict(x_data)
    for i, pred in enumerate(preds):
        image = pred.squeeze()
        image = cv2.resize(image, (512,512), interpolation=INTER_AREA)
        image = (image * 255).astype('uint8')
        cv2.imwrite(mask_path + str(i + 1).zfill(4) + ".tif", image)

def modify_image(image):
    row, column = image.shape[:2]
    radius = 256
    x_position = row // 2
    y_position = column // 2

    mask = np.zeros_like(image)
    mask = cv2.circle(mask, (x_position, y_position), radius, (255, 255, 255), -1)
    result = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    result[:,:,3] = mask[:,:,0]
        
    return result

def convert_from_dicom_to_tif(image_dcm, save_path, save16_path):
    for index, i in enumerate(os.listdir(image_dcm), start=1):
        dicom_image_path = os.path.join(image_dcm, i) # 獲取所有dicom檔的路徑
        dicoms_array = sitk.ReadImage(dicom_image_path) # 讀取dicom檔案的相關資訊
        image_array = sitk.GetArrayFromImage(dicoms_array) # 存成陣列
        image_array[image_array <= -2000] = 0
        
        shape = image_array.shape
        image_array = np.reshape(image_array, (shape[1], shape[2])) #.reshape(): 提出image_array中的height和width
        
        #* uint8
        high_window = np.max(image_array) # 上限
        low_window = np.min(image_array) # 下限
        lung_window = np.array([low_window * 1., high_window * 1.])
        new_image = (image_array - lung_window[0]) / (lung_window[1] - lung_window[0]) # 歸一化
        new_image = (new_image * 255).astype('uint8') # 將畫素值擴充套件到[0,255]
        stack_image = np.stack((new_image,) * 3, axis = -1)
        #? final_image = modify_image(stack_image)
        cv2.imwrite(save_path + str(index).zfill(4) + '.tif', stack_image)

        #* uint16
        image16_array = cv2.normalize(image_array, None, 0, 65535, cv2.NORM_MINMAX)
        cv2.imwrite(save16_path + str(index).zfill(4) + '.tif', image16_array.astype('uint16'))
        
def superimpose(original_path, mask_path, save_path):
    for index, i in enumerate(os.listdir(original_path), start=1):
        original_image_path = os.path.join(original_path, i)
        mask_image_path = os.path.join(mask_path, i)
        original = cv2.imread(original_image_path)
        mask = cv2.imread(mask_image_path)

        superimpose_image = cv2.bitwise_and(original, mask)
        image = cv2.cvtColor(superimpose_image, cv2.COLOR_BGR2GRAY)
        new_image = (image - np.min(image)) / (np.max(image) - np.min(image))
        final_image = (new_image * 65535).astype(np.uint16) # 轉成16bit
        cv2.imwrite(save_path + str(index).zfill(4) + '.tif', final_image)

def final_lung_segmentation(image_path, mask_path, model_path):
    image = sorted(glob.glob(image_path + '/*.tif'))
    #? print(len(image))
    model = models.load_model(model_path)
    
    x_data = np.empty((len(image), 256, 256, 1), dtype=np.float32)
    for i, img_path in enumerate(image):
        img = io.imread(img_path)
        img = resize(img, output_shape=(256, 256, 1), preserve_range=True)
        x_data[i] = img
    #? print(x_data.shape)
    preds = model.predict(x_data)
    os.makedirs("C:/VS_Code/web2/public/onlineSegementation_mul/lung_mask", exist_ok=True)
    for i, pred in enumerate(preds, start=1):
        image = pred.squeeze()
        image = cv2.resize(image, (512,512), interpolation=INTER_AREA)
        image = (image * 255).astype('uint8')
        cv2.imwrite(mask_path + str(i).zfill(4) + ".tif", image)
        cv2.imwrite("C:/VS_Code/web2/public/onlineSegementation_mul/lung_mask/"+str(i).zfill(4)+".png", image)
    shutil.make_archive("C:/VS_Code/web2/public/onlineSegementation_mul/lung_mask", 'zip', "C:/VS_Code/web2/public/onlineSegementation_mul/lung_mask")

def overlapping(original, segmentation, overlapping_path):
    os.makedirs("C:/VS_Code/web2/public/onlineSegementation_mul/lung_overlapped", exist_ok=True)
    for index, i in enumerate(os.listdir(original), start=1):
        original_path = os.path.join(original, i)
        segmentation_path = os.path.join(segmentation, i)

        bottom = cv2.imread(original_path, 1)
        
        segmentation_image = cv2.imread(segmentation_path, 2)
        segmentation_image = cv2.cvtColor(segmentation_image, cv2.COLOR_GRAY2RGB) # 轉成3通道
        # top = (segmentation_image * 255).astype('uint8')  # float32轉uint8
        
        paper = np.zeros((512, 512, 3), np.uint8)
        paper[:, :, 0] = 0
        paper[:, :, 1] = 0
        paper[:, :, 2] = 255

        mask = cv2.bitwise_and(segmentation_image, paper)
        overlapping_image = cv2.addWeighted(bottom, 0.6, mask, 0.4, 0)
        cv2.imwrite(overlapping_path + str(index).zfill(4) + '.png', overlapping_image)
        cv2.imwrite("C:/VS_Code/web2/public/onlineSegementation_mul/lung_overlapped/"+str(index).zfill(4)+".png", overlapping_image)

def tif_to_png_original(file_path, save_path):
    for index, file in enumerate(os.listdir(file_path), start=1):
        image_path = os.path.join(file_path, file)
        image = cv2.imread(image_path)
        cv2.imwrite(save_path + str(index).zfill(4) + '.png', image)

def tif_to_png_segmentation(file_path, save_path):
    for index, file in enumerate(os.listdir(file_path), start=1):
        image_path = os.path.join(file_path, file)
        image = cv2.imread(image_path, 2)
        # image_8 = (image * 255).astype('uint8') 
        cv2.imwrite(save_path + str(index).zfill(4) + '.png', image)

#TODO -------------------------------------------------------------------------------------------------------

#! 主函式
def main(dicom_path, original_path, original16_path, segmentation1_path, superimpose1_path, segmentation2_path, superimpose2_path, web_png_path, model_path, resunet_model_path):
    #* Original
    convert_from_dicom_to_tif(dicom_path, original_path, original16_path)

    #* Segmentation (Image Processing)
    slices = read_ct_scan(dicom_path)
    slices_pixels = get_pixels_hu(slices)
    mask = lung_segmentation_from_ct_scan(slices_pixels) # 轉成mask

    for i in range(mask.shape[0]):
        io.imsave(segmentation1_path + '/' + str(i + 1).zfill(4) + '.tif', mask[i,:,:])

    #* Segmentation (ResUNet)
    lung_segmentation_resunet(original16_path, segmentation2_path, resunet_model_path)

    #* Superimpose
    superimpose(original16_path, segmentation1_path, superimpose1_path)
    superimpose(original16_path, segmentation2_path, superimpose2_path)

    #* Final_Segmentation (UNet)
    final_lung_segmentation(superimpose1_path, segmentation1_path, model_path)
    final_lung_segmentation(superimpose2_path, segmentation2_path, model_path)

    #* Overlapping
    overlapping1_path = web_png_path + 'overlapping1/'
    overlapping(original_path, segmentation1_path, overlapping1_path)
    overlapping2_path = web_png_path + 'overlapping2/'
    overlapping(original_path, segmentation2_path, overlapping2_path)

    #* Convert tif to png
    original_png_path = web_png_path + 'original/'
    tif_to_png_original(original_path, original_png_path)
    original16_png_path = web_png_path + 'original16/'
    tif_to_png_original(original16_path, original16_png_path)
    segmentation1_png_path = web_png_path + 'segmentation1/'
    tif_to_png_segmentation(segmentation1_path, segmentation1_png_path)
    segmentation2_png_path = web_png_path + 'segmentation2/'
    tif_to_png_segmentation(segmentation2_path, segmentation2_png_path)

#TODO ---------------------------------------------------------------------------------------------------
if os.path.exists("C:/Users/NUK_lab/Desktop/Lung_Segmentation/result"):
    shutil.rmtree("C:/Users/NUK_lab/Desktop/Lung_Segmentation/result")
model_path = "C:/Users/NUK_lab/Desktop/Lung_Segmentation/modify.h5"
base_path = 'C:/Users/NUK_lab/Desktop/Lung_Segmentation/'
dicom_path = 'C:/VS_Code/web2/segementation_mul_dcm/'
resunet_model_path = 'C:/Users/NUK_lab/Desktop/Lung_Segmentation/resunet.h5'

# file_name = dicom_path.split('/')[-1]
# file_path = os.path.join(base_path, file_name)
file_path = base_path + "result/"
if not os.path.isdir(file_path): os.mkdir(file_path)

original_path = os.path.join(file_path, 'original')
if not os.path.isdir(original_path): os.mkdir(original_path)
original16_path = os.path.join(file_path, 'original16')
if not os.path.isdir(original16_path): os.mkdir(original16_path)
segmentation1_path = os.path.join(file_path, 'segmentation1')
if not os.path.isdir(segmentation1_path): os.mkdir(segmentation1_path)
superimpose1_path = os.path.join(file_path, 'superimpose1')
if not os.path.isdir(superimpose1_path): os.mkdir(superimpose1_path)
segmentation2_path = os.path.join(file_path, 'segmentation2')
if not os.path.isdir(segmentation2_path): os.mkdir(segmentation2_path)
superimpose2_path = os.path.join(file_path, 'superimpose2')
if not os.path.isdir(superimpose2_path): os.mkdir(superimpose2_path)
web_png_path = os.path.join(file_path, 'web_png')
if not os.path.isdir(web_png_path): 
    os.mkdir(web_png_path)
    os.mkdir(os.path.join(web_png_path, 'original'))
    os.mkdir(os.path.join(web_png_path, 'original16'))
    os.mkdir(os.path.join(web_png_path, 'segmentation1'))
    os.mkdir(os.path.join(web_png_path, 'overlapping1'))
    os.mkdir(os.path.join(web_png_path, 'segmentation2'))
    os.mkdir(os.path.join(web_png_path, 'overlapping2'))

original_path = original_path + '/'
original16_path = original16_path + '/'
segmentation1_path = segmentation1_path + '/'
superimpose1_path = superimpose1_path + '/'
segmentation2_path = segmentation2_path + '/'
superimpose2_path = superimpose2_path + '/'
web_png_path = web_png_path + '/'

main(dicom_path, original_path, original16_path, segmentation1_path, superimpose1_path, segmentation2_path, superimpose2_path, web_png_path, model_path, resunet_model_path)