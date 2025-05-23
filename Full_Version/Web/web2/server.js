const express = require("express");
const fs = require("fs-extra");

const app = express();
const { spawn, spawnSync } = require("child_process");
const e = require("express");
const formidable = require('formidable');
const { on } = require("events");
const { writeFileSync } = require("fs");
const bodyParser = require('body-parser');
const { networkInterfaces } = require("os");
const { receiveMessageOnPort } = require("worker_threads");

const ip = "140.127.208.159";
const port = 8080;

var login_stat = 1;

function writeMaskComfirmJson(newRecords) {
  data = fs.readFileSync("./public/maskConfirm.json");
  var n = data.toString();
  n = JSON.parse(n);
  var records = n

  for (let i = 0; i < records.length; i++) {
    if (records[i].patientID == newRecords[0].patientID) {
      records.splice(i, 1)
      i--
    }
  }

  newRecords.forEach(newRecord => {
    n.push(newRecord);
  });


  var str = JSON.stringify(n);
  fs.writeFileSync("./public/maskConfirm.json", str)
}

function updateMaskBtnColorJsonStatus(id) {
  data = fs.readFileSync("./public/mask_btn_color.json");
  var n = data.toString();
  n = JSON.parse(n);

  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 1;
      patientExsit = 1;
      break;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 1
    };
    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);
  fs.writeFileSync("./public/mask_btn_color.json", str);
}

function writeIndexJsonMaskVersion(id) {
  id = id.padStart(3, "0")
  idInt = Number(id)
  dir = fs.readdirSync(`./public/maskPicture/overlapped/${id}`);

  tumorNum = dir.length
  filenameLists = []
  for (var i = 1; i <= tumorNum; i++) {
    dir = i.toString()
    dir = dir.padStart(3, "0")
    files = fs.readdirSync(`./public/maskPicture/overlapped/${id}/${dir}`)
    filenameLists.push(files)
  }

  nodules = []
  var allNodules = fs.readFileSync(`./public/nodules.json`)
  allNodules = allNodules.toString()
  allNodules = JSON.parse(allNodules)
  allNodules.nodules.forEach(element => {
    num = 1
    if (element.patientID == id) {
      nodules.push(element)
    }
  });

  mainTumor = []
  for(var i = 0; i < filenameLists.length; i++){
    mainTumor.push("0")
  }
  nodules.forEach(element => {
    mainTumor[element.num - 1] = element.maintumor
  });

  n = {
    patientID: id,
    filenameLists: filenameLists,
    mainTumor: mainTumor
  }
  var str = JSON.stringify(n);
  fs.writeFileSync("./public/maskIndex.json", str);
}

function updateOnlineNameJson(newName) {
  let on = fs.readFileSync("./public/onlineName.json")
  on = on.toString();
  on = JSON.parse(on);

  let sum = on.btnSum;
  newName = {
    patientName: `${newName}`,
    patientID: 200 + sum + 1
  };
  on.patients.push(newName);
  on.btnSum += 1;
  on = JSON.stringify(on)
  fs.writeFileSync("./public/onlineName.json", on)
  return sum + 201;
};

function writeLungOnlinePatientJson1(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lungOnlinebtn_color.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 1;
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 1,
    };

    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);

  fs.writeFileSync("./public/lungOnlinebtn_color.json", str);
}

function deleteLungOnlineJson(pid, filename) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lungOnline.json")
  //將二進制數據轉換為字串符
  var n = data.toString();
  //將字符串轉換成JSON對象
  n = JSON.parse(n);

  //將數據讀出來並刪除指定部分
  for (var i = 0; i < n.Lung.length; i++) {
    if (pid == n.Lung[i].patientID && filename == n.Lung[i].filename) {
      //console.log(n.nodules[i])
      n.Lung.splice(i, 1);
      i--;
    }
  }
  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);

  //最後再將數據寫入
  fs.writeFileSync("./public/lungOnline.json", str)
}

function writeLungOnlinePatientJson0(id) {
  data = fs.readFileSync("./public/lungOnlinebtn_color.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;

  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 0,
    };

    n.patients.push(pstat);
    var str = JSON.stringify(n);

    fs.writeFileSync("./public/lungOnlinebtn_color.json", str);
  }
}

function writeLungOnlineJson(nlungf) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lungOnline.json");
  var n = data.toString();
  n = JSON.parse(n);
  n.Lung.push(nlungf);

  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);
  //將字串符傳入您的 json 文件中
  fs.writeFileSync("./public/lungOnline.json", str)
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function writeIndexJsonWithName(id) {
  idInt = Number(id)
  files = fs.readdirSync(`./public/soft${idInt}`);
  len = files.length
  files = fs.readdirSync(`./public/cor${idInt}`);
  corLen = files.length
  data = fs.readFileSync("./public/onlineName.json");
  var n = data.toString();
  n = JSON.parse(n);
  let na = ""
  for (patient of n.patients) {
    if (patient.patientID == id) {
      na = patient.patientName;
    }
  }

  index = {
    patientID: id,
    length: len,
    corLength: corLen,
    patientName: na
  }

  var str = JSON.stringify(index);
  fs.writeFileSync("./public/index.json", str);
}

