import os
import pandas as pd
nodulescsv = pd.read_csv("C:/Users/user/Desktop/nodule/nodules.csv")
dataset_dir = 'C:/Users/user/Desktop/nodule/final'
images_dir = dataset_dir + '/image/'
annotations_dir = dataset_dir + '/mask/'
is_train = True
cnt = 0
for fordername in os.listdir(images_dir):
    if is_train and int(fordername) <= 43:#>= 150
        continue
    # if not is_train and int(fordername) >24:#< 150
    #     continue
    for filename in os.listdir(images_dir+fordername):
            for imagename in os.listdir(images_dir+fordername+'/'+filename):
                cnt+=1
                image_id = imagename[:4]+'_'+filename
                img_id = imagename[:4]
                # if is_train and int(image_id) >= 150:
                #     continue

                # if not is_train and int(image_id) < 150:
                #     continue

                img_path = images_dir + fordername+'/'+filename+'/'+imagename
                ann_path = annotations_dir + fordername+'/'+filename+'/'+img_id + '.png'
                index_loc = nodulescsv.loc[(nodulescsv['patientID'] ==int(fordername)) &(nodulescsv['num'] ==int(filename)) &(nodulescsv['filename'] == int(img_id))]
                print('-'*30)
                print('image_id : ',image_id)
                print('img_path : ',img_path)
                print('ann_path : ',ann_path)
                x,y = index_loc.iloc[0]['cordX'],index_loc.iloc[0]['cordY']
                print('x,y : ',x,y)
                print('-'*30)
                # coord_indice = np.array([[x,y]])
                # anchor = generate_coord_pyramid_anchors(x,y,
                # model.config.RPN_ANCHOR_SCALES,
                # model.config.RPN_ANCHOR_RATIOS,
                # backbone_shapes,
                # model.config.BACKBONE_STRIDES,
                # model.config.RPN_ANCHOR_STRIDE)
                # print('-'*30)
                # print(index_loc)
                # print([x,y])
                # print('-'*30)

                # self.add_image('dataset', image_id=image_id, path=img_path,index=anchor,annotation=ann_path)
print(cnt)