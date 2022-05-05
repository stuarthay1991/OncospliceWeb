import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SpcInputLabel from "./SpcInputLabel";
import FilterItem from "./FilterItem";

const boxProps = {
  border: 3,
};

function LabelHeatmap(props){
  var QueryExport = props.QueryExport;
  var children_arr = [];
  if(QueryExport[props.type] != undefined)
  {
    for(var i = 0; i < QueryExport[props.type].length; i++)
    {
      children_arr.push(<FilterItem item={QueryExport[props.type][i]}/>)
    }
  }
  return(
    <div style={{marginBottom: 30}}>
    <SpcInputLabel label={props.title} />
    <Box borderColor="#dbdbdb" {...boxProps}>
      <div>
      <Grid container spacing={1}>
        {children_arr}
      </Grid>
      </div>
    </Box>
    </div>
  )
}

export default LabelHeatmap;