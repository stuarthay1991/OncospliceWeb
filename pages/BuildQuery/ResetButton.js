import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

import useStyles from '../../useStyles.js';
import '../../App.css';

function reload() {
    window.location.href = "http://www.altanalyze.org/ICGS/Oncosplice/testing/index.html/build";
}

function ResetButton(){
  const classes = useStyles();
  return(
    <Button className={classes.myButton} onClick={() => reload()} style={{ textTransform: 'none'}}>Reset</Button>
  )
}

export default ResetButton;