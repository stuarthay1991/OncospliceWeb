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
  const bodyFormData = new FormData();
  bodyFormData.append("cancer_type", cancername);
  let promises = [];
  var sigFilters;
  var sigTranslate;
  axios({
        method: "post",
        url: (targeturl.concat("/backend/update_signature_ui_fields.php")),
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })
  .then(function (response) 
  {
      console.log("CANCER RESPONSE", response);
      console.log("cancername", cancername);
      callback(cancername, response["data"]["sig"], response["data"]["sigtranslate"], keys);

  });
}

export default updateSignature;