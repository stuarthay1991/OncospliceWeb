import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PreQueueMessage from './PreQueueMessage';
import SingleItem from './SingleItem';
import Icon from '@material-ui/core/Icon';
import SpcInputLabel from "./SpcInputLabel";

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

const addnewfiltericon = makeStyles((theme) => ({
  root: {
    fontSize: 40   
  }
}));

const widgetlabel3 = makeStyles((theme) => ({
  root: {
    fontSize: "16px",
    maxWidth: "360px",
    width: "360px",
    minWidth: "360px"
  },
  select: {
    fontSize: "16px",
    maxWidth: "360px",
    width: "360px",
    minWidth: "360px"
  }
}));

const widgetlabel2 = makeStyles((theme) => ({
  root: {
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

const labelstyle2 = makeStyles((theme) => ({
  labelstyle: {
    backgroundColor: '#599bb3',
    color: 'white',
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 2
  }
}));

const boxProps_padding = {
  border: 3,
  margin: 1,
  paddingRight: '10px',
  display: 'inline-block',
};

class ClientAddFilter extends React.Component {
  constructor(props) {
    super(props);
    const P = this.props;
    this.state = {
      numChildren: P.keys[P.type].length
    };
  }

  render (){
    const P = this.props;
    const children = [];

    console.log("ClientAddFilter: RENDER: ", P.keys[P.type]);
    for(var i = 0; i < P.keys[P.type].length; i += 1) 
    {
      children.push(P.egg[P.keys[P.type][i]]);
    };

    P.syncQB(children, P.type);

    return(
      <FilterMenuPopulate addChild={this.onAddChild} type={P.type} filterID={P.filterID} sigTranslate={P.sigTranslate} label={P.label} chicken={P.chicken} range={P.rangeSet}> 
      </FilterMenuPopulate>
    )
  }

  onDeleteChild = (keyval) => {
    const P = this.props;
    P.removeKey(P.type, keyval)
    P.egg[keyval] = "";
    console.log(this.state.numChildren);
    this.setState(state => ({...state, numChildren: state.numChildren - 1}));
    console.log(this.state.numChildren);
    if(P.type == "filter")
    {
      P.pre_q[keyval] = undefined;
      P.q[keyval] = "";
      for(var i = 0; i < P.keys["filter"].length; i++)
      {
        P.functioncall(P.pre_q[P.keys["filter"][i]].props.name, P.pre_q[P.keys["filter"][i]].props.value, P.keys["filter"][i], P.type)
      }
    }
    if(P.type == "single")
    {
      P.pre_q[keyval] = undefined;
      P.q[keyval] = "";
      for(var i = 0; i < P.keys["single"].length; i++)
      {
        P.functioncall(P.pre_q[P.keys["single"][i]].props.name, P.keys["single"][i], P.type);
      }
    }    
  }

  onAddChild = (invalue) => {
    const P = this.props;
    const S = this.state;
    const keyval = document.getElementById(P.filterID).value.concat(S.numChildren.toString());
    P.keys[P.type].push(keyval);
    const filterIDvalue = document.getElementById(P.filterID).value;
    console.log("added value", invalue);
    var found = false;
    if(P.rangeSet != undefined)
    {
      for (const [newkey, newvalue] of Object.entries(P.rangeSet)) {
        if(newkey == filterIDvalue)
        {
          found = true;
          break;
        }
      }
    }
    if(P.type == "filter")
    {
      if(found)
      {
        P.egg[keyval] = <ClientSelectedFilter functioncall={P.functioncall} key={keyval} number={S.numChildren} get={keyval} deleteChild={this.onDeleteChild} range={P.rangeSet} chicken={P.rangeSet} egg={filterIDvalue} pre_q={P.pre_q}/>;
      }
      else
      {
        P.egg[keyval] = <ClientSelectedFilter functioncall={P.functioncall} key={keyval} number={S.numChildren} get={keyval} deleteChild={this.onDeleteChild} range={P.rangeSet} chicken={P.chicken} egg={filterIDvalue} pre_q={P.pre_q}/>;
      }
    }
    if(P.type == "single")
    {
      P.egg[keyval] = <SingleItem key={keyval} number={S.numChildren} get={keyval} deleteChild={this.onDeleteChild} chicken={P.chicken} egg={invalue}/>;
      P.pre_q[keyval] = <PreQueueMessage key={keyval} number={S.numChildren} get={keyval} name={invalue}/>
      P.functioncall(invalue, keyval, P.type);
    }
    this.setState(state => ({...state, numChildren: state.numChildren + 1}));
  }
}

function AddButton(props) {
  const classes = addnewfiltericon();
  return(
    <IconButton size={"large"} disableFocusRipple={true} disableRipple={true} type="submit" aria-label="add" onClick={props.addChild}>
      <AddIcon classes={classes} size={"large"} />
    </IconButton>
  );
}

function FilterMenuPopulate(props) {
  const classes = useStyles();
  const widgetlabel = widgetlabel3();
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
    //console.log(event.target);
    props.addChild(viewDict[event.target.value]);
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
        <Select
          native
          classes={widgetlabel}
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: props.filterID,
          }}
        >

          <option value=""></option>
          {(() => {
            const options = [];

            if(props.type == "filter")
            {
            for (const [key, value] of Object.entries(props.chicken)) {
             /* var found = false;
              if(props.range != undefined)
              {
                for (const [newkey, newvalue] of Object.entries(props.range)) {
                  if(newkey == key)
                  {
                    console.log("Kung fu randypants");
                    found = true;
                    break;
                  }
                }
              }*/
              //if(found)
              //{
                //console.log("Key time", key);
                //var name_selected = "Range: ".concat(key);
                //options.push(<option value={key}>{name_selected}</option>);
              ///}
              //else
              //{
              //console.log("Print out the key: ", key);
              var name_selected = key.replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              name_selected = name_selected.toUpperCase();
              options.push(<option value={key}>{name_selected}</option>);
              //}
            }
            }
            else if(props.type == "single")
            {
            for(var i = 0; i < props.chicken.length; i++) {
              var name_selected = props.chicken[i];
              if((Object.entries(props.sigTranslate)).length > 0)
              {
                //console.log("WUMBA!", props.sigTranslate[name_selected]);
                if(props.sigTranslate[name_selected] != undefined)
                {
                  final_name_selected = props.sigTranslate[name_selected];
                  viewDict[final_name_selected] = final_name_selected;
                }
                else
                {
                  //console.log("msel1", name_selected);
                  var final_name_selected = name_selected.replaceAll("__", " _");
                  //console.log("msel2", name_selected);
                  final_name_selected = final_name_selected.replaceAll("_", " ");
                  final_name_selected = final_name_selected.replaceAll("  ", " ");
                  //console.log("msel3", name_selected);
                  final_name_selected = final_name_selected.replaceAll("PSI ", "");
                  viewDict[final_name_selected] = name_selected;
                  //console.log("msel4", name_selected);
                  //Temporary fix
                  //name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);                  
                }
              }
              else
              {
                //console.log("nsel1", name_selected);
                var final_name_selected = name_selected.replaceAll("__", " _");
                //console.log("nsel2", name_selected);
                final_name_selected = final_name_selected.replaceAll("_", " ");
                final_name_selected = final_name_selected.replaceAll("  ", " ");
                //console.log("nsel3", name_selected);
                final_name_selected = final_name_selected.charAt(0).toUpperCase() + final_name_selected.slice(1);
                viewDict[final_name_selected] = name_selected;
                //console.log("nsel4", name_selected);
              }
              options.push(<option value={props.chicken.length[i]}>{final_name_selected}</option>);
            }
            }
            return options;
          })()}
        </Select>
        </FormControl>
        </Grid>
        </Grid>
    </div>
    </Grid>
    </Grid>
    </div>
  );
}

function ClientSelectedFilter({key, number, get, deleteChild, range, chicken, egg, pre_q, functioncall}) {
  const classes = useStyles();
  const widgemidge = widgetlabel5();
  if(pre_q[get] != undefined)
  {
    var initial_val = pre_q[get].props.value;
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
    pre_q[get] = <PreQueueMessage key={number} number={number} get={get} name={egg} value={event.target.value}/>
    functioncall(egg, event.target.value, get, "filter");
  }

  var cur_filter = chicken[egg];
  for (const [key, value] of Object.entries(range))
  {
    var groovykey = key.replaceAll("_", " ");
    console.log("ENTRIES", key, groovykey, egg);
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

export default ClientAddFilter;