import axios from 'axios';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "https://www.altanalyze.org/oncosplice" : "http://localhost:8081";

//This function transforms the raw data for visualizing transcripts into a downloadable format whereupon it is exported to
//the user in a .csv file.
export function downloadExonPlotData(downloadableFileName, contentToDownload){
  var blob_text = "";
  console.log("content to download", contentToDownload);
  for (const [key, value] of Object.entries(contentToDownload[0])) {
        blob_text = blob_text.concat(key);
        blob_text = blob_text.concat(",");
  }

  blob_text = blob_text.slice(0, -1);
  blob_text = blob_text.concat("\n");

  for(var i = 0; i < contentToDownload.length; i++)
  {
    for (const [key, value] of Object.entries(contentToDownload[i])) {
          blob_text = blob_text.concat(value);
          blob_text = blob_text.concat(",");
    }
    blob_text = blob_text.slice(0, -1);
    blob_text = blob_text.concat("\n");
  }
  var filename;
  filename = downloadableFileName;

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export function downloadPdfFunction(filename){
  var svg = document.getElementById('supp1'); // or whatever you call it
  var serializer = new XMLSerializer();
  var burg = serializer.serializeToString(svg);
  const postData = {};
  postData["data"] = {};
  postData["data"]["svg"] = burg;
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/createPdf"),
    data: postData,
    headers: { "Content-Type": "application/json" },
  })
  .then(function (response) {
      //console.log("full return from heatmap: ", response)
      document.getElementById("LoadingStatusDisplay").style.display = "none";
      //console.log("resLog", response["data"]);
      console.log(response["data"]);
  })

}