function writeIndexJson(id) {
  id = id.padStart(3, "0")
  idInt = Number(id)
  files = fs.readdirSync(`./public/soft${idInt}`);
  len = files.length
  files = fs.readdirSync(`./public/cor${idInt}`);
  corLen = files.length
  if (idInt <= 200) {
    n = {
      patientID: id,
      length: len,
      corLength: corLen,
      patientName: id
    }
    var str = JSON.stringify(n);
    fs.writeFileSync("./public/index.json", str);
  } else {
    data = fs.readFileSync("./public/onlineName.json");
    var n = data.toString();
    n = JSON.parse(n);
    let na = ""
    for (patient of n.patients) {
      if (patient.patientID == id) {
        na = patient.patientName;
      }
    }
    index = {
      patientID: id,
      length: len,
      corLength: corLen,
      patientName: na
    }
    var str = JSON.stringify(index);
    fs.writeFileSync("./public/index.json", str);
  }
}

function writeLungPatientJson0(id) {
  data = fs.readFileSync("./public/lungpatient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;

  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 0,
    };

    n.patients.push(pstat);
    var str = JSON.stringify(n);

    fs.writeFileSync("./public/lungpatient.json", str);
  }
}

function deleteLungJson(pid, filename) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lung.json")
  //將二進制數據轉換為字串符
  var n = data.toString();
  //將字符串轉換成JSON對象
  n = JSON.parse(n);

  //將數據讀出來並刪除指定部分
  for (var i = 0; i < n.Lung.length; i++) {
    if (pid == n.Lung[i].patientID && filename == n.Lung[i].filename) {
      //console.log(n.nodules[i])
      n.Lung.splice(i, 1);
      i--;
    }
  }
  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);

  //最後再將數據寫入
  fs.writeFileSync("./public/lung.json", str)
}
function writeLungJson(nlungf) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lung.json");
  var n = data.toString();
  n = JSON.parse(n);
  n.Lung.push(nlungf);

  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);
  //將字串符傳入您的 json 文件中
  fs.writeFileSync("./public/lung.json", str)
}
function reviseNodules(pID, num, opt) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/nodules.json");
  var n = data.toString();
  n = JSON.parse(n);
  for (const nodule of n.nodules) {
    if (nodule.patientID == pID && nodule.num == num) {
      nodule.option = opt;
    }
  }
  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);
  //將字串符傳入您的 json 文件中
  fs.writeFileSync("./public/nodules.json", str)
}
function appendNum_Maintumor(num, check) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./c.json");
  var n = data.toString();
  n = JSON.parse(n);
  for (nodule of n.nodules) {
    nodule.num = num;
    nodule.maintumor = check;
  }
  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);
  //將字串符傳入您的 json 文件中
  fs.writeFileSync("./c.json", str)
}
function writeJSONtoRemarkResult(newPatient) {
  //先將原本的 json 檔讀出來
  fs.readFile("./public/remark_result.json", function (err, patients) {
    if (err) {
      return console.error(err);
    }
    //將二進制數據轉換為字串符
    var p = patients.toString();
    //將字符串轉換為 JSON 對象
    p = JSON.parse(p);
    //將傳來的資訊推送到數組對象中
    p.patients.push(newPatient);
    console.log(p.patients);

    //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
    var str = JSON.stringify(p);
    //將字串符傳入您的 json 文件中
    fs.writeFile("./public/remark_result.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("Add new patient remark to remark_result.json...");
    });
  });
}

function writeJSONtoRemark(newPatient) {
  //先將原本的 json 檔讀出來
  fs.readFile("./public/remark.json", function (err, patients) {
    if (err) {
      return console.error(err);
    }
    //將二進制數據轉換為字串符
    var p = patients.toString();
    //將字符串轉換為 JSON 對象
    p = JSON.parse(p);
    //將傳來的資訊推送到數組對象中
    p.patients.push(newPatient);
    console.log(p.patients);

    //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
    var str = JSON.stringify(p);
    //將字串符傳入您的 json 文件中
    fs.writeFile("./public/remark.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("Add new patient remark to remark.json...");
    });
  });
}

function writePatientJson0(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/patient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;

  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 0,
    };

    n.patients.push(pstat);
    var str = JSON.stringify(n);

    fs.writeFileSync("./public/patient.json", str);
  }
}

function writePatientJson1(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/patient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 1;
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 1,
    };

    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);

  fs.writeFileSync("./public/patient.json", str);
}

function writePatientJson2(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/patient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 2;
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 2,
    };

    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);

  fs.writeFileSync("./public/patient.json", str);
}

function writeLungPatientJson1(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lungpatient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 1;
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 1,
    };

    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);

  fs.writeFileSync("./public/lungpatient.json", str);
}

function writeLungPatientJson2(id) {
  //先將原本的 json 檔讀出來
  data = fs.readFileSync("./public/lungpatient.json");
  var n = data.toString();
  n = JSON.parse(n);
  var patientExsit = 0;
  for (var i = 0; i < n.patients.length; i++) {
    if (n.patients[i].patientID == id) {
      n.patients[i].stat = 2;
      patientExsit = 1;
    }
  }
  if (!patientExsit) {
    pstat = {
      patientID: id,
      stat: 2,
    };

    n.patients.push(pstat);
  }
  var str = JSON.stringify(n);

  fs.writeFileSync("./public/lungpatient.json", str);
}

