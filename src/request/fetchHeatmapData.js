import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function fetchHeatmapData(arg, targeturl)
{
  const BQstate = arg["BQstate"];
  const BQprops = arg["BQprops"];
  const keys = BQstate.keys;
  var clientCoord = BQstate.clientCoord;
  var clientGenes = BQstate.clientGenes;
  const childrenFilters = BQstate.queryFilter;
  const listOfSelectedSignatures = BQstate.querySignature;
  const sigTranslate = BQstate.sigTranslate;
  const exportView = BQstate.export;
  const curCancer = BQstate.cancer;
  const compCancer = BQstate.comparedCancer;
  const callback = BQprops.setViewPane;
  var GLOBAL_user = "Default";
  var document = arg["document"];
  document.getElementById("sub").style.display = "block";
  var qh_arr = [];
  var tmp_qh_obj = {};

  var sampleFilters = [];
  var signatureFilters = [];
  var geneFilters = [];
  var coordinateFilters = [];
  var oncospliceClusters = undefined;

  for(var i = 0; i < keys["filter"].length; i++)
  {
    var queryString = document.getElementById(childrenFilters[keys["filter"][i]].props.currentSelection.concat("_id")).value;
    queryString = queryString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    bodyFormData.append(("SPLC".concat(childrenFilters[keys["filter"][i]].props.currentSelection)), queryString);
    tmp_qh_obj["key"] = "SPLC".concat(childrenFilters[keys["filter"][i]].props.currentSelection);
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < keys["single"].length; i++)
  {
    var queryString = listOfSelectedSignatures[keys["single"][i]].props.currentSelection;
    queryString = queryString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    if(Object.entries(sigTranslate).length > 0)
    {
      if(sigTranslate[queryString] != undefined)
      {
        bodyFormData.append(("RPSI".concat(queryString)), queryString);
        console.log("RPSI SUBMIT", queryString);
        queryString = sigTranslate[queryString];
        queryString = queryString.replace("+", "positive_");
      }//TEMPORARY FIX
      else
      {
        //myString = "PSI_".concat(myString);
        queryString = queryString.replace(" ", "_");
      }
    }
    queryString = "PSI".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
    bodyFormData.append(queryString, queryString);
  }
  for(var i = 0; i < clientGenes.length; i++)
  {
    var queryString = clientGenes[i];
    tmp_qh_obj = {};
    queryString = "GENE".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
    bodyFormData.append(queryString, queryString);
  }
  for(var i = 0; i < clientCoord.length; i++)
  {
    var queryString = clientCoord[i];
    tmp_qh_obj = {};
    queryString = "COORD".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
    bodyFormData.append(queryString, queryString);
  }  
  bodyFormData.append("CANCER",curCancer);
  bodyFormData.append("COMPCANCER",compCancer);
  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qh_postdata = JSON.stringify(qh_arr);
  bodyFormData.append("HIST",qh_postdata);
  bodyFormData.append("USER",GLOBAL_user);
  if(keys["single"].length == 0 && clientGenes.length == 0 && clientCoord.length == 0)
  {
    alert("Please select at least one signature or gene to continue.");
    document.getElementById("sub").style.display = "none";
  }
  else if(clientGenes.length > 0 && parseInt(BQstate.resultAmount["events"]) == 0)
  {
    alert("These gene(s) have no matches in database. Please try different gene(s), remember to not use Ensembl IDs.");
    document.getElementById("sub").style.display = "none";
  }
  else
  {
    axios({
      method: "post",
      url: "http://localhost:8081/api/datasets/getheatmapdata",
      data: postData,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        console.log("full return from heatmap: ", response)
        var dateval = response["data"]["date"];
        var indatatmp = {};
        var splicingreturned = response["data"]["rr"];
        var splicingcols = response["data"]["col_beds"];
        var splicingcc = response["data"]["cci"];
        var splicingrpsi = response["data"]["rpsi"];
        var splicingtrans = response["data"]["oncokey"];
        callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, BQstate);
        document.getElementById("sub").style.display = "none";
      })
  }
}

export default fetchHeatmapData;
