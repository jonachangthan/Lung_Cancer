var pnum =document.getElementById("pnum")
var finSubmit = document.getElementById("finSubmit");
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
        var finSubmit = document.getElementById("finSubmit");
        var submitForm = document.getElementById("submitPatient");
        finSubmit.addEventListener("click", (event) => {
           
            if(pnum.value==""){
                alert("請輸入病人編號")
            }
            else{
                submitForm.submit();
                wait.style.display="block";
            }
        })   
    }
    

}