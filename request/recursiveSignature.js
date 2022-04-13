import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

//NEED FIX
function recursiveSignature(arg, targeturl)
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

export default recursiveSignature;