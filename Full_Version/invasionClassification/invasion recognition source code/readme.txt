feature extraction and selection :
	preprocess.py 將同一顆tumor的所有dicom壓縮成nrrd檔
	getfeature.py 利用pyradiomics擷取每顆腫瘤的特徵 並寫檔儲存
	fea_sel.py 利用不同方式進行特徵選取 並寫檔儲存

imbalanced : 直接用不平衡的原始資料training model 其中包含AdaBoost, LDA, NN, RF, SVM, XGBoost等模型

LDA, Randomforest, XGBoost kernel : 為解決資料不平衡所提出的方法 三個資料夾中皆有proposed.py, proposed_weighted.py 和 smote.py
	proposed.py 訓練出五個模型進行投票
	proposed_weighted.py 訓練出五個模型並加上權重後進行投票
	smote.py 利用SMOTE解決不平衡後 再訓練模型