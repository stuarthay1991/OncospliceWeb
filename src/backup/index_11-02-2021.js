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
import LockIcon from '@material-ui/icons/Lock';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import '@fontsource/roboto';
import axios from 'axios';
import {Helmet} from "react-helmet";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createMuiTheme } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

//import OKMAP from './ViewPane.js';
import useStyles from './useStyles.js';
import ViewPane from './ViewPane.js';
import QueryHistory from './QueryHistory';
import TabPanel from './components/TabPanel';
import QueueMessage from './components/QueueMessage';
import PreQueueMessage from './components/PreQueueMessage';
import ClientAddFilter from './components/ClientAddFilter';
import SingleItem from './components/SingleItem';
import CancerSelect from './components/CancerSelect';
import SpcInputLabel from './components/SpcInputLabel';
import CheckboxForm from './components/CheckboxForm';
import AboutUs from './components/AboutUs';
import { makeRequest } from './components/CancerDataManagement.js';
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

const theme = createMuiTheme({
  overrides: {
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  }
});

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

const Uitabstyle = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    color: '#0F6A8B',
  }
}));

//Versioning
var version = "0.1";

//Global Variables
var flag = 0;
var splicingreturned = [];
var splicingcols = [];
var splicingcc = [];
var splicingrpsi = [];
var splicingtrans = "";
var sendToViewPane = {};
var keys = {};
var ui_field_dict;
var ui_field_range;

var cur_filter_amt = 0;
var childrenFilters = [];
var postoncosig = [];
var clientgenes = [];
var clientcoord = [];
var queueboxchildren = {};
var pre_queueboxchildren = {};
var queueboxsignatures = {};
var pre_queueboxsignatures = {};
var sigTranslate;
var sigFilters;
var curCancer;
var cancerQueueMessage;

var displayvalue_userquery = "block";
var displayvalue_sigquery = "block";
var displayvalue_defaultquery = "none";
var displayvalue_geneinput = "none";
var displayvalue_coordinput = "none";
var current_number_of_events = 0;
var current_number_of_samples = 0;

var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";

var targeturl = serverurl;

var queryhistory_dat = [];
var GLOBAL_user = "Default";

keys["filter"] = [];
keys["single"] = [];

function updateQueueBox(cmess, num, arr, sig){
    const cancer_in = [];
    const ta1 = [];
    const ta2 = [];

    cancer_in.push(cancerQueueMessage);

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
      targetCancer: cancer_in,
      targetArr: ta1,
      targetSignatures: ta2
    });
}

function updateFilterBox(ctype, num, field, range, sig){
  this.setState({
      cancerType: ctype,
      fieldSet: field,
      rangeSet: range,
      sigSet: sig,
      number: num
  });
}

function updateViewPane(list1, list2, list3, list4, list5, exp){
  this.setState({
    inData: list1,
    inCols: list2,
    inCC: list3,
    inRPSI: list4,
    inTRANS: list5,
    export: exp
  });
}

function removeKey(type, keyval, keys){
  for(var i = 0; i < keys[type].length; i++)
  {
    if(keys[type][i] == keyval)
    {
      keys[type].splice(i, 1);
      break;
    }
  }
  return keys;
}

function regeneratefields(cancername) {
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", cancername);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/ui_fields.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    var local_ui_field_dict = response["data"]["meta"];
    var local_ui_field_range = response["data"]["range"];
    var local_sigFilters = response["data"]["sig"];
    sigTranslate = response["data"]["sigtranslate"];
    console.log("sigTranslate", sigTranslate);
    ui_field_dict = local_ui_field_dict;
    ui_field_range = local_ui_field_range;
    sigFilters = local_sigFilters;
    var qcancer_rows = (response["data"]["qbox"]["rows"]).toString();
    var qcancer_cols = (response["data"]["qbox"]["columns"]).toString();
    var cmessage = qcancer_rows.concat(" events and ").concat(qcancer_cols).concat(" samples.");
    curCancer = cancername;
    sendToViewPane["cancer"] = cancername;
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
    cancerQueueMessage = <QueueMessage key={"c_type_q"} number={0} name={"cancer"} get={0} value={cancername} type={"cancer"} total_selected={cmessage} total_left={cmessage}/>;
    updateQueueBox(curCancer, 2, queueboxchildren, queueboxsignatures);
    updateFilterBox(cancername, 2, local_ui_field_dict, local_ui_field_range, local_sigFilters);
  })  
}

