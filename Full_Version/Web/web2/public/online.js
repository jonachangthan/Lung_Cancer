var divImage1 = document.getElementById("divImage1");
var divImage2 = document.getElementById("divImage2");
var finSubmit = document.getElementById("finSubmit");

var lungimgList = document.getElementsByClassName("lungp");
var corimgList = document.getElementsByClassName("corp");
var scrollBar = document.getElementById("style")

var nowPic = 0; //當下顯示到第幾張圖片
var picnow = 0;


populate();
async function populate() {

    const requestURL = 'http://140.127.208.120:8080/onlinePicNum.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const superPatients = await response.json();

    populateImages(superPatients);

    function populateImages(obj) {

        lungLength = obj.length;
        corLength = obj.corLength;
    
        for (var i = 0; i < lungLength; i++) {
            if (i == 0) {
                divImage1.innerHTML =
                    `<img src="onlinePicture/lungpic/0.png" class="lungp" id="img0" style="display: block;width:512px;height:512px">`
            } else {
                divImage1.innerHTML = divImage1.innerHTML +
                    `<img src="onlinePicture/lungpic/${i}.png" class="lungp" id="img${i}" style="display: none;width:512px;height:512px">`
            }
        }
        
        var finSubmit = document.getElementById("finSubmit");
        var submitForm = document.getElementById("submitPatient");
        finSubmit.addEventListener("click", (event) => {
            if(lungLength==0||corLength==0){
                alert("請重新上傳圖片")
            }else{
                submitForm.submit();
            }
        })
        

        for (var j = 0; j < corLength; j++) {
           if (j == 0) {
                divImage2.innerHTML =
                    `<img src="onlinePicture/lungcor/0.png" class="corp" id="p0" style="display: block;width:512px;height:512px">`
            } else {
                divImage2.innerHTML = divImage2.innerHTML +
                    `<img src="onlinePicture/lungcor/${j}.png" class="corp" id="p${j}" style="display: none;width:512px;height:512px">`
            }
        }
    }

    scrollBar.innerText =
      `body {
        overflow-x:hidden;
        }`

    var pic;
    function MouseWheel(e) {
        for (i = 0; i < lungimgList.length; i++) {
            if (e.wheelDelta < 0) {
                //滑鼠滾輪往下
                if (nowPic != lungimgList.length - 1) {
                    nowPic++;
                   // file.value = nowPic;
                }
            } else if (e.wheelDelta > 0) {
                //滾輪往上
                if (nowPic != 0) {
                    nowPic--;
                    //file.value = nowPic;
                }
            }
            e = e || window.event; //多種瀏覽器兼容
            for (i = 0; i < lungimgList.length; i++) {
                if (i == nowPic) {
                    if (e.wheelDelta) {
                        //IE                   
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
    
    var cor;
    //滾動肺窗正面照
    function MouseWheel2(e) {
        for (i = 0; i < corimgList.length; i++) {
            if (e.wheelDelta < 0) {
                //滑鼠滾輪往下
                if (picnow != corimgList.length - 1) {
                    picnow++;
                    //file.value = picnow;
                }
            } else if (e.wheelDelta > 0) {
                //滾輪往上
                if (picnow != 0) {
                    picnow--;
                   // file.value = picnow;
                }
            }

            e = e || window.event; //多種瀏覽器兼容
            for (i = 0; i < corimgList.length; i++) {
                if (i == picnow) {
                    if (e.wheelDelta) {
                        //IE
                        cor = document.getElementById("p" + i);
                        cor.style.display = "block";

                    } else if (e.detail) {
                        //Firefox
                        cor = document.getElementById("p" + i);
                        cor.style.display = "block";
                    }
                } else {
                    cor = document.getElementById("p" + i);
                    cor.style.display = "none";
                }
            }
        }
    }

    for (i = 0; i < lungimgList.length; i++) {
        lungimgList[i].addEventListener("mouseover", (event) => {
            document.onmousewheel = MouseWheel;
        })
    }

    for (i = 0; i < lungimgList.length; i++) {
        lungimgList[i].addEventListener("mouseout", (event) => {
            document.onmousewheel = null;
        })
    }

    for (j = 0; j < corimgList.length; j++) {
        corimgList[j].addEventListener("mouseover", (event) => {
            document.onmousewheel = MouseWheel2;
        })
        corimgList[j].addEventListener("mouseout", (event) => {
            document.onmousewheel = null;
        })
    }
}