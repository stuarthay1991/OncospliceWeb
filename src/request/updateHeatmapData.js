import axios from 'axios';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "https://www.altanalyze.org/oncosplice" : "http://localhost:8081";

function updateHeatmapData(arg, targeturl)
{
    //console.log("routeurl", routeurl)
    const postData = {};
    postData["data"] = {};
    const callback = arg["callback"];
    const pancancercallback = arg["pancancerupdate"];
    var exportView = arg["exportView"];
    exportView["cancerType"] = arg["cancerType"];
    postData["data"]["cancerName"] = arg["cancerType"];
    postData["data"]["comparedCancer"] = arg["comparedCancer"];
    postData["data"]["oncospliceClusters"] = arg["oncocluster"];
    postData["data"]["eventType"] = arg["eventType"];
    document.getElementById("LoadingStatusDisplay").style.display = "block";
    document.getElementById("heatmapLoadingDiv").style.display = "block";

    document.getElementById("HEATMAP_LABEL").style.opacity = 0.2;
    document.getElementById("HEATMAP_CC").style.opacity = 0.2;
    document.getElementById("HEATMAP_OncospliceClusters").style.opacity = 0.2;
    document.getElementById("HEATMAP_0").style.opacity = 0.2;
    document.getElementById("HEATMAP_ROW_LABEL").style.opacity = 0.2;

    if(arg["sample"] != undefined && arg["sample"] != null){
        postData["data"]["samples"] = [arg["sample"]];
    }
    else{
        postData["data"]["samples"] = undefined;
    }
    postData["data"]["coords"] = arg["coords"];
    postData["data"]["signatures"] = arg["signature"];
    exportView["single"] = arg["signature"];
    postData["data"]["genes"] = arg["genes"];
    console.log("postLog", postData);

    axios({
        method: "post",
        url: routeurl.concat("/api/datasets/heatmapData"),
        data: postData,
        headers: { "Content-Type": "application/json" },
      })
    .then(function (response) {
        //console.log("full return from heatmap: ", response)
        document.getElementById("LoadingStatusDisplay").style.display = "none";
        //console.log("resLog", response["data"]);
        if(response["data"] != "Error")
        {
          var dateval = response["data"]["date"];
          var heatmapMatrix = response["data"]["rr"];
          var sampleNames = response["data"]["col_beds"];
          var hierarchicalClusterColumns = response["data"]["cci"];
          var oncospliceSignatureClusterColumns = response["data"]["oncospliceClusterIndices"];
          var oncospliceSignatureClusterName = response["data"]["oncospliceClusterName"];    
          sampleUiRefresh(postData["data"]["cancerName"], heatmapMatrix, sampleNames, hierarchicalClusterColumns, oncospliceSignatureClusterColumns, oncospliceSignatureClusterName, exportView, callback, postData, pancancercallback);
        }
        else
        {
          document.getElementById("HEATMAP_LABEL").style.opacity = 1;
          document.getElementById("HEATMAP_CC").style.opacity = 1;
          document.getElementById("HEATMAP_OncospliceClusters").style.opacity = 1;
          document.getElementById("HEATMAP_0").style.opacity = 1;
          document.getElementById("HEATMAP_ROW_LABEL").style.opacity = 1;
          document.getElementById("heatmapLoadingDiv").style.display = "none";
          alert("no entries found!");
        }
    })

}

function sampleUiRefresh(cancerType, heatmapMatrix, sampleNames, hierarchicalClusterColumns, oncospliceSignatureClusterColumns, oncospliceSignatureClusterName, exportView, callback, prevPostData, pancancercallback)
{
    var postdata = {"data": {"cancerName": cancerType, "signature": prevPostData["data"]["signatures"]}};
    axios({
      method: "post",
      data: postdata,
      url: routeurl.concat("/api/datasets/samples"),
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      //console.log("full retrun from ui response: ", response)
      exportView["cancer"] = cancerType;
      exportView["ui_field_dict"] = response["data"]["samples"];
      exportView["ui_field_range"] = response["data"]["range"];
      //console.log(sampleNames, "sampleNames")
      document.getElementById("HEATMAP_LABEL").style.opacity = 1;
      document.getElementById("HEATMAP_CC").style.opacity = 1;
      document.getElementById("HEATMAP_OncospliceClusters").style.opacity = 1;
      document.getElementById("HEATMAP_0").style.opacity = 1;
      document.getElementById("HEATMAP_ROW_LABEL").style.opacity = 1;
      document.getElementById("heatmapLoadingDiv").style.display = "none";
      //console.log("updating view panel with: ", cancerType, heatmapMatrix, sampleNames, hierarchicalClusterColumns, oncospliceSignatureClusterColumns, oncospliceSignatureClusterName, exportView, prevPostData)
      callback(heatmapMatrix, sampleNames, hierarchicalClusterColumns, oncospliceSignatureClusterColumns, oncospliceSignatureClusterName, exportView);
      pancancercallback({"DEtableData": response["data"]["pancancerDE"], "tableData": response["data"]["pancancersignature"], "clusterLength": response["data"]["uniqueclusters"], "cancer": cancerType});
    })
    
}

export default updateHeatmapData;