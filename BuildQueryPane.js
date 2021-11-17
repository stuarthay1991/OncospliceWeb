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
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import '@fontsource/roboto';
import axios from 'axios';
import {Helmet} from "react-helmet";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createMuiTheme } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import useStyles from './useStyles.js';
import TabPanel from './components/TabPanel';
import SpcInputLabel from './components/SpcInputLabel';
import CheckboxForm from './components/CheckboxForm';
import QueueMessage from './components/QueueMessage';
import PreQueueMessage from './components/PreQueueMessage';
import ClientAddFilter from './components/ClientAddFilter';
import QueueBox from './components/Queuebox';
import SingleItem from './components/SingleItem';
import CancerSelect from './components/CancerSelect';
import ClientAddCoord from './components/ClientAddCoord';
import ClientAddGene from './components/ClientAddGene';
import { makeRequest } from './components/CancerDataManagement.js';

var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";
var buildurl = "/ICGS/Oncosplice/build";

var targeturl = serverurl;

var queryhistory_dat = [];
var GLOBAL_user = "Default";

const boxProps = {
  border: 3,
};

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
  for(var i = 0; i < keys[type].length; i++){
    if(keys[type][i] == keyval){
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

  componentDidMount (){
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
    if(prevProps.inherit.cancer != this.props.inherit.cancer){
      this.setState({
        cancerType: this.props.inherit.cancer,
        number: 0,
        fieldSet: this.props.inherit.ui_fields,
        sigSet: this.props.inherit.signatures,
        rangeSet: this.props.inherit.range,
        eventfilterSet: this.props.inherit.SEFobj
      })
    }
    else if(prevProps != this.props){
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

  render (){
    const P = this.props;
    const S = this.state;
    const children = [];
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    if(this.state.cancerType != "NULL" && this.state.fieldSet != undefined && this.state.sigSet != undefined){
      children.push(<div>
      <div>
      <ClientAddFilter 
        inheritState={S} 
        parentProps={P} 
        removeKey={removeKey}
        functioncall={none}
        keys={P.inherit.keys}
        sigTranslate={P.inherit.sigTranslate}
        rangeSet={S.rangeSet}
        chicken={S.fieldSet}
        egg={P.inherit.childrenFilters}
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

function ClientSEF_select(props){
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

class ClientSEF extends React.Component {
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
    if(event.target.value == "Oncosplice Signature Filter"){
      const obj1 = <ClientAddFilter
        inheritState={P.inheritState}
        parentProps={P.parentProps}
        removeKey={removeKey}
        functioncall={none}
        keys={BQstate.keys}
        sigTranslate={BQstate.sigTranslate}
        chicken={BQstate.signatures}
        egg={BQstate.postoncosig}
        pre_q={BQstate.pre_queueboxvalues}
        q={BQstate.queuebox_values}
        type={"single"}
        filterID={"sig_filter_id"}
        label={"Oncosplice Signature Filter"}
      />;
      var new_clientgenes = [];
      var new_clientcoord = [];
      P.parentProps.updatePage(BQstate.keys, BQstate.queuebox_values, new_clientgenes, new_clientcoord, "Oncosplice Signature Filter", obj1);
    }
    if(event.target.value == "Gene Symbol Filter"){
      const obj2 = <ClientAddGene
        filterID={"clientinputgene"} 
        clientgenes={P.parentProps.inherit.clientgenes}
        cancer={P.parentProps.inherit.cancer}
        export={P.parentProps.inherit.export}
        callback={P.parentProps.setGene}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientcoord = [];
      P.parentProps.updatePage(new_keys, new_Q, BQstate.clientgenes, new_clientcoord, "Gene Symbol Filter", obj2);
    }
    if(event.target.value == "Coordinate Filter"){
      const obj3 = <ClientAddCoord
        filterID={"clientinputcoord"}
        clientcoord={P.parentProps.inherit.clientcoord}
        cancer={P.parentProps.inherit.cancer}
        export={P.parentProps.inherit.export}
        callback={P.parentProps.setCoord}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientgenes = [];
      P.parentProps.updatePage(new_keys, new_Q, new_clientgenes, BQstate.clientcoord, "Coordinate Filter", obj3);
    }
  };

  componentDidUpdate(prevProps) {
    console.log("update", this.props.parentProps.inherit.filterboxSEF);
    if(prevProps.parentProps.inherit.cancer !== this.props.parentProps.inherit.cancer){
      console.log("ClientSEF", this.state);
      this.setState({
        value: ""
      })
    }
    else if(prevProps !== this.props){
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

function SubmitButton(props){
  const BQstate = props.BQstate;
  const BQprops = props.BQprops;
  var args = {};
  var to = "fetchHeatmapData";
  var functionpointer = makeRequest;
  if(props.defaultQuery == true){
    functionpointer = makeRequest;
    args["setState"] = BQprops.setViewPane;
    args["export"] = BQstate.export;
    args["cancer"] = BQstate.cancer;
    args["doc"] = document;
    to = "defaultQuery";
  }
  else{
    functionpointer = makeRequest;
    args["BQprops"] = BQprops;
    args["BQstate"] = BQstate;
    args["document"] = document;
    to = "fetchHeatmapData";
  }
  const classes = useStyles();
  return(
    <Button className={classes.myButton} onClick={() => functionpointer(to, args)} style={{ textTransform: 'none'}}>Run query</Button>
  )
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

  componentDidMount() {
    var prevstate = this.props.prevstate;
    console.log("mounted_prevstate", this.props);
    this.setState(prevstate);
  }

  componentDidUpdate(prevProps){
    var prevstate = this.props.prevstate;
    console.log("prevstate", prevstate);
    if(prevProps !== this.props){
      console.log("prevstate_new", prevstate);
      this.setState(prevstate);
    }
  }

  render(){
    var displayvalue = "block";
    if(this.state.defaultQuery == false){
      displayvalue = "block";
    }
    else{
      displayvalue = "none";
    }
    console.log("CURRENT_LOADING_STATE", this.state);
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
            <CheckboxForm updateBQPane={updateBQPane}/>
            <div id="FilterBox_div" style={{display: displayvalue}}>
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
                BQstate={this.state}
                BQprops={this.props}
              />
            </div>
            </Grid>
            </Grid>
            <div id="QueueBox_div">
              <QueueBox BQstate={this.state}></QueueBox>
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