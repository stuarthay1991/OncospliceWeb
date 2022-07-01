import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';

import SpcInputLabel from '../../components/SpcInputLabel';

import { makeRequest } from '../../request/CancerDataManagement.js';

class ClientAddCoord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numChildren: 0
    };
  }

  render ()
  {
    return(
      <InputCoord addChild={this.onAddChild}>
      </InputCoord>
    )
  }

  onAddChild = () => {
    postCoords(this.props.cancer, this.props.export, this.props.callback);
  }

}

function InputCoord(props) {
  const stringA = "Enter Coordinates";
  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <SpcInputLabel label={stringA} />
    <div style={{display: "flex"}}>
        <textarea id="clientinputcoord" name="name" placeholder="Enter coordinates here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
        <IconButton type="submit" aria-label="add" onClick={props.addChild}>
          <AddIcon />
        </IconButton>
    </div>
    </Grid>
    </Grid>
    </div>
  );  
}

function postCoords(cancer, exp, callback)
{
  var all_coords = document.getElementById("clientinputcoord").value;
  var delimiter = "\n";
  if(all_coords.indexOf("\n") != -1 && all_coords.indexOf(",") == -1)
  {
    delimiter = "\n";
  }
  if(all_coords.indexOf("\n") == -1 && all_coords.indexOf(",") != -1)
  {
    delimiter = ",";
  }
  if(all_coords.indexOf("\n") != -1 && all_coords.indexOf(",") != -1)
  {
    if(all_coords.split(",").length > all_coords.split("\n").length)
    {
      delimiter = ",";
      all_coords = all_coords.replace("\n", "");
    }
    else
    {
      delimiter = "\n";
    }
  }

  all_coords = all_coords.split(delimiter);

  var pile_of_coords = [];

  for(var i=0; i<all_coords.length; i++)
  {
    pile_of_coords.push(all_coords[i]);
  }

  var args = {};
  console.log(pile_of_coords.length);
  console.log(pile_of_coords);
  var clientCoord = pile_of_coords;
  args["clientCoord"] = pile_of_coords;
  args["num"] = pile_of_coords.length;
  args["cancer"] = cancer;
  args["export"] = exp;
  args["setState"] = callback;
  makeRequest("coord", args);
}

export default ClientAddCoord;