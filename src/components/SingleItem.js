import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const boxProps_padding = {
  margin: 1,
  paddingRight: '10px',
  display: 'inline-block',
};

function SingleItem(props) {
  return(
    <Grid item>
    <Box borderColor="#dbdbdb" {...boxProps_padding}>
         <IconButton variant="contained" color="primary" onClick={() => props.deleteChild(props.get)}><CloseIcon /></IconButton>
         <IconButton variant="contained" color="primary"><LinearScaleIcon /></IconButton>
         {props.currentSelection}
    </Box>
    </Grid>
    );
}

export default SingleItem;