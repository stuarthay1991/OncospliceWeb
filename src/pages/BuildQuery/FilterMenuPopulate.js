import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import SpcInputLabel from "../../components/SpcInputLabel";
import BuildQuerySelect from "../../components/BuildQuerySelect";

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
    fontSize: "1.25em"
  }
}));

//This function populates the selection options for the filters (samples and signatures) on the left hand side of
//the build query panel. It also correctly parses the strings for display purposes.
function FilterMenuPopulate(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    value: '',
    name: 'hai',
    rawvalue: '',
  });

  var viewDict = {};

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
      rawvalue: event.target.value,
    });
    //TEMPORARY FIX (UPDATE AS SOON AS POSSIBLE)
    props.addChild(viewDict[event.target.value])
  };
  
  return(
    <div className={classes.parent}>
    <Grid container spacing={5}>
    <Grid item>
    <SpcInputLabel label={props.label}/>
    <div className={classes.secondaryinput}>
        <Grid container spacing={0}>
        <Grid item>
        <FormControl>
        <Tooltip title="Select option from the menu. Filters will correspond to patient data for each cancer, while signatures/coordinates/genes correspond to events.">
        <BuildQuerySelect
          value={state.value}
          handleChange={handleChange}
          inputID={props.filterID}
        >
          <option value=""></option>
          {(() => {
            const options = [];

            if(props.type == "filter")
            {
            for (const [key, value] of Object.entries(props.possibleSelections)) {
              var name_selected = key.replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              name_selected = name_selected.toUpperCase();
              options.push(<option value={key}>{name_selected}</option>);
            }
            }
            else if(props.type == "single")
            {
            for(var i = 0; i < props.possibleSelections.length; i++) {
              var name_selected = props.possibleSelections[i];
              if((Object.entries(props.sigTranslate)).length > 0)
              {
                if(props.sigTranslate[name_selected] != undefined)
                {
                  final_name_selected = props.sigTranslate[name_selected];
                  viewDict[final_name_selected] = final_name_selected;
                }
                else
                {
                  var final_name_selected = name_selected.replaceAll("__", " _");
                  final_name_selected = final_name_selected.replaceAll("_", " ");
                  final_name_selected = final_name_selected.replaceAll("  ", " ");
                  final_name_selected = final_name_selected.replaceAll("PSI ", "");
                  viewDict[final_name_selected] = name_selected;               
                }
              }
              else
              {
                var final_name_selected = name_selected.replaceAll("__", " _");
                final_name_selected = final_name_selected.replaceAll("_", " ");
                final_name_selected = final_name_selected.replaceAll("  ", " ");
                final_name_selected = final_name_selected.charAt(0).toUpperCase() + final_name_selected.slice(1);
                viewDict[final_name_selected] = name_selected;
              }
              options.push(<option value={props.possibleSelections.length[i]}>{final_name_selected}</option>);
            }
            }
            return options;
          })()}
        </BuildQuerySelect>
        </Tooltip>
        </FormControl>
        </Grid>
        </Grid>
    </div>
    </Grid>
    </Grid>
    </div>
  );
}

export default FilterMenuPopulate;
