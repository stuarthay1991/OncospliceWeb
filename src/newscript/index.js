import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import axios from 'axios';
import {Helmet} from "react-helmet";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import OKMAP from './ViewPane.js';
import useStyles from './useStyles.js';
import ViewPane from './ViewPane.js';
//import ClientAddFilter from './ClientAddFilter.js'

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: 'white',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: 'black',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    opacity: 1,
    '&:focus': {
      fontWeight: 'bold',
      backgroundColor: 'white',
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const defaultProps = {
  m: 1,
};

const boxProps = {
  border: 3,
};

const boxProps_padding = {
  border: 3,
  margin: 1,
  paddingRight: '10px',
  display: 'inline-block',
};

//Global Variables
var flag = 0;
var ui_field_dict;
var cur_filter_amt = 0;
var childrenFilters = [];
var postoncosig = [];
var clientgenes = [];
var queueboxchildren = {};
var pre_queueboxchildren = {};
var queueboxsignatures = {};
var pre_queueboxsignatures = {};
var sigFilters;
var curCancer;
var keys = {};
keys["filter"] = [];
keys["single"] = [];

function updateQueueBox(num, arr, sig){
    const ta1 = [];
    const ta2 = [];

    for(var i = 0; i < keys["filter"].length; i++)
    {
      ta1.push(arr[keys["filter"][i]])
    }

    for(var i = 0; i < keys["single"].length; i++)
    {
      ta2.push(sig[keys["single"][i]])
    }

    this.setState({
      numChildren: num,
      targetArr: ta1,
      targetSignatures: ta2
    });
}

function updateCancerType(ctype){
    this.setState({
      cancerType: ctype
    });
}

function removeKey(type, keyval){
  for(var i = 0; i < keys[type].length; i++)
  {
    if(keys[type][i] == keyval)
    {
      keys[type].splice(i, 1);
      break;
    }
  }
}

function selectfield(name, value, number, filter){
  var bodyFormData = new FormData();
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxchildren[keys[filter][i]].props.value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(pre_queueboxchildren[keys[filter][i]].props.name, myString);
  }
  name = name.replace(/(\r\n|\n|\r)/gm, "");
  value = value.replace(/(\r\n|\n|\r)/gm, "");
  bodyFormData.append(("SEL".concat(name)), value);
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: "/material-app/backend/getsinglemeta.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      queueboxchildren[number] = <QueueMessage key={number} number={number} name={name} get={number} value={value} type={"samples"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(keys["filter"].length, queueboxchildren, queueboxsignatures);
    })
}

function selectsignature(name, number, filter){
  var bodyFormData = new FormData();
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxsignatures[keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(myString, myString);
  }
  name = name.replace(/(\r\n|\n|\r)/gm, "");
  bodyFormData.append(("SEL".concat(name)), name);
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: "/material-app/backend/getsinglesig.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      queueboxsignatures[number] = <QueueMessage key={number} number={number} name={"PSI"} get={number} value={name} type={"uids"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(keys["single"].length, queueboxchildren, queueboxsignatures);
  })  
}

function getfields(cancername) {
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", cancername);
  axios({
    method: "post",
    url: "/material-app/backend/ui_fields.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    // handle success
    //console.log(response);
    ui_field_dict = response["data"]["meta"];
    sigFilters = response["data"]["sig"];
    curCancer = cancername;
    console.log(ui_field_dict);
    updateCancerType(cancername);
  })
}

