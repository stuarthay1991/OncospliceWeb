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
    var myString = preQ["signatures"][keys["single"][i]].props.name;
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
    exportView["single"].push(myString); 
  }
  
  resamt = {"samples": arg["parentResultAmt"]["samples"], "events": Object.keys(completeListOfUIDs).length};
  callback(resamt, Q, keys, exportView, arg["egg"], completeListOfUIDs);
}

export default deleteSignature;