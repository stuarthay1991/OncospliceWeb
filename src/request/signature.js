import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function mergeSignatures(name, currentListOfUIDs, completeListOfUIDs)
{
  for(let i in currentListOfUIDs)
  {
    try 
    {
      completeListOfUIDs[currentListOfUIDs[i]].push(name);
    } catch (error) 
    {
      console.error(error);
      completeListOfUIDs[currentListOfUIDs[i]] = [name];
    }
    
  }
  return completeListOfUIDs;
}

function signature(arg, targeturl)
{
  //name, number, filter
  console.log("callback...started");
  var bodyFormData = new FormData();
  const keys = arg["keys"];
  const egg = arg["egg"];
  var completeListOfUIDs = arg["completeListOfUIDs"];
  const preQ = arg["pre_queueboxchildren"];
  const Q = arg["queueboxchildren"];
  const cancer = arg["cancer"];
  var resamt = arg["parentResultAmt"];
  const callback = arg["setState"];
  var name = arg["name"];
  const original_name = name;
  var number = arg["keyval"];
  var filter = arg["type"];
  const sigTranslate = arg["sigTranslate"];
  const exportView = arg["export"];
  exportView["single"] = [];
  
  for(let i in keys[filter])
  {
    var myString = preQ["signatures"][keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      if(sigTranslate[myString] != undefined)
      {
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }
      else
      {
        myString = myString.replace(" ", "_");
      }
    }
    bodyFormData.append(myString, myString);
    exportView["single"].push(myString); 
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
        name = name.replace(" ", "_");
    }
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
  }
  else
  {
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);  
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
      completeListOfUIDs = mergeSignatures(original_name, response["data"]["result"], completeListOfUIDs);
      resamt = {"samples": arg["parentResultAmt"]["samples"], "events": Object.keys(completeListOfUIDs).length};
      callback(resamt, Q, keys, exportView, egg, completeListOfUIDs);
      //updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
  })
}

export default signature;