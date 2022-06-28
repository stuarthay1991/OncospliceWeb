import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  parent: {
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    margin: 12,
  },
  altparent: {
    fontSize: "1.1em",
  },
  build_message: {
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: "1.25em",
  },
  selected_message: {
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: "1.25em",
  },
  in_criterion_message: {
    position: 'relative',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: "1.25em",
  }
}));


function QueueMessage(props) 
{
  const classes = useStyles();
  var parentclass = classes.parent;
  var selectedclass = classes.selected_message;
  var build_message;
  var selected_message = "";
  var in_criterion_message = "";
  var name_selected = props.name.replace("_", " ");
  name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
  build_message = name_selected.concat(" - ").concat(props.value);
  if(props.type != "cancer")
  {
  selected_message = selected_message.concat(" selected ").concat(props.total_left).concat(" ").concat(props.type);
  in_criterion_message = in_criterion_message.concat("(in criterion ").concat(props.total_selected).concat(")");
  selected_message = "";
  in_criterion_message = "";
  }
  else
  {
  selected_message = build_message;
  in_criterion_message = "";
  parentclass = classes.altparent;
  selectedclass = classes.altparent;
  }
  return(
      <div className={parentclass}>
      <Grid container spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item>
      <div className={classes.selected_message}>{selected_message}</div>
      </Grid>
      <Grid item>
      <div className={classes.in_criterion_message}>{in_criterion_message}</div>
      </Grid>
      </Grid>
      </div>
    );
}

export default QueueMessage;
