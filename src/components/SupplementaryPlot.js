import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SpcInputLabel from "./SpcInputLabel";
import * as Plotly from 'plotly';

const boxProps = {
  border: 3,
};

function loopThroughGene(props){
  var Data = props.Data;
  var Cols = props.Cols;

}

function SupplementaryPlot(props){
  
  const [state, setState] = React.useState({
      selection: null;
  });

  var Data = props.Data;
  var Cols = props.Cols;
  var Selection = state.selection;
  if(props.type == "violin")
  {
    var y0 = [];
    var y1 = [];
    for (var i = 0; i < 50; i ++) {
      y0[i] = Math.random();
      y1[i] = Math.random() + 1;
    }

    var trace1 = {
      y: y0,
      type: 'box'
    };

    var trace2 = {
      y: y1,
      type: 'box'
    };

    var plotdata = [trace1, trace2];
    Plotly.newPlot('myDiv', plotdata);  
  }

  return(
    <div style={{marginBottom: 10}}>
    <SpcInputLabel label={props.title} />
    <Box borderColor="#dbdbdb" {...boxProps}>
      <div>

      </div>
    </Box>
    </div>
  )
}

