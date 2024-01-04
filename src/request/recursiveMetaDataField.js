import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function recursiveMetaDataField(arg, targeturl)
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
	    	var queryString = item.props.value;
	    	queryString = queryString.replace(/(\r\n|\n|\r)/gm, "");
	    	bodyFormData.append(item.props.name, queryString);
	    }
	    exportView["filter"].push((item.props.name.concat("#").concat(queryString)));
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

export default recursiveMetaDataField;
