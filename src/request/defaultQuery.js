import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

function defaultQuery(arg, targeturl)
{
  const exportView = arg["export"];
  const callback = arg["setState"];
  const pancancercallback = arg["pancancerupdate"];
  const document = arg["doc"];
  const curCancer = "BRCA";
  const compCancer = "BRCA";
  var sampleFilters = [];
  var signatureFilters = ["psi_er_negative_r1_v24_vs_others"];
  var geneFilters = [];
  var coordinateFilters = [];
  var oncospliceClusters = "R1-V24 (ER Negative Splice Enriched)";
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
      exportView["cancer"] = "GBM";
      exportView["single"] = ["PSI er negative r1 v24 vs others"];
      var splicingrpsi = response["data"]["oncospliceClusterIndices"];
      var splicingtrans = response["data"]["oncospliceClusterName"];
      defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, callback, document, targeturl, pancancercallback);
  })
}

function defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp, callback, doc, targeturl, pancancercallback)
{
  var postdata = {"data": {"cancerName": "GBM", "signature": "psi_er_negative_r1_v24_vs_others"}};
  axios({
    method: "post",
    data: postdata,
    url: routeurl.concat("/api/datasets/samples"),
    headers: { "Content-Type": "application/json" },
  })
  .then(function (response) {
    exp["cancer"] = "GBM";
    exp["ui_field_dict"] = response["data"]["samples"];
    exp["ui_field_range"] = response["data"]["range"];
    callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp);
    pancancercallback({"tableData": response["data"]["pancancersignature"], "clusterLength": response["data"]["uniqueclusters"]});
  })
}

export default defaultQuery;