function clearALL(patientID) {
  fs.readdir("./public/" + patientID, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }
    files.forEach(function (file) {
      if (file.search("original") != -1) {
        newfilename = file.replace("_original", "");
        fs.renameSync(
          `./public/${patientID}/${file}`,
          `./public/${patientID}/${newfilename}`
        );
        n = Number(patientID)
        // fs.renameSync(
        //   `./public/soft${n}/${file}`,
        //   `./public/soft${n}/${newfilename}`
        // );
      }
    });
  });
  fs.readFile("./public/nodules.json", function (err, nodules) {
    if (err) {
      return console.error(err);
    }
    //將二進制數據轉換為字串符
    var n = nodules.toString();
    //將字符串轉換成JSON對象
    n = JSON.parse(n);

    //將數據讀出來並刪除指定部分
    for (var i = 0; i < n.nodules.length; i++) {
      if (patientID == n.nodules[i].patientID) {
        //console.log(n.nodules[i])
        n.nodules.splice(i, 1);
        i--;
      }
    }
    console.log(n.nodules);
    n.total = n.nodules.length;
    //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
    var str = JSON.stringify(n);

    //最後再將數據寫入
    fs.writeFile("./public/nodules.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("clear nodules...");
    });
  });
}

function writeJSON(newn) {
  //先將原本的 json 檔讀出來
  nodules = fs.readFileSync("./public/nodules.json")

  //將二進制數據轉換為字串符
  var n = nodules.toString();
  //將字符串轉換為 JSON 對象
  n = JSON.parse(n);
  //將傳來的資訊推送到數組對象中
  n.nodules.push(newn);
  n.total = n.nodules.length;
  //console.log(n.nodules);

  //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
  var str = JSON.stringify(n);
  //將字串符傳入您的 json 文件中
  fs.writeFileSync("./public/nodules.json", str);
}

function deleteJSON(pid, filename) {
  //先將原本的 json 檔讀出來
  fs.readFile("./public/nodules.json", function (err, nodules) {
    if (err) {
      return console.error(err);
    }
    //將二進制數據轉換為字串符
    var n = nodules.toString();
    //將字符串轉換成JSON對象
    n = JSON.parse(n);

    //將數據讀出來並刪除指定部分
    for (var i = 0; i < n.nodules.length; i++) {
      if (pid == n.nodules[i].patientID && filename == n.nodules[i].filename) {
        //console.log(n.nodules[i])
        n.nodules.splice(i, 1);
        i--;
      }
    }
    //console.log(n.nodules);
    n.total = n.nodules.length;
    //因為寫入文件（json）只認識字符串或二進制數，所以需要將json對象轉換成字符串
    var str = JSON.stringify(n);

    //最後再將數據寫入
    fs.writeFile("./public/nodules.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      //console.log("delete n in nodules...");
    });
  });
}

function combineJSON() {
  var newJSON = { nodules: [], total: 0 };

  data = fs.readFileSync("./public/nodules.json");

  //將二進制數據轉換為字串符
  data = data.toString();
  //將字符串轉換為 JSON 對象
  n1 = JSON.parse(data);

  data = fs.readFileSync("./c.json");

  //將二進制數據轉換為字串符
  data = data.toString();
  //將字符串轉換為 JSON 對象
  n2 = JSON.parse(data);

  for (var i = 0; i < n1.nodules.length; i++) {
    newJSON.nodules.push(n1.nodules[i]);
  }

  for (var i = 0; i < n2.nodules.length; i++) {
    newJSON.nodules.push(n2.nodules[i]);
  }
  newJSON.total = newJSON.nodules.length;
  var str = JSON.stringify(newJSON);
  fs.writeFile("./public/nodules.json", str, function (err) {
    if (err) {
      console.error(err);
    }
    console.log("combine compelete");
  });
}

const sendResponse = (filename, statusCode, response) => {
  fs.readFile(`./html/${filename}`, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain");
      response.end("Sorry, internal error");
    } else {
      response.statusCode = statusCode;
      response.setHeader("Location", filename);
      response.end(data);
    }
  });
};

app.post("/logout", (request, response) => {
  login_stat = 0;
  sendResponse("/login.html", 301, response);
})

app.post("/login", (request, response) => {
  let body = [];
  request.on("data", (chunk) => {
    body.push(chunk);
  });

  request.on("end", () => {
    body = Buffer.concat(body).toString();
    body = new URLSearchParams(body);

    if (body.get("username") === "doctor123" && body.get("password") === "dr0000") {
      login_stat = 1;
      sendResponse("/home.html", 301, response)
    } else {
      login_stat = 0;
      sendResponse("/login.html", 301, response)
    }
  });
});

app.get("/login.html", (request, response) => {
  sendResponse("login.html", 200, response);
});

app.use(express.static("./public"));

