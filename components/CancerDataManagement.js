import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from './QueueMessage';
import axios from 'axios';

//GLOBALS
const localurl = "/material-app";
const serverurl = "/ICGS/Oncosplice/testing";
const targeturl = serverurl;
const exportToViewPane = {};

export function makeRequest(to, arg)
{
	if(to == "uiFields"){ uiFields(arg);}
	if(to == "metaDataField"){ metaDataField(arg);}
	if(to == "recursiveMetaDataField"){ recursiveMetaDataField(arg);}
	if(to == "signature"){ signature(arg);}
	if(to == "recursiveSignature"){ recursiveSignature(arg);}
	if(to == "fetchHeatmapData"){ fetchHeatmapData(arg);}
	if(to == "gene"){ gene(arg);}
	if(to == "coord"){ coord(arg);}
	if(to == "defaultQuery"){ defaultQuery(arg);}
}

function uiFields(arg)
{
	const export_dict = {};
	const cancername = arg["cancername"];
	var keys = {};
	keys["filter"] = [];
	keys["single"] = [];
  	const bodyFormData = new FormData();
  	bodyFormData.append("cancer_type", cancername);
	axios({
	    method: "post",
	    url: (targeturl.concat("/backend/ui_fields.php")),
	    data: bodyFormData,
	    headers: { "Content-Type": "multipart/form-data" },
	})
	.then(function (response) 
	{
		//console.log(response);
	    var ui_field_dict = response["data"]["meta"];
    	var ui_field_range = response["data"]["range"];
    	var sigFilters = response["data"]["sig"];
    	var sigTranslate = response["data"]["sigtranslate"];

		var qcancer_rows = (response["data"]["qbox"]["rows"]).toString();
    	var qcancer_cols = (response["data"]["qbox"]["columns"]).toString();
    	var cmessage = qcancer_rows.concat(" events and ").concat(qcancer_cols).concat(" samples.");
		var cancerQueueMessage = <QueueMessage key={"c_type_q"} number={0} name={"cancer"} get={0} value={cancername} type={"cancer"} total_selected={cmessage} total_left={cmessage}/>;
		
		var resamt = {"samples": qcancer_cols, "events": qcancer_rows};

		var temp_q_obj = {}
		temp_q_obj["children"] = {};
		temp_q_obj["signatures"] = {};
		temp_q_obj["cancer"] = cancerQueueMessage;
		const callback = arg["setState"];
		//console.log("ham", callback);
		export_dict["cancer"] = cancername;
    export_dict["ui_field_dict"] = response["data"]["meta"];
		callback(ui_field_dict, cancername, temp_q_obj, ui_field_range, sigFilters, resamt, sigTranslate, export_dict);


		/*export_dict["cancer"] = cancername;
		export_dict["cancerQueueMessage"] = cancerQueueMessage;
		export_dict["ui_field_dict"] = ui_field_dict;
		export_dict["ui_field_range"] = ui_field_range;
		export_dict["sigFilters"] = sigFilters;
		export_dict["sigTranslate"] = sigTranslate;
		return export_dict;*/
	})
}

function defaultQuery(arg)
{
  const exportView = arg["export"];
  const callback = arg["setState"];
  const document = arg["doc"];

  var bodyFormData = new FormData();
  bodyFormData.append("PSIPsi cbfb gene fusions vs others", "PSIPsi cbfb gene fusions vs others");
  bodyFormData.append("CANCER","LAML");
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
      document.getElementById(`simple-tab-1`).click();
      var splicingreturned = response["data"]["rr"];
      var splicingcols = response["data"]["col_beds"];
      var splicingcc = response["data"]["cci"];
      exportView["filter"] = [];
      exportView["cancer"] = "LAML";
      exportView["single"] = ["Psi cbfb gene fusions vs others"];
      var splicingrpsi = response["data"]["rpsi"];
      var splicingtrans = response["data"]["oncokey"];
      defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, callback, document);
  })
}

