import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "https://www.altanalyze.org/oncosplice" : "http://localhost:8081";

function defaultQuery(arg, targeturl)
{
  const exportView = arg["export"];
  const callback = arg["setState"];
  const pancancercallback = arg["pancancerupdate"];
  const document = arg["doc"];
  const curCancer = "BLCA";
  const compCancer = "BLCA";
  var sampleFilters = [];
  var signatureFilters = ["psi_r2_v15_vs_others"];
  var geneFilters = [];
  var coordinateFilters = [];
  var oncospliceClusters = "R2-V15";
  var postData = {"data": {"cancerName": curCancer, 
  "comparedCancer": compCancer,
  "oncospliceClusters": oncospliceClusters,
  "samples": sampleFilters,
  "signatures": signatureFilters,
  "genes": geneFilters,
  "coords": coordinateFilters}
  };
  /*
  var bodyFormData = new FormData();
  bodyFormData.append("PSIPsi er negative r1 v24 vs others", "PSIPsi er negative r1 v24 vs others");
  bodyFormData.append("RPSIR1-V24 (ER Negative Splice Enriched)", "R1-V24 (ER Negative Splice Enriched)");
  bodyFormData.append("CANCER","BRCA");
  bodyFormData.append("COMPCANCER","BRCA");
  document.getElementById("sub").style.display = "block";*/
  //console.log("RUNNING running");

  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/defaultquery"),
    data: postData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      //console.log(response);
      //response = JSON.parse(response);
      //document.getElementById(`simple-tab-1`).click();
      var splicingreturned = response["data"]["rr"];
      var splicingcols = response["data"]["col_beds"];
      var splicingcc = response["data"]["cci"];
      exportView["filter"] = [];
      exportView["cancer"] = "BLCA";
      exportView["single"] = ["PSI r2 v15 vs others"];
      var splicingrpsi = response["data"]["oncospliceClusterIndices"];
      var splicingtrans = response["data"]["oncospliceClusterName"];
      defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, callback, document, targeturl, pancancercallback);
  })
}

function defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp, callback, doc, targeturl, pancancercallback)
{
  var postdata = {"data": {"cancerName": "BLCA", "signature": "psi_r2_v15_vs_others"}};
  axios({
    method: "post",
    data: postdata,
    url: routeurl.concat("/api/datasets/samples"),
    headers: { "Content-Type": "application/json" },
  })
  .then(function (response) {
    exp["cancer"] = "BLCA";
    exp["ui_field_dict"] = response["data"]["samples"];
    exp["ui_field_range"] = response["data"]["range"];
    console.log("fer4", response["data"]["pancancersignature"]);
    console.log("fer5", response["data"]["uniqueclusters"]);
    callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp);
    pancancercallback({"DEtableData": response["data"]["pancancerDE"], "tableData": response["data"]["pancancersignature"], "clusterLength": response["data"]["uniqueclusters"], "cancer": "BLCA"});
  })
}

export default defaultQuery;