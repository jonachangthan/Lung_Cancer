var form = document.getElementById("form"); //獲取表格標籤
var file = document.getElementById("formf");
var deleteID = document.getElementById("formID");
var clearID = document.getElementById("clearID");
var finid = document.getElementById("finid")
var skipid = document.getElementById("skipid")
var canvas1 = document.getElementById("myCanvas1");
var canvas2 = document.getElementById("myCanvas2");
var scrollBar = document.getElementById("style")
var number = document.getElementById("number");
var divImage1 = document.getElementById("divImage1");
var divImage2 = document.getElementById("divImage2");
var divImage3 = document.getElementById("divImage3");
var divImage4 = document.getElementById("divImage4");
var text = document.getElementById("text");
var result = document.getElementById("result");
var pid = document.getElementById("patient")
var num = document.getElementById("num")
var quantity = document.getElementById("quantity")
var checkbox1 = document.getElementById("checkbox1")
var checkbox0 = document.getElementById("checkbox0")


var loading = document.getElementById("loading")
var lungimgList = document.getElementsByClassName("lungp");
var softimgList = document.getElementsByClassName("softp");
var corimgList = document.getElementsByClassName("corp");
var corsoftimgList = document.getElementsByClassName("corp_soft");

var patientID;
var lungLength;
var corLength;

var nowPic = 0; //當下顯示到第幾張圖片
var picnow = 0;


