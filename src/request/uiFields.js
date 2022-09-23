import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function uiFields(arg, targeturl)
{
	console.log("start request");
	const export_dict = {};
	const cancername = arg["cancername"];
	var keys = {};
	keys["filter"] = [];
	keys["single"] = [];
  	console.log("cancername", cancername);
  	var postdata = {"data": cancername};
  	console.log("post data", postdata);
	axios({
	    method: "post",
	    data: postdata,
	    url: "http://localhost:8081/api/datasets/getui",
	    headers: { "Content-Type": "application/json" },
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
		//console.log("ham", callback);
		export_dict["cancer"] = cancername;
    	export_dict["ui_field_dict"] = response["data"]["meta"];
		callback(ui_field_dict, cancername, temp_q_obj, ui_field_range, sigFilters, resamt, sigTranslate, export_dict);

	});
}

export default uiFields;