function ajaxfunc() {
var bodyFormData = new FormData();
for(var i = 0; i < keys["filter"].length; i++)
{
  var myString = document.getElementById(childrenFilters[keys["filter"][i]].props.egg.concat("_id")).value;
  myString = myString.replace(/(\r\n|\n|\r)/gm, "");
  //myString = myString.split("rows) ");
  //myString = myString[1];
  bodyFormData.append(("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
}
for(var i = 0; i < keys["single"].length; i++)
{
  var myString = postoncosig[keys["single"][i]].props.egg;
  myString = myString.replace(/(\r\n|\n|\r)/gm, "");
  //myString = myString.split("rows) ");
  //myString = myString[1];
  myString = "PSI".concat(myString);
  bodyFormData.append(myString, myString);
}
for(var i = 0; i < clientgenes.length; i++)
{
  var myString = clientgenes[i].props.egg;
  myString = "GENE".concat(myString);
  bodyFormData.append(myString, myString);
}
bodyFormData.append("CANCER",curCancer);
axios({
  method: "post",
  url: "/material-app/backend/metarequest.php",
  data: bodyFormData,
  headers: { "Content-Type": "multipart/form-data" },
})
  .then(function (response) {
    console.log(response);
    //response = JSON.parse(response);
    document.getElementById(`simple-tab-1`).click();
    var thelist = document.getElementById("HEATMAP_0");   
    while (thelist.hasChildNodes()){
        thelist.removeChild(thelist.lastChild);
    }

    var rr = response["data"]["rr"];
    var cbeds = response["data"]["col_beds"];

    var base_re_wid = window.innerWidth;
    var base_re_high = window.innerHeight;
    var standard_width = 1438;
    var standard_height = 707;
    var adjust_width = (base_re_wid / standard_width) * 1.28;
    var adjust_height = (base_re_high / standard_height) * 1.28;
    var y_start = 0;
    var universal_y = 15;
    var y_scaling = universal_y;

    var map1 = new OKMAP("HEATMAP_0", cbeds, document, ((400/cbeds.length) * adjust_width), rr.length);
    map1.baseSVG("100%", ((y_scaling * rr.length) + 50));
    map1.writeBase(y_scaling);
    const set = new Set([]);
    setTimeout(function(){
    for(var i = 0; i < rr.length; i++)
    {
      //console.log(rr[i]);
      map1.writeSingle5(y_start, rr[i], y_scaling, ((400/cbeds.length) * adjust_width), cbeds, 1);
      y_start = y_start + y_scaling;
      set.add(rr[i]["symbol"]);
    }
    }, 1000);
  })
}

function CancerSelect(props) {
  const classes = useStyles();
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
    getfields(event.target.value);
  }

  return (
    <Grid item xs={3}>
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={"CancerSelect_id"}>{"Cancer Type"}</InputLabel>
        <Select
          native
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: "CancerSelect_id",
          }}
        >
          <option value=""></option>
          {(() => {
            const options = [];
            options.push(<option value={"LGG"}>{"LGG"}</option>);
            options.push(<option value={"LAML"}>{"LAML"}</option>);
            return options;
          })()}
        </Select>
      </FormControl>
    </div>
    </Grid>
  );
}

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancerType: "NULL"
    };
    updateCancerType = updateCancerType.bind(this)
  }

  render ()
  {
    const children = [];
    if(this.state.cancerType != "NULL")
    {
      children.push(<div><div>
      <ClientAddFilter chicken={ui_field_dict} egg={childrenFilters} type={"filter"} filterID={"meta_filter_id"} label={"Add Sample Filter"}>
      </ClientAddFilter>
      </div>
      <div>
      <ClientAddFilter chicken={sigFilters} egg={postoncosig} type={"single"} filterID={"sig_filter_id"} label={"Oncosplice Signature Filter"}>
      </ClientAddFilter>
      </div>
      <div>
      <ClientAddGene egg={clientgenes} filterID={"clientinputgene"}>
      </ClientAddGene>
      </div>
      <div>
        <Button variant="contained" style={{ textTransform: 'none'}}>Add to query</Button>
      </div>
      <QueueBox egg={queueboxchildren}></QueueBox></div>);
    }

    return(
      <div>
      {children}
      </div>
    )
  }
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
    const children = [];
    for (var i = 0; i < this.state.numChildren; i += 1) 
    {
      children.push(this.props.egg[i]);
    };
    return(
      <InputGenes addChild={this.onAddChild}> 
        {children}
      </InputGenes>
    )
  }

  onDeleteChild = (num) => {
    this.props.egg.splice(num, 1);
    console.log(this.props.egg);
    this.setState({
      numChildren: this.state.numChildren - 1
    });

  }

  onAddChild = () => {
    this.props.egg.push(<SingleItem key={this.state.numChildren} number={this.state.numChildren} deleteChild={this.onDeleteChild} egg={document.getElementById(this.props.filterID).value}/>);
    this.setState({
      numChildren: this.state.numChildren + 1
    });
  }

}

function InputGenes(props) {
  const classes = useStyles();
  const stringA = "Enter Gene:";
  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <div className={classes.secondaryinput}>
          <InputLabel htmlFor={"clientinputgene"}>{stringA}</InputLabel>
          <input type="text" id="clientinputgene" name="name" placeholder="IRF8"/>
        <IconButton type="submit" className={classes.iconAdd} aria-label="add" onClick={props.addChild}>
          <AddIcon />
        </IconButton>
    </div>
    </Grid>
      {props.children}
    </Grid>
    </div>
  );  
}

class ClientAddFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numChildren: 0
    };
  }

  render (){
    const children = [];

    for (var i = 0; i < keys[this.props.type].length; i += 1) {
      children.push(this.props.egg[keys[this.props.type][i]]);
    };

    return(
      <FilterMenuPopulate addChild={this.onAddChild} type={this.props.type} filterID={this.props.filterID} label={this.props.label}> 
        {children}
      </FilterMenuPopulate>
    )
  }

  onDeleteChild = (keyval) => {
    console.log("keyval selected: ", keyval);
    removeKey(this.props.type, keyval)
    this.props.egg[keyval] = "";
    this.setState({
        numChildren: this.state.numChildren - 1
    });
    console.log(this.state);
    console.log(this.props);
    if(this.props.type == "filter")
    {
      pre_queueboxchildren[keyval] = "";
      queueboxchildren[keyval] = "";
      for(var i = 0; i < keys["filter"].length; i++)
      {
        selectfield(pre_queueboxchildren[keys["filter"][i]].props.name, pre_queueboxchildren[keys["filter"][i]].props.value, keys["filter"][i], this.props.type)
      }
    }
    if(this.props.type == "single")
    {
      pre_queueboxsignatures[keyval] = "";
      queueboxsignatures[keyval] = "";
      for(var i = 0; i < keys["single"].length; i++)
      {
        selectsignature(pre_queueboxsignatures[keys["single"][i]].props.name, keys["single"][i], this.props.type);
      }
    }
  }

  onAddChild = () => {
    const keyval = document.getElementById(this.props.filterID).value.concat(this.state.numChildren.toString());
    keys[this.props.type].push(keyval);
    const filterIDvalue = document.getElementById(this.props.filterID).value;
    if(this.props.type == "filter"){
      this.props.egg[keyval] = <ClientSelectedFilter key={keyval} number={this.state.numChildren} get={keyval} deleteChild={this.onDeleteChild} chicken={this.props.chicken} egg={filterIDvalue}/>;
    }
    if(this.props.type == "single"){
      this.props.egg[keyval] = <SingleItem key={keyval} number={this.state.numChildren} get={keyval} deleteChild={this.onDeleteChild} chicken={this.props.chicken} egg={filterIDvalue}/>;
      pre_queueboxsignatures[keyval] = <PreQueueMessage key={keyval} number={this.state.numChildren} get={keyval} name={filterIDvalue}/>
      selectsignature(filterIDvalue, keyval, this.props.type);
    }
    

    this.setState({
      numChildren: this.state.numChildren + 1
    });

  }
}

function SingleItem(props) {
  return(
    <Grid item xs={2}>
    <Box borderColor="#dbdbdb" {...boxProps_padding}>
         <IconButton variant="contained" color="secondary" onClick={() => props.deleteChild(props.get)}><CloseIcon /></IconButton>
         {props.egg}
    </Box>
    </Grid>
    );
}

class QueueBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numChildren: 0,
      targetArr: [],
      targetSignatures: [],
    }
    updateQueueBox = updateQueueBox.bind(this)

  }

  render (){
    return(
      <Box borderColor="#dbdbdb" {...boxProps}>
          <div>{this.state.targetArr}</div>
          <div>{this.state.targetSignatures}</div>
      </Box>
      );
  }

}

function QueueMessage(props) 
{
  var build_message;
  var name_selected = props.name.replace("_", " ");
  name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
  build_message = name_selected.concat(" - ").concat(props.value).concat(": \t\t");
  build_message = build_message.concat(" selected ").concat(props.total_left).concat(" ").concat(props.type).concat(" ");
  build_message = build_message.concat("(in criterion ").concat(props.total_selected).concat(")");
  return(
      <div>{build_message}</div>
    );
}

function PreQueueMessage(props) 
{
  return(
      <div>
      <div>{props.name}</div>
      <div>{props.value}</div>
      </div>
    );
}

