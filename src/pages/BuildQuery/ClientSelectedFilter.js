import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import PreQueueMessage from '../../components/PreQueueMessage';
import { makeRequest } from '../../request/CancerDataManagement.js';

const useStyles = makeStyles((theme) => ({
  parent: {
    marginTop: 8,
    marginBottom: 8,
  },
  secondaryinput: {
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    fontSize: "16px"
  }
}));

const widgetlabel5 = makeStyles((theme) => ({
  root: {
    fontSize: "16px"
  },
  select: {
    fontSize: "16px",
    maxWidth: "200px",
    width: "200px",
    minWidth: "200px"
  }
}));

function ClientSelectedFilter({BQstate, P, key, number, get, deleteChild, range, chicken, egg, functioncall}) {
  const classes = useStyles();
  const widgemidge = widgetlabel5();
  if(BQstate.pre_queueboxvalues["children"][get] != undefined)
  {
    var initial_val = BQstate.pre_queueboxvalues["children"][get].props.value;
  }
  else
  {
    var initial_val = "";
  }
  const [state, setState] = React.useState({
    value: initial_val,
    name: 'hai',
  });
  var found_range = false;
  //console.log("RANGE", range);
  //console.log("EGG", egg);
  //console.log("pre_q", pre_q);


  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    BQstate.pre_queueboxvalues["children"][get] = <PreQueueMessage 
                                                    key={number} 
                                                    number={number} 
                                                    get={get} 
                                                    name={egg} 
                                                    value={event.target.value}/>
    var args = {};
    //console.log("event.target.value", event.target.value);

    //name, value, number, filter
    args["name"] = egg;
    args["value"] = event.target.value;
    args["number"] = get;
    args["filter"] = "filter";
    args["keys"] = BQstate.keys;
    args["pre_queueboxchildren"] = BQstate.pre_queueboxvalues;
    args["queueboxchildren"] = BQstate.queuebox_values;
    args["cancer"] = BQstate.cancer;
    args["parentResultAmt"] = BQstate.resultAmount;
    args["export"] = BQstate.export;
    args["setState"] = P.parentProps.setMeta;
    makeRequest("metaDataField", args);
    //functioncall(egg, event.target.value, get, "filter");
  }

  var cur_filter = chicken[egg];
  for (const [key, value] of Object.entries(range))
  {
    var groovykey = key.replaceAll("_", " ");
    //console.log("ENTRIES", key, groovykey, egg);
    if((key.toLowerCase() == egg.toLowerCase()) || (groovykey.toLowerCase() == egg.toLowerCase()))
    {
      found_range = true;
      cur_filter = value;
    }
  }
  const cur_id = (egg).concat("_id");
  return (
    <Grid item>
    <div>
      <IconButton variant="contained" color="primary" onClick={() => deleteChild(get)}><CloseIcon /></IconButton>
      <IconButton variant="contained" color="primary"><LocalBarIcon /></IconButton>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={cur_id}>{egg}</InputLabel>
        <Select
          native
          classes={widgemidge}
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: cur_id,
          }}
        >
          <option value=""></option>
          {(() => {
            const options = [];

            for (var i = 0; i < cur_filter.length; i++) 
            {
              var name_selected = cur_filter[i].replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              options.push(<option value={cur_filter[i]}>{name_selected}</option>);
            }

            return options;
          })()}
        </Select>
      </FormControl>
    </div>
    </Grid>
  );
}

export default ClientSelectedFilter;