app.all("*", (request, response) => {
  if(request.url === '/getMulResultNum'){
    lungFiles = fs.readdirSync(`./public/onlineSegementation_mul/lung_overlapped`);
    lungLen = lungFiles.length;

    noduleFiles = fs.readdirSync(`./public/onlineSegementation_mul/nodule_overlapped`);
    noduleLen = noduleFiles.length;

     // Sample JSON data
    const jsonData = {
     lungLen : lungLen,
     noduleLen : noduleLen
    };
    
    // Set the content type header to indicate JSON response
    response.setHeader('Content-Type', 'application/json');

    // Send the JSON data as the response
    response.send(JSON.stringify(jsonData, null, 2));
  }
  else if (request.url === '/onlineMulCord') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let cordX = body.get("cordX");
      let cordY = body.get("cordY");
      let fileNum = body.get("cordZ");
      // console.log(cordX, cordY, fileNum)
      spawnSync("python", ["./compression.py"])
      // console.log(cordX, cordY)
      spawnSync("python", ["C:/Users/NUK_lab/Desktop/Lung_Segmentation/Lung_Segmentation2.py"]);

      spawnSync("C:/Users/NUK_lab/Anaconda3/envs/conda_env/python", ["C:/Users/NUK_lab/Desktop/Lung_Nodule_Segmentation/Lung_Nodule_Segmentation_continuous_2.py", fileNum, cordX, cordY]);

      sendResponse(`lungNoduleMask_mul.html`, 301, response)
    })
  }
  else if(request.url === '/getSegementationMulNum'){
    imgFiles = fs.readdirSync(`./public/onlineSegementation_mul/image`);
    imgLen = imgFiles.length;

     // Sample JSON data
    const jsonData = {
     len : imgLen
    };
    
    // Set the content type header to indicate JSON response
    response.setHeader('Content-Type', 'application/json');

    // Send the JSON data as the response
    response.send(JSON.stringify(jsonData, null, 2));
  }
  else if(request.url === '/onlineSegementationDicm_mul'){

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./segementation_mul_dcm")
    fs.mkdirSync('./segementation_mul_dcm')
    deleteFolderRecursive("./public/onlineSegementation_mul")
    fs.mkdirSync('./public/onlineSegementation_mul')
    fs.mkdirSync('./public/onlineSegementation_mul/image')
    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/segementation_mul_dcm/';
      newpath += file.originalFilename
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      spawnSync("python", ["./dicom_to_png_path.py", "C:/VS_Code/web2/segementation_mul_dcm", "C:/VS_Code/web2/public/onlineSegementation_mul/image"]);
      sendResponse("onlineSegementation_mul.html", 301, response);
    })
    form.parse(request);
  }
  else if(request.url === '/recognize'){
    const pythonProcess = spawn('python', ["C:/Users/NUK_lab/Desktop/web_model/web_invasion.py"]);

    pythonProcess.stdout.on('data', (data) => {
    const result = data.toString().trim();
    // console.log('Result from Python:', result);
    last_char = result[result.length - 1]
    if(last_char == "1"){
      // Sample JSON data
      const jsonData = {
        result : "侵襲性腫瘤"
      };
      
      // Set the content type header to indicate JSON response
      response.setHeader('Content-Type', 'application/json');

      // Send the JSON data as the response
      response.send(JSON.stringify(jsonData, null, 2));
    }else{
      // Sample JSON data
      const jsonData = {
        result : "非侵襲性腫瘤"
      };
      
      // Set the content type header to indicate JSON response
      response.setHeader('Content-Type', 'application/json');

      // Send the JSON data as the response
      response.send(JSON.stringify(jsonData, null, 2));
    }
});
  }
  else if (request.url === '/onlineSegCord') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let cordX = body.get("cordX");
      let cordY = body.get("cordY");

      // console.log(cordX, cordY)
      spawnSync("python", ["C:/Users/NUK_lab/Desktop/Lung_Segmentation/Lung_Segmentation.py"]);

      spawnSync("C:/Users/NUK_lab/Anaconda3/envs/conda_env/python", ["C:/Users/NUK_lab/Desktop/Lung_Nodule_Segmentation/final.py", cordX, cordY]);

      sendResponse(`lungNoduleMask.html`, 301, response)
    })
  }
  else if(request.url === '/onlineSegementationDicm'){

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./segementationdcm")
    fs.mkdirSync('./segementationdcm')
    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/segementationdcm/upload.dcm';
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      spawnSync("python", ["./dicom_to_png_path.py", "C:/VS_Code/web2/segementationdcm", "C:/VS_Code/web2/public/onlineSegementation/"]);
      sendResponse("onlineSegementation.html", 301, response);
    })
    form.parse(request);
  }
  else if(request.url === '/getUploadInvasionNum'){
    imgFiles = fs.readdirSync(`./public/onlineInvasion/image`);
    imgLen = imgFiles.length;

    maskFiles = fs.readdirSync(`./public/onlineInvasion/mask`);
    maskLen = maskFiles.length;
     // Sample JSON data
    const jsonData = {
      dcmLen: imgLen,
      pngLen: maskLen
    };
    
    // Set the content type header to indicate JSON response
    response.setHeader('Content-Type', 'application/json');

    // Send the JSON data as the response
    response.send(JSON.stringify(jsonData, null, 2));
  }
  else if(request.url === '/onlineInvasionDicm'){

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./invasiondcm")
    fs.mkdirSync('./invasiondcm')
    deleteFolderRecursive("./public/onlineInvasion/image")
    fs.mkdirSync('./public/onlineInvasion/image')
    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/invasiondcm/';
      newpath += file.originalFilename
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      spawnSync("python", ["./dicom_to_png_path.py", "C:/VS_Code/web2/invasiondcm", "C:/VS_Code/web2/public/onlineInvasion/image"]);
      sendResponse("onlineInvasion.html", 301, response);
    })
    form.parse(request);
  }
  else if(request.url === '/onlineInvasionMask'){
    deleteFolderRecursive("./public/onlineInvasion/mask")
    fs.mkdirSync('./public/onlineInvasion/mask')
    let num = "0";
    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/public/onlineInvasion/mask/';
      num = (parseInt(num)+1).toString().padStart(4, '0')
      filename = num + '.png'
      newpath += filename
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      sendResponse("onlineInvasion.html", 301, response);
    })
    form.parse(request);
  }
  else if (request.url === '/update_mask_result') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString()
      body = new URLSearchParams(body)
      patientID = body.get("patientid");
      writeIndexJsonMaskVersion(patientID);

      var index = fs.readFileSync(`./public/maskIndex.json`)
      var invasion = []
      index = index.toString()
      index = JSON.parse(index)
      for (var i = 1; i <= index.mainTumor.length; i++) {
        tumorNum = i
        tumorNum = tumorNum.toString()
        tumorNum = tumorNum.padStart(3, "0")
        invasion.push(body.get(`invasion${tumorNum}`));
      }

      checkBoxes = body.getAll("checkbox");
      texts = body.getAll("text");

      var newRecords = []
      var i = 0
      var j = 0
      index.filenameLists.forEach(list => {
        list.forEach(filename => {
          // force the text to be empty string if check box isn't checked
          if (checkBoxes[i] == 0) {
            texts[i] = ""
          }
          let newRecord = {
            patientID: patientID,
            filename: filename,
            num: j + 1,
            checkbox: checkBoxes[i],
            text: texts[i],
            invasion: invasion[j]
          }
          newRecords.push(newRecord)
          i++
        })
        j++
      });
      writeMaskComfirmJson(newRecords)
      updateMaskBtnColorJsonStatus(patientID);
      sendResponse(`maskPicBtn.html`, 200, response);
    });
  }

  //根據maskPicBtn.html 使用者click的病人編號 來更新index.json的內容
  else if (request.url === '/maskBtn') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let patientID = body.get("patientID");
      patientID = patientID.padStart(3, "0");
      writeIndexJsonMaskVersion(patientID);
      sendResponse(`maskConfirm.html`, 200, response)
    })
  }
  else if (request.url === '/upload') {

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./uploadfiles")
    fs.mkdirSync('./uploadfiles')
    deleteFolderRecursive("./uploadresult")
    fs.mkdirSync("./uploadresult")

    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      //console.log(file);
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/uploadfiles/';
      newpath += file.originalFilename;
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      console.log('upload files done');//接收完畢所有上傳檔案

      //呼叫外部程式辨識肺部
      spawnSync("python", ["./upload/lung_segmentation_complete.py"]);

      //將辨識結果之圖檔複製至指定資料夾
      let source = './uploadresult/web_png/original'
      let destination = './public/uploadPNG/1/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      source = './uploadresult/web_png/segmentation'
      destination = './public/uploadPNG/2/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      source = './uploadresult/web_png/overlapping'
      destination = './public/uploadPNG/3/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      //更新上傳病人總數
      data = fs.readFileSync("./public/lungOnlinebtn_color.json");
      var n = data.toString();
      n = JSON.parse(n);
      n.btnSum += 1;
      var str = JSON.stringify(n);
      fs.writeFileSync("./public/lungOnlinebtn_color.json", str)

      sendResponse("lungpictureOnline.html", 301, response);
    });
    form.parse(request);
  }
  else if (request.url === '/uploadtxt') {//上傳文字檔TXT

    //將上次所上傳的檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./uploadfilestxt")
    fs.mkdirSync('./uploadfilestxt')

    //開始接收上傳資料
    // let form = new formidable.IncomingForm();
    // form.parse(request, function(error, fields, file){
    //   let filepath = file.filepath;
    //   let newpath = 'C:/VS_Code/web2/uploadfilestxt/';
    // })


    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      //console.log(file);
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/uploadfilestxt/';
      newpath += file.originalFilename;
      //Copy the uploaded file to a custom folder
      fs.renameSync(filepath, newpath);

      files.push([field, file]);
    })
    form.once('end', function () {
      console.log('upload files done (txt)');//接收完畢所有上傳檔案

      sendResponse("Upload_patientnum.html", 301, response);
    });
    form.parse(request);
  }
  else if (request.url === '/createPatient') {

    //讀取病人名稱
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientName = body.get("patientName");
      console.log(patientName)
      //更新onlineName.json中的資料 及病人總數
      sum = updateOnlineNameJson(patientName)

      //將儲存切割結果之資料結初始化
      deleteFolderRecursive("./uploadresult")
      fs.mkdirSync("./uploadresult")

      //若有txt 將txt轉成html檔 存到public中
      txtList = fs.readdirSync("./uploadfilestxt");
      if (txtList.length != 0) {
        let h = "<pre>\n";
        let txtName = `text${sum}.html`
        h += fs.readFileSync(`./uploadfilestxt/${txtList[0]}`);
        h = h.toString();
        h += "</pre>"
        fs.writeFileSync(`./public/${txtName}`, h);
      }

      //呼叫外部程式辨識肺部
      spawnSync("python", ["./upload/lung_segmentation_complete.py"]);

      //將辨識結果之圖檔複製至指定資料夾

      //移動切割肺部圖片
      let source = './uploadresult/web_png/original'
      let destination = './public/final/1/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      source = './uploadresult/web_png/segmentation'
      destination = './public/final/2/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      source = './uploadresult/web_png/overlapping'
      destination = './public/final/3/'
      destination += String(fs.readdirSync(destination).length + 1)
      fs.copySync(source, destination)

      //移動點選結節圖片
      source = './public/onlinePicture/lungpic'
      destination = './public/'
      destination += `${sum}`
      fs.copySync(source, destination)

      source = './public/onlinePicture/lungcor'
      destination = './public/'
      destination += `cor${sum}`
      fs.copySync(source, destination)

      source = './public/onlinePicture/softpic'
      destination = './public/'
      destination += `soft${sum}`
      fs.copySync(source, destination)

      source = './public/onlinePicture/softcor'
      destination = './public/'
      destination += `cor${sum}_soft`
      fs.copySync(source, destination)

      //將所上傳的照片及檔案刪除 初始化所有資料夾
      deleteFolderRecursive("./uploadfilesCorDicom")
      fs.mkdirSync('./uploadfilesCorDicom')

      deleteFolderRecursive("./public/onlinePicture/lungcor")
      fs.mkdirSync("./public/onlinePicture/lungcor")

      deleteFolderRecursive("./public/onlinePicture/softcor")
      fs.mkdirSync("./public/onlinePicture/softcor")

      deleteFolderRecursive("./uploadfiles")
      fs.mkdirSync('./uploadfiles')

      deleteFolderRecursive("./public/onlinePicture/lungpic")
      fs.mkdirSync("./public/onlinePicture/lungpic")

      deleteFolderRecursive("./public/onlinePicture/softpic")
      fs.mkdirSync("./public/onlinePicture/softpic")

      deleteFolderRecursive("./uploadfilestxt")
      fs.mkdirSync('./uploadfilestxt')

      //將檔案數量歸零 並寫入檔案
      let n = fs.readFileSync("./public/onlinePicNum.json");
      n = n.toString();
      n = JSON.parse(n);
      n.length = 0;
      n.corLength = 0;
      var str = JSON.stringify(n);
      fs.writeFileSync("./public/onlinePicNum.json", str);

      sendResponse("lungpictureOnline.html", 301, response);
    });
  }
  else if (request.url === '/uploadCorPic') {//上傳正面dicom

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./uploadfilesCorDicom")
    fs.mkdirSync('./uploadfilesCorDicom')

    deleteFolderRecursive("./public/onlinePicture/lungcor")
    fs.mkdirSync("./public/onlinePicture/lungcor")

    deleteFolderRecursive("./public/onlinePicture/softcor")
    fs.mkdirSync("./public/onlinePicture/softcor")

    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      //console.log(file);
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/uploadfilesCorDicom/';
      newpath += file.originalFilename;
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      console.log('upload files done (second)');//接收完畢所有上傳檔案

      //將檔案數量寫入onlinePicture.json中
      files = fs.readdirSync(`./uploadfilesCorDicom`);
      len = files.length;
      let n = fs.readFileSync("./public/onlinePicNum.json");
      n = n.toString();
      n = JSON.parse(n);
      n.corLength = len;
      var str = JSON.stringify(n);
      fs.writeFileSync("./public/onlinePicNum.json", str);

      //將dicom轉為png
      spawnSync("python", ["./cor_dicom_to_png.py"]);

      sendResponse("Upload_fullpic.html", 301, response);
    });
    form.parse(request);
  }
  else if (request.url === '/uploadPic') {//上傳橫切面dicom

    //將上次所上傳的照片及檔案刪除 初始化需用到的資料夾
    deleteFolderRecursive("./uploadfiles")
    fs.mkdirSync('./uploadfiles')

    deleteFolderRecursive("./public/onlinePicture/lungpic")
    fs.mkdirSync("./public/onlinePicture/lungpic")

    deleteFolderRecursive("./public/onlinePicture/softpic")
    fs.mkdirSync("./public/onlinePicture/softpic")

    //開始接收上傳資料
    var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
    form.on('field', function (field, value) {
      fields.push([field, value]);
    })
    form.on('file', function (field, file) {
      //console.log(file);
      let filepath = file.filepath;
      let newpath = 'C:/VS_Code/web2/uploadfiles/';
      newpath += file.originalFilename;
      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
      });
      files.push([field, file]);
    })
    form.once('end', function () {
      console.log('upload files done (first)');//接收完畢所有上傳檔案

      //將檔案數量寫入onlinePicture.json中
      files = fs.readdirSync(`./uploadfiles`);
      len = files.length;
      let n = fs.readFileSync("./public/onlinePicNum.json");
      n = n.toString();
      n = JSON.parse(n);
      n.length = len;
      var str = JSON.stringify(n);
      fs.writeFileSync("./public/onlinePicNum.json", str);

      //將dicom轉為png
      spawnSync("python", ["./dicom_to_png.py"]);

      sendResponse("Upload_crosspic.html", 301, response);
    });
    form.parse(request);
  }
  else if (request.url === '/lung_online_delete') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientID = body.get("patientID");
      filename = body.get("filename");
      deleteLungOnlineJson(patientID, filename);
      n = Number(patientID)
      if (fs.existsSync(`./public/uploadPNG/3/${n}/${filename}_original.png`)) {
        fs.renameSync(
          `./public/uploadPNG/3/${n}/${filename}_original.png`,
          `./public/uploadPNG/3/${n}/${filename}.png`
        );
      }
      sendResponse(`lungOnline.html`, 301, response)
    });
  }
  else if (request.url === '/online_lung_submit') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      // console.log(body);
      patientID = body.get("patientID");
      filename = body.get("filename")
      startX = body.get("startX")
      startY = body.get("startY")
      endX = body.get("endX")
      endY = body.get("endY")
      option = body.get("option")
      text = body.get("text")

      console.log(patientID, filename, startX, startY, endX, endY)

      let newLungFrame = {
        patientID: patientID,
        filename: filename,
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        option: option,
        text: text
      }
      writeLungOnlineJson(newLungFrame);
      spawnSync("python", [
        "./chen_frame_online.py",
        patientID,
        filename,
        startX,
        startY,
        endX,
        endY
      ]);
      writeLungOnlinePatientJson0(patientID);
      sendResponse(`lungOnline.html`, 301, response);
    });
  }
  else if (request.url === '/onlineLungBtn') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let patientID = body.get("patientID");

      //console.log(patientID)

      idInt = Number(patientID)
      files = fs.readdirSync(`./public/uploadPNG/1/${idInt}`);
      len = files.length
      corLen = files.length
      n = {
        patientID: patientID,
        length: len
      }
      var str = JSON.stringify(n);
      fs.writeFileSync("./public/index.json", str);
      sendResponse(`lungOnline.html`, 301, response)
    })
  }
  else if (request.url === '/lungBtn') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let patientID = body.get("patientID");
      patientID = patientID.padStart(3, "0")
      writeIndexJson(patientID);
      sendResponse(`lung.html`, 301, response)
    })
  }
  else if (request.url === '/resultBtn') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let patientID = body.get("patientID");
      writeIndexJson(patientID);
      sendResponse(`result.html`, 301, response)
    })
  }
  else if (request.url === '/btn') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let patientID = body.get("patientID");
      writeIndexJson(patientID);
      sendResponse(`patient.html`, 301, response)
    })
  }
  else if (request.url === '/lung_delete') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientID = body.get("patientID");
      filename = body.get("filename");
      deleteLungJson(patientID, filename);
      n = Number(patientID)
      if (fs.existsSync(`./public/final/3/${n}/${filename}_original.png`)) {
        fs.renameSync(
          `./public/final/3/${n}/${filename}_original.png`,
          `./public/final/3/${n}/${filename}.png`
        );
      }
      writeIndexJson(patientID);
      sendResponse(`lung.html`, 301, response)
    });
  }
  else if (request.url === '/lung_submit') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      // console.log(body);
      patientID = body.get("patientID");
      filename = body.getAll("filename")
      startX = body.getAll("startX")
      startY = body.getAll("startY")
      endX = body.getAll("endX")
      endY = body.getAll("endY")
      option = body.get("option")
      text = body.getAll("text")

      //console.log(patientID, filename, startX, startY, endX, endY)
      //console.log(startX)
      for (let i = 0; i < startX.length; i++) {
        let newLungFrame = {
          patientID: patientID,
          filename: filename[i],
          startX: startX[i],
          startY: startY[i],
          endX: endX[i],
          endY: endY[i],
          option: option,
          text: text[i]
        }
        writeLungJson(newLungFrame);
        spawnSync("python", [
          "./chen_frame.py",
          patientID,
          filename[i],
          startX[i],
          startY[i],
          endX[i],
          endY[i]
        ]);
      }
      writeIndexJson(patientID);
      writeLungPatientJson0(patientID);
      sendResponse(`lung.html`, 301, response);
    });
  }
  else if (request.url === '/revise') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientID = body.get("patientID");
      num = body.get("num");
      option = body.get("option");
      console.log(patientID, num, option)
      reviseNodules(patientID, num, option)

      writeIndexJson(patientID);
      sendResponse(`result.html`, 301, response);
    });
  }
  else if (request.url === '/lungskip') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body.get("finid"));
      writeLungPatientJson2(body.get("skipid"));
      sendResponse("lungpicture.html", 301, response);
    })
  }
  else if (request.url === '/lungfin') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body.get("finid"));
      writeLungPatientJson1(body.get("finid"));
      sendResponse("lungpicture.html", 301, response);
    })
  }
  else if (request.url === "/lungPS") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body.get("patientid"));
      let newPatient = {
        patientID: body.get("patientid"),
        text: body.get("text")
      }
      writeJSONtoRemark(newPatient);
      sendResponse("remark.html", 301, response);
    });
  }
  else if (request.url === '/skip') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });
    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      console.log(body.get("skipid"));
      writePatientJson2(body.get("skipid"));
      sendResponse("index.html", 301, response);
    })
  }
  else if (request.url === '/fin') {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body.get("finid"));
      writePatientJson1(body.get("finid"));
      sendResponse("index.html", 301, response);
    })
  }
  else if (request.url === "/result_delete") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientID = body.get("patientID");
      filename = body.get("filename");
      deleteJSON(patientID, filename);
      if (fs.existsSync(`./public/${patientID}/${filename}_original.png`)) {
        fs.renameSync(
          `./public/${patientID}/${filename}_original.png`,
          `./public/${patientID}/${filename}.png`
        );
        console.log("delete compelete");
      }
      writeIndexJson(patientID);
      sendResponse(`result.html`, 301, response);
    });
  }
  else if (request.url === "/PS") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      let newPatient = {
        patientID: body.get("patientid"),
        text: body.get("text")
      }
      writeJSONtoRemarkResult(newPatient);
      //console.log(body.get("text"));
      patientID = body.get("patientid");
      //console.log(`result${n}.html`);
      writeIndexJson(patientID);
      sendResponse(`result.html`, 301, response);
    });
  } else if (request.url === "/clear") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      patientID = body.get("patientID");
      console.log("clear", patientID);
      clearALL(patientID);
      writeIndexJson(patientID);
      sendResponse(`/patient.html`, 301, response)
    });
  } else if (request.url === "/delete") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      //console.log(body);
      patientID = body.get("patientID");
      filename = body.get("filename");
      console.log("delete", patientID, filename);
      deleteJSON(patientID, filename);
      if (fs.existsSync(`./public/${patientID}/${filename}_original.png`)) {
        fs.renameSync(
          `./public/${patientID}/${filename}_original.png`,
          `./public/${patientID}/${filename}.png`
        );
        // n = Number(patientID)
        // fs.renameSync(
        //   `./public/soft${n}/${filename}_original.png`,
        //   `./public/soft${n}/${filename}.png`
        // );
        console.log("delete compelete");
      } else {
        console.log("no such file");
      }
      writeIndexJson(patientID);
      sendResponse(`/patient.html`, 301, response)
    });
  } else if (request.url === "/writefile") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      patientID = body.get("patientID");
      filename = body.getAll("filename");
      cordX = body.getAll("cordX");
      cordY = body.getAll("cordY");
      option = body.get("option");
      num = body.get("num");
      text = body.get("text");
      checkBox1 = body.get("checkbox1");
      if (checkBox1 == "1") {
        checkBox = "1"
      } else {
        checkBox = "0"
      }

      if (num == "選擇顆數") {
        //console.log(text)
        num = text
      }
      //console.log(filename.length)

      for (let i = 0; i < filename.length; i++) {
        var newNodule = {
          patientID: patientID,
          filename: filename[i],
          cordX: cordX[i],
          cordY: cordY[i],
          option: option,
          num: num,
          maintumor: checkBox
        };
        if (patientID != null) {
          writeJSON(newNodule);
          writePatientJson0(body.get("patientID"))
          console.log(patientID, filename[i], cordX[i], cordY[i], option, checkBox);
          spawnSync("python", ["./chen.py", patientID, filename[i], cordX[i], cordY[i]]);
        }
      }
      writeIndexJson(patientID);
      sendResponse(`/patient.html`, 301, response);
    });
  } else if (request.url === "/writefile2") {
    let body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
      body = new URLSearchParams(body);
      patientID = body.get("patientID");
      filename = body.get("filename");
      cordX = body.get("cordX");
      cordY = body.get("cordY");
      option = body.get("option");
      num = body.get("num");
      text = body.get("text")
      checkBox = body.get("checkbox");
      //console.log(checkBox);

      if (checkBox == null) {
        checkBox = "0"
      }

      if (num == "選擇顆數") {
        //console.log(text)
        num = text
      }
      // var newNodule = {
      //   patientID: patientID,
      //   filename: filename,
      //   cordX: cordX,
      //   cordY: cordY,
      //   option: option,
      //   num: num
      // };
      console.log(patientID, filename, cordX, cordY, option);
      spawnSync("python", [
        "./chen2.py",
        patientID,
        filename,
        cordX,
        cordY,
        option,
      ]);
      appendNum_Maintumor(num, checkBox);
      combineJSON();
      writePatientJson0(body.get("patientID"))
      writeIndexJson(patientID);
      sendResponse(`/patient.html`, 301, response)
    });
  } else if (request.method === "GET") {
    const requestURL = new URL(request.url, `http://${ip}:${port}`);
    var url = requestURL.pathname;
    //console.log(url[url.length-1]);
    if (url[url.length - 1] === "l") {
      if (login_stat) {
        sendResponse(`${url}`, 200, response);
      } else {
        sendResponse(`login.html`, 200, response);
      }
    } else {
      response.end();
    }
  } else {
    sendResponse(`/error.html`, 404, response);
  }
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}....`);
});
