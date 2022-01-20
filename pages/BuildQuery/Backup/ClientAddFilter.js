import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const addnewfiltericon = makeStyles((theme) => ({
  root: {
    fontSize: 40   
  }
}));

const widgetlabel2 = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    fontSize: 17,
    minHeight: 27
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
    for (var i = 0; i < P.keys[P.type].length; i += 1) {
      children.push(P.egg[P.keys[P.type][i]]);
    }; 

    return(
      <FilterMenuPopulate addChild={this.onAddChild} type={P.type} filterID={P.filterID} label={P.label} chicken={P.chicken}> 
        {children}
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

  onAddChild = () => {
    const P = this.props;
    const S = this.state;
    const keyval = document.getElementById(P.filterID).value.concat(S.numChildren.toString());
    P.keys[P.type].push(keyval);
    const filterIDvalue = document.getElementById(P.filterID).value;
    if(P.type == "filter")
    {
      P.egg[keyval] = <ClientSelectedFilter functioncall={P.functioncall} key={keyval} number={S.numChildren} get={keyval} deleteChild={this.onDeleteChild} chicken={P.chicken} egg={filterIDvalue} pre_q={P.pre_q}/>;
    }
    if(P.type == "single")
    {
      P.egg[keyval] = <SingleItem key={keyval} number={S.numChildren} get={keyval} deleteChild={this.onDeleteChild} chicken={P.chicken} egg={filterIDvalue}/>;
      P.pre_q[keyval] = <PreQueueMessage key={keyval} number={S.numChildren} get={keyval} name={filterIDvalue}/>
      P.functioncall(filterIDvalue, keyval, P.type);
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
  const widgetlabel = widgetlabel2();
  const [state, setState] = React.useState({
    value: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    props.addChild();
  };

  return(
    <div className={classes.parent}>
    <Grid container spacing={5}>
    <Grid item>
    <SpcInputLabel label={props.label}/>
    <div className={classes.secondaryinput}>
        <Grid container spacing={0}>
        <Grid item>
        <FormControl variant="outlined">
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
              var name_selected = key.replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              options.push(<option value={key}>{name_selected}</option>);
            }
            }
            else if(props.type == "single")
            {
            for(var i = 0; i < props.chicken.length; i++) {
              var name_selected = props.chicken[i].replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              options.push(<option value={props.chicken.length[i]}>{name_selected}</option>);
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
      {props.children}
    </Grid>
    </div>
  );
}

function ClientSelectedFilter({key, number, get, deleteChild, chicken, egg, pre_q, functioncall}) {
  const classes = useStyles();
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

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    pre_q[get] = <PreQueueMessage key={number} number={number} get={get} name={egg} value={event.target.value}/>
    functioncall(egg, event.target.value, get, "filter");
  }

  const cur_filter = chicken[egg];
  const cur_id = (egg).concat("_id");
  return (
    <Grid item>
    <div>
      <IconButton variant="contained" color="secondary" onClick={() => deleteChild(get)}><CloseIcon /></IconButton>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={cur_id}>{egg}</InputLabel>
        <Select
          native
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

            for (var i = 0; i < cur_filter.length; i++) {
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