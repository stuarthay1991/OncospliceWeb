import React from 'react';
import ReactDOM from 'react-dom';
import QueueMessage from '../components/QueueMessage';
import axios from 'axios';

function gene(arg, targeturl)
{
  const exportView = arg["export"];
  const clientgenes = arg["clientgenes"];
  const curCancer = arg["cancer"];
  const num = arg["num"];
  const callback = arg["setState"];
  var resamt = arg["resamt"];

  var bodyFormData = new FormData();
  exportView["single"] = [];
  for(var i = 0; i < clientgenes.length; i++)
  {
    bodyFormData.append(("GENE".concat(clientgenes[i])), ("GENE".concat(clientgenes[i])));
    exportView["single"].push(("Gene: ".concat(clientgenes[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getgene.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      var outmatch = {"samples": resamt["samples"], "events": totalmatch};
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      //add totalmatch for gene counter
      callback(clientgenes, exportView, outmatch);
  })	
}

export default gene;