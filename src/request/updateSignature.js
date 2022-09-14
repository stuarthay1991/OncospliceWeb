import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function updateSignature(arg, targeturl)
{
  const export_dict = {};
  const cancername = arg["cancername"];
  const callback = arg["setState"];
  const BQstate = arg["BQstate"];
  const P = arg["P"];
  const none = arg["none"];
  const targetsigobj = BQstate.comparedCancer_signature;
  console.log("updateSignature_1", callback);
  var keys = arg["keys"];
  keys["single"] = [];
  console.log("cancername", cancername);
  var postdata = {"data": cancername};
  console.log("post data", postdata);
  let promises = [];
  var sigFilters;
  var sigTranslate;
  axios({
        method: "post",
        url: "http://localhost:8081/api/datasets/updatesignatures",
        data: postdata,
        headers: { "Content-Type": "application/json" },
    })
  .then(function (response) 
  {
      console.log("CANCER RESPONSE", response);
      console.log("cancername", cancername);
      callback(cancername, response["data"]["sig"], response["data"]["sigtranslate"], keys);

  });
}

export default updateSignature;