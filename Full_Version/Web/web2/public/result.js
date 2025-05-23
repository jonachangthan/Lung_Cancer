var lungimgList = document.getElementsByClassName("lungp");
var nowPic = 0; //當下顯示到第幾張圖片
var nodulebtn = document.getElementById("nodulebtn");
var sheet = document.getElementById("sheet");
var form = document.getElementById("btnForm");
var patientID;
var el = document.getElementById("main");
var pid = document.getElementById("patient")
var psid = document.getElementById("psid")
var divImage1 = document.getElementById("divImage1");
var patientName;

populate3()

async function populate3() {

  const requestURL = '/index.json';
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superPatients = await response.json();

  populateImages(superPatients);

  function populateImages(obj) {
    const name = obj.patientName;
    const id = obj.patientID;
    patientID = id; //病人編號
    patientName=name;

    psid.value = patientID;
    pid.innerHTML = patientName;
    const lungLength = obj.length;
    for (var i = 0; i < lungLength; i++) {
      if (i == 0) {
        divImage1.innerHTML =
          `<img src="${patientID}/0.png" class="lungp" id="img0" style="display: block;width:512px;height:512px">`
      } else {
        divImage1.innerHTML = divImage1.innerHTML +
          ` <img src="${patientID}/${i}.png" class="lungp" id="img${i}" style="display: none;width:512px;height:512px">`
      }
    }
  }
  async function populate() {

    const requestURL = '/nodules.json';
    const request = new Request(requestURL);
  
    const response = await fetch(request);
    const superNodules = await response.json();
  
    populateNodules(superNodules);
  }
  
  function populateNodules(obj) {
    console.log(obj)
    console.log(patientID)
    var allnodules = obj.nodules;
    var nodules = [];
    allnodules.forEach((element) => {
      if (element.patientID == patientID) {
        nodules.push(element);
      }
    });
  
    for (let i = 0; i < nodules.length; i++) {
      for (let j = 0; j < nodules.length - 1; j++) {
        if (Number(nodules[j].filename) > Number(nodules[j + 1].filename)) {
          let tempValue = nodules[j];
          nodules[j] = nodules[j + 1];
          nodules[j + 1] = tempValue;
        }
      }
    }
   
    for (let i = 1; i <= 50; i++) {
      for (const nodule of nodules) {
        if (nodule.num == i) {

          if(nodule.maintumor=="1"){
            nodule.maintumor="是"
          }
          else if(nodule.maintumor=="0"){
            nodule.maintumor="否"
          }

          sheet.innerHTML =
            sheet.innerHTML +
            `
              <tr>
              <th scope="row" align='center' valign="middle">${patientName}</th>
              <td> <button class="btn btn-outline-dark cl" align="center" valign="middle" id=${nodule.filename} >${nodule.filename}</button></td>
              <td align='center' valign="middle">${nodule.cordX}</td>
              <td align='center' valign="middle">${nodule.cordY}</dh>
              <td align='center' valign="middle">${nodule.option}</td>
              <td align='center' valign="middle">${nodule.num}</td>
              <td align='center' valign="middle">${nodule.maintumor}</td>
              <td>
              <form method="post" action="/result_delete" id="myForm">
              <input type="hidden" name="patientID" value="${nodule.patientID}">
              <input type="hidden" name="filename" value="${nodule.filename}">
              <input type="hidden" name="cordX" value="${nodule.cordX}">
              <input type="hidden" name="cordY" value="${nodule.cordY}">
              <input style="width: 60px;height:35px;"class="btn btn-outline-danger" type="submit" value="刪除">
              </form>
              </td>
              <td> 
              <form method="post" action="/revise" class="formClass" id="${nodule.num}">
              <button type="button" style="width: 60px;height:35px;"class="btn btn-outline-primary cl">修改</button>
              </form>
              </td>
              </tr>`;
        }
      }
    }
    var di = document.getElementsByClassName("btn btn-outline-dark cl");
    for (let d = 0; d < nodules.length; d++) {
      di[d].addEventListener("click", function () {
        for (var k = 0; k < lungimgList.length; k++) {
          if (k == this.id) {
            //如果等於對應檔名之id
            pic = document.getElementById("img" + k);
            pic.style.display = "block";
            nowPic = k;
            el.innerHTML = "picture" + k;
          } else {
            pic = document.getElementById("img" + k);
            pic.style.display = "none";
          }
        }
      });
    }
  
    var replaceBtn = document.getElementsByClassName("btn btn-outline-primary cl");
    var formclass = document.getElementsByClassName("formClass");
    for (let i = 0; i < nodules.length; i++) {
      replaceBtn[i].addEventListener("click", function () {
        formclass[i].innerHTML = `
        <input type="hidden" name="patientID" value="${patientID}">
        <input type="hidden" name="num" value="${formclass[i].id}">
        <select name="option" style="width:100px" class="form-select">
              <option value="calcified">calcified</option>
              <option value="perifissural">perifissural</option>
              <option value="pure GGN">pure GGN</option>
              <option value="heterogenous GGN">heterogenous GGN</option>
              <option value="part solid">part solid</option>
              <option value="solid">solid</option>
              <option value="undetermined">undetermined</option>
        </select>
        <button type="submit" style="width: 60px;height:35px;"class="btn btn-outline-primary cl">完成</button>
        `
      });
    }
  }
  
  async function populate2() {
  
    const requestURL = '/remark_result.json';
    const request = new Request(requestURL);
  
    const response = await fetch(request);
    const superPatients = await response.json();
  
    populatePatients(superPatients);
  
  }
  
  function populatePatients(obj) {
  
    const patients = obj.patients;
  
    for (const patient of patients) {
      if (patient.patientID == patientID) {
  
        formm.innerHTML =
          formm.innerHTML + `
          <tr> 
          <td align='center' valign="middle" style="font-family:DFKai-sb;font-size:20px">${patient.text}</td>  
          </tr>`;
  
      }
    }
  }
  
  
  
  
  populate();
  populate2();
  
  // window.addEventListener("load", function () {
    nodulebtn.addEventListener("click", function () {
      formInput.value = patientID;
      //console.log(form.innerHTML)
      form.submit();
    })
    //肺窗
    var pic;
    function MouseWheel(e) {
      for (i = 0; i < lungimgList.length; i++) {
        if (e.wheelDelta < 0) {
          //滑鼠滾輪往下
          if (nowPic != lungimgList.length - 1) {
            nowPic++;
          }
        } else if (e.wheelDelta > 0) {
          //滾輪往上
          if (nowPic != 0) {
            nowPic--;
          }
        }
        e = e || window.event; //多種瀏覽器兼容
        for (i = 0; i < lungimgList.length; i++) {
          if (i == nowPic) {
            if (e.wheelDelta) {
              el.innerHTML = "picture" + i;
              pic = document.getElementById("img" + i);
              pic.style.display = "block"; //元素以區塊呈現
            } else if (e.detail) {
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
      lungimgList[i].addEventListener("mouseover", function (event) {
        document.onmousewheel = MouseWheel;
      })
      lungimgList[i].addEventListener("mouseout", function (event) {
        document.onmousewheel = null;
      })
    }
  // })
}

