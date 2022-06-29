import React from 'react';
import Grid from '@material-ui/core/Grid';
import '@fontsource/roboto';

function FilterItem(props) {
  var message = props.item;
  message = message.replace("#", ": ");
  /*
  if(props.fontSize == undefined)
  {
  	props.fontSize = 16;
  }
  if(props.padding == undefined)
  {
  	props.padding = 6;
  }*/
  return(
    <Grid item>
    <div style={{fontSize: "0.75em", margin: "1.75em", fontFamily: 'Roboto', fontWeight: "bold", textAlign: 'left'}}>
      <strong style={{padding: 8, borderRadius: 8, backgroundColor: "black", color: "white", margin: "0.1em"}}>{message}</strong>
    </div>
    </Grid>
    );
}

export default FilterItem;