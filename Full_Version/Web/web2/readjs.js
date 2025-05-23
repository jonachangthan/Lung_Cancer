const fs = require("fs")

var allMask = fs.readFileSync(`C:/web/web2/public/maskConfirm.json`)
allMask = allMask.toString()
allMask = JSON.parse(allMask)
allMask = allMask

var allNodules = fs.readFileSync(`C:/web/web2/public/nodules.json`)
allNodules = allNodules.toString()
allNodules = JSON.parse(allNodules)
allNodules = allNodules.nodules


allNodules.forEach(nodule => {
  if(nodule.maintumor === "0"){
    allMask.forEach(mask => {
      if(mask.patientID == nodule.patientID && mask.num == nodule.num){
        mask.invasion = null
      }
    });
  }
});

allMask = JSON.stringify(allMask)
fs.writeFileSync("C:/web/web2/public/maskConfirm.json", allMask)
