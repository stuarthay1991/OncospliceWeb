import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import ClientAddFilter from '../pages/BuildQuery/ClientAddFilter';
import targeturl from '../targeturl.js';
import axios from 'axios';

import uiFields from './uiFields.js';
import updateSigature from './updateSignature.js';
import defaultQuery from './defaultQuery.js';
import fetchHeatmapData from './fetchHeatmapData.js';
import updateHeatmapData from './updateHeatmapData.js';
import gene from './gene.js';
import coord from './coord.js';
import recursiveMetaDataField from './recursiveMetaDataField.js';
import metaDataField from './metaDataField.js';
import signature from './signature.js';
import updateSignature from './updateSignature.js';

//GLOBALS
const exportToViewPane = {};

export function makeRequest(to, arg)
{
	if(to == "uiFields"){ uiFields(arg, targeturl);}
	if(to == "metaDataField"){ metaDataField(arg, targeturl);}
	if(to == "recursiveMetaDataField"){ recursiveMetaDataField(arg, targeturl);}
	if(to == "signature"){ signature(arg, targeturl);}
	if(to == "fetchHeatmapData"){ fetchHeatmapData(arg, targeturl);}
  if(to == "updateHeatmapData"){ updateHeatmapData(arg, targeturl);}
	if(to == "gene"){ gene(arg, targeturl);}
	if(to == "coord"){ coord(arg, targeturl);}
	if(to == "defaultQuery"){ defaultQuery(arg, targeturl);}
  if(to == "updateSignature"){ updateSignature(arg, targeturl);}
}

//Query history object
function viewQueryHistoryObj()
{

}

function resetKeys(keys)
{
    keys["filter"] = [];
    keys["single"] = [];
    return keys;
}

function resetQueueChildren(queuechildren)
{
    queuechildren["queueboxchildren"] = {};
    queuechildren["pre_queueboxchildren"] = {};
    queuechildren["queueboxsignatures"] = {};
    queuechildren["pre_queueboxsignatures"] = {};
    return queuechildren;
}

//IMPLEMENT THIS
/*
function ajaxviewquery(indata) {
  var bodyFormData = new FormData();
  sendToViewPane["filter"] = [];
  sendToViewPane["single"] = [];
  for(var i = 0; i < indata.length; i++)
  {
    bodyFormData.append(indata[i]["key"], indata[i]["val"]);
    if(indata[i]["key"].substring(0, 4) == "SPLC")
    {
      sendToViewPane["filter"].push(indata[i]["val"]);
    }
    if(indata[i]["key"].substring(0, 3) == "PSI")
    {
      sendToViewPane["single"].push(indata[i]["val"]);
    }
  }
  axios({
    method: "post",
    url: (targeturl.concat("/backend/metarequest.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      document.getElementById(`simple-tab-1`).click();
      splicingreturned = response["data"]["rr"];
      splicingcols = response["data"]["col_beds"];
      splicingcc = response["data"]["cci"];
      updateViewPane(splicingreturned, splicingcols, splicingcc);
      document.getElementById("sub").style.display = "none";
  })
}
*/

//export { makeRequest };