import os

dicom_path = "D:/lung_project/Section2/data/Hospital_data/dicom"

for i in range(1, 201):

    dicom_file_path = os.path.join(dicom_path, str(i))
    dicom_file_path = os.path.join(dicom_file_path, str(os.listdir(dicom_file_path)[0]))

    dcm_files = [f for f in os.listdir(dicom_file_path) if f.endswith('.dcm')]

    for old_filename in dcm_files:

        old_path = os.path.join(dicom_file_path, old_filename)

        old_filename = old_filename[:old_filename.find(".")]

        parts = old_filename.split("-")  # Split the filename into two parts, before and after the "-"
        new_filename = "{}-{:03d}.dcm".format(parts[0], int(parts[1]))  # Format the new filename with zero-padded numbers
        
        new_path = os.path.join(dicom_file_path, new_filename)
        os.rename(old_path, new_path)
