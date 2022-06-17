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

function postGenes(cancer, exp, callback, resamt)
{
  var all_uids = document.getElementById("clientinputgene").value;
  var delimiter = "\n";
  if(all_uids.indexOf("\n") != -1 && all_uids.indexOf(",") == -1)
  {
    delimiter = "\n";
  }
  if(all_uids.indexOf("\n") == -1 && all_uids.indexOf(",") != -1)
  {
    delimiter = ",";
  }
  if(all_uids.indexOf("\n") != -1 && all_uids.indexOf(",") != -1)
  {
    if(all_uids.split(",").length > all_uids.split("\n").length)
    {
      delimiter = ",";
      all_uids = all_uids.replace("\n", "");
    }
    else
    {
      delimiter = "\n";
    }
  }

  all_uids = all_uids.split(delimiter);

  var pile_of_uids = [];

  for(var i=0; i<all_uids.length; i++)
  {
    pile_of_uids.push(all_uids[i]);
  }

  var clientgenes = pile_of_uids;
  console.log(pile_of_uids.length);
  console.log(pile_of_uids);
  var args = {};
  args["clientgenes"] = pile_of_uids;
  args["num"] = pile_of_uids.length;
  args["cancer"] = cancer;
  args["export"] = exp;
  args["setState"] = callback;
  args["resamt"] = resamt;
  makeRequest("gene", args);
}


class ClientAddGene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numChildren: 0
    };
  }

  render ()
  {
    return(
      <InputGenes addChild={this.onAddChild}>
      </InputGenes>
    )
  }

  onAddChild = () => {
    postGenes(this.props.cancer, this.props.export, this.props.callback, this.props.BQstate.resultAmount);
  }

}

function InputGenes(props) {
  const stringA = "Enter Gene(s)";
  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <SpcInputLabel label={stringA} />
    <div style={{display: "flex"}}>
        <textarea id="clientinputgene" name="name" placeholder="TP53,JUN,MYC" onChange={props.addChild} style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
    </div>
    </Grid>
    </Grid>
    </div>
  );  
}

export default ClientAddGene;