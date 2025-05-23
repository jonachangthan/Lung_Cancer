import shutil

train = [1, 7, 11, 14, 32, 42, 44, 45, 50, 51, 58, 8, 10, 15, 19, 21, 23, 26, 34, 39, 47, 48, 13, 20, 29, 35, 40, 41, 46, 53, 56, 57, 22, 24, 25, 27, 36, 43, 49, 52, 54, 59]
test = [3, 12, 16, 18, 28, 31, 33, 38, 55, 60]

for i in train:

    # Source file path
    src_file = 'data/normalized/'+ str(i).zfill(3) + '/lung_features.npy'
    src_file2 = 'data/normalized/'+ str(i).zfill(3) + '/nodule_features.npy'
    src_file3 = 'data/normalized/'+ str(i).zfill(3) + '/vessel_features.npy'

    # Destination directory path
    dest_dir = 'data/cross_validation/folder1/train/'

    # specify the new name of the file
    new_file_name = str(i).zfill(3) + '_lung_features.npy'
    new_file_name2 = str(i).zfill(3) + '_nodule_features.npy'
    new_file_name3 = str(i).zfill(3) + '_vessel_features.npy'

    # Copy the file to destination directory
    shutil.copy(src_file, dest_dir + new_file_name)
    shutil.copy(src_file2, dest_dir + new_file_name2)
    shutil.copy(src_file3, dest_dir + new_file_name3)

for i in test:

    # Source file path
    src_file = 'data/normalized/'+ str(i).zfill(3) + '/lung_features.npy'
    src_file2 = 'data/normalized/'+ str(i).zfill(3) + '/nodule_features.npy'
    src_file3 = 'data/normalized/'+ str(i).zfill(3) + '/vessel_features.npy'

    # Destination directory path
    dest_dir = 'data/cross_validation/folder1/test/'
    
    # specify the new name of the file
    new_file_name = str(i).zfill(3) + '_lung_features.npy'
    new_file_name2 = str(i).zfill(3) + '_nodule_features.npy'
    new_file_name3 = str(i).zfill(3) + '_vessel_features.npy'

    # Copy the file to destination directory
    shutil.copy(src_file, dest_dir + new_file_name)
    shutil.copy(src_file2, dest_dir + new_file_name2)
    shutil.copy(src_file3, dest_dir + new_file_name3)