var context = document.getElementById("context")
var psid = document.getElementById("psid")
var patient =document.getElementById("patient")


const maskConfirmPromise = fetch('/maskConfirm.json');
const maskIndexPromise = fetch('/maskIndex.json');

// using promise.all to deal with multiple promises which are from fetch function at the same time
Promise.all([maskConfirmPromise, maskIndexPromise])
    .then(([maskConfirmResponse, maskIndexResponse]) => {

        // parse json file
        return Promise.all([maskConfirmResponse.json(), maskIndexResponse.json()]);
    })
    // records corresponding to the data in maskConfirm.json
    // index corresponding to the data in maskIndex.json
    .then(([records, index]) => {

        // write the patientID value in the form automatically
        const patientID = index.patientID
        psid.value = patientID
        patient.innerHTML="病人"+patientID

        // select the records in maskConfirm.json which pateintID is equal to frontend's
        var selectedRecords = []
        records.forEach(record => {
            if (record.patientID == patientID) {
                selectedRecords.push(record)
            }
        });

        // generate the html according to the data of maskIndex.json
        filenameLists = index.filenameLists
        mainTumor = index.mainTumor

        for(var i = 0; i < mainTumor.length; i++){

            tumorNum = i + 1
            tumorNum = tumorNum.toString()
            tumorNum = tumorNum.padStart(3, "0")
            
            if(mainTumor[i] == "1"){
                if(mainTumor[i])
                context.innerHTML += `
                    <div class = "row">
                        <h3 style="font-weight:bold;color:rgb(179, 85, 23)";>第${tumorNum}顆 (main tumor)</h3>
                        <div class="form-check">
                            <input class="invasion-radio" type="radio" name="invasion${tumorNum}" value="1">
                            <label class="form-check-label" for="invasion">侵襲性腫瘤</label>
                        </div>
                        <div class="form-check">
                            <input class="noninvasion-radio" type="radio" name="invasion${tumorNum}" value="0" checked>
                            <label class="form-check-label" for="noninvasion">非侵襲性腫瘤</label>
                        </div>
                    </div>`
            }
            else {
                context.innerHTML += `
                    <div class = "row">
                        <h3 style="font-weight:bold;color:rgb(179, 85, 23)";>第${tumorNum}顆</h3>
                    </div>
                    <input class="invasion-radio" type="hidden">
                    `
            }
            
            
            filenameLists[i].forEach(file =>{
                context.innerHTML += `
                    <div class = "row">
                        <div class = "col-md-5">
                            <div class="pic"><img src="maskPicture/original/${patientID}/${tumorNum}/${file}"></div>
                        </div>
                        <div class = "col-md-5">
                            <div class="pic"><img src="maskPicture/overlapped/${patientID}/${tumorNum}/${file}"></div>
                        </div>
                        <div class = "col-md-2">
                            <p style="font-weight:bold;font-size:20px;margin-top:308px;">遮罩有誤請打勾: 
                                <input name="checkbox" style="width:30px;height:30px" type="checkbox" class="my-checkbox" value="0">
                                <textarea name="text" type="text" style="width:280px;height:100px"  placeholder="在此填寫備註" class="my-textarea""></textarea>
                                <p style="font-weight:bold;font-size:15px;">若要放大，可使用ctrl+滾輪</p>
                            </p>
                        </div>
                    </div>
                    <br>`
            })
            context.innerHTML += `<hr style="border:3px dashed #000; height:3px">`
        }        

        //change the html accroding to maskConfirm.json(selected records)
        var checkboxes = document.getElementsByClassName('my-checkbox');
        var textareas = document.getElementsByClassName('my-textarea');
        var invasions = document.getElementsByClassName('invasion-radio')

        for(var i = 0; i < selectedRecords.length; i++){
            if(selectedRecords[i].invasion == "1"){
                invasions[selectedRecords[i].num - 1 ].checked = true
            }
            if(selectedRecords[i].checkbox == 1 ){
                checkboxes[i].value = 1
                checkboxes[i].checked = true
                textareas[i].value = selectedRecords[i].text
            }
        }

        // when user click submit button, fill the checkbox vaule automatically(again) and sumbit the form
        var form = document.getElementById("myForm");
        var submitBtn = document.getElementById("submitBtn");
        submitBtn.addEventListener("click", (event) => {
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    checkboxes[i].value = 1
                }
                else {
                    // no matter the user click the check box or not, the check box will be checked eventually
                    // since back end only get the value of the checkboxes which were checked
                    checkboxes[i].checked = true
                    checkboxes[i].value = 0
                }
            }
            form.submit()
        });
    })
    .catch(error => {
        console.log(error)
    });


