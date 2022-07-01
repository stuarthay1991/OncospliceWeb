import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import BQSelect from '../../components/BQSelect';

import PreQueueMessage from '../../components/PreQueueMessage';
import { makeRequest } from '../../request/CancerDataManagement.js';

function ClientSelectedFilter({BQstate, P, key, number, get, deleteChild, range, possibleSelections, currentSelection, functioncall}) {
  var initial_val = BQstate.preQueueboxValues["children"][get] != undefined ? BQstate.preQueueboxValues["children"][get].props.value : "";
  const [state, setState] = React.useState({
    value: initial_val,
    name: 'hai',
  });
  var found_range = false;

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    BQstate.preQueueboxValues["children"][get] = <PreQueueMessage 
                                                    key={number} 
                                                    number={number} 
                                                    get={get} 
                                                    name={currentSelection} 
                                                    value={event.target.value}/>
    var args = {};
    args["name"] = currentSelection;
    args["value"] = event.target.value;
    args["number"] = get;
    args["filter"] = "filter";
    args["keys"] = BQstate.keys;
    args["pre_queueboxchildren"] = BQstate.preQueueboxValues;
    args["queueboxchildren"] = BQstate.queueboxValues;
    args["cancer"] = BQstate.cancer;
    args["parentResultAmt"] = BQstate.resultAmount;
    args["export"] = BQstate.export;
    args["setState"] = P.parentProps.setMeta;
    makeRequest("metaDataField", args);
  }

  var cur_filter = possibleSelections[currentSelection];
  for (const [key, value] of Object.entries(range))
  {
    var groovykey = key.replaceAll("_", " ");
    if((key.toLowerCase() == currentSelection.toLowerCase()) || (groovykey.toLowerCase() == currentSelection.toLowerCase()))
    {
      found_range = true;
      cur_filter = value;
    }
  }
  const cur_id = (currentSelection).concat("_id");
  return (
    <Grid item>
    <div>
      <span style={{display: "flex", marginTop: 8, marginLeft: 3}}>
      <span>
      <IconButton variant="contained" color="primary" onClick={() => deleteChild(get)}><CloseIcon /></IconButton>
      <IconButton variant="contained" color="primary"><LocalBarIcon /></IconButton>
      </span>
      <span>
      <FormControl>
        <span style={{flex: 1, display: "flex"}}>
        <span style={{color: "grey", marginTop: "0.4em", marginLeft: "0.4em", marginRight: "0.6em", fontSize: "1em"}}>{currentSelection.concat(":")}</span>
        <span style={{mmarginLeft: "0.5em", marginTop: "0.4em", fontSize: "0.75em", flex: 1}}>
        <BQSelect value={state.value} 
                  handleChange={handleChange} 
                  inputID={cur_id} 
                  componentWidth={"8em"}
                  componentHeight={"100%"}>
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
        </BQSelect>
        </span>
        </span>
      </FormControl>
      </span>
      </span>
    </div>
    </Grid>
  );
}

export default ClientSelectedFilter;