import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { makeRequest } from '../../request/CancerDataManagement.js';

import useStyles from '../../useStyles.js';
import '../../App.css';


function SubmitButton(props){
  const BQstate = props.BQstate;
  const BQprops = props.BQprops;
  var args = {};
  var to = "fetchHeatmapData";
  var functionpointer = makeRequest;
  if(BQstate.defaultQuery == true){
    functionpointer = makeRequest;
    args["setState"] = BQprops.setViewPane;
    args["export"] = BQstate.export;
    args["cancer"] = BQstate.cancer;
    args["doc"] = document;
    to = "defaultQuery";
  }
  else{
    functionpointer = makeRequest;
    args["BQprops"] = BQprops;
    args["BQstate"] = BQstate;
    args["document"] = document;
    to = "fetchHeatmapData";
  }
  const classes = useStyles();
  return(
    <Tooltip title="Retrieve the results from the database and visualize them">
    <Button className={classes.myButton} onClick={() => functionpointer(to, args)} style={{ textTransform: 'none'}}>Run query</Button>
    </Tooltip>
  )
}

export default SubmitButton;