function ajaxviewquery(indata) {
  var bodyFormData = new FormData();
  sendToViewPane["filter"] = [];
  sendToViewPane["single"] = [];
  for(var i = 0; i < indata.length; i++)
  {
    bodyFormData.append(indata[i]["key"], indata[i]["val"]);
    if(indata[i]["key"].substring(0, 4) == "SPLC")
    {
      sendToViewPane["filter"].push(indata[i]["val"]);
    }
    if(indata[i]["key"].substring(0, 3) == "PSI")
    {
      sendToViewPane["single"].push(indata[i]["val"]);
    }
  }
  axios({
    method: "post",
    url: (targeturl.concat("/backend/metarequest.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      document.getElementById(`simple-tab-1`).click();
      splicingreturned = response["data"]["rr"];
      splicingcols = response["data"]["col_beds"];
      splicingcc = response["data"]["cci"];
      updateViewPane(splicingreturned, splicingcols, splicingcc);
      document.getElementById("sub").style.display = "none";
  })
}

function none()
{
  return null;
}

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancerType: this.props.inherit.cancer,
      number: 0,
      fieldSet: this.props.inherit.ui_fields,
      sigSet: this.props.inherit.signatures,
      rangeSet: this.props.inherit.range,
      eventfilterSet: null
    };
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
  }

  componentDidMount ()
  {
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    if(curCancer != undefined)
    {
      this.setState({
        cancerType: curCancer,
        number: 1,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.inherit.cancer != this.props.inherit.cancer)
    {
      this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range,
        eventfilterSet: null
      })
    }
    else if(prevProps != this.props)
    {
      this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range
      })
    }
  }

  render ()
  {
    const P = this.props;
    const S = this.state;
    const children = [];
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    if(this.state.cancerType != "NULL" && this.state.fieldSet != undefined && this.state.sigSet != undefined)
    {
      children.push(<div>
      <div>
      <ClientAddFilter 
        inheritState={S} 
        parentProps={P} 
        syncQB={syncQB}
        removeKey={removeKey}
        functioncall={none}
        keys={P.inherit.keys}
        sigTranslate={P.inherit.sigTranslate}
        rangeSet={S.rangeSet}
        chicken={S.fieldSet}
        egg={childrenFilters}
        pre_q={P.inherit.pre_queueboxvalues}
        q={P.inherit.queuebox_values}
        type={"filter"}
        filterID={"meta_filter_id"}
        label={"Add Sample Filter"}>
      </ClientAddFilter>
      </div>
      <ClientSEF
        inheritState={this.state}
        parentProps={this.props}
        sigvalue={this.state.sigSet}/>
      <div>
      {this.state.eventfilterSet}
      </div>
      </div>);
    }

    return(
      <div>
      {children}
      </div>
    )
  }
}


function updateFilterBoxSEF(val){
  this.setState({
      eventfilterSet: val
  });
}

function updateClientSEF(){
  this.setState({
      value: '',
      name: 'hai',
  });
}

