import Plot from 'react-plotly.js';
import CBioportalLinkout from '../components/CBioportalLinkout';
import { global_colors } from '../utilities/constants.js';

//This function takes the samples that are associated with oncosplice clusters and outputs two components:
//1. A violin plot (using Plotly.js) that compares expression between oncosplice cluster samples.
//2. A dynamically created linkout (via a button) to the website cbioportal that creates a survival plot with the given samples and their respective clusters.
function oncospliceClusterViolinPlotPanel(selectedRow, selectedExpressionArray, heatmapColumnArray, 
                                          oncospliceSampleLabels, selectedOncospliceSignature, cancer)
{
  var expressionArrayClusters = {"cluster0": [], "cluster1": []};
  var cBioportalInputData = {"cluster0": [], "cluster1": []};
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    if(oncospliceSampleLabels[curcol] == "0")
    {
      expressionArrayClusters["cluster0"].push(selectedExpressionArray[curcol]);
      cBioportalInputData["cluster0"].push(curcol);
    }
  }
  for(var i = 0; i < heatmapColumnArray.length; i++)
  {
    var curcol = heatmapColumnArray[i];
    if(oncospliceSampleLabels[curcol] == "1")
    {
      expressionArrayClusters["cluster1"].push(selectedExpressionArray[curcol]);
      cBioportalInputData["cluster1"].push(curcol);
    }
  }
  var toCBioLabels = ["others", selectedOncospliceSignature];
  var available_width = window.innerWidth;
  var available_height = window.innerHeight;
  var plotobj = <><Plot
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
                name: selectedOncospliceSignature,
                mode: 'lines+markers',
                marker: {color: 'black'},
              }
            ]}

            layout={ {width: 0.260 * available_width,
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
                      },
                      height: 200} }
  />
  <CBioportalLinkout cancer={cancer} label={toCBioLabels} data={cBioportalInputData}/>
  </>;
  return plotobj;
}

export default oncospliceClusterViolinPlotPanel;