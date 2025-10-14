import Plot from 'react-plotly.js';
import CbioportalLinkout from '../components/cBioportalLinkout';
import { global_colors } from '../utilities/constants.js';
import {ExpandedPlotViewButton} from '../components/ExpandedPlotView';

//This function groups samples by their atrributes and outputs two components:
//1. A violin plot (using Plotly.js) that compares expression between sample atrribute groups.
//2. A dynamically created linkout (via a button) to the website cbioportal that creates a survival plot with the given samples and their respective attribute groups.
function sampleFilterViolinPlotPanel(selectedRow, selectedExpressionArray, heatmapColumnArray, columnToFilterArray, filterSet, cancer){
  var datarray = [];
  var cBioportalInputData = {};
  var toCBioLabels = [];
  //console.log("lTF", out);
  //console.log("set", set);
  console.log("cancer", cancer);
  console.log("sampleFilter values", selectedExpressionArray, heatmapColumnArray, columnToFilterArray, filterSet);
  for(var i = 0; i < filterSet.length; i++)
  {
      var curstack = [];
      var curcol = [];
      for(var k = 0; k < heatmapColumnArray.length; k++)
      {
        const findMatchingKey = (obj, probeKey) => {
          if (obj[probeKey] !== undefined) return probeKey;
          const keys = Object.keys(obj);
          const exact = keys.find(k => k === probeKey);
          if (exact !== undefined) return exact;
          const inclusive = keys.find(k => k.includes(probeKey) || probeKey.includes(k));
          return inclusive;
        };
        
        const baseKey = heatmapColumnArray[k];
        const candidates = [baseKey, baseKey.concat("_bed"), baseKey.slice(0, 15), baseKey.slice(0, 15).concat("_bed")];
        
        // Handle SRR format
        if (baseKey.slice(0, 3) == "srr") {
          candidates.push(baseKey.replace(".", "_"));
          candidates.push(baseKey.replace(".", "_").concat("_bed"));
        }
        
        // Handle TCGA format - for truncated IDs like tcga_6a_ab49_01a_bed
        if (baseKey.startsWith("tcga_") && baseKey.endsWith("_bed")) {
          const truncatedId = baseKey.replace("_bed", "");
          candidates.push(truncatedId);
          const truncatedId2 = truncatedId.slice(0, 15)
          candidates.push(truncatedId2);
          const truncatedId3 = truncatedId.slice(0, 15)
          candidates.push(truncatedId3.concat("_bed"));
          
          // Try to find matching full TCGA ID in selectedExpressionArray
          const fullTcgKeys = Object.keys(selectedExpressionArray);
          const matchingFullKey = fullTcgKeys.find(fullKey => 
            fullKey.startsWith(truncatedId) && fullKey.length > truncatedId.length
          );
          if (matchingFullKey) {
            candidates.push(matchingFullKey);
          }
        }

        console.log("CANDIDATES: ", candidates);
        
        for (let ci = 0; ci < candidates.length; ci++) {
          const probe = candidates[ci];
          const matchKey = findMatchingKey(columnToFilterArray, probe);
          if (matchKey !== undefined && columnToFilterArray[matchKey] == filterSet[i]) {
            // Use the matching key from selectedExpressionArray, not the probe
            const expressionKey = probe.startsWith("tcga_") && !probe.endsWith("_bed") ? 
              Object.keys(selectedExpressionArray).find(key => key.startsWith(probe)) : 
              probe;
            
            if (expressionKey && selectedExpressionArray[expressionKey] !== undefined) {
              curstack.push(selectedExpressionArray[expressionKey]);
              curcol.push(baseKey);
              break;
            }
          }
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
  console.log("datarray", datarray, "2");
  var available_width = window.innerWidth;
  var available_height = window.innerHeight;
  var plotobj = <div id="lub2"><Plot
              data={datarray}
              layout={ {width: 0.25 * available_width, 
                        height: 300,
                        margin: {
                          l: 48,
                          r: 16,
                          b: 160,
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
                        showlegend: false,
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
  <div style={{display:"inline-block", width:"100%"}}>
  <span style={{float: "left"}}>
    <CbioportalLinkout cancer={cancer} label={toCBioLabels} data={cBioportalInputData}/>
  </span>
  <span style={{float: "right"}}>
    <ExpandedPlotViewButton inputType={"samplefilter"}></ExpandedPlotViewButton>
  </span>
  </div>
  </div>;
  return plotobj;
}

export default sampleFilterViolinPlotPanel;