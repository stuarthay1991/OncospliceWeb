export function downloadTranscript(contentToDownload){
  var blob_text = "";
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
  filename = "transcript.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export function downloadGeneModel(contentToDownload){
  var blob_text = "";
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
  filename = "genemodel.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export function downloadJunctions(contentToDownload){
  var blob_text = "";
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
  filename = "junctions.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}
