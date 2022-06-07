import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

//NEED FIX
function deleteSignature(arg, targeturl)
{
  //name, number, filter
  const keys = arg["keys"];
  const Q = arg["queueboxchildren"];
  var resamt = arg["parentResultAmt"];
  var completeListOfUIDs = arg["completeListOfUIDs"];
  const callback = arg["setState"];
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
  resamt = {"samples": arg["parentResultAmt"]["samples"], "events": Object.keys(completeListOfUIDs).length};
  callback(resamt, Q, keys, exportView, arg["egg"], completeListOfUIDs);
}

export default deleteSignature;