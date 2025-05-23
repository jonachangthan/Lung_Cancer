var divImage1 = document.getElementById("divImage1");
var divImage2 = document.getElementById("divImage2");
var dcmList = document.getElementsByClassName("dcmp");
var pngList = document.getElementsByClassName("pngp");
var next = document.getElementById("next");
var nowPic = 1; //當下顯示到第幾張圖片
var nowPic_m = 1; //當下顯示到第幾張圖片
var number1 = document.getElementById("number1");
var number2 = document.getElementById("number2");



document.getElementById("uploadForm").onsubmit = function(event) {
  var fileInput = document.getElementById("fileInput");
  if (fileInput.files.length === 0) {
    event.preventDefault(); // 阻止表單提交
    alert("請選擇要上傳的檔案！");
  }
};

document.getElementById("uploadForm1").onsubmit = function(event) {
  var fileInput1 = document.getElementById("fileInput1");
  if (fileInput1.files.length === 0) {
    event.preventDefault(); // 阻止表單提交
    alert("請選擇要上傳的檔案！");
  }
};

// 使用fetch發送GET請求獲取後端JSON檔案
fetch('/getUploadInvasionNum')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const dcm = data.dcmLen;
    const png = data.pngLen;
    dcmLen=dcm;//dcm長度
    pngLen=png;//png長度

    console.log('pngLen:', pngLen); 
    console.log('dcmLen:', dcmLen); 

    number1.innerHTML = "共"+dcmLen +"張";  
    number2.innerHTML = "共"+pngLen +"張";    

    for (var i = 1; i <= dcmLen; i++) {
      if (i == 1) {
        paddedI = String(i).padStart(4, '0');
        divImage1.innerHTML =
            `<img src="onlineInvasion/image/0001.png" class="dcmp" id="img1" style="display: block;width:512px;height:512px">`
            number1.innerHTML = "共"+dcmLen +"張"+"，目前為第1張"; 
      } 
      else {
      paddI = String(i).padStart(4, '0');
            divImage1.innerHTML = divImage1.innerHTML +
            `<img src="onlineInvasion/image/${paddI}.png" class="dcmp" id="img${i}" style="display: none;width:512px;height:512px">`
            
      }
    }
    for (var i = 1; i <= pngLen; i++) {
      if (i == 1) {
        paddedI = String(i).padStart(4, '0');
        divImage2.innerHTML =
            `<img src="onlineInvasion/mask/0001.png" class="pngp" id="mask1" style="display: block;width:512px;height:512px">`
            number2.innerHTML = "共"+pngLen +"張"+"，目前為第1張";
      } 
      else {
      paddI = String(i).padStart(4, '0');
            divImage2.innerHTML = divImage2.innerHTML +
            `<img src="onlineInvasion/mask/${paddI}.png" class="pngp" id="mask${i}" style="display: none;width:512px;height:512px">`
      }
    }
///原圖滾動
    var pic;
    function MouseWheel(e) {
        for (i = 1; i <= dcmList.length; i++) {
            if (e.wheelDelta < 0) {
                //滑鼠滾輪往下
                if (nowPic != dcmList.length ) {
                    nowPic++;
                   // file.value = nowPic;
                }
            } else if (e.wheelDelta > 0) {
                //滾輪往上
                if (nowPic > 1) {
                    nowPic--;
                    //file.value = nowPic;
                }
            }
            e = e || window.event; //多種瀏覽器兼容
            for (i = 1; i <= dcmList.length; i++) {
                if (i == nowPic) {
                    if (e.wheelDelta) {
                        //IE            
                        number1.innerHTML = "共"+dcmLen +"張"+"，目前為第"+i+"張";  
                        pic = document.getElementById("img" + i);
                        pic.style.display = "block"; //元素以區塊呈現
                    } else if (e.detail) {
                        //Firefox
                        pic = document.getElementById("img" + i);
                        pic.style.display = "block"; //元素以區塊呈現
                    }
                } else {
                    pic = document.getElementById("img" + i);
                    pic.style.display = "none";

                }
            }
        }
    }
    


    for (i = 0; i < dcmList.length; i++) {
      dcmList[i].addEventListener("mouseover", (event) => {
            document.onmousewheel = MouseWheel;
        })
    }

    for (i = 0; i < dcmList.length; i++) {
      dcmList[i].addEventListener("mouseout", (event) => {
            document.onmousewheel = null;
        })
    }
///mask滾動
var pic_m;
function MouseWheel2(e) {
    for (i = 1; i <= pngList.length; i++) {
        if (e.wheelDelta < 0) {
            //滑鼠滾輪往下
            if (nowPic_m != pngList.length ) {
              nowPic_m++;
               // file.value = nowPic;
            }
        } else if (e.wheelDelta > 0) {
            //滾輪往上
            if (nowPic_m > 1) {
              nowPic_m--;
                //file.value = nowPic;
            }
        }
        e = e || window.event; //多種瀏覽器兼容
        for (i = 1; i <= pngList.length; i++) {
            if (i == nowPic_m) {
                if (e.wheelDelta) {
                    //IE                   
                    number2.innerHTML = "共"+pngLen +"張"+"，目前為第"+i+"張";
                    pic_m = document.getElementById("mask" + i);
                    pic_m.style.display = "block"; //元素以區塊呈現
                } else if (e.detail) {
                    //Firefox
                    pic_m = document.getElementById("mask" + i);
                    pic_m.style.display = "block"; //元素以區塊呈現
                }
            } else {
              pic_m = document.getElementById("mask" + i);
              pic_m.style.display = "none";

            }
        }
    }
}



for (i = 0; i < pngList.length; i++) {
  pngList[i].addEventListener("mouseover", (event) => {
        document.onmousewheel = MouseWheel2;
    })
}

for (i = 0; i < pngList.length; i++) {
  pngList[i].addEventListener("mouseout", (event) => {
        document.onmousewheel = null;
    })
}
    
if(pngLen!=0&&dcmLen!=0&&pngLen==dcmLen){
  next.style.display="block";    
}

if(pngLen!=0||dcmlen!=0){
  if( pngLen!=dcmLen)
 alert("請確保原圖及遮罩張數相同，以便成功進行辨識")
}

    //console.log(data);
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });

