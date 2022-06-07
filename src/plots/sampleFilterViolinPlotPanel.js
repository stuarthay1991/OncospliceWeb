import Plot from 'react-plotly.js';
import CBioportalLinkout from '../components/CBioportalLinkout';
import { global_colors } from '../constants.js';

//This function groups samples by their atrributes and outputs two components:
//1. A violin plot (using Plotly.js) that compares expression between sample atrribute groups.
//2. A dynamically created linkout (via a button) to the website cbioportal that creates a survival plot with the given samples and their respective attribute groups.
function sampleFilterViolinPlotPanel(selectedRow, selectedExpressionArray, heatmapColumnArray, columnToFilterArray, filterSet, cancer){
  var datarray = [];
  var cBioportalInputData = {};
  var toCBioLabels = [];
  //console.log("lTF", out);
  //console.log("set", set);
  for(var i = 0; i < filterSet.length; i++)
  {
      var curstack = [];
      var curcol = [];
      for(var k = 0; k < heatmapColumnArray.length; k++)
      {
        if(columnToFilterArray[heatmapColumnArray[k]] == filterSet[i])
        {
          curstack.push(selectedExpressionArray[heatmapColumnArray[k]]);
          curcol.push(heatmapColumnArray[k]);
        }
      }
      toCBioLabels.push(filterSet[i]);
      cBioportalInputData[filterSet[i]]=curcol;
      var name = filterSet[i];
      var curcolor = global_colors[i];
      datarray.push({
        y: curstack,
        type: 'violin',
        mode: 'lines+markers',
        name: name,
        marker: {color: curcolor},
      });
  }
  var plotobj = <><Plot
              data={datarray}
              layout={ {width: 535, 
                        height: 300,
                        margin: {
                          l: 48,
                          r: 48,
                          b: 100,
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
                        }},
                        xaxis:{
                        title: {
                          text: 'Filters',
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

export default sampleFilterViolinPlotPanel;