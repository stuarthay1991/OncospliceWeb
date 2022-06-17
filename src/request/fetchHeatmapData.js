import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function fetchHeatmapData(arg, targeturl)
{
  const BQstate = arg["BQstate"];
  const BQprops = arg["BQprops"];
  const keys = BQstate.keys;
  var clientcoord = BQstate.clientcoord;
  var clientgenes = BQstate.clientgenes;
  const childrenFilters = BQstate.queryFilter;
  const postoncosig = BQstate.querySignature;
  const sigTranslate = BQstate.sigTranslate;
  const exportView = BQstate.export;
  const curCancer = BQstate.cancer;
  const compCancer = BQstate.compared_cancer;
  const callback = BQprops.setViewPane;
  var GLOBAL_user = "Default";
  var document = arg["document"];
  //console.log("FETCH ARGS", arg)
  document.getElementById("sub").style.display = "block";
  var bodyFormData = new FormData();
  var qh_arr = [];
  var tmp_qh_obj = {};
  for(var i = 0; i < keys["filter"].length; i++)
  {
    var myString = document.getElementById(childrenFilters[keys["filter"][i]].props.egg.concat("_id")).value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    //console.log("bodyFormDataSPLC", ("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    bodyFormData.append(("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    tmp_qh_obj["key"] = "SPLC".concat(childrenFilters[keys["filter"][i]].props.egg);
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < keys["single"].length; i++)
  {
    var myString = postoncosig[keys["single"][i]].props.egg;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    if(Object.entries(sigTranslate).length > 0)
    {
      if(sigTranslate[myString] != undefined)
      {
        bodyFormData.append(("RPSI".concat(myString)), myString);
        console.log("RPSI SUBMIT", myString);
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }//TEMPORARY FIX
      else
      {
        //myString = "PSI_".concat(myString);
        myString = myString.replace(" ", "_");
      }
      //console.log("Signature added:", myString);
    }
    myString = "PSI".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataPSI", myString, myString);
    bodyFormData.append(myString, myString);
  }
  for(var i = 0; i < clientgenes.length; i++)
  {
    var myString = clientgenes[i];
    tmp_qh_obj = {};
    myString = "GENE".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataGene", myString, myString);
    bodyFormData.append(myString, myString);
  }
  for(var i = 0; i < clientcoord.length; i++)
  {
    var myString = clientcoord[i];
    tmp_qh_obj = {};
    myString = "COORD".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataGene", myString, myString);
    bodyFormData.append(myString, myString);
  }  
  bodyFormData.append("CANCER",curCancer);
  bodyFormData.append("COMPCANCER",compCancer);
  //console.log("curcancer", curCancer);
  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qh_postdata = JSON.stringify(qh_arr);
  //console.log("QH1", qh_arr);
  //console.log("QH2", qh_postdata);
  bodyFormData.append("HIST",qh_postdata);
  bodyFormData.append("USER",GLOBAL_user);
  //console.log("bodyFormDataCancer", curCancer)
  if(keys["single"].length == 0 && clientgenes.length == 0 && clientcoord.length == 0)
  {
    alert("Please select at least one signature or gene to continue.");
    document.getElementById("sub").style.display = "none";
  }
  else if(clientgenes.length > 0 && parseInt(BQstate.resultAmount["events"]) == 0)
  {
    alert("These gene(s) have no matches in database. Please try different gene(s), remember to not use Ensembl IDs.");
    document.getElementById("sub").style.display = "none";
  }
  else
  {
    axios({
      method: "post",
      url: (targeturl.concat("/backend/metarequest.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        var dateval = response["data"]["date"];
        var indatatmp = {};
        //indatatmp["obj"] = qh_arr;
        //indatatmp["date"] = dateval;
        //queryhistory_dat.push(indatatmp);
        //addQueryHistory(indatatmp);
        console.log("METAREQUEST response:", response["data"]);
        //response = JSON.parse(response);
        //document.getElementById(`simple-tab-1`).click();
        var splicingreturned = response["data"]["rr"];
        var splicingcols = response["data"]["col_beds"];
        var splicingcc = response["data"]["cci"];
        var splicingrpsi = response["data"]["rpsi"];
        var splicingtrans = response["data"]["oncokey"];
        //console.log("EXPORT VIEW", exportView);
        callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, BQstate);
        document.getElementById("sub").style.display = "none";
        //changeUser(GLOBAL_user);
      })
  }
}

export default fetchHeatmapData;
