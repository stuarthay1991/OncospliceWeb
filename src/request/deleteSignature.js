import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function deleteSignature(arg, targeturl)
{
  //name, number, filter
  const keys = arg["keys"];
  const Q = arg["queueboxchildren"];
  var resamt = arg["parentResultAmt"];
  var completeListOfUIDs = arg["completeListOfUIDs"];
  const sigTranslate = arg["sigTranslate"];
  const callback = arg["setState"];
  const preQ = arg["pre_queueboxchildren"];
  var name = arg["name"];
  for (const [key, value] of Object.entries(completeListOfUIDs))
  {
    var current_list = completeListOfUIDs[key];
    for(var i = 0; i < current_list.length; i++)
    {
      if(name == current_list[i])
      {
        current_list.splice(i, 1);
      }
    }
    if(current_list.length == 0)
    {
      delete completeListOfUIDs[key];
    }
    else
    {
      completeListOfUIDs[key] = current_list; 
    }
  }

  const exportView = arg["export"];
  exportView["single"] = [];
  //Reset export
  for(var i = 0; i < keys["single"].length; i++)
  {
    var signatureName = preQ["signatures"][keys["single"][i]].props.name;
    signatureName = signatureName.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      signatureName = sigTranslate[signatureName] != undefined ? sigTranslate[signatureName].replace("+", "positive_") : signatureName.replace(" ", "_");
    }
    exportView["single"].push(signatureName); 
  }
  
  //delete from postoncosig
  const postoncosig = arg["egg"];
  for (const [key, value] of Object.entries(postoncosig))
  {
    if(value == "")
    {
      delete postoncosig[key];
    }
  }

  resamt = {"samples": arg["parentResultAmt"]["samples"], "events": Object.keys(completeListOfUIDs).length};
  callback(resamt, Q, keys, exportView, postoncosig, completeListOfUIDs);
}

export default deleteSignature;