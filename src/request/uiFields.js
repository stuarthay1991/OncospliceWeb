import axios from 'axios';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

function uiFields(arg, targeturl)
{
	console.log("start request");
	const export_dict = {};
	const cancername = arg["cancerType"];
	const pancancercallback = arg["pancancerupdate"];
	const signature = arg["signature"];
  	console.log("cancername", cancername);
	var postdata = {"data": {"cancerName": cancername, "signature": signature}};
	const callback = arg["callback"];
  	console.log("post data", postdata);
	axios({
	    method: "post",
	    data: postdata,
	    url: routeurl.concat("/api/datasets/samples"),
	    headers: { "Content-Type": "application/json" },
	})
	.then(function (response)
	{
		var samples = response["data"]["samples"];
		var pctable = response["data"]["pancancersignature"];
		console.log("pctable", response["data"]);
		callback(samples);
		pancancercallback({"DEtableData": response["data"]["pancancerDE"], "tableData": response["data"]["pancancersignature"], "clusterLength": response["data"]["uniqueclusters"], "cancer": cancername});
	});
}

export default uiFields;