import Plot from 'react-plotly.js';
import CBioportalLinkout from '../components/CBioportalLinkout';
import { global_colors } from '../constants.js';

//This function takes the samples that are associated with hierarchical clusters and outputs two components:
//1. A violin plot (using Plotly.js) that compares expression between hierarchical cluster samples.
//2. A dynamically created linkout (via a button) to the website cbioportal that creates a survival plot with the given samples and their respective clusters.
function hierarchicalClusterViolinPlotPanel(selectedExpressionArray, selectedRow, heatmapColumnArray, clusterColumns, cancer){
  //Refactored according to the logic.
  var cBioportalInputData = {"cluster1": [], "cluster2": [], "cluster3": []};
  var expressionArrayCluster1 = [];
  var expressionArrayCluster2 = [];
  var expressionArrayCluster3 = [];
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    if(clusterColumns[i] == "1")
    {
      expressionArrayCluster1.push(selectedExpressionArray[curcol]);
      cBioportalInputData["cluster1"].push(curcol);
    }
    if(clusterColumns[i] == "2")
    {
      expressionArrayCluster2.push(selectedExpressionArray[curcol]);
      cBioportalInputData["cluster2"].push(curcol);
    }
    if(clusterColumns[i] == "3")
    {
      expressionArrayCluster3.push(selectedExpressionArray[curcol]);
      cBioportalInputData["cluster3"].push(curcol);
    }
  }
  var expressionArrayClusters = {};
  expressionArrayClusters["arr1"] = expressionArrayCluster1;
  expressionArrayClusters["arr2"] = expressionArrayCluster2;
  expressionArrayClusters["arr3"] = expressionArrayCluster3;
  var plotInputData = [];
  var toCBioLabels = ["Cluster1", "Cluster2"]
  plotInputData[0] = {
    y: expressionArrayClusters["arr1"],
    type: 'violin',
    mode: 'lines+markers',
    name: "Cluster 1",
    marker: {color: 'orange'},  	
  };
  plotInputData[1] = {
    y: expressionArrayClusters["arr2"],
    type: 'violin',
    mode: 'lines+markers',
    name: "Cluster 2",
    marker: {color: 'blue'},  	
  };
  if(expressionArrayClusters["arr3"].length > 0)
  {
  	toCBioLabels.push("Cluster3");
	plotInputData[2] = {
	    y: expressionArrayClusters["arr3"],
	    type: 'violin',
	    mode: 'lines+markers',
	    name: "Cluster 3",
	    marker: {color: 'blue'},  	
	};
  }
  var plotobj = <><Plot
              data={plotInputData}
              layout={ {width: 535,
                        height: 200,
                        margin: {
                          l: 48,
                          r: 48,
                          b: 48,
                          t: 40
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
                      }} }
    />
    <CBioportalLinkout cancer={cancer} label={toCBioLabels} data={cBioportalInputData}/>
  </>;
  return plotobj;
}

export default hierarchicalClusterViolinPlotPanel;