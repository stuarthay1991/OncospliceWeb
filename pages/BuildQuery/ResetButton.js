import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from '../../useStyles.js';
import '../../App.css';

function reload() {
    window.location.href = "http://www.altanalyze.org/ICGS/Oncosplice/testing/index.html/build";
}

function ResetButton(){
  const classes = useStyles();
  return(
  	<Tooltip title="Remove all queries.">
    <Button className={classes.myButton} onClick={() => reload()} style={{ textTransform: 'none'}}>Reset</Button>
    </Tooltip>
  )
}

export default ResetButton;