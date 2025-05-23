var oriimgList = document.getElementsByClassName("origin");
var way1imgList = document.getElementsByClassName("way1");
var mergelist = document.getElementsByClassName("merge");
var canvas = document.getElementById("myCanvas1");
var scrollBar = document.getElementById("style")
var line = document.getElementById("line")
var form = document.getElementById("form")
var remark = document.getElementById("remark")
var finid = document.getElementById("finid")
var skipid= document.getElementById("skipid")

var method1 = document.getElementById("method1");
var method2 = document.getElementById("method2");

var divImage1 = document.getElementById("divImage1");
var divImage2 = document.getElementById("divImage2");
var divImage3 = document.getElementById("divImage3");
var nowPic = 0;
var patientName;

var checkBox = document.getElementById("flexCheckDefault");

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
    patientID = id; //病人編號
    patientName=name;

    finid.value = patientID;
    skipid.value = patientID;
    lungLength = obj.length;
    corLength = obj.corLength;
    //console.log(corLength)

    for (var i = 1; i <= lungLength; i++) {
      if (i == 1) {
        divImage1.innerHTML = divImage1.innerHTML +
          `<img src="final/1/${intID}/1.png" class="origin" id="ori1"
      style="display: block;width:500px;height:500px;float: left;">`
        divImage2.innerHTML = divImage2.innerHTML +
          `<img src="final/2/${intID}/1.png" class="way1" id="w1"
      style="display: block;width:500px;height:500px;float: right;">`
        divImage3.innerHTML = divImage3.innerHTML +
          `<img src="final/3/${intID}/1.png" class="merge" id="m1"
     style="display:block;width:500px;height:500px;float: right;">`
      } else {
        divImage1.innerHTML = divImage1.innerHTML +
          `<img src="final/1/${intID}/${i}.png" class="origin" id="ori${i}"
      style="display: none;width:500px;height:500px;float: left;">`
        divImage2.innerHTML = divImage2.innerHTML +
          `<img src="final/2/${intID}/${i}.png" class="way1" id="w${i}"
      style="display: none;width:500px;height:500px;float: right;">`
        divImage3.innerHTML = divImage3.innerHTML +
          `<img src="final/3/${intID}/${i}.png" class="merge" id="m${i}"
      style="display:none;width:500px;height:500px;float: right;">`
      }

    }

  }


  var pp = document.getElementById("patient");
  pp.innerHTML = patientName;//病人編號

  var pic;
  var way1;
  var merpic;
  var el = document.getElementById("main");

  function MouseWheel(e) {
    for (i = 0; i < oriimgList.length; i++) {
      if (e.wheelDelta < 0) {
        //滑鼠滾輪往下
        if (nowPic != oriimgList.length - 1) {
          nowPic++;
        }
      } else if (e.wheelDelta > 0) {
        //滾輪往上    
        if (nowPic != 0) {
          nowPic--; //0~116
        }
      }

      e = e || window.event; //多種瀏覽器兼容
      for (i = 0; i < oriimgList.length; i++) {
        if (i == nowPic) {
          if (e.wheelDelta) {

            el.innerHTML = "_picture" + (i + 1);

            pic = document.getElementById("ori" + (i + 1));
            pic.style.display = "block"; //元素以區塊呈現
            way1 = document.getElementById("w" + (i + 1));
            way1.style.display = "block";
            merpic = document.getElementById("m" + (i + 1));
            merpic.style.display = "block";

          } else if (e.detail) {
            //Firefox
            pic = document.getElementById("ori" + (i + 1));
            pic.style.display = "block"; //元素以區塊呈現
            way1 = document.getElementById("w" + (i + 1));
            way1.style.display = "block";
            merpic = document.getElementById("m" + (i + 1));
            merpic.style.display = "block";

          }
        } else {
          pic = document.getElementById("ori" + (i + 1));
          pic.style.display = "none"; //元素以區塊呈現
          way1 = document.getElementById("w" + (i + 1));
          way1.style.display = "none";
          merpic = document.getElementById("m" + (i + 1));
          merpic.style.display = "none";

        }
      }
      printClicked();
    }
  }

  for (i = 0; i < oriimgList.length; i++) {
    oriimgList[i].addEventListener("mouseover", function (event) {
      document.onmousewheel = MouseWheel;
      scrollBar.innerText =
        `body {
      overflow:hidden;
    }`
    })
    oriimgList[i].addEventListener("mouseout", function (event) {
      document.onmousewheel = null;
      scrollBar.innerText =
        `body {
      overflow-x:hidden;
    }`
    })
  }
  for (i = 0; i < way1imgList.length; i++) {
    way1imgList[i].addEventListener("mouseover", function (event) {
      document.onmousewheel = MouseWheel;
      scrollBar.innerText =
        `body {
      overflow:hidden;
    }`
    })
    way1imgList[i].addEventListener("mouseout", function (event) {
      document.onmousewheel = null;
      scrollBar.innerText =
        `body {
      overflow-x:hidden;
    }`
    })
  }
  canvas.addEventListener("mouseover", function (event) {
    document.onmousewheel = MouseWheel;
    scrollBar.innerText =
      `body {
    overflow:hidden;
  }`
  })
  canvas.addEventListener("mouseout", function (event) {
    document.onmousewheel = null;
    scrollBar.innerText =
      `body {
    overflow-x:hidden;
  }`
  })

  //建造函數
  function createNodule(id, name,z, sx, sy, ex, ey) {
    //建立新結節object
    this.patientID = id;
    this.patientName=name;
    this.cordZ = z;
    this.ScordX = sx;
    this.ScordY = sy;
    this.EcordX = ex;
    this.EcordY = ey;
  }

  function render(e) {
    if (form.innerHTML.length < 100) {
      form.innerHTML = form.innerHTML + `
    <tr>
        <th valign="middle" scope="row">${e.patientName}</th>
        <td valign="middle">${e.cordZ}</td>
        <td valign="middle">(${e.ScordX},${e.ScordY})</td>
        <td valign="middle">(${e.EcordX},${e.EcordY})</td>
        <td ><select  style="width:150px" class="form-select"  name="option" id="choose" >
        <option selected>選項</option>
        <option value="多圈">多圈</option>
        <option value="少圈">少圈</option>
        </select></td>
        <td ><input type="text" class="form-control " id="FormControlInput" name="text" value="" style="width:500px" ></td>  
        <input type="hidden" name="patientID" value="${e.patientID}">
        <input type="hidden" name="filename" value="${e.cordZ}">
        <input type="hidden" name="startX" value="${e.ScordX}">
        <input type="hidden" name="startY" value="${e.ScordY}">
        <input type="hidden" name="endX" value="${e.EcordX}">
        <input type="hidden" name="endY" value="${e.EcordY}">
        
     
      </tr>`;
    } else {
      form.innerHTML = form.innerHTML + `
    <tr>
    <th  valign="middle" scope="row">${e.patientName}</th>
    <td  valign="middle">${e.cordZ}</td>
    <td  valign="middle">(${e.ScordX},${e.ScordY})</td>
    <td valign="middle">(${e.EcordX},${e.EcordY})</td>
    <td></td>
    <td ><input type="text" class="form-control " id="FormControlInput" name="text" value="" style="width:500px" ></td>  

    <input type="hidden" name="patientID" value="${e.patientID}">
        <input type="hidden" name="filename" value="${e.cordZ}">
        <input type="hidden" name="startX" value="${e.ScordX}">
        <input type="hidden" name="startY" value="${e.ScordY}">
        <input type="hidden" name="endX" value="${e.EcordX}">
        <input type="hidden" name="endY" value="${e.EcordY}">      
      </tr>
     `;
      line.innerHTML = ` <p class="line"></p>
      <span style="font-weight:bold;color:rgb(179, 85, 23);font-size:30px;text-align :center">瀏覽結果
      </span>
      <p class="line"></p>`
    }
  }
  var content = document.getElementById("content");
  var submitbtn = document.getElementById("submitBtn");
  submitbtn.addEventListener("click", (event) => {
     var c = document.getElementById("choose")
     if(c.value=="選項"){
      alert("請選擇多圈或少圈")
     }
     else{
      content.submit();
     }
  })

