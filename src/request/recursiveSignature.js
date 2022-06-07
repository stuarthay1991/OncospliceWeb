import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

//NEED FIX
function deleteSignature(arg, targeturl)
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
  resamt = {"samples": arg["parentResultAmt"]["samples"], "events": selected_left};
  callback(resamt, Q, keys, exportView);
}

export default recursiveSignature;