populate();
async function populate() {

  const requestURL = 'http://140.127.208.159:8080/index.json';
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superPatients = await response.json();

  populateImages(superPatients);

  function populateImages(obj) {

    const id = obj.patientID;
    const name = obj.patientName;
    const intID = parseInt(obj.patientID);
    patientName=name;
    patientID = id; //病人編號
    deleteID.value = patientID;
    clearID.value = patientID;
    finid.value = patientID;
    skipid.value = patientID;
    lungLength = obj.length;
    corLength = obj.corLength;
    console.log(corLength)

    for (var i = 0; i < lungLength; i++) {
      if (i == 0) {
        divImage1.innerHTML =
          `<img src="${patientID}/0.png" class="lungp" id="img0" style="display: block;width:512px;height:512px">`
      } else {
        divImage1.innerHTML = divImage1.innerHTML +
          ` <img src="${patientID}/${i}.png" class="lungp" id="img${i}" style="display: none;width:512px;height:512px">`
      }
      divImage2.innerHTML = divImage2.innerHTML +
        ` <img src="soft${intID}/${i}.png" class="softp" id="soft${i}" style="display: none";width:512px;height:512px">`

    }
    for (var j = 0; j < corLength; j++) {
      if (j == 0) {
        divImage3.innerHTML =
          `<img src="cor${intID}/0.png" class="corp" id="p0" style="display: block;width:512px;height:512px">`
      } else {
        divImage3.innerHTML = divImage3.innerHTML +
          ` <img src="cor${intID}/${j}.png" class="corp" id="p${j}" style="display: none;width:512px;height:512px">`
      }
      divImage4.innerHTML = divImage4.innerHTML +
        ` <img src="cor${intID}_soft/${j}.png" class="corp_soft" id="p_soft${j}" style="display: none";width:512px;height:512px">`
    }
    pid.innerHTML = patientName;
    text.innerHTML =
      `<h5><b><a href="text${intID}.html" target="_blank">文字報告</a></b></h5>`
    result.innerHTML =
      `<form method="post" action="/resultBtn">
    <input name="patientID" type="hidden" value="${id}">
    <button class="btn btn-outline-dark me-md-2" type="submit">瀏覽結果</button>
  </form>`
  }

  // document.onreadystatechange = subSomething;
  // function subSomething() {
  //  if (document.readyState == "complete") {
  //    loading.style.display = "none";
  //  }
  // }

  //window.addEventListener("load", function () {
  console.log(corLength)
  //肺窗
  var pic;
  var soft;
  function MouseWheel(e) {
    for (i = 0; i < lungimgList.length; i++) {
      if (e.wheelDelta < 0) {
        //滑鼠滾輪往下
        if (nowPic != lungimgList.length - 1) {
          nowPic++;
          file.value = nowPic;
        }
      } else if (e.wheelDelta > 0) {
        //滾輪往上
        if (nowPic != 0) {
          nowPic--;
          file.value = nowPic;
        }
      }

      e = e || window.event; //多種瀏覽器兼容
      for (i = 0; i < lungimgList.length; i++) {
        if (i == nowPic) {
          if (e.wheelDelta) {
            //IE
            number.innerHTML = "picture" + i;
            soft = document.getElementById("soft" + i);
            soft.style.display = "none";
            pic = document.getElementById("img" + i);
            pic.style.display = "block"; //元素以區塊呈現
          } else if (e.detail) {
            //Firefox
            soft = document.getElementById("soft" + i);
            soft.style.display = "none";
            pic = document.getElementById("img" + i);
            pic.style.display = "block"; //元素以區塊呈現
          }
        } else {
          pic = document.getElementById("img" + i);
          pic.style.display = "none";
          soft = document.getElementById("soft" + i);
          soft.style.display = "none"; //不會在畫面上佔有空間，後續元素會自動遞補上
        }
      }
      printClicked();
    }
  }

  //軟組織
  function MouseWheel1(e) {
    if (e.wheelDelta < 0) {
      //滑鼠滾輪往下
      if (nowPic != softimgList.length - 1) {
        nowPic++;
        file.value = nowPic;
      }
    } else if (e.wheelDelta > 0) {
      //滾輪往上
      if (nowPic != 0) {
        nowPic--;
        file.value = nowPic;
      }
    }
    //console.log(file.value);
    e = e || window.event; //多種瀏覽器兼容
    for (i = 0; i < softimgList.length; i++) {
      if (i == nowPic) {
        if (e.wheelDelta) {
          //IE
          pic = document.getElementById("img" + i);
          pic.style.display = "none";
          soft = document.getElementById("soft" + i);
          soft.style.display = "block"; //元素以區塊呈現
        } else if (e.detail) {
          //Firefox
          pic = document.getElementById("img" + i);
          pic.style.display = "none;";
          soft = document.getElementById("soft" + i);
          soft.style.display = "block";
        }
      } else {
        pic = document.getElementById("img" + i);
        pic.style.display = "none";
        soft = document.getElementById("soft" + i);
        soft.style.display = "none"; //不會在畫面上佔有空間，後續元素會自動遞補上
      }
    }
    printClicked2()
  }
  var cor;
  var corsoft;
  //滾動肺窗正面照
  function MouseWheel2(e) {
    for (i = 0; i < corimgList.length; i++) {
      if (e.wheelDelta < 0) {
        //滑鼠滾輪往下
        if (picnow != corimgList.length - 1) {
          picnow++;
          file.value = picnow;
        }
      } else if (e.wheelDelta > 0) {
        //滾輪往上
        if (picnow != 0) {
          picnow--;
          file.value = picnow;
        }
      }

      e = e || window.event; //多種瀏覽器兼容
      for (i = 0; i < corimgList.length; i++) {
        if (i == picnow) {
          if (e.wheelDelta) {
            //IE
            corsoft = document.getElementById("p_soft" + i);
            corsoft.style.display = "none"; //元素以區塊呈現
            cor = document.getElementById("p" + i);
            cor.style.display = "block";

          } else if (e.detail) {
            //Firefox
            corsoft = document.getElementById("p_soft" + i);
            corsoft.style.display = "none"; //元素以區塊呈現
            cor = document.getElementById("p" + i);
            cor.style.display = "block";
          }
        } else {
          cor = document.getElementById("p" + i);
          cor.style.display = "none";
          corsoft = document.getElementById("p_soft" + i);
          corsoft.style.display = "none"; //不會在畫面上佔有空間，後續元素會自動遞補上
        }
      }
    }
  }
  //滾動軟組織正面照
  function MouseWheel3(e) {
    for (i = 0; i < corsoftimgList.length; i++) {
      if (e.wheelDelta < 0) {
        //滑鼠滾輪往下
        if (picnow != corsoftimgList.length - 1) {
          picnow++;
          file.value = picnow;
        }
      } else if (e.wheelDelta > 0) {
        //滾輪往上
        if (picnow != 0) {
          picnow--;
          file.value = picnow;
        }
      }

      e = e || window.event; //多種瀏覽器兼容
      for (i = 0; i < corsoftimgList.length; i++) {
        if (i == picnow) {
          if (e.wheelDelta) {
            //IE
            cor = document.getElementById("p" + i);
            cor.style.display = "none";
            corsoft = document.getElementById("p_soft" + i);
            corsoft.style.display = "block"; //元素以區塊呈現

          } else if (e.detail) {
            //Firefox
            cor = document.getElementById("p" + i);
            cor.style.display = "none";
            corsoft = document.getElementById("p_soft" + i);
            corsoft.style.display = "block"; //元素以區塊呈現
          }
        } else {
          cor = document.getElementById("p" + i);
          cor.style.display = "none";
          corsoft = document.getElementById("p_soft" + i);
          corsoft.style.display = "none"; //不會在畫面上佔有空間，後續元素會自動遞補上
        }
      }
    }
  }


  //////////////////呼叫滾輪事件
  canvas1.addEventListener("mouseover", (event) => {
    document.onmousewheel = MouseWheel;
    scrollBar.innerText =
      `body {
        overflow:hidden;
        }`
  })
  canvas1.addEventListener("mouseout", (event) => {
    document.onmousewheel = null;
    scrollBar.innerText = ""
  })


  canvas2.addEventListener("mouseover", (event) => {
    document.onmousewheel = MouseWheel1;
    scrollBar.innerText =
      `body {
        overflow:hidden;
        }`
  })
  canvas2.addEventListener("mouseout", (event) => {
    document.onmousewheel = null;
    scrollBar.innerText = ""
  })
  console.log(corimgList.length)
  for (j = 0; j < corimgList.length; j++) {
    corimgList[j].addEventListener("mouseover", (event) => {
      document.onmousewheel = MouseWheel2;
      scrollBar.innerText =
        `body {
        overflow:hidden;
        }`
    })
    corimgList[j].addEventListener("mouseout", (event) => {
      document.onmousewheel = null;
      scrollBar.innerText = ""
    })
  }

  for (l = 0; l < corsoftimgList.length; l++) {
    corsoftimgList[l].addEventListener("mouseover", (event) => {
      document.onmousewheel = MouseWheel3;
      scrollBar.innerText =
        `body {
 overflow:hidden;
}`
    })
    corsoftimgList[l].addEventListener("mouseout", (event) => {
      document.onmousewheel = null;
      scrollBar.innerText = ""
    })
  }


  //////////////////////
  var softtissueButton = document.getElementById("softtissueButton");
  var lungButton = document.getElementById("lungButton");

  var lungpic;
  var softpic;
  //顯示肺窗值
  lungButton.addEventListener("click", function () {
    document.onmousewheel = MouseWheel;
    canvas2.style.display = "none";
    canvas1.style.display = "block";

    cor_softpic = document.getElementById("p_soft" + picnow);
    cor_softpic.style.display = "none";

    corpic = document.getElementById("p" + picnow);
    corpic.style.display = "block";

    for (i = 0; i < lungimgList.length; i++) {
      if (i == nowPic) {
        softpic = document.getElementById("soft" + i);
        softpic.style.display = "none";
        lungpic = document.getElementById("img" + i);
        lungpic.style.display = "block";
      }
    }
  });
  //顯示軟組織肺窗值
  softtissueButton.addEventListener("click", function () {
    document.onmousewheel = MouseWheel1;
    canvas1.style.display = "none";
    canvas2.style.display = "block";

    corpic = document.getElementById("p" + picnow);
    corpic.style.display = "none";

    cor_softpic = document.getElementById("p_soft" + picnow);
    cor_softpic.style.display = "block";

    for (i = 0; i < lungimgList.length; i++) {
      if (i == nowPic) {
        lungpic = document.getElementById("img" + i);
        lungpic.style.display = "none";
        softpic = document.getElementById("soft" + i);
        softpic.style.display = "block"; //元素以區塊呈現
      }
    }
  });



  var corpic;
  var coordinate_y = [];

  //找肺窗照
  canvas1.addEventListener("click", function (event) {

    var y = event.offsetY; //當前的y座標
    var cor_y = 282 / corimgList.length; //3.76
    for (j = 0; j <= 282; j += cor_y) {
      coordinate_y.push(Math.ceil(j)); //取照片之最大整數值
    }

    var i = 0; //當下的照片
    while (y >= coordinate_y[i] + 97) {
      i++;
    }

    for (k = 0; k < corimgList.length; k++) {
      if (k == i - 1) {
        picnow = k;
        corpic = document.getElementById("p" + k);
        corpic.style.display = "block"; //元素以區塊呈現
      } else {
        corpic = document.getElementById("p" + k);
        corpic.style.display = "none";
      }
    }
  });

  var cor_softpic;
  //找軟組織窗正面照
  canvas2.addEventListener("click", function (event) {
    var y = event.offsetY; //當前的y座標
    var cor_y = 282 / corsoftimgList.length;
    for (j = 0; j <= 282; j += cor_y) {
      coordinate_y.push(Math.ceil(j));
    }
    var i = 0; //當下的照片
    while (y >= coordinate_y[i] + 97) {
      i++;
    }
    for (k = 0; k < corsoftimgList.length; k++) {
      if (k == i - 1) {
        picnow = k;
        cor_softpic = document.getElementById("p_soft" + k);
        cor_softpic.style.display = "block"; //元素以區塊呈現
      } else {
        cor_softpic = document.getElementById("p_soft" + k);
        cor_softpic.style.display = "none";
      }
    }
  });




  //建造函數
  function createNodule(id,name, x, y, z) {
    //建立新結節object
    this.patientID=id;
    this.patientName = name;
    this.cordX = x;
    this.cordY = y;
    this.cordZ = z;
  }

  //var noduleList = []; //儲存該病人所有結節位置的陣列
  function render(e) {
    if (form.innerHTML.length < 100) {
      form.innerHTML = form.innerHTML + `
<tr>
   <th align='center' valign="middle" scope="row">${e.patientName}</th>
   <td align='center' valign="middle">${e.cordX}</td>
   <td align='center' valign="middle">${e.cordY}</td>
   <td align='center' valign="middle">${e.cordZ}</td>
   <td><select  name="option" style="width:200px" id="type" class="form-select">
       <option selected>選擇種類</option>
       <option value="calcified">calcified</option>
       <option value="perifissural">perifissural</option>
       <option value="pure GGN">pure GGN</option>
       <option value="heterogenous GGN">heterogenous GGN</option>
       <option value="part solid">part solid</option>
       <option value="solid">solid</option>
       <option value="undetermined">undetermined</option>
       </select>
   </td>
   <td><select name="num" style="width:200px" id="num" class="form-select">
   <option selected>選擇顆數</option>
       <option value="1">1</option>
       <option value="2">2</option>
       <option value="3">3</option>
       <option value="4">4</option>
       <option value="5">5</option>
       <option value="6">6</option>
       <option value="7">7</option>
       </select>
   </td>
   <td ><input type="text" class="form-control " id="quantity" name="text" value="" placeholder="若大於7顆，請在此輸入顆數" style="width:250px" ></td>  

   <td align='center' valign="middle">
   <div class="form-check form-check-inline">
   <input class="form-check-input" type="radio" value="" name="checkbox1" id="checkbox1" >
   <label class="form-check-label" for="inlineRadio1" style="font-weight:bold">是</label>
   </div>
   <div class="form-check form-check-inline">
   <input class="form-check-input" type="radio" value="" name="checkbox1" id="checkbox0" >
   <label class="form-check-label" for="inlineRadio2" style="font-weight:bold">否</label>
   </div>
   </td>
   
   <input type="hidden" name="patientID" value="${e.patientID}">
   <input type="hidden" name="filename" value="${e.cordZ}">
   <input type="hidden" name="cordX" value="${e.cordX}">
   <input type="hidden" name="cordY" value="${e.cordY}">
 </tr>`;

    } else {
      form.innerHTML = form.innerHTML + `
<tr>
   <th align='center' valign="middle" scope="row">${e.patientName}</th>
   <td align='center' valign="middle">${e.cordX}</td>
   <td align='center' valign="middle">${e.cordY}</td>
   <td align='center' valign="middle">${e.cordZ}</td>
   <td></td>
   <td></td>
   <td></td>
   <td></td>
   
   <input type="hidden" name="patientID" value="${e.patientID}">
   <input type="hidden" name="filename" value="${e.cordZ}">
   <input type="hidden" name="cordX" value="${e.cordX}">
   <input type="hidden" name="cordY" value="${e.cordY}">
 </tr>`;
    }
}


  //console.log(imgArray);
  canvas1.addEventListener("dblclick", function (event) {

    let x = event.offsetX;
    let y = event.offsetY;

    //建立一個新的結節object 並push至noduleList中
    let newNodule = new createNodule(
      patientID,
      patientName,
      x,
      y,
      nowPic //z座標同張數
    );

    //render 更新表格
    render(newNodule);
  });

  canvas2.addEventListener("dblclick", function (event) {
    var x = event.offsetX;
    var y = event.offsetY;

    //建立一個新的結節object 並push至noduleList中
    let newNodule = new createNodule(
      patientID,
      patientName,
      x,
      y,
      nowPic
    );
    render(newNodule);
  });


  var action = document.getElementById("a");
  var button = document.getElementById("modeButton");
  button.addEventListener("click", (event) => {
    actionString = action.action[action.action.length - 1];
    if (actionString == "2") {//writefile2->writefile
      action.action = "writefile";
      button.innerText = "manual";
    } else {//writefile->writefile2
      action.action = "writefile2";
      button.innerText = "auto";
    }
  });

  var submitbtn = document.getElementById("submitBtn");
  submitbtn.addEventListener("click", (event) => {
    const checkbox1 = document.querySelector('#checkbox1');
    const checkbox0 = document.querySelector('#checkbox0');
    if(checkbox1.checked==true){
      checkbox1.value=1
      console.log(checkbox1.value)
    }
    else if(checkbox0.checked==true){
      checkbox0.value=0
      console.log(checkbox0.value)
    }
    var c1 = document.getElementById("checkbox1")
    var c0 = document.getElementById("checkbox0")
     var q = document.getElementById("quantity")
     var n = document.getElementById("num")
     var t = document.getElementById("type")
     if(q.value!=''&&n.value!="選擇顆數"){
      alert("輸入錯誤")
     }
     else if(q.value==''&&n.value=="選擇顆數"){
      alert("請選擇顆數")
     }
     else if(t.value=="選擇種類"){
      alert("請選擇種類")
     }
     else if(c1.value==''&&c0.value==''){
      alert("請選擇是否為main tumor")
     }
     else{
      action.submit();
     }
  })
  


  let clicked = []
  var startX, startY;

  var isdown = 0
  function mouseDown(e, d) {
    down_id = e.id;
    startX = d.offsetX;
    startY = d.offsetY;
    isdown = 1;
    var ctx = canvas1.getContext("2d");
    ctx.lineWidth = 1;
    //ctx.clearRect(0, 0, 512, 512);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = "#FF0000"
    ctx.fillStyle = "#FF0000"
    ctx.arc(startX, startY, 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath();
    ctx.stroke();
    console.log(startX + ",,,," + startY)

    let temp = [startX, startY, nowPic];
    clicked.push(temp);
    //console.log(clicked.length)
  }

  function wheelDelete() {
    canvas1.addEventListener("wheel", function (event) {
      //console.log(nowPic)
      var ctx = canvas1.getContext("2d");
      ctx.clearRect(0, 0, 512, 512);
      //printClicked();
    });
  }

  function printClicked() {
    for (var i = 0; i < clicked.length; i++) {
      if (clicked[i][2] == nowPic) {
        var ctx = canvas1.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(clicked[i][0], clicked[i][1]);
        ctx.strokeStyle = "#FF0000"
        ctx.fillStyle = "#FF0000"
        ctx.arc(clicked[i][0], clicked[i][1], 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath();
        ctx.stroke();
      }
    }
  }



  canvas1.addEventListener("dblclick", function (event) {
    mouseDown(this, event);
  });
  canvas1.addEventListener("mouseover", function (event) {
    wheelDelete();
    //printClicked();
  });
  var picbox = document.getElementsByClassName("lungp")
  canvas1.addEventListener("mouseover", function (event) {
    document.getElementById("picall").style.transform = "scale(1.5)";
  });
  canvas1.addEventListener("mouseout", function (event) {
    document.getElementById("picall").style.transform = "scale(1)";
  });
  ///////////////////////////////////////////////////////////////////////////////
  let clicked2 = []
  var startX2, startY2;

  var isdown2 = 0

  function mouseDown2(e, d) {
    down_id = e.id;
    startX2 = d.offsetX;
    startY2 = d.offsetY;
    isdown = 1;
    var ctx = canvas2.getContext("2d");
    ctx.lineWidth = 1;
    //ctx.clearRect(0, 0, 512, 512);

    ctx.beginPath();
    ctx.moveTo(startX2, startY2);
    ctx.strokeStyle = "#FF0000"
    ctx.fillStyle = "#FF0000"
    ctx.arc(startX2, startY2, 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath();
    ctx.stroke();
    console.log(startX2 + ",,,," + startY2)
    let temp = [startX2, startY2, nowPic];
    clicked2.push(temp);
  }



  function wheelDelete2() {
    canvas2.addEventListener("wheel", function (event) {
      var ctx = canvas2.getContext("2d");
      ctx.clearRect(0, 0, 512, 512);
    });
  }
  function printClicked2() {
    for (var i = 0; i < clicked2.length; i++) {
      if (clicked2[i][2] == nowPic) {
        var ctx = canvas2.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(clicked2[i][0], clicked2[i][1]);
        ctx.strokeStyle = "#FF0000"
        ctx.fillStyle = "#FF0000"
        ctx.arc(clicked2[i][0], clicked2[i][1], 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
  canvas2.addEventListener("dblclick", function (event) {
    mouseDown2(this, event);
  });
  canvas2.addEventListener("mouseover", wheelDelete2);

  var picbox = document.getElementsByClassName("lungp")
  canvas2.addEventListener("mouseover", function (event) {
    document.getElementById("picall").style.transform = "scale(1.5)";
  });
  canvas2.addEventListener("mouseout", function (event) {
    document.getElementById("picall").style.transform = "scale(1)";
  });
  // }
  // )


  /*function clickedDeleted(e){
    console.log(e.keyCode)
    switch(e.keyCode){
      case 90:
      var ctx=canvas1.getContext("2d");
      let lastNum = clicked.length-1;
      ctx.clearRect(clicked[lastNum][0] - 2 - 1, clicked[lastNum][1] - 2 - 1,
                      2 * 2 + 2, 2 * 2 + 2);
      clicked.pop();
      break;
    }
  }
  
  function clickedDeleted2(e){
    console.log(e.keyCode)
    switch(e.keyCode){
      case 90:
      var ctx=canvas2.getContext("2d");
      let lastNum = clicked2.length-1;
      ctx.clearRect(clicked2[lastNum][0] - 2 - 1, clicked2[lastNum][1] - 2 - 1,
                      2 * 2 + 2, 2 * 2 + 2);
      clicked2.pop();
      break;
    }
  }
   
  
  window.addEventListener("keydown",function(event) {
    if(canvas1.style.display == "block"){
      clickedDeleted(event);
    }
    else if(canvas2.style.display == "block"){
    clickedDeleted2(event);
  }
  })*/
}