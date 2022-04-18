import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function defaultQuery(arg, targeturl)
{
  const exportView = arg["export"];
  const callback = arg["setState"];
  const document = arg["doc"];

  var bodyFormData = new FormData();
  bodyFormData.append("PSIPsi er negative r1 v24 vs others", "PSIPsi er negative r1 v24 vs others");
  bodyFormData.append("RPSIR1-V24 (ER Negative Splice Enriched)", "R1-V24 (ER Negative Splice Enriched)");
  bodyFormData.append("CANCER","BRCA");
  bodyFormData.append("COMPCANCER","BRCA");
  document.getElementById("sub").style.display = "block";
  //console.log("RUNNING running");
  axios({
    method: "post",
    url: (targeturl.concat("/backend/metarequest.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //console.log(response);
      //response = JSON.parse(response);
      //document.getElementById(`simple-tab-1`).click();
      var splicingreturned = response["data"]["rr"];
      var splicingcols = response["data"]["col_beds"];
      var splicingcc = response["data"]["cci"];
      exportView["filter"] = [];
      exportView["cancer"] = "BRCA";
      exportView["single"] = ["PSI er negative r1 v24 vs others"];
      var splicingrpsi = response["data"]["rpsi"];
      var splicingtrans = response["data"]["oncokey"];
      defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, callback, document, targeturl);
  })
}

function defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp, callback, doc, targeturl)
{
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", "BRCA");
  axios({
    method: "post",
    url: (targeturl.concat("/backend/ui_fields.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    //console.log("DQ_UI_fields", response["data"]);
    exp["cancer"] = "BRCA";
    exp["ui_field_dict"] = response["data"]["meta"];
    exp["ui_field_range"] = response["data"]["range"];
    callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp);
    doc.getElementById("sub").style.display = "none";
  })
}

export default defaultQuery;