import Plot from 'react-plotly.js';
import axios from 'axios';
import { global_colors } from '../utilities/constants.js';
import targeturl from '../targeturl.js';
import { isBuild } from '../utilities/constants.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

export function gtexSend(UID, setGtexState, gtexState) {
  var postedData = {"data": {"uid": UID}}
  axios({
    method: "post",
    url: (routeurl.concat("/api/datasets/gtexData")),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var new_vec = response["data"]["result"][0];
      //console.log("new_vec", new_vec);
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

  var available_width = window.innerWidth;
  var available_height = window.innerHeight;

  const plotobj = <Plot
              data={datarray}
              layout={ {width: 0.260 * available_width, 
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