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
}

function uiFields(arg)
{
	const export_dict = {};
	const cancername = arg["cancername"];
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
		console.log(response);
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
		console.log("ham", callback);
		callback(ui_field_dict, cancername, temp_q_obj, ui_field_range, sigFilters, resamt);

		export_dict["cancer"] = cancername;
		export_dict["cancerQueueMessage"] = cancerQueueMessage;
		export_dict["ui_field_dict"] = ui_field_dict;
		export_dict["ui_field_range"] = ui_field_range;
		export_dict["sigFilters"] = sigFilters;
		export_dict["sigTranslate"] = sigTranslate;
		return export_dict;
	})
}

function defaultQuery()
{

}

function defaultQueryUiFields()
{

}

function viewQueryHistoryObj()
{

}

function events()
{

}

function gene(num)
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
	var bodyFormData = new FormData();
	var resamt = {"samples": 0, "events": arg["parentResultAmt"]["events"]};
	//name, value, number, filter
	//P.functioncall(P.pre_q["children"][P.keys["filter"][i]].props.name, P.pre_q["children"][P.keys["filter"][i]].props.value, P.keys["filter"][i], P.type);
	console.log("DEBUG", keys, preQ["children"]);
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
	    	//sendToViewPane["filter"].push((item.props.name.concat("#").concat(myString)));
		  	i_name = i_name.replace(/(\r\n|\n|\r)/gm, "");
		  	i_value = i_value.replace(/(\r\n|\n|\r)/gm, "");
		  	bodyFormData.append(("SEL".concat(i_name)), i_value);
		  	bodyFormData.append("CANCER",cancer);
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
			    console.log("CALLBACK", i, k);
			    if(k == (keys[filter].length-1) && i == (keys[filter].length-1))
			    {
			    	console.log("CALLBACK", resamt);
			    	callback(resamt, Q, preQ, keys);
				}
		    })
	  	}
    }
    
    
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
  	var bodyFormData = new FormData();
  	//sendToViewPane["filter"] = [];
  	for(var i = 0; i < keys[filter].length; i++)
  	{
  		var item = preQ["children"][keys[filter][i]];
    	var myString = item.props.value;
    	myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    	bodyFormData.append(item.props.name, myString);
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
      callback(resamt, stateQboxchildren, preQ, keys);
      //console.log("selectfield response code finished.");
  	})	
}

function signature(name, number, filter)
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

//export { makeRequest };