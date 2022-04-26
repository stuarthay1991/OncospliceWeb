import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function coord(arg, targeturl)
{
  const exportView = arg["export"];
  const clientcoord = arg["clientcoord"];
  const curCancer = arg["cancer"];
  const num = arg["num"];
  const callback = arg["setState"];

  var bodyFormData = new FormData();
  exportView["single"] = [];
  for(var i = 0; i < clientcoord.length; i++)
  {
    bodyFormData.append(("COORD".concat(clientcoord[i])), ("COORD".concat(clientcoord[i])));
    exportView["single"].push(("Coord: ".concat(clientcoord[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getcoord.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      callback(clientcoord, exportView);
  }) 
}

export default coord;