const widgetlabel4 = makeStyles((theme) => ({
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

function ClientSEF_select(props)
{
  const wla4 = widgetlabel4();
  return(
    <Select
          native
          classes={wla4}
          value={props.value}
          onChange={props.handleChange}
          inputProps={{
            name: 'value',
            id: "SEF_id",
          }}
    >
    <option value=""></option>
    {(() => {
            const options = [];
            options.push(<option value={"Oncosplice Signature Filter"}>{"Oncosplice Signature Filter"}</option>);
            options.push(<option value={"Gene Symbol Filter"}>{"Gene Symbol Filter"}</option>);
            options.push(<option value={"Coordinate Filter"}>{"Coordinate Filter"}</option>);
            return options;
    })()}
    </Select>
  )
}

class ClientSEF extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        name: 'hai',
    }
    updateClientSEF = updateClientSEF.bind(this);
  }

  handleChange = (event) => {
    const name = event.target.name;
    const P = this.props;
    const parentProps = P.parentProps;
    const S = this.state;
    const BQstate = P.parentProps.inherit;
    this.setState({
      ...this.state,
      [name]: event.target.value,
    });
    if(event.target.value == "Oncosplice Signature Filter")
    {
      const obj1 = <ClientAddFilter
        inheritState={P.inheritState}
        parentProps={P.parentProps}
        syncQB={syncQB}
        removeKey={removeKey}
        functioncall={none}
        keys={BQstate.keys}
        sigTranslate={BQstate.sigTranslate}
        chicken={BQstate.signatures}
        egg={postoncosig}
        pre_q={BQstate.pre_queueboxvalues}
        q={BQstate.queuebox_values}
        type={"single"}
        filterID={"sig_filter_id"}
        label={"Oncosplice Signature Filter"}
      />;
      updateFilterBoxSEF(obj1);
      var new_clientgenes = [];
      var new_clientcoord = [];
      displayvalue_geneinput = "none";
      displayvalue_coordinput = "none";
      displayvalue_sigquery = "block";
      P.parentProps.updatePage(BQstate.keys, BQstate.queuebox_values, new_clientgenes, new_clientcoord);
      //updateQueueBox(P.parentProps.inherit.cancer, keys["single"].length, queueboxchildren, queueboxsignatures);
    }
    if(event.target.value == "Gene Symbol Filter")
    {
      const obj2 = <ClientAddGene
        filterID={"clientinputgene"} 
        clientgenes={P.parentProps.inherit.clientgenes}
        cancer={P.parentProps.inherit.cancer}
        export={P.parentProps.inherit.export}
        callback={P.parentProps.setGene}
      />;
      updateFilterBoxSEF(obj2);
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientcoord = [];
      displayvalue_geneinput = "block";
      displayvalue_coordinput = "none";
      displayvalue_sigquery = "none";
      P.parentProps.updatePage(new_keys, new_Q, BQstate.clientgenes, new_clientcoord);
      //updateQueueBox(P.parentProps.inherit.cancer, keys["single"].length, queueboxchildren, queueboxsignatures);
    }
    if(event.target.value == "Coordinate Filter")
    {
      const obj3 = <ClientAddCoord
        filterID={"clientinputcoord"}
        clientcoord={P.parentProps.inherit.clientcoord}
        cancer={P.parentProps.inherit.cancer}
        export={P.parentProps.inherit.export}
        callback={P.parentProps.setCoord}
      />;
      updateFilterBoxSEF(obj3);
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientgenes = [];
      displayvalue_geneinput = "none";
      displayvalue_coordinput = "block";
      displayvalue_sigquery = "none";
      P.parentProps.updatePage(new_keys, new_Q, new_clientgenes, BQstate.clientcoord);
      //updateQueueBox(P.parentProps.inherit.cancer, keys["single"].length, queueboxchildren, queueboxsignatures);
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.parentProps.inherit.cancer !== this.props.parentProps.inherit.cancer)
    {
      console.log("ClientSEF", this.state);
      this.setState({
        value: ""
      })
    }
  }

  render(){
  return(
    <div style={{marginTop: 18, marginBottom: 26}}>
    <SpcInputLabel label={"Select Event Filter"}/>
    <FormControl>
      <ClientSEF_select value={this.state.value} handleChange={this.handleChange}/>   
    </FormControl>
    </div>
  )}
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
  clientcoord = pile_of_coords;
  args["clientcoord"] = pile_of_coords;
  args["num"] = pile_of_coords.length;
  args["cancer"] = cancer;
  args["export"] = exp;
  args["setState"] = callback;
  makeRequest("coord", args);
}

function postGenes(cancer, exp, callback)
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

  clientgenes = pile_of_uids;
  console.log(pile_of_uids.length);
  console.log(pile_of_uids);
  var args = {};
  args["clientgenes"] = pile_of_uids;
  args["num"] = pile_of_uids.length;
  args["cancer"] = cancer;
  args["export"] = exp;
  args["setState"] = callback;
  makeRequest("gene", args);
}

function updateNumberGenes(num, tm)
{
    displayvalue_geneinput = "block";
    this.setState({
      numberGenes: num,
      totalMatch: tm
    });
}

function updateNumberCoord(num, tm)
{
    displayvalue_coordinput = "block";
    this.setState({
      numberCoords: num,
      totalMatch: tm
    });
}

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
  const classes = useStyles();
  const stringA = "Enter Coordinates";
  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <SpcInputLabel label={stringA} />
    <div style={{display: "flex"}}>
        <textarea id="clientinputcoord" name="name" placeholder="Enter coordinates here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
        <IconButton type="submit" className={classes.iconAdd} aria-label="add" onClick={props.addChild}>
          <AddIcon />
        </IconButton>
    </div>
    </Grid>
    </Grid>
    </div>
  );  
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
    postGenes(this.props.cancer, this.props.export, this.props.callback);
  }

}

