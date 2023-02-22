import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { makeRequest } from './CancerDataManagement.js';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

function updateSignature(arg, targeturl)
{
  const export_dict = {};
  const cancername = arg["cancerType"];
  const callbackForSignatureList = arg["callbackOne"];
  const callbackForSelectedSignature = arg["callbackTwo"];
  //console.log("updateSignature_1", callbackOne);
  var postdata = {"data": cancername};
  axios({
        method: "post",
        url: routeurl.concat("/api/datasets/signatures"),
        data: postdata,
        headers: { "Content-Type": "application/json" },
    })
  .then(function (response) 
  {
      //console.log("CANCER RESPONSE", response);
      //console.log("cancername", cancername);
      //console.log("updateHeatmapArgs", args["updateHeatmapArgs"]);
      callbackForSignatureList(response["data"]["signatureTranslate"]);
      callbackForSelectedSignature({"signature": Object.keys(response["data"]["signatureTranslate"])[0], 
                                    "oncocluster": "R1-V2", 
                                    "initialized": true});
      //This function can't directly call updateHeatmapData because it isn't using the state of the navBar object.
      //This causes problems with certain selections and needs to be fixed ASAP. 
      //arg["updateHeatmapArgs"]["signature"] = [Object.keys(response["data"]["signatureTranslate"])[0]];
      makeRequest("updateHeatmapData", arg["updateHeatmapArgs"])
  });
}

export default updateSignature;