function defaultQueryUiFields(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp, callback, doc)
{
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", "LAML");
  axios({
    method: "post",
    url: (targeturl.concat("/backend/ui_fields.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    //console.log("DQ_UI_fields", response["data"]);
    exp["cancer"] = "LAML";
    exp["ui_field_dict"] = response["data"]["meta"];
    exp["ui_field_range"] = response["data"]["range"];
    callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exp);
    doc.getElementById("sub").style.display = "none";
  })
}

function fetchHeatmapData(arg)
{
  const keys = arg["keys"];
  var clientcoord = arg["clientcoord"];
  var clientgenes = arg["clientgenes"];
  const childrenFilters = arg["childrenFilters"];
  const postoncosig = arg["postoncosig"];
  const sigTranslate = arg["sigTranslate"];
  const exportView = arg["export"];
  const curCancer = arg["cancer"];
  const callback = arg["updateViewPane"];
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
  //console.log("curcancer", curCancer);
  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qh_postdata = JSON.stringify(qh_arr)
  bodyFormData.append("HIST",qh_postdata);
  bodyFormData.append("USER",GLOBAL_user);
  //console.log("bodyFormDataCancer", curCancer)
  if(keys["single"].length == 0 && clientgenes.length == 0 && clientcoord.length == 0)
  {
    alert("Please select at least one signature or gene to continue.");
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
        //console.log("METAREQUEST response:", response["data"]);
        //response = JSON.parse(response);
        document.getElementById(`simple-tab-1`).click();
        var splicingreturned = response["data"]["rr"];
        var splicingcols = response["data"]["col_beds"];
        var splicingcc = response["data"]["cci"];
        var splicingrpsi = response["data"]["rpsi"];
        var splicingtrans = response["data"]["oncokey"];
        //console.log("EXPORT VIEW", exportView);
        callback(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans, exportView, arg["fullstate"]);
        document.getElementById("sub").style.display = "none";
        //changeUser(GLOBAL_user);
      })
  }
}