function InputGenes(props) {
  const classes = useStyles();
  const stringA = "Enter Gene(s)";
  return(
    <div>
    <Grid container spacing={0}>
    <Grid item xs={3}>
    <SpcInputLabel label={stringA} />
    <div style={{display: "flex"}}>
        <textarea id="clientinputgene" name="name" placeholder="TP53,JUN,MYC" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
        <IconButton type="submit" className={classes.iconAdd} aria-label="add" onClick={props.addChild}>
          <AddIcon />
        </IconButton>
    </div>
    </Grid>
    </Grid>
    </div>
  );  
}

function qBDefaultMessage(value)
{
  if(value)
  {
    displayvalue_userquery = "none";
    displayvalue_defaultquery = "block";
  }
  else
  {
    displayvalue_defaultquery = "none";
    displayvalue_userquery = "block";
  } 
}

function syncQB(selections, type)
{
    if(type == "filter")
    {
      this.setState({
        targetArrSelections: selections
      });
    }
    else
    {
      this.setState({
        targetSigSelections: selections
      });      
    }
}

function QB_SelectedCancer(props)
{
  var canc_message = props.targetCancer;
  if(canc_message == "")
  {
    canc_message = "Please select a cancer."
  }
  return(
    <div>
      <Box>
        <div id="QueueBoxExampleDiv" style={{display: displayvalue_defaultquery}}>
          <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item>
            <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
            {"Select 'Run Query' to see example output."}
            </div>
            </Grid>
            </Grid>
          </div>
        </div>
        <div id="QueueBoxContentDiv" style={{display: displayvalue_userquery, position: 'relative', alignItems: 'center', textAlign: 'center'}}>
          <div style={{color: "#0F6A8B", backgroundColor: "#edf0f5", position: 'relative', minHeight: "40px", minWidth: "40px", alignItems: 'center', textAlign: 'center', marginTop: 2}}>{canc_message}</div>
        </div>
      </Box>
    </div>
  );
}

function QB_format(props)
{
  var targsel = props.targetArrSelections;
  var targarr = props.targetArr;
  var index = props.index;
  var targarr_obj;
  if(index < props.targetArr.length)
  {
    targarr_obj = props.targetArr[index];
  }
  else
  {
    targarr_obj = <strong style={{paddingTop: 5}}>None Selected.</strong>;
  }

  return(
    <div>
    <Grid container spacing={2}>
      <Grid item>
        {targsel[index]}
      </Grid>
      <Grid item>
        {targarr_obj}
      </Grid>
    </Grid>
    </div>
  );
}

function QB_SelectedSample(props)
{
  return(
    <div>
      <Box>
      <div style={{display: displayvalue_userquery, position: 'relative', minHeight: "40px", alignItems: 'left', textAlign: 'center', margin: 2}}>
        {(() => {
            const target = [];
            for(var i = 0; i < props.targetArrSelections.length; i++) {
              target.push(<QB_format targetArrSelections={props.targetArrSelections} targetArr={props.targetArr} index={i}></QB_format>);
            }
            return target;
        })()}
      </div>
      </Box>
    </div>
  );
}

