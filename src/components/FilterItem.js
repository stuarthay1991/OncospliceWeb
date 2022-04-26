import React from 'react';
import Grid from '@material-ui/core/Grid';
import '@fontsource/roboto';

function FilterItem(props) {
  var message = props.item;
  message = message.replace("#", ": ");
  if(props.fontSize == undefined)
  {
  	props.fontSize = 16;
  }
  if(props.padding == undefined)
  {
  	props.padding = 6;
  }
  return(
    <Grid item>
    <div style={{fontSize: props.fontSize, margin: 8, fontFamily: 'Roboto', fontWeight: "bold", textAlign: 'left'}}>
      <strong style={{backgroundColor: "#0F6A8B", color: "white", padding: props.padding, borderRadius: props.padding, margin: 2}}>{message}</strong>
    </div>
    </Grid>
    );
}

export default FilterItem;