function gene(arg)
{
  const exportView = arg["export"];
  const clientgenes = arg["clientgenes"];
  const curCancer = arg["cancer"];
  const num = arg["num"];
  const callback = arg["setState"];

  var bodyFormData = new FormData();
  exportView["single"] = [];
  for(var i = 0; i < clientgenes.length; i++)
  {
    bodyFormData.append(("GENE".concat(clientgenes[i])), ("GENE".concat(clientgenes[i])));
    exportView["single"].push(("Gene: ".concat(clientgenes[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getgene.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      //add totalmatch for gene counter
      callback(clientgenes, exportView);
  })	
}

function coord(arg)
{
  const exportView = arg["export"];
  const clientcoord = arg["clientcoord"];
  const curCancer = arg["cancer"];
  const num = arg["num"];
  const callback = arg["setState"];

  var bodyFormData = new FormData();
  exportView["single"] = [];
  for(var i = 0; i < clientcoord.length; i++)
  {
    bodyFormData.append(("COORD".concat(clientcoord[i])), ("COORD".concat(clientcoord[i])));
    exportView["single"].push(("Coord: ".concat(clientcoord[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getcoord.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      callback(clientcoord, exportView);
  }) 
}

//Query history object
function viewQueryHistoryObj()
{

}

function recursiveMetaDataField(arg)
{
	const filter = arg["filter"];
	const keys = arg["keys"];
	//const number = arg["number"];
	//var value = arg["value"];
	//var name = arg["name"];
	const cancer = arg["cancer"];
	const preQ = arg["pre_queueboxchildren"];
	const Q = arg["queueboxchildren"];
	const exportView = arg["export"];
	exportView["filter"] = [];
	var bodyFormData = new FormData();
	var resamt = {"samples": 0, "events": arg["parentResultAmt"]["events"]};
	let promises = [];
	//name, value, number, filter
	//P.functioncall(P.pre_q["children"][P.keys["filter"][i]].props.name, P.pre_q["children"][P.keys["filter"][i]].props.value, P.keys["filter"][i], P.type);
	//console.log("DEBUG", keys, preQ["children"]);
	const callback = arg["setState"];
    for(var i = 0; i < keys[filter].length; i++)
    {
    	var bodyFormData = new FormData();
    	var i_name = preQ["children"][keys[filter][i]].props.name;
    	var i_value = preQ["children"][keys[filter][i]].props.value;
    	var i_number = keys[filter][i];
	  	for(var k = 0; k < keys[filter].length; k++)
	  	{
	  		var item = preQ["children"][keys[filter][k]];
	    	var myString = item.props.value;
	    	myString = myString.replace(/(\r\n|\n|\r)/gm, "");
	    	bodyFormData.append(item.props.name, myString);
	    }
	    exportView["filter"].push((item.props.name.concat("#").concat(myString)));
		i_name = i_name.replace(/(\r\n|\n|\r)/gm, "");
		i_value = i_value.replace(/(\r\n|\n|\r)/gm, "");
		bodyFormData.append(("SEL".concat(i_name)), i_value);
		bodyFormData.append("CANCER",cancer);
		promises.push(
		axios({
		    method: "post",
		    url: (targeturl.concat("/backend/getsinglemeta.php")),
		    data: bodyFormData,
		    headers: { "Content-Type": "multipart/form-data" },
		})
		.then(function (response) {
			var in_criterion = response["data"]["single"];
			var selected_left = response["data"]["meta"];
			var current_number_of_samples = response["data"]["meta"];
			resamt = {"samples": selected_left, "events": arg["parentResultAmt"]["events"]};
			Q["children"][i_number] = <QueueMessage key={i_number} number={i_number} name={i_name} get={i_number} value={i_value} type={"samples"} total_selected={in_criterion} total_left={selected_left}/>
			//console.log("CALLBACK", i);
			if(i == (keys[filter].length-1))
			{
			   	//console.log("CALLBACK", resamt);
			    callback(resamt, Q, preQ, keys, exportView);
			}
		})
		)
	  	
    }

    Promise.all(promises).then(() => callback(resamt, Q, preQ, keys));
    
}

function metaDataField(arg)
{
	const filter = arg["filter"];
	const keys = arg["keys"];
	const number = arg["number"];
	var value = arg["value"];
	var name = arg["name"];
	const cancer = arg["cancer"];
	const preQ = arg["pre_queueboxchildren"];
	const stateQboxchildren = arg["queueboxchildren"];
	const exportView = arg["export"];
  	var bodyFormData = new FormData();
  	exportView["filter"] = [];

  	for(var i = 0; i < keys[filter].length; i++)
  	{
  		var item = preQ["children"][keys[filter][i]];
    	var myString = item.props.value;
    	myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    	bodyFormData.append(item.props.name, myString);
    	exportView["filter"].push((item.props.name.concat("#").concat(myString)));
    	//sendToViewPane["filter"].push((item.props.name.concat("#").concat(myString)));
  	}
  	name = name.replace(/(\r\n|\n|\r)/gm, "");
  	value = value.replace(/(\r\n|\n|\r)/gm, "");
  	bodyFormData.append(("SEL".concat(name)), value);
  	bodyFormData.append("CANCER",cancer);
  	axios({
    	method: "post",
    	url: (targeturl.concat("/backend/getsinglemeta.php")),
    	data: bodyFormData,
    	headers: { "Content-Type": "multipart/form-data" },
  	})
    .then(function (response) {
      //console.log("selectfield response code starting...");
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      var current_number_of_samples = response["data"]["meta"];
      console.log("DEBUG: ", selected_left, arg["parentResultAmt"]["events"])
      var resamt = {"samples": selected_left, "events": arg["parentResultAmt"]["events"]};
      //console.log("selectfield repsonse: ", response["data"]);
      stateQboxchildren["children"][number] = <QueueMessage key={number} number={number} name={name} get={number} value={value} type={"samples"} total_selected={in_criterion} total_left={selected_left}/>
      //updateQueueBox(curCancer, keys["filter"].length, queueboxchildren, queueboxsignatures);
      const callback = arg["setState"];
      callback(resamt, stateQboxchildren, preQ, keys, exportView);
      //console.log("selectfield response code finished.");
  	})
}

function signature(arg)
{
  //name, number, filter
  var bodyFormData = new FormData();
  const keys = arg["keys"];
  const preQ = arg["pre_queueboxchildren"];
  const Q = arg["queueboxchildren"];
  const cancer = arg["cancer"];
  var resamt = arg["parentResultAmt"];
  const callback = arg["setState"];
  var name = arg["name"];
  var number = arg["keyval"];
  var filter = arg["type"];
  const sigTranslate = arg["sigTranslate"];
  const exportView = arg["export"];
  exportView["single"] = [];
  //sendToViewPane["single"] = [];
  
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = preQ[keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      //console.log("working working");
      if(sigTranslate[myString] != undefined)
      {
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }
      else
      {
        //myString = "PSI_".concat(myString);
        myString = myString.replace(" ", "_");
      }
      //console.log(myString);
    }
    bodyFormData.append(myString, myString);
    exportView["single"].push(myString);
    //console.log("SIGBODYFORMDATA1: ", myString);  
  }
  if(Object.entries(sigTranslate).length > 0)
  {
    if(sigTranslate[name] != undefined)
    {
        name = sigTranslate[name];
        name = name.replace("+", "positive_");
    }//TMEPORARY FIX
    else
    {
        //name = "PSI_".concat(name);
        name = name.replace(" ", "_");
    }
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    //console.log("SIGBODYFORMDATA2: ", name);
  }
  else
  {
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    //console.log("SIGBODYFORMDATA2: ", name);   
  }
  bodyFormData.append("CANCER",cancer);
  
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getsinglesig.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      var current_number_of_events = response["data"]["meta"];
      Q["signatures"][number] = <QueueMessage key={number} number={number} name={"PSI"} get={number} value={name} type={"events"} total_selected={in_criterion} total_left={selected_left}/>
      resamt = {"samples": arg["parentResultAmt"]["samples"], "events": selected_left};
      callback(resamt, Q, keys, exportView);
      //updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
  })
}

//NEED FIX
function recursiveSignature(arg)
{
  //name, number, filter
  var bodyFormData = new FormData();
  const keys = arg["keys"];
  const preQ = arg["pre_queueboxchildren"];
  const Q = arg["queueboxchildren"];
  const cancer = arg["cancer"];
  var resamt = arg["parentResultAmt"];
  const callback = arg["setState"];
  var name = arg["name"];
  var number = arg["keyval"];
  var filter = arg["type"];
  const sigTranslate = arg["sigTranslate"];
  const exportView = arg["export"];
  //sendToViewPane["single"] = [];
  
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = preQ[keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      //console.log("working working");
      if(sigTranslate[myString] != undefined)
      {
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }
      else
      {
        //myString = "PSI_".concat(myString);
        myString = myString.replace(" ", "_");
      }
      //console.log(myString);
    }
    bodyFormData.append(myString, myString);
    //sendToViewPane["single"].push(myString);
    //console.log("SIGBODYFORMDATA1: ", myString);  
  }
  if(Object.entries(sigTranslate).length > 0)
  {
    if(sigTranslate[name] != undefined)
    {
        name = sigTranslate[name];
        name = name.replace("+", "positive_");
    }//TMEPORARY FIX
    else
    {
        //name = "PSI_".concat(name);
        name = name.replace(" ", "_");
    }
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    //console.log("SIGBODYFORMDATA2: ", name);
  }
  else
  {
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    //console.log("SIGBODYFORMDATA2: ", name);   
  }
  bodyFormData.append("CANCER",cancer);
  
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getsinglesig.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      var current_number_of_events = response["data"]["meta"];
      Q["signatures"][number] = <QueueMessage key={number} number={number} name={"PSI"} get={number} value={name} type={"events"} total_selected={in_criterion} total_left={selected_left}/>
      resamt = {"samples": arg["parentResultAmt"]["samples"], "events": selected_left};
      callback(resamt, Q, keys, exportView);
      //updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
  })
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