//  //方法一
//  method1.addEventListener("click", function () {

//   var way1 = document.getElementsByClassName("way1");
//   for (var i = 0; i < way1.length; i++) {
//     way1[0].style.display = "block";
//   }
//   var merge = document.getElementsByClassName("merge");
//   for (var i = 0; i < merge.length; i++) {
//     merge[0].style.display = "block";
//   }
// });

//  //方法二
//  method2.addEventListener("click", function () {
//   document.onmousewheel = MouseWheel;


//   var way1 = document.getElementsByClassName("way1");
//   for (var i = 0; i < way1.length; i++) {
//     way1[i].style.display = "none";
//   }
//   var merge = document.getElementsByClassName("merge");
//   for (var i = 0; i < merge.length; i++) {
//     merge[i].style.display = "none";
//   }
//   // for (i = 0; i < lungimgList.length; i++) {
//   //   if (i == nowPic) {
//   //     softpic = document.getElementById("soft" + i);
//   //     softpic.style.display = "none";
//   //     lungpic = document.getElementById("img" + i);
//   //     lungpic.style.display = "block";
//   //   }
//   // }
// });

  ///拉框
  let clicked = []
  var startX, startY;
  var endX, endY;

  var isdown = 0
  function mouseUp(e, d) {
    isdown = 0;
    var ctx = canvas.getContext("2d");
    endX = d.offsetX;
    endY = d.offsetY;
    console.log(endX + ",,,," + endY)
    //ctx.clearRect(0,0,400,400);

    let temp = [startX, startY, endX, endY, nowPic];
    clicked.push(temp);

  }
  function mouseDown(e, d) {
    down_id = e.id;
    startX = d.offsetX;
    startY = d.offsetY;
    isdown = 1;
    console.log(startX + ",,,," + startY)
  }


  function mousemove(e) {
    if (isdown) {
      height = canvas.style.height
      width = canvas.style.width
      var ctx = canvas.getContext("2d");
      ctx.lineWidth = 1;
      ctx.clearRect(0, 0, 500, 500);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, startY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.lineTo(startX, e.offsetY);
      ctx.closePath();
      ctx.strokeStyle = "#FFD306"
      ctx.stroke();

    }
  }

  function wheelDelete() {
    canvas.addEventListener("wheel", function (event) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 500, 500);
    });
  }

  function printClicked() {
    for (var i = 0; i < clicked.length; i++) {
      //console.log(nowPic)
      console.log(clicked[i][4])
      if (clicked[i][4] == nowPic) {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(clicked[i][0], clicked[i][1]);
        ctx.strokeStyle = "#FFD306"
        ctx.lineTo(clicked[i][2], clicked[i][1]);
        ctx.lineTo(clicked[i][2], clicked[i][3]);
        ctx.lineTo(clicked[i][0], clicked[i][3]);

        ctx.closePath();
        ctx.stroke();
      }
    }
  }



  canvas.addEventListener("mouseup", function (event) {
    mouseUp(this, event);
    let sx = startX;
    let sy = startY;
    let ex = endX;
    let ey = endY;

    //建立一個新的結節object 並push至noduleList中
    let newNodule = new createNodule(
      patientID,
      patientName,
      nowPic + 1, //z座標同張數
      sx,
      sy,
      ex,
      ey,

    );

    //render 更新表格
    render(newNodule);
  });

  canvas.addEventListener("mousemove", function (event) {
    mousemove(event);
  });

  canvas.addEventListener("mousedown", function (event) {
    mouseDown(this, event);
  });
  canvas.addEventListener("mouseover", wheelDelete);

  populate2();

  async function populate2() {

    const requestURL = 'http://140.127.208.159:8080/lung.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const superLung = await response.json();

    populateLung(superLung);

  }

  function populateLung(obj) {
    var allLung = obj.Lung;
    var Lung = [];
    allLung.forEach((element) => {
      if (element.patientID == patientID) {
        Lung.push(element);
      }
    });

    for (let i = 0; i < Lung.length; i++) {
      for (let j = 0; j < Lung.length - 1; j++) {
        if (Number(Lung[j].filename) > Number(Lung[j + 1].filename)) {
          let tempValue = Lung[j];
          Lung[j] = Lung[j + 1];
          Lung[j + 1] = tempValue;
        }
      }
    }

    for (const lung of Lung) {

      remark.innerHTML =
        remark.innerHTML +
        `
         <tr>
         <th scope="row" align='center' valign="middle">${patientName}</th>
         <td> <button class="btn btn-outline-dark cl" align="center" valign="middle" id=${lung.filename}>${lung.filename}</button></td>
         <td  valign="middle">(${lung.startX},${lung.startY})</td>
         <td  valign="middle">(${lung.endX},${lung.endY})</td>
         <td  valign="middle">${lung.option}</td>
         <td  valign="middle">${lung.text}</td>
         <td>
         <form method="post" action="/lung_delete" id="myForm">
         <input type="hidden" name="patientID" value="${lung.patientID}">
         <input type="hidden" name="filename" value="${lung.filename}">
         <input type="hidden" name="method">
         <input type="hidden" name="start" value="(${lung.startX},${lung.startY})">
         <input type="hidden" name="end" value="(${lung.endX},${lung.endY})">
         <input type="hidden" name="option" value="${lung.option}">
         <input type="hidden" name="text" value="${lung.text}">
         <input style="width: 60px;height:35px;"class="btn btn-outline-danger" type="submit" value="刪除">
         </form>
         </td>
         </tr>`;
    }

    var di = document.getElementsByClassName("btn btn-outline-dark cl");
    for (let d = 0; d < Lung.length; d++) {
      di[d].addEventListener("click", function () {
        for (var k = 1; k <= oriimgList.length; k++) {
          if (k == this.id) {
            //如果等於對應檔名之id
            pic = document.getElementById("ori" + k);
            pic.style.display = "block";
            way1 = document.getElementById("w" + k);
            way1.style.display = "block";
            merpic = document.getElementById("m" + k);
            merpic.style.display = "block";
            nowPic = k - 1;
            el.innerHTML = "_picture" + k;
          } else {
            pic = document.getElementById("ori" + k);
            pic.style.display = "none";
            way1 = document.getElementById("w" + k);
            way1.style.display = "none";
            merpic = document.getElementById("m" + k);
            merpic.style.display = "none";
          }
        }
      });
    }

    /* var replaceBtn = document.getElementsByClassName("btn btn-outline-primary cl");
     var formclass = document.getElementsByClassName("formClass");
     for (let i = 0; i < Lung.length; i++) {
       replaceBtn[i].addEventListener("click", function () {
         formclass[i].innerHTML = `
           <input type="hidden" name="patientID" value="${patientID}">
           <input type="hidden" name="filename" value="${formclass[i].id}">
           <select name="option" style="width:100px" class="form-select">
                 <option value="多圈">多圈</option>
                 <option value="少圈">少圈</option>
           </select>
           <button type="submit" style="width: 60px;height:35px;"class="btn btn-outline-primary cl">完成</button>
           `
       });
     }*/
  }
}