function QB_SelectedSignature(props)
{
  return(
    <div>
      <div style={{display: displayvalue_userquery}}>
      <Box>
        <div style={{display: displayvalue_sigquery, position: 'relative', minHeight: "40px", alignItems: 'left', textAlign: 'center', margin: 2}}>
          {(() => {
              const target = [];
              for(var i = 0; i < props.targetSigSelections.length; i++) {
                target.push(<QB_format targetArrSelections={props.targetSigSelections} targetArr={props.targetSignatures} index={i}></QB_format>);
              }
              return target;
          })()}
        </div>
        <div id="QueueBoxGeneDiv" style={{display: displayvalue_geneinput, position: 'relative', alignItems: 'left', textAlign: 'center'}}>
          <div style={{position: 'relative', minHeight: "40px", alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
                {"Selected ".concat(props.numberGenes).concat(" genes.")}
                </div>
                </Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', fontSize: 13}}>
                {"Selected ".concat(props.numberGenes).concat(" genes.")}
                </div>
                </Grid>
            </Grid>
          </div>
        </div> 
        <div id="QueueBoxCoordDiv" style={{display: displayvalue_coordinput, position: 'relative', alignItems: 'left', textAlign: 'center'}}>
            <div style={{position: 'relative', minHeight: "40px", alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
                {"Selected ".concat(props.numberCoords).concat(" Coordinates.")}
                </div>
                </Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', fontSize: 13}}>
                {"Selected ".concat(props.numberCoords).concat(" coordinates.")}
                </div>
                </Grid>
            </Grid>
            </div>
        </div>        
      </Box> 
      </div> 
    </div>  
  );
}

function QB_displayEventsSigs(props)
{
  return(
    <div style={{position: 'relative', fontSize: 16, paddingTop:6, paddingBottom:5, backgroundColor: '#E8E8E8'}}>
    <Grid container spacing={1}>
    <Grid item>
    <div style={{marginLeft: 15, alignItems: 'left', textAlign: 'left'}}>
    <strong>Prospective Results: </strong>
    </div>
    </Grid>
    <Grid item>
    <div style={{marginRight: 10, alignItems: 'right', textAlign: 'right'}}>
    {props.amount["samples"].toString().concat(" samples and ").concat(props.amount["events"].toString()).concat(" events")}
    </div>
    </Grid>
    </Grid>
    </div>
  );
}

class QueueBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numChildren: 0,
      targetCancer: this.props.cancerQueueMessage,
      targetArr: [],
      targetArrSelections: [],
      targetSignatures: [],
      targetSigSelections: [],
      numberGenes: 0,
      numberCoords: 0,
      defaultOn: false,
      totalMatch: 0,
      resultamount: this.props.resamt
    }
    updateQueueBox = updateQueueBox.bind(this);
    updateNumberGenes = updateNumberGenes.bind(this);
    updateNumberCoord = updateNumberCoord.bind(this);
    syncQB = syncQB.bind(this);
  }

  componentDidMount (){
    if(this.props.keys["filter"].length > 0 || this.props.keys["single"].length > 0)
    {
    var ta1 = [];
    var ta2 = [];
    var totalkeylen = this.props.keys["filter"].length + this.props.keys["single"].length;
    for(var i = 0; i < this.props.keys["filter"].length; i++)
    {
      ta1.push(this.props.queueboxchildren[this.props.keys["filter"][i]])
    }

    for(var i = 0; i < this.props.keys["single"].length; i++)
    {
      ta2.push(this.props.queueboxsignatures[this.props.keys["single"][i]])
    }

    this.setState({
        numChildren: totalkeylen,
        targetCancer: this.props.cancerQueueMessage,
        targetArr: ta1,
        targetSignatures: ta2
    });
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props)
    {
      var ta1 = [];
      var ta2 = [];
      var arr = this.props.inherit.queuebox_values["children"];
      var sig = this.props.inherit.queuebox_values["signatures"];
      for(var i = 0; i < this.props.keys["filter"].length; i++)
      {
        ta1.push(arr[this.props.keys["filter"][i]])
      }

      for(var i = 0; i < this.props.keys["single"].length; i++)
      {
        ta2.push(sig[this.props.keys["single"][i]])
      }
      this.setState({
        targetCancer: this.props.cancerQueueMessage,
        resultamount: this.props.resamt,
        targetArr: ta1,
        targetSignatures: ta2,
        targetArrSelections: this.props.inherit.childrenFilters,
        targetSigSelections: this.props.inherit.postoncosig,
        numberGenes: this.props.clientgenes.length,
        numberCoords: this.props.clientcoord.length
      })
    }
    //console.log("queuebox", this.state, this.props);
  }

  render (){
    return(
      <div>
      <SpcInputLabel label={"Selected Criteria"}/>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
      <QB_SelectedCancer targetCancer={this.state.targetCancer}/>
      <QB_SelectedSample targetArrSelections={this.state.targetArrSelections} targetArr={this.state.targetArr}/>
      <QB_SelectedSignature 
        targetSigSelections={this.state.targetSigSelections} 
        targetSignatures={this.state.targetSignatures} 
        totalMatch={this.state.totalMatch} 
        numberGenes={this.state.numberGenes}
        numberCoords={this.state.numberCoords}
        />
      <QB_displayEventsSigs amount={this.state.resultamount}/>
      </Box>
      </div>
    );
  }
}

function SubmitButton(props)
{
  var args = {};
  var to = "fetchHeatmapData";
  var functionpointer = makeRequest;
  if(props.defaultQuery == true)
  {
    functionpointer = makeRequest;
    args["setState"] = updateViewPane;
    args["export"] = props.export;
    args["cancer"] = props.cancer;
    args["doc"] = document;
    to = "defaultQuery";
  }
  else
  {
    functionpointer = makeRequest;
    args["updateViewPane"] = updateViewPane;
    args["childrenFilters"] = props.childrenFilters;
    args["postoncosig"] = props.postoncosig;
    args["sigTranslate"] = props.sigTranslate;
    args["export"] = props.export;
    args["cancer"] = props.cancer;
    args["keys"] = props.keys;
    args["clientgenes"] = props.clientgenes;
    args["clientcoord"] = props.clientcoord;
    args["document"] = document;
    to = "fetchHeatmapData";
  }
  const classes = useStyles();
  return(
    <Button className={classes.myButton} onClick={() => functionpointer(to, args)} style={{ textTransform: 'none'}}>Run query</Button>
  )
}

function updateDQW(value) {
  this.setState({
      stateobj: value
  });
}

class DefaultQueryWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stateobj: null
    }
    updateDQW = updateDQW.bind(this)
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render()
  {
    return(
      null
    )
  }
}

