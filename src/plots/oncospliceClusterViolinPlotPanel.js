import Plot from 'react-plotly.js';
import CbioportalLinkout from '../components/cBioportalLinkout';
import {ExpandedPlotViewButton} from '../components/ExpandedPlotView';

//This object takes the samples that are associated with oncosplice clusters and outputs two components:
//A violin plot (using Plotly.js) that compares expression between oncosplice cluster samples.

export function oncospliceClusterViolinPlot(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer, flag="NO")
{
  //console.log("ONCO_PANTS", oncospliceSampleLabels, selectedOncospliceSignature);
  //console.log("oncospliceClusterViolinPlot data", heatmapColumnArray, oncospliceSampleLabels);
  var expressionArrayClusters = {"cluster0": [], "cluster1": []};
  //console.log("curcol", heatmapColumnArray[0]);
  let vo = heatmapColumnArray[0].replace("_bed", "");
  //console.log("curcol", vo);
  //console.log("cancol", oncospliceSampleLabels[vo])
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    let modcurcol = curcol.replace("_bed", "");
    if(parseInt(oncospliceSampleLabels[modcurcol], 10) == 0)
    {
      expressionArrayClusters["cluster0"].push(selectedExpressionArray[curcol]);
    }
  }
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    let modcurcol = curcol.replace("_bed", "");
    if(parseInt(oncospliceSampleLabels[modcurcol], 10) == 1)
    {
      expressionArrayClusters["cluster1"].push(selectedExpressionArray[curcol]);
    }
  }
  var available_width = window.innerWidth;
  var available_height = window.innerHeight;
  var width_to_use = flag == "NO" ? 0.25 * available_width : 0.520 * available_width;
  var height_to_use = flag == "NO" ? 200 : 400;
  var id_to_use = flag == "NO" ? "munch" : "bunch";
  //console.log("expressionArrayClusters", expressionArrayClusters)
  var plotobj = <div id={id_to_use}><Plot
            data={[
              {
                x: "Group1",
                y: expressionArrayClusters["cluster0"],
                type: 'violin',
                name: "Others",
                mode: 'lines+markers',
                marker: {color: 'grey'},
              },
              {
                x: "Group2",
                y: expressionArrayClusters["cluster1"],
                type: 'violin',
                name: selectedOncospliceSignature[0],
                mode: 'lines+markers',
                marker: {color: 'black'},
              }
            ]}

            layout={ {width: width_to_use,
                      margin: {
                          l: flag == "NO" ? 48 : 2,
                          r: flag == "NO" ? 16 : 2,
                          b: flag == "NO" ? 48 : 2,
                          t: flag == "NO" ? 40 : 2
                      },
                      title: {
                          text: selectedRow["pancanceruid"],
                          font: {
                            family: 'Arial, monospace',
                            size: 11,
                            color: '#7f7f7f'
                            }
                      },
                      yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Arial, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        },
                      },
                      xaxis:{
                        title: {
                          text: 'Clusters',
                          font: {
                            family: 'Arial, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      },
                      height: height_to_use} }
  />;
  </div>
  return plotobj;
}

//A dynamically created linkout (via a button) to the website cbioportal that creates a survival plot with the given samples and their respective clusters.
function cbioSetup(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer)
{
  var cBioportalInputData = {"cluster0": [], "cluster1": []};
  //console.log("heatmapColumnArray", heatmapColumnArray);
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    let modcurcol = curcol.replace("_bed", "");
    if(parseInt(oncospliceSampleLabels[modcurcol], 10) == 0)
    {
      cBioportalInputData["cluster0"].push(curcol);
    }
  }
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    let modcurcol = curcol.replace("_bed", "");
    if(parseInt(oncospliceSampleLabels[modcurcol], 10) == 1)
    {
      cBioportalInputData["cluster1"].push(curcol);
    }
  }
  //console.log("cBioportalInputData_Onco", cBioportalInputData);
  var toCBioLabels = ["others", selectedOncospliceSignature];
  var returnobj = <><CbioportalLinkout cancer={cancer} label={toCBioLabels} data={cBioportalInputData}/></>
  return returnobj;
}

//The holding panel.
function oncospliceClusterViolinPlotPanel(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer)
{
  var cbioObject = cbioSetup(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer);
  var ocvPlot = oncospliceClusterViolinPlot(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer)
  //var expandObject = expandedPlotViewSetup(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer)
  var ocvPanel = <>
  {ocvPlot}
  <div style={{display:"inline-block", width:"100%"}}>
  <span>{cbioObject}</span>
  <span style={{float: "right"}}><ExpandedPlotViewButton inputType={"oncosplice"}></ExpandedPlotViewButton></span>
  </div>
  </>;
  return ocvPanel;
}

/*function expandedPlotViewSetup(selectedRow, selectedExpressionArray, heatmapColumnArray, oncospliceSampleLabels, selectedOncospliceSignature, cancer, flag="YES")
{
  var inputData = {"selectedRow": selectedRow,
    "selectedExpressionArray": selectedExpressionArray,
    "heatmapColumnArray": heatmapColumnArray,
    "oncospliceSampleLabels": oncospliceSampleLabels,
    "selectedOncospliceSignature": selectedOncospliceSignature,
    "cancer": cancer,
    "flag": flag}
  var returnobj = <><ExpandedPlotViewButton inputData={inputData} inputFunction={oncospliceClusterViolinPlot} inputType={"oncosplice"}></ExpandedPlotViewButton></>
  return returnobj;
}*/

export default oncospliceClusterViolinPlotPanel;
