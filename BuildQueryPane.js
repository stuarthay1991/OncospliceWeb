import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
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
import TabPanel from './components/TabPanel';
import SpcInputLabel from './components/SpcInputLabel';
import CheckboxForm from './components/CheckboxForm';
import QueueMessage from './components/QueueMessage';
import PreQueueMessage from './components/PreQueueMessage';
import ClientAddFilter from './components/ClientAddFilter';
import SingleItem from './components/SingleItem';
import CancerSelect from './components/CancerSelect';
import { makeRequest } from './components/CancerDataManagement.js';

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
var buildurl = "/ICGS/Oncosplice/build";

var targeturl = serverurl;

var queryhistory_dat = [];
var GLOBAL_user = "Default";

const boxProps = {
  border: 3,
};

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

function none()
{
  return null;
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

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancerType: this.props.inherit.cancer,
      number: 0,
      fieldSet: this.props.inherit.ui_fields,
      sigSet: this.props.inherit.signatures,
      rangeSet: this.props.inherit.range,
      eventfilterSet: this.props.inherit.SEFobj
    };
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
  }

  componentDidMount ()
  {
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range,
        eventfilterSet: this.props.inherit.SEFobj
    })
  }

  componentDidUpdate(prevProps) {
    console.log("Look at state", this.state)
    if(prevProps.inherit.cancer != this.props.inherit.cancer)
    {
      this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range,
        eventfilterSet: this.props.inherit.SEFobj
      })
    }
    else if(prevProps != this.props)
    {
      this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range,
        eventfilterSet: this.props.inherit.SEFobj
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
        value: this.props.parentProps.inherit.filterboxSEF,
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
      //updateFilterBoxSEF(obj1);
      var new_clientgenes = [];
      var new_clientcoord = [];
      displayvalue_geneinput = "none";
      displayvalue_coordinput = "none";
      displayvalue_sigquery = "block";
      P.parentProps.updatePage(BQstate.keys, BQstate.queuebox_values, new_clientgenes, new_clientcoord, "Oncosplice Signature Filter", obj1);
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
      //updateFilterBoxSEF(obj2);
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientcoord = [];
      displayvalue_geneinput = "block";
      displayvalue_coordinput = "none";
      displayvalue_sigquery = "none";
      P.parentProps.updatePage(new_keys, new_Q, BQstate.clientgenes, new_clientcoord, "Gene Symbol Filter", obj2);
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
      //updateFilterBoxSEF(obj3);
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientgenes = [];
      displayvalue_geneinput = "none";
      displayvalue_coordinput = "block";
      displayvalue_sigquery = "none";
      P.parentProps.updatePage(new_keys, new_Q, new_clientgenes, BQstate.clientcoord, "Coordinate Filter", obj3);
    }
  };

  componentDidUpdate(prevProps) {
    console.log("update", this.props.parentProps.inherit.filterboxSEF);
    if(prevProps.parentProps.inherit.cancer !== this.props.parentProps.inherit.cancer)
    {
      console.log("ClientSEF", this.state);
      this.setState({
        value: ""
      })
    }
    else if(prevProps !== this.props)
    {
      this.setState({
        value: this.props.parentProps.inherit.filterboxSEF
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
    args["setState"] = props.setViewPane;
    args["export"] = props.export;
    args["cancer"] = props.cancer;
    args["doc"] = document;
    to = "defaultQuery";
  }
  else
  {
    functionpointer = makeRequest;
    args["updateViewPane"] = props.setViewPane;
    args["childrenFilters"] = props.childrenFilters;
    args["postoncosig"] = props.postoncosig;
    args["sigTranslate"] = props.sigTranslate;
    args["export"] = props.export;
    args["cancer"] = props.cancer;
    args["keys"] = props.keys;
    args["clientgenes"] = props.clientgenes;
    args["clientcoord"] = props.clientcoord;
    args["fullstate"] = props.fullstate;
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
    var prevstate = this.props.prevstate;
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
      sigTranslate: undefined,
      filterboxSEF: "",
      SEFobj: null
    }
    updateBQPane = updateBQPane.bind(this)
  }

  componentDidMount() 
  {
    var prevstate = this.props.prevstate;
    console.log("mounted_prevstate", this.props);
    this.setState(prevstate);
  }

  componentDidUpdate(prevProps)
  {
    var prevstate = this.props.prevstate;
    console.log("prevstate", prevstate);
    if(prevProps !== this.props)
    {
      console.log("prevstate_new", prevstate);
      this.setState(prevstate);
    }
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
              <CancerSelect inherit={this.props} prevState={this.state} 
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
              updatePage={(k,q,cG,cC,fSEF,SEFobj) => this.setState({
                keys: k,
                queuebox_values: q,
                clientgenes: cG,
                clientcoord: cC,
                filterboxSEF: fSEF,
                SEFobj: SEFobj
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
                setViewPane={this.props.setViewPane}
                export={this.state.export}
                fullstate={this.state}
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

export default BQPane;