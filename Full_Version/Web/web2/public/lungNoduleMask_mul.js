var divImage1 = document.getElementById("divImage1");
var divImage2 = document.getElementById("divImage2");
var divImage3 = document.getElementById("divImage3");

var lungList = document.getElementsByClassName("lungp");
var imgList = document.getElementsByClassName("orip");
var noduleList = document.getElementsByClassName("nodulep");

var nowPic=1;
var nowPic_o=1;
var nowPic_n=1;

// 使用fetch發送GET請求獲取後端JSON檔案
fetch('/getMulResultNum')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const lunglen = data.lungLen;//原圖跟肺
    const nodulelen = data.noduleLen;

    lungLen=lunglen;
    noduleLen=nodulelen

    // number1.innerHTML = "共"+dcmLen +"張";    

    for (var i = 1; i <= lungLen; i++) {
      if (i == 1) {
        paddedI = String(i).padStart(4, '0');
        divImage1.innerHTML =
            `<img src="onlineSegementation_mul/lung_overlapped/0001.png" class="lungp" id="lung1" style="display: block;width:512px;height:512px">`
            // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第1張"; 
      } 
      else {
      paddI = String(i).padStart(4, '0');
            divImage1.innerHTML = divImage1.innerHTML +
            `<img src="onlineSegementation_mul/lung_overlapped/${paddI}.png" class="lungp" id="lung${i}" style="display: none;width:512px;height:512px">`            
      }
    }

    for (var i = 1; i <= lungLen; i++) {
        if (i == 1) {
          paddedI = String(i).padStart(4, '0');
          divImage2.innerHTML =
              `<img src="onlineSegementation_mul/image/0001.png" class="orip" id="ori1" style="display: block;width:512px;height:512px">`
              // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第1張"; 
        } 
        else {
        paddI = String(i).padStart(4, '0');
              divImage2.innerHTML = divImage2.innerHTML +
              `<img src="onlineSegementation_mul/image/${paddI}.png" class="orip" id="ori${i}" style="display: none;width:512px;height:512px">`            
        }
      }
      for (var i = 1; i <= noduleLen; i++) {
        if (i == 1) {
          paddedI = String(i).padStart(4, '0');
          divImage3.innerHTML =
              `<img src="onlineSegementation_mul/nodule_overlapped/0001.png" class="nodulep" id="nodule1" style="display: block;width:512px;height:512px">`
              // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第1張"; 
        } 
        else {
        paddI = String(i).padStart(4, '0');
              divImage3.innerHTML = divImage3.innerHTML +
              `<img src="onlineSegementation_mul/nodule_overlapped/${paddI}.png" class="nodulep" id="nodule${i}" style="display: none;width:512px;height:512px">`            
        }
      }

///肺遮罩滾動
    var pic;
    var opic;
    var npic;
    function MouseWheel(e) {
        for (i = 1; i <= lungList.length; i++) {
            if (e.wheelDelta < 0) {
                //滑鼠滾輪往下
                if (nowPic != lungList.length ) {
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
            for (i = 1; i <= lungList.length; i++) {
                if (i == nowPic) {
                    if (e.wheelDelta) {
                        //IE            
                        // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第"+i+"張";             
                        pic = document.getElementById("lung" + i);
                        pic.style.display = "block"; //元素以區塊呈現
                        opic = document.getElementById("ori" + i);
                        opic.style.display = "block"; //元素以區塊呈現
                        npic = document.getElementById("nodule" + i);
                        npic.style.display = "block"; //元素以區塊呈現
                    
                      } else if (e.detail) {
                        //Firefox
                        pic = document.getElementById("lung" + i);
                        pic.style.display = "block"; //元素以區塊呈現
                        opic = document.getElementById("ori" + i);
                        opic.style.display = "block"; //元素以區塊呈現
                        npic = document.getElementById("nodule" + i);
                        npic.style.display = "block"; //元素以區塊呈現
                    }
                } else {
                    pic = document.getElementById("lung" + i);
                    pic.style.display = "none";
                    opic = document.getElementById("ori" + i);
                    opic.style.display = "none";
                    npic = document.getElementById("nodule" + i);
                    npic.style.display = "none"; //元素以區塊呈現

                }
            }
        }
    }

    for (i = 0; i < lungList.length; i++) {
        lungList[i].addEventListener("mouseover", function (event) {
          document.onmousewheel = MouseWheel;
          scrollBar.innerText =
            `body {
          overflow:hidden;
        }`
        })
        lungList[i].addEventListener("mouseout", function (event) {
          document.onmousewheel = null;
          scrollBar.innerText =
            `body {
          overflow-x:hidden;
        }`
        })
      }
      for (i = 0; i < imgList.length; i++) {
        imgList[i].addEventListener("mouseover", function (event) {
          document.onmousewheel = MouseWheel;
          scrollBar.innerText =
            `body {
          overflow:hidden;
        }`
        })
        imgList[i].addEventListener("mouseout", function (event) {
          document.onmousewheel = null;
          scrollBar.innerText =
            `body {
          overflow-x:hidden;
        }`
        })
      }
      for (i = 0; i < noduleList.length; i++) {
        noduleList[i].addEventListener("mouseover", function (event) {
          document.onmousewheel = MouseWheel;
          scrollBar.innerText =
            `body {
          overflow:hidden;
        }`
        })
        noduleList[i].addEventListener("mouseout", function (event) {
          document.onmousewheel = null;
          scrollBar.innerText =
            `body {
          overflow-x:hidden;
        }`
        })
      }
   
    
   })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
      });
    