function ClientSelectedFilter({key, number, get, deleteChild, chicken, egg}) {
  const classes = useStyles();
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
    pre_queueboxchildren[get] = <PreQueueMessage key={number} number={number} get={get} name={egg} value={event.target.value}/>
    selectfield(egg, event.target.value, get, "filter");
  }

  const cur_filter = chicken[egg];
  const cur_id = (egg).concat("_id");
  return (
    <Grid item xs={3}>
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
              options.push(<option value={cur_filter[i]}>{cur_filter[i]}</option>);
            }

            return options;
          })()}
        </Select>
      </FormControl>
    </div>
    </Grid>
  );
}

function FilterMenuPopulate(props) {
  const classes = useStyles();
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
  };

  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <div className={classes.secondaryinput}>
        <InputLabel htmlFor={props.filterID}>{props.label}</InputLabel>
        <Select
          native
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
            for (const [key, value] of Object.entries(ui_field_dict)) {
              options.push(<option value={key}>{key}</option>);
            }
            }
            else if(props.type == "single")
            {
            for(var i = 0; i < sigFilters.length; i++) {
              options.push(<option value={sigFilters[i]}>{sigFilters[i]}</option>);
            }
            }
            return options;
          })()}
        </Select>        
        <IconButton type="submit" className={classes.iconAdd} aria-label="add" onClick={props.addChild}>
          <AddIcon />
        </IconButton>
    </div>
    </Grid>
      {props.children}
    </Grid>
    </div>
  );
}

function BQPane() {
  const classes = useStyles();
  return (
  	<div style={{ fontFamily: 'Arial' }}>
  	  <div>
      <Grid container spacing={0}>
        <Grid item xs={10}>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={ajaxfunc} style={{ textTransform: 'none'}}>Run query<ChevronRight /></Button>
        </Grid>
      </Grid>
      </div>
      <Typography className={classes.padding} />
      <div>
	    <Grid container spacing={2}>
	      <Grid item xs={1}></Grid>
	      <Grid item xs={4}>
		    <div className={classes.baseinput}>
        <CancerSelect	/>	    
        </div>
	      </Grid>
	      <Grid item xs={1}></Grid>
	      <Grid item xs={4}>
		    <div className={classes.baseinput}>
			  <IconButton className={classes.iconButton} aria-label="menu">
			    <MenuIcon />
			  </IconButton>
			  <TextField id="standard-basic" label="Cancer Study" className={classes.input} inputProps={{ 'aria-label': 'search cancer type' }}/>
			  <IconButton type="submit" className={classes.iconSearch} aria-label="search">
			    <SearchIcon />
			  </IconButton>
	        </div>
	      </Grid>
	      <Grid item xs={2}></Grid>
        </Grid>
      </div>
      <Typography className={classes.medpadding} />
      <FilterBox />
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function MainPane() {
	const classes = useStyles();
	const [value, setValue] = React.useState(1);

	const handleChange = (event, newValue) => {
	    setValue(newValue);
	  };

	return (
		<div className={classes.root} style={{ fontFamily: 'Arial' }}>
			<div className={classes.demo2}>
			  <Typography className={classes.padding} />
			  <Tabs id="tabset" value={value} onChange={handleChange} aria-label="simple tabs example">
			    <Tab label="Build Query" {...a11yProps(0)} style={{ textTransform: 'none'}}/>
			    <Tab label="Explore Data" {...a11yProps(1)} style={{ textTransform: 'none'}}/>
			    <Tab label="Query History" {...a11yProps(2)} style={{ textTransform: 'none'}}/>
			  </Tabs>
			</div>
			<div>
			<TabPanel value={value} index={0}>
			  <BQPane />
			</TabPanel>
			<TabPanel value={value} index={1}>
			  <ViewPane />
			</TabPanel>
			<TabPanel value={value} index={2}>
			  Query History
			</TabPanel>
			</div>
		</div>
	);
}

function TopNav() {
  
  const classes = useStyles();

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Arial' }}>
      <Grid container spacing={3}>    
        <Grid item xs={4}>
          <div className={classes.cntr_special}>Interactive Data Explorer</div>
        </Grid>
        <Grid item xs={5}>
        </Grid>
        <Grid item xs={3}>
          <div className={classes.cntr_generic}>About Us | Contact</div>
        </Grid>
      </Grid>
    </div>
  );
}

function App() {
  return (
  	<div style={{ fontFamily: 'Arial' }}>
    <Helmet>
      <script src="https://d3js.org/d3.v5.js" type="text/javascript" />
    </Helmet>
    <TopNav />
    <MainPane />
    </div>
  );

}

ReactDOM.render(<App />, document.getElementById("root"));