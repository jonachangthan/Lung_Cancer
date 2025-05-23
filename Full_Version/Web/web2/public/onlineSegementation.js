 var submitBtn = document.getElementById("submitBtn")

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

//建造函數
function createNodule(x, y) {
  //建立新結節object
  this.cordX = x;
  this.cordY = y;
}

function render(e) {
  form.innerHTML = `
    <tr>
      <td align='center' valign="middle">${e.cordX}</td>
      <td align='center' valign="middle">${e.cordY}</td>
      <input type="hidden" name="cordX" value="${e.cordX}">
      <input type="hidden" name="cordY" value="${e.cordY}">
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

  // 若之前有紅點，先清除
  if (clicked) {
    clicked = null;
    var ctx = canvas1.getContext("2d");
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  }

  // 建立一個新的結節object
  clicked = new createNodule(x, y);

  // render 更新表格
  render(clicked);

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