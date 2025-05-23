var buttonList = document.getElementsByClassName("btn btn-link");
var formInput = document.getElementById("formInput");
var form = document.getElementById("btnForm")

var divImage7 = document.getElementById("divImage7")
var divImage8 = document.getElementById("divImage8")
var divImage9 = document.getElementById("divImage9")
var divImage10 = document.getElementById("divImage10")
var divImage11 = document.getElementById("divImage11")
var divImage12 = document.getElementById("divImage12")
var divImage13 = document.getElementById("divImage13")
var divImage14 = document.getElementById("divImage14")
var divImage15 = document.getElementById("divImage15")
var divImage16 = document.getElementById("divImage16")
var divImage17 = document.getElementById("divImage17")
var divImage18 = document.getElementById("divImage18")
var divImage19 = document.getElementById("divImage19")
var divImage20 = document.getElementById("divImage20")
var divImagenew = document.getElementById("divImagenew")

populate1();
for (var i =200; i >195; i--) {
    divImage7.innerHTML = divImage7.innerHTML+ `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 195; i >180; i--) {
    divImage8.innerHTML = divImage8.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 180; i >165; i--) {
    divImage9.innerHTML = divImage9.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 165; i >150; i--) {
    divImage10.innerHTML = divImage10.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 150; i >135; i--) {
    divImage11.innerHTML = divImage11.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 135; i >120; i--) {
    divImage12.innerHTML = divImage12.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 120; i >105; i--) {
    divImage13.innerHTML = divImage13.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${i}"
            style="color:black;font-weight:bold;">病人${i}</button></div>
</li>`
}
for (var i = 105; i > 90; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage14.innerHTML = divImage14.innerHTML+ `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 90; i > 75; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage15.innerHTML = divImage15.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 75; i > 60; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage16.innerHTML = divImage16.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 60; i > 45; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage17.innerHTML = divImage17.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 45; i > 30; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage18.innerHTML = divImage18.innerHTML+ `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 30; i >15; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage19.innerHTML = divImage19.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}
for (var i = 15; i > 0; i--) {
    let pt = i.toString();
    let patientID = pt.padStart(3, 0)
    let pid=parseInt(patientID)
    divImage20.innerHTML = divImage20.innerHTML + `<li>
    <div class="btnnn"><button class="btn btn-link" id="btn${pid}"
            style="color:black;font-weight:bold;">病人${patientID}</button></div>
</li>`
}

async function populate1() {
    const requestURL = 'http://140.127.208.159:8080/onlineName.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const superPatients = await response.json();

    populateImages(superPatients);

    function populateImages(obj) {

        const patients = obj.patients;

        var btnSum = obj.btnSum

        for (var i = 200 + btnSum; i > 200; i--) {
            for (const patient of patients) {

                if(patient.patientID==i){
                    var patientName = patient.patientName;
                    divImagenew.innerHTML = divImagenew.innerHTML + `
                    <li><div class="btnnn"><button class="btn btn-link" id="btn${i}"
                        style="color:black;font-weight:bold;">病人${patientName}</button></div></li>`
                }
            }
        }
        for (var i = 0; i < buttonList.length; i++) {
            buttonList[i].addEventListener("click", function () {
                let str = this.id;
                let patientbtn = str.replace("btn", "");
                formInput.value = patientbtn;
                console.log(form.innerHTML)
                form.submit();
            })
        }
    }
}

async function populate() {

    const requestURL = '/patient.json';
    const request = new Request(requestURL);

    const response = await fetch(request);
    const superPatients = await response.json();

    populatePatients(superPatients);

}
var button;

function populatePatients(obj) {


    const patients = obj.patients;

    for (const patient of patients) {

        var id = parseInt(patient.patientID);


        button = document.getElementById("btn" + id);

        if (patient.stat == 1) { //完成        

            button.style.background = '#D9B300';

        }
        else if (patient.stat == 0) {//做一半 

            button.style.background = '#FFD306';

        }
        else if (patient.stat == 2) {//略過

            button.style.background = '#FFC78E';

        }

    }
}

populate();