function updateBQPane(value) {
  this.setState({
      defaultQuery: value
  });
}

class BQPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultQuery: false,
      queuebox_values: {"children": undefined, "signatures": undefined},
      pre_queueboxvalues: {"children": {}, "signatures": {}},
      eventfilterSet: null,
      resultamount: {"samples": 0, "events": 0},
      childrenFilters: [],
      postoncosig: [],
      queryFilter: {},
      querySignature: {},
      clientcoord: [],
      clientgenes: [],
      keys: {"filter": [], "single": []},
      range: undefined,
      cancer: "",
      ui_fields: {},
      export: {},
      genes: [],
      coordinates: [],
      signatures: undefined,
      sigTranslate: undefined
    }
    updateBQPane = updateBQPane.bind(this)
  }

  render()
  {
    var displayvalue = "block";
    if(this.state.defaultQuery == false)
    {
      displayvalue = "block";
    }
    else
    {
      displayvalue = "none";
    }
    console.log(this.state);
    return (
    	<div style={{ marginLeft: 40, fontFamily: 'Arial' }}>
    	  <div>
        <Grid container spacing={0}>
          <Grid item sm={12} md={4}>
            <Grid container spacing={0}>
              <Grid item xs={10}>
              </Grid>
            </Grid>
            <div>
            <CheckboxForm updateBQPane={updateBQPane} qBDefaultMessage={qBDefaultMessage}/>
            <div id="FilterBox_div" style={{display: displayvalue}}>
            <DefaultQueryWrapper value={this.state.defaultQuery} />
      	    <Grid container spacing={2}>
      	      <Grid item>
              <CancerSelect	inherit={this.props} prevState={this.state} 
                setUI={(in_ui_fields, in_cancer, in_qbox, range, sigs, resamt, sigT, exp) => this.setState({
                ui_fields: in_ui_fields, 
                cancer: in_cancer,
                queuebox_values: in_qbox,
                keys: {"filter": [], "single": []},
                range: range,
                signatures: sigs,
                resultamount: resamt,
                sigTranslate: sigT,
                export: exp,
                childrenFilters: [],
                postoncosig: [],
                clientgenes: [],
                clientcoord: []
                })}
                />
      	      </Grid>
            </Grid>
            <Typography style={{padding: '2px 4px'}} />
            <FilterBox 
              inherit={this.state}
              setChildrenFilters={(cF, egg) => this.setState({
                childrenFilters: cF,
                queryFilter: egg
              })}
              setPostoncosig={(pO, egg) => this.setState({
                postoncosig: pO,
                querySignature: egg
              })}
              setMeta={(resamt, qbox, pre_qbox, keys, exp) => this.setState({
                resultamount: resamt,
                queuebox_values: qbox,
                pre_queueboxvalues: pre_qbox,
                keys: keys,
                export: exp
              })}
              setSig={(resamt, qbox, keys, exp) => this.setState({
                resultamount: resamt,
                queuebox_values: qbox,
                keys: keys,
                export: exp
              })}
              setGene={(cG, exp) => this.setState({
                clientgenes: cG,
                export: exp
              })}
              setCoord={(cC, exp) => this.setState({
                clientcoord: cC,
                export: exp
              })}
              updatePage={(k,q,cG,cC) => this.setState({
                keys: k,
                queuebox_values: q,
                clientgenes: cG,
                clientcoord: cC
              })}
              />
            </div>
            </div>
          </Grid>
          <Grid item>
          <div style={{height: "110%", width: "5px", backgroundColor:"#edf0f5"}}>
          </div>
          </Grid>
          <Grid item sm={12} md={5}>
            <Grid container spacing={0}>
            <Grid item xs={7}></Grid>
            <Grid item xs={1}>
            <div id="sub" style={{display: "none"}}>
              <img src={(targeturl.concat("/backend/gifmax.gif"))} width="50" height="50"/>
            </div>
            </Grid>
            <Grid item xs={4}>
            <div style={{float: 'right', alignItems: 'center'}}>
              <SubmitButton 
                defaultQuery={this.state.defaultQuery}
                keys={this.state.keys}
                cancer={this.state.cancer}
                clientgenes={this.state.clientgenes}
                clientcoord={this.state.clientcoord}
                childrenFilters={this.state.queryFilter}
                postoncosig={this.state.querySignature}
                sigTranslate={this.state.sigTranslate}
                export={this.state.export}
              />
            </div>
            </Grid>
            </Grid>
            <div id="QueueBox_div">
              <QueueBox 
                keys={this.state.keys} 
                cancerQueueMessage={this.state.queuebox_values["cancer"]} 
                queueboxchildren={this.state.queuebox_values["children"]} 
                queueboxsignatures={this.state.queuebox_values["signature"]} 
                qBDefaultMessage={qBDefaultMessage}
                clientgenes={this.state.clientgenes}
                clientcoord={this.state.clientcoord}
                resamt={this.state.resultamount}
                inherit={this.state}>
              </QueueBox>
            </div>
          </Grid>
          <Grid item sm={12} md={1}>
          </Grid>
        </Grid>
        </div>
      </div>
    );
  }
}

class ViewPaneWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      inCols: [],
      inCC: [],
      inRPSI: [],
      inTRANS: [],
      export: []
    }
    updateViewPane = updateViewPane.bind(this);
  }

  componentDidMount() {   
    this.setState({
    inData: [],
    inCols: [],
    inCC: [],
    inRPSI: [],
    inTRANS: [],
    export: []
    });
  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
          <ViewPane css={withStyles(useStyles)} QueryExport={this.state.export} Data={this.state.inData} Cols={this.state.inCols} CC={this.state.inCC} RPSI={this.state.inRPSI} TRANS={this.state.inTRANS}/>
        )}
      </div>
    );
  }
}

function updateQueryHistory(input) {
    this.setState({
    inData: input
    });
}

function removeQueryHistory(index) {
    const newdat = this.state.inData;
    newdat.splice(index, 1);
    this.setState({
    inData: newdat
    });
}

function addQueryHistory(input) {
    const newdat = this.state.inData;
    newdat.push(input);
    this.setState({
    inData: newdat
    });
}

function changeUser(user) {
    GLOBAL_user = user;
    var bodyFormData = new FormData();
    bodyFormData.append("user",user);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistoryaccess.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        var responsedata = response["data"];
        var tmp_array = [];
        console.log("RESPONSE_changeuser", responsedata);
        updateQueryHistory(responsedata);
    })
    
}

class QueryHistoryPaneWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      user: "Default"
    }
    updateQueryHistory = updateQueryHistory.bind(this);
    removeQueryHistory = removeQueryHistory.bind(this);
    addQueryHistory = addQueryHistory.bind(this);
  }

  componentDidMount() {
    var bodyFormData = new FormData();
    bodyFormData.append("user",this.state.user);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistoryaccess.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        var responsedata = response["data"];
        var tmp_array = [];
        console.log("RESPONSE", responsedata);
        updateQueryHistory(responsedata);
    })

  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
        <QueryHistory Data={this.state.inData} removeQueryHistory={removeQueryHistory} goQuery={ajaxviewquery}/>
        )}
      </div>
    );
  }
}

const responseGoogle = response => {
  console.log("Google response: ", response);
  var user = response["Ys"]["Ve"];
  updateAuthentication(user);
};

function updateAuthentication(value) {
  this.setState({
      user: value
  });

  changeUser(value);
}
//QnP0q95cm5LOxDO1FHkM44I8

