var divImage1 = document.getElementById("divImage1");
var lungimgList = document.getElementsByClassName("lungp");
var scrollBar = document.getElementById("style")
var nowPic = 0; //當下顯示到第幾張圖片
var wait=document.getElementById("wait")
var submitBtn=document.getElementById("submitBtn")

populate();
async function populate() {

    const requestURL = 'http://140.127.208.159:8080/onlinePicNum.json';
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
    if(lungLength!=0){
        next.style.display="block";    
    }
    submitBtn.addEventListener("click",(event) => {
        wait.style.display="block"

    })
   
    

}