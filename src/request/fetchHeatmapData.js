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
    sampleFilters.push({"key": childrenFilters[keys["filter"][i]].props.currentSelection, "value": queryString});
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
        oncospliceClusters = queryString;
        queryString = sigTranslate[queryString];
        queryString = queryString.replace("+", "positive_");

      }//TEMPORARY FIX
      else
      {
        queryString = queryString.replace(" ", "_");
      }
    }
    signatureFilters.push(queryString);
    queryString = "PSI".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < clientGenes.length; i++)
  {
    var queryString = clientGenes[i];
    tmp_qh_obj = {};
    geneFilters.push(queryString);
    queryString = "GENE".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < clientCoord.length; i++)
  {
    var queryString = clientCoord[i];
    tmp_qh_obj = {};
    coordinateFilters.push(queryString);
    queryString = "COORD".concat(queryString);
    tmp_qh_obj["key"] = queryString;
    tmp_qh_obj["val"] = queryString;
    qh_arr.push(tmp_qh_obj);
  }  

  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qhPostData = JSON.stringify(qh_arr);

  var postData = {"data": {"cancerName": curCancer, 
  "comparedCancer": compCancer,
  "oncospliceClusters": oncospliceClusters,
  "samples": sampleFilters,
  "signatures": signatureFilters,
  "genes": geneFilters,
  "coords": coordinateFilters}
  };

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
        var heatmapMatrix = response["data"]["rr"];
        var sampleNames = response["data"]["col_beds"];
        var hierarchicalClusterColumns = response["data"]["cci"];
        var oncospliceSignatureClusterColumns = response["data"]["rpsi"];
        var oncospliceSignatureClusterName = response["data"]["oncokey"];
        callback(heatmapMatrix, sampleNames, hierarchicalClusterColumns, oncospliceSignatureClusterColumns, oncospliceSignatureClusterName, exportView, BQstate);
        document.getElementById("sub").style.display = "none";
      })
  }
}

export default fetchHeatmapData;
