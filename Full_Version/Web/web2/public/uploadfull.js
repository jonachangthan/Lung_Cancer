var divImage2 = document.getElementById("divImage2");
var corimgList = document.getElementsByClassName("corp");
var scrollBar = document.getElementById("style")
var picnow = 0;
var next = document.getElementById("next")
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
    for (j = 0; j < corimgList.length; j++) {
        corimgList[j].addEventListener("mouseover", (event) => {
            document.onmousewheel = MouseWheel2;
        })
        corimgList[j].addEventListener("mouseout", (event) => {
            document.onmousewheel = null;
        })
    }
    if(corLength!=0){
        next.style.display="block";    
    }
    submitBtn.addEventListener("click",(event) => {
        wait.style.display="block"

    })
}