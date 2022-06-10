import Plot from 'react-plotly.js';
import axios from 'axios';
import { global_colors } from '../constants.js';
import targeturl from '../targeturl.js';

export function gtexSend(UID, setGtexState, gtexState) {
  var bodyFormData = new FormData();
  bodyFormData.append("UID",UID);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/GTex.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var new_vec = response["data"]["result"][0];
      gtexPlotPanel(new_vec, setGtexState, gtexState);
  })  
}

function gtexPlotPanel(vec, setGtexState, gtexState){
  var datarray = [];
  var counter = 0;
  for (const [key, value] of Object.entries(vec)) {
          if(key != "uid")
          {
          //console.log(key, value);
          var tmparr = value.split("|");
          
          var curcolor = global_colors[counter];
          datarray.push({
            y: tmparr,
            type: 'violin',
            mode: 'lines+markers',
            name: key,
            marker: {color: curcolor},
          });

          counter = counter + 1;
          }
  }

  const plotobj = <Plot
              data={datarray}
              layout={ {width: 525, 
                        height: 450,
                        margin: {
                          l: 48,
                          r: 32,
                          b: 200,
                          t: 40
                        },
                        showlegend: false,
                        title: {
                          text: "GTEX",
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
                          text: 'GTEX',
                          font: {
                            family: 'Arial, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      }} }
  />
  setGtexState({gtexPlot: plotobj})
}