function UsernameDisplay(props) {
  
  return(
    <div>
    <Grid container spacing={3}>
      <Grid item>
    <div style={{marginTop: 6, fontSize: 20}}>Hello, <strong>{props.user}</strong> ! </div>
    </Grid>
    <Grid item>
    <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white", fontSize: 12, margin: 2}} onClick={() => updateAuthentication("Default")}>Logout</Button>
    </Grid>
    </Grid>
    </div>
  );
}

class Authentication extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        user: "Default",
      }
      updateAuthentication = updateAuthentication.bind(this);
  }

  render()
  {
  return(
      <div>
        {this.state.user != "Default" && (
        <div>
          <UsernameDisplay user={this.state.user}/>
        </div>
        )}
        {this.state.user == "Default" && (
        <div>
          <GoogleLogin clientId="113946767130-k3hs8dhjbctc9dtaamubobdftphlr60q.apps.googleusercontent.com" onSuccess={responseGoogle} onFailure={responseGoogle}/>
        </div> 
        )}
      </div>
    );
  }

}

const spcTabStyles = makeStyles({
  root: {
    backgroundColor: "#edf0f5",
    color: '#0F6A8B',
    fontSize: 16,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  },
  selected: {
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: 16,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  }
});

const spcTabRoot = makeStyles({
  root: {
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: 20,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  }
});

function tabLabelQH()
{
  return (
    <LockIcon />
  );
}

function loadAbout()
{
  document.getElementById("aboutpanel").style.display = "block";
  document.getElementById("contactpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "none";
}

function loadContact()
{
  document.getElementById("contactpanel").style.display = "block";
  document.getElementById("aboutpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "none";
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
  const tabstyle = spcTabStyles();
  //const Uitabstyle = Uitabstyle();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
      document.getElementById("contactpanel").style.display = "none";
      document.getElementById("aboutpanel").style.display = "none";
      document.getElementById("tabcontent").style.display = "block";
	    setValue(newValue);
	  };

	return (
		<div className={classes.root} style={{ fontFamily: 'Roboto' }}>
			<div className={classes.demo2}>
        <div className={classes.tabholder}>
        <Grid container spacing={0}>
        <Grid item sm={12} md={9}>
        <Typography className={classes.padding} />
			  <Tabs id="tabset" value={value} onChange={handleChange} aria-label="simple tabs example" indicatorColor="primary">
			    <Tab classes={tabstyle} label="Build Query" {...a11yProps(0)} style={{ textTransform: 'none'}}/>
			    <Tab classes={tabstyle} label="Explore Data" {...a11yProps(1)} style={{ textTransform: 'none'}}/>
			    <Tab classes={tabstyle} icon={<LockIcon />} label="Query History" {...a11yProps(2)} style={{ textTransform: 'none'}}></Tab>
        </Tabs>
        </Grid>
        <Grid item sm={12} md={3}>
        <Typography className={classes.padding} />
        <div style={{float: "right"}}>
        <Authentication />
        </div>
        </Grid>
        </Grid>
        </div>
			</div>
			<div id="tabcontent" style={{display: "block"}}>
			<TabPanel value={value} index={0}>
			  <BQPane regeneratefields={regeneratefields}/>
			</TabPanel>
			<TabPanel value={value} index={1}>
			  <ViewPaneWrapper />
			</TabPanel>
			<TabPanel value={value} index={2}>
			  <QueryHistoryPaneWrapper />
			</TabPanel>
			</div>
      <div id="aboutpanel" style={{display: "none", margin: 15}}>
        <AboutUs />
      </div>
      <div id="contactpanel" style={{display: "none", margin: 15}}>
        <div>
          <Box borderLeft={3} borderColor={'#0F6A8B'}>
          <div style={{marginLeft: 15, marginTop: 20, fontSize: 24}}>
            <p>Contact: <a href="mailto: altanalyze@gmail.com">altanalyze@gmail.com</a></p>
          </div>
          </Box>
        </div>
      </div>
		</div>
	);
}

function TopNav() {
  
  const classes = useStyles();

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.mainpane_margin}>
      <Grid container spacing={3}>    
        <Grid item xs={5}>
          <div className={classes.cntr_special}>OncoSplice: Cancer Genomics Browser</div>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "white", textDecoration: "none"}}>Contact</a></div>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

function App() {
  return (
  	<div style={{ fontFamily: 'Roboto' }}>
    <Helmet>
      <script src="https://d3js.org/d3.v5.js" type="text/javascript" />
    </Helmet>
    <TopNav />
    <MainPane />
    </div>
  );

}

ReactDOM.render(<App />, document.getElementById("root"));