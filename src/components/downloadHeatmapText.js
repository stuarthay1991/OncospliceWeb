import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

function downloadHeatmapText(data,cols,QueryExport,CC,RPSI)
{
  console.log("cols", cols);
  console.log("CC", CC);
  console.log("RPSI", RPSI);
  var content = "";
  var local_data = data;
  var local_cols = cols;
  var local_QE = QueryExport;
  //console.log(data, cols, QueryExport, "oops");
  //console.log("local_QE", local_QE);
  //console.log("local_cols", local_cols[0]);
  //console.log("local_cols", local_cols.length);
  //console.log("local_cols", local_cols[1]);
  console.log("local_data", local_data);
  var filename;
  filename = local_QE["cancer"];
  filename = filename.concat("_").concat(local_QE["single"]).concat(".csv");

  content = content.concat("Hierarchical Clusters,-,-,-,-");
  var content_line = "";
  for(var i = 0; i < CC.length; i++)
  {
    content_line = content_line.concat(",").concat(CC[i]);
  }
  content = content.concat(content_line);
  content = content.concat("\n");

  content = content.concat("Oncosplice Clusters,-,-,-,-");
  var content_line = "";
  for(var i = 0; i < local_cols.length; i++)
  {
    content_line = content_line.concat(",").concat(RPSI[local_cols[i]]);
  }
  content = content.concat(content_line);
  content = content.concat("\n");

  content = content.concat("UID,AltExons,ClusterID,dPSI,Symbol");
  
  for(var i = 0; i < local_cols.length; i++)
  {
    var sampleNameEdit = local_cols[i];
    sampleNameEdit = sampleNameEdit.substring(0, sampleNameEdit.length - 4);
    sampleNameEdit = sampleNameEdit.toUpperCase();
    sampleNameEdit = sampleNameEdit.replace(/_/g,"-");
    sampleNameEdit = sampleNameEdit.concat(".bed");
  	content = content.concat(",").concat(sampleNameEdit);
  }
  content = content.concat("\n");

  for(var i = 0; i < local_data.length; i++)
  {
  	var content_line = local_data[i]["uid"];
  	content_line = content_line.concat(",").concat(local_data[i]["altexons"]);
  	content_line = content_line.concat(",").concat(local_data[i]["clusterid"]);
  	content_line = content_line.concat(",").concat(local_data[i]["dpsi"]);
  	content_line = content_line.concat(",").concat(local_data[i]["symbol"]);
  	for(var k = 0; k < local_cols.length; k++)
  	{
  		content_line = content_line.concat(",").concat(local_data[i][local_cols[k]]);
  	}
  	content_line = content_line.concat("\n");
  	content = content.concat(content_line);
  }

  var uri = "data:application/octet-stream," + encodeURIComponent(content);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
  //window.location.href = uri;
}

export default downloadHeatmapText;
