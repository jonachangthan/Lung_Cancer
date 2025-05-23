
var divImage1 = document.getElementById("divImage1");
var dcmList = document.getElementsByClassName("dcmp");
var nowPic = 1; //當下顯示到第幾張圖片
var canvas1 = document.getElementById("myCanvas1");
var currentRedDot = null; // 用於記錄當前的紅點

document.getElementById("uploadForm").onsubmit = function(event) {
    var fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
      event.preventDefault(); // 阻止表單提交
      alert("請選擇要上傳的檔案！");
    }
  };

var submit = document.getElementById("submit")
var canvas1 = document.getElementById("myCanvas1");
var form = document.getElementById("form");
var clicked = null;
// 使用fetch發送GET請求獲取後端JSON檔案
fetch('/getSegementationMulNum')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const len = data.len;

    dcmLen=len;//dcm長度

    console.log('dcmLen:', dcmLen); 

    // number1.innerHTML = "共"+dcmLen +"張";    

    for (var i = 1; i <= dcmLen; i++) {
      if (i == 1) {
        paddedI = String(i).padStart(4, '0');
        divImage1.innerHTML =
            `<img src="onlineSegementation_mul/image/0001.png" class="dcmp" id="img1" style="display: block;width:512px;height:512px">`
            // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第1張"; 
      } 
      else {
      paddI = String(i).padStart(4, '0');
            divImage1.innerHTML = divImage1.innerHTML +
            `<img src="onlineSegementation_mul/image/${paddI}.png" class="dcmp" id="img${i}" style="display: none;width:512px;height:512px">`
            
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
                        // number1.innerHTML = "共"+dcmLen +"張"+"，目前為第"+i+"張";  
                        console.log(currentRedDot)
                      
                        pic = document.getElementById("img" + i);
                        pic.style.display = "block"; //元素以區塊呈現

                        if (currentRedDot && currentRedDot.pic === nowPic) {
                          // 畫出之前紀錄的紅點
                          drawRedDot(currentRedDot.x, currentRedDot.y);
                      } else {
                          // 清除上一個紅點
                          var ctx = canvas1.getContext("2d");
                          ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                      }
                    
                      } else if (e.detail) {
                        //Firefox
                        pic = document.getElementById("img" + i);
                        pic.style.display = "block"; //元素以區塊呈現

                        if (currentRedDot && currentRedDot.pic === nowPic) {
                          // 畫出之前紀錄的紅點
                          drawRedDot(currentRedDot.x, currentRedDot.y);
                        } else {
                            // 清除上一個紅點
                            var ctx = canvas1.getContext("2d");
                            ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                        }
                    }
                } else {
                    pic = document.getElementById("img" + i);
                    pic.style.display = "none";

                }
            }
        }
    }
    
      canvas1.addEventListener("mouseover", (event) => {
            document.onmousewheel = MouseWheel;           
        })
    
        canvas1.addEventListener("mouseout", (event) => {
            document.onmousewheel = null;
        })
   })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
      });
    

      function createNodule(x, y, z) {
        //建立新結節object
        this.cordX = x;
        this.cordY = y;
        this.cordZ = z;
      }

function render(e) {
  form.innerHTML = `
    <tr>
      <td align='center' valign="middle">${e.cordX}</td>
      <td align='center' valign="middle">${e.cordY}</td>
      <td align='center' valign="middle">${e.cordZ}</td>
      <input type="hidden" name="cordX" value="${e.cordX}">
      <input type="hidden" name="cordY" value="${e.cordY}">
      <input type="hidden" name="cordZ" value="${e.cordZ}">
    </tr>`;
}

function drawRedDot(x, y) {
  var ctx = canvas1.getContext("2d");
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);

  // 繪製點
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = "#FF0000"
  ctx.fillStyle = "#FF0000"
  ctx.arc(x, y, 2, 0, 2 * Math.PI)
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

canvas1.addEventListener("dblclick", function (event) {
  let x = event.offsetX;
  let y = event.offsetY;

  // 清除紅點
    var ctx = canvas1.getContext("2d");
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    // 建立一個新的結節object
    clicked = new createNodule(x, y,nowPic);

    // render 更新表格
    render(clicked);
    currentRedDot = { x: x, y: y, pic:nowPic};

    // 繪製點
    drawRedDot(x, y);
    submit.style.display = "block";
});

canvas1.addEventListener("mouseover", function (event) {
  document.getElementById("picall").style.transform = "scale(1.5)";
});

canvas1.addEventListener("mouseout", function (event) {
  document.getElementById("picall").style.transform = "scale(1)";
});

submit.addEventListener("click",(event) => {
  wait.style.display="block"

})