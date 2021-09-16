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
var cancerQueueMessage;
var keys = {};
var sendToViewPane = {};
var displayvalue1 = "block";
var displayvalue2 = "none";
var displayvalue3 = "none";
var splicingreturned = [];
var splicingcols = [];

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

function updateFilterBox(ctype, num, field, sig){
  //console.log("working");
  this.setState({
      cancerType: ctype,
      fieldSet: field,
      sigSet: sig,
      number: num
  });
}

function updateViewPane(list1, list2){
  this.setState({
    inData: list1,
    inCols: list2
  });
}

function removeKey(type, keyval){
  //console.log("Delete starting...");
  for(var i = 0; i < keys[type].length; i++)
  {
    if(keys[type][i] == keyval)
    {
      //console.log("Key found!");
      keys[type].splice(i, 1);
      break;
    }
  }
}
///material-app
///ICGS/Oncosplice/build
function selectfield(name, value, number, filter){
  //console.log("selectfield starting...");
  var bodyFormData = new FormData();
  sendToViewPane["filter"] = [];
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxchildren[keys[filter][i]].props.value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(pre_queueboxchildren[keys[filter][i]].props.name, myString);
    sendToViewPane["filter"].push((pre_queueboxchildren[keys[filter][i]].props.name.concat("#").concat(myString)));
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
      //console.log("selectfield response code starting...");
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      queueboxchildren[number] = <QueueMessage key={number} number={number} name={name} get={number} value={value} type={"samples"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(curCancer, keys["filter"].length, queueboxchildren, queueboxsignatures);
      //console.log("selectfield response code finished.");
    })
}

function selectsignature(name, number, filter){
  var bodyFormData = new FormData();
  sendToViewPane["single"] = [];
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxsignatures[keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(myString, myString);
    sendToViewPane["single"].push(myString);
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
      queueboxsignatures[number] = <QueueMessage key={number} number={number} name={"PSI"} get={number} value={name} type={"events"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
  })
}

function selectgene(num){
  var bodyFormData = new FormData();
  sendToViewPane["single"] = [];
  for(var i = 0; i < clientgenes.length; i++)
  {
    bodyFormData.append(("GENE".concat(clientgenes[i])), ("GENE".concat(clientgenes[i])));
    sendToViewPane["single"].push(("Gene: ".concat(clientgenes[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: "/material-app/backend/getgene.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      console.log("1", totalmatch);
      console.log("2", response["data"]);
      updateNumberGenes(num, totalmatch);
  }) 
}

function DQ_UI_fields() {
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", "LAML");
  axios({
    method: "post",
    url: "/material-app/backend/ui_fields.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    sendToViewPane["cancer"] = "LAML";
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
  })
}

function getfields(cancername) {
  //console.log(cancername);
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
    keys["filter"] = [];
    keys["single"] = [];
    queueboxchildren = {};
    pre_queueboxchildren = {};
    queueboxsignatures = {};
    pre_queueboxsignatures = {};
    var local_ui_field_dict = response["data"]["meta"];
    var local_sigFilters = response["data"]["sig"];
    ui_field_dict = local_ui_field_dict;
    sigFilters = local_sigFilters;
    var qcancer_rows = (response["data"]["qbox"]["rows"]).toString();
    var qcancer_cols = (response["data"]["qbox"]["columns"]).toString();
    var cmessage = qcancer_rows.concat(" events and ").concat(qcancer_cols).concat(" samples.");
    curCancer = cancername;
    sendToViewPane["cancer"] = cancername;
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
    cancerQueueMessage = <QueueMessage key={"c_type_q"} number={0} name={"cancer"} get={0} value={cancername} type={"cancer"} total_selected={cmessage} total_left={cmessage}/>;
    updateQueueBox(curCancer, 1, queueboxchildren, queueboxsignatures);
    //console.log(ui_field_dict);
    updateFilterBox(cancername, 1, local_ui_field_dict, local_sigFilters);
    //console.log("Finished");
  })
}

function regeneratefields(cancername) {
  //console.log(cancername);
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
    var local_ui_field_dict = response["data"]["meta"];
    var local_sigFilters = response["data"]["sig"];
    ui_field_dict = local_ui_field_dict;
    sigFilters = local_sigFilters;
    var qcancer_rows = (response["data"]["qbox"]["rows"]).toString();
    var qcancer_cols = (response["data"]["qbox"]["columns"]).toString();
    var cmessage = qcancer_rows.concat(" events and ").concat(qcancer_cols).concat(" samples.");
    curCancer = cancername;
    sendToViewPane["cancer"] = cancername;
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
    cancerQueueMessage = <QueueMessage key={"c_type_q"} number={0} name={"cancer"} get={0} value={cancername} type={"cancer"} total_selected={cmessage} total_left={cmessage}/>;
    updateQueueBox(curCancer, 2, queueboxchildren, queueboxsignatures);
    //console.log(ui_field_dict);
    updateFilterBox(cancername, 2, local_ui_field_dict, local_sigFilters);
  })  
}

function ajaxdq() {
  var bodyFormData = new FormData();
  bodyFormData.append("PSIPsi cbfb gene fusions vs others", "PSIPsi cbfb gene fusions vs others");
  bodyFormData.append("CANCER","LAML");
  document.getElementById("sub").style.display = "block";
  //console.log("RUNNING running");
  axios({
    method: "post",
    url: "/material-app/backend/metarequest.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //console.log(response);
      //response = JSON.parse(response);
      document.getElementById(`simple-tab-1`).click();
      splicingreturned = response["data"]["rr"];
      splicingcols = response["data"]["col_beds"];
      sendToViewPane["filter"] = [];
      sendToViewPane["single"] = ["Psi cbfb gene fusions vs others"];
      updateViewPane(splicingreturned, splicingcols);
      document.getElementById("sub").style.display = "none";
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
    url: "/material-app/backend/metarequest.php",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      document.getElementById(`simple-tab-1`).click();
      splicingreturned = response["data"]["rr"];
      splicingcols = response["data"]["col_beds"];
      updateViewPane(splicingreturned, splicingcols);
      document.getElementById("sub").style.display = "none";
  })
}

function ajaxfunc() {
  document.getElementById("sub").style.display = "block";
  var bodyFormData = new FormData();
  var qh_arr = [];
  var tmp_qh_obj = {};
  for(var i = 0; i < keys["filter"].length; i++)
  {
    var myString = document.getElementById(childrenFilters[keys["filter"][i]].props.egg.concat("_id")).value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    //console.log("bodyFormDataSPLC", ("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    bodyFormData.append(("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    tmp_qh_obj["key"] = "SPLC".concat(childrenFilters[keys["filter"][i]].props.egg);
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < keys["single"].length; i++)
  {
    var myString = postoncosig[keys["single"][i]].props.egg;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    myString = "PSI".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataPSI", myString, myString);
    bodyFormData.append(myString, myString);
  }
  for(var i = 0; i < clientgenes.length; i++)
  {
    var myString = clientgenes[i];
    tmp_qh_obj = {};
    myString = "GENE".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataGene", myString, myString);
    bodyFormData.append(myString, myString);
  }
  bodyFormData.append("CANCER",curCancer);
  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qh_postdata = JSON.stringify(qh_arr)
  bodyFormData.append("HIST",qh_postdata);
  bodyFormData.append("USER",GLOBAL_user);
  //console.log("bodyFormDataCancer", curCancer)
  if(keys["single"].length == 0 && clientgenes.length == 0)
  {
    alert("Please select at least one signature or gene to continue.")
  }
  else
  {
    axios({
      method: "post",
      url: "/material-app/backend/metarequest.php",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        var dateval = response["data"]["date"];
        var indatatmp = {};
        //indatatmp["obj"] = qh_arr;
        //indatatmp["date"] = dateval;
        //queryhistory_dat.push(indatatmp);
        //addQueryHistory(indatatmp);
        console.log(response);
        //response = JSON.parse(response);
        document.getElementById(`simple-tab-1`).click();
        splicingreturned = response["data"]["rr"];
        splicingcols = response["data"]["col_beds"];
        updateViewPane(splicingreturned, splicingcols);
        document.getElementById("sub").style.display = "none";
        changeUser(GLOBAL_user);
      })
  }
}

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancerType: "NULL",
      number: 0,
      fieldSet: "NULL",
      sigSet: "NULL",
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
      //console.log(pre_queueboxchildren);
      //console.log(pre_queueboxsignatures);
    }
  }

  render ()
  {
    const children = [];
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    if(this.state.cancerType != "NULL" && this.state.fieldSet != undefined && this.state.sigSet != undefined)
    {
      children.push(<div>
      <div>
      <ClientAddFilter removeKey={removeKey} functioncall={selectfield} keys={keys} chicken={this.state.fieldSet} egg={childrenFilters} pre_q={pre_queueboxchildren} q={queueboxchildren} type={"filter"} filterID={"meta_filter_id"} label={"Add Sample Filter"}>
      </ClientAddFilter>
      </div>
      <ClientSEF sigvalue={this.state.sigSet}/>
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

//<ClientAddFilter removeKey={removeKey} functioncall={selectsignature} keys={keys} chicken={this.state.sigSet} egg={postoncosig} pre_q={pre_queueboxsignatures} q={queueboxsignatures} type={"single"} filterID={"sig_filter_id"} label={"Oncosplice Signature Filter"}>
//</ClientAddFilter>
//</div>
//<div>
//<ClientAddGene egg={clientgenes} filterID={"clientinputgene"}>
//</ClientAddGene>
//</div>
function updateFilterBoxSEF(val){
  //console.log("working");
  this.setState({
      eventfilterSet: val
  });
}

function ClientSEF(props)
{
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
    if(event.target.value == "Oncosplice Signature Filter")
    {
      const obj1 = <ClientAddFilter removeKey={removeKey} functioncall={selectsignature} keys={keys} chicken={props.sigvalue} egg={postoncosig} pre_q={pre_queueboxsignatures} q={queueboxsignatures} type={"single"} filterID={"sig_filter_id"} label={"Oncosplice Signature Filter"} />;
      updateFilterBoxSEF(obj1);
      clientgenes = [];
      displayvalue3 = "none";
      updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
    }
    if(event.target.value == "Gene Symbol Filter")
    {
      const obj2 = <ClientAddGene egg={clientgenes} filterID={"clientinputgene"} />;
      updateFilterBoxSEF(obj2);
      keys["single"] = [];
      queueboxsignatures = {};
      displayvalue3 = "block";
      updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
    }
  };

  return(
    <div style={{marginTop: 8, marginBottom: 26}}>
    <SpcInputLabel label={"Select Event Filter"}/>
    <FormControl variant="outlined">
        <Select
          native
          value={state.value}
          onChange={handleChange}
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
            return options;
          })()}
        </Select>      
    </FormControl>
    </div>
  )
}

function postGenes()
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
  selectgene(pile_of_uids.length);
}

function updateNumberGenes(num, tm)
{
    displayvalue3 = "block";
    this.setState({
      numberGenes: num,
      totalMatch: tm
    });
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
    //const children = [];
    //for (var i = 0; i < this.state.numChildren; i += 1) 
    //{
      //children.push(this.props.egg[i]);
    //};
    return(
      <InputGenes addChild={this.onAddChild}>
      </InputGenes>
    )
  }

  /*onDeleteChild = (num) => {
    this.props.egg.splice(num, 1);
    console.log(this.props.egg);
    this.setState({
      numChildren: this.state.numChildren - 1
    });

  }*/

  onAddChild = () => {
    //this.props.egg.push(<SingleItem key={this.state.numChildren} number={this.state.numChildren} deleteChild={this.onDeleteChild} egg={document.getElementById(this.props.filterID).value}/>);
    /*this.setState({
      numChildren: this.state.numChildren + 1
    });*/
    postGenes();
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
        <textarea id="clientinputgene" name="name" placeholder="TP53,JUN,MYC" style={{minWidth: 400, fontSize: 17, minHeight: 60}}/>
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
    displayvalue1 = "none";
    displayvalue2 = "block";
  }
  else
  {
    displayvalue2 = "none";
    displayvalue1 = "block";
  }
  //this.setState({
      //defaultOn: value
  //});  
}


class QueueBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numChildren: 0,
      targetCancer: [],
      targetArr: [],
      targetSignatures: [],
      numberGenes: 0,
      defaultOn: false,
      totalMatch: 0
    }
    updateQueueBox = updateQueueBox.bind(this);
    updateNumberGenes = updateNumberGenes.bind(this);
  }

  componentDidMount (){
    if(keys["filter"].length > 0 || keys["single"].length > 0)
    {
    var ta1 = [];
    var ta2 = [];
    var totalkeylen = keys["filter"].length + keys["single"].length;
    for(var i = 0; i < keys["filter"].length; i++)
    {
      ta1.push(this.props.queueboxchildren[keys["filter"][i]])
    }

    for(var i = 0; i < keys["single"].length; i++)
    {
      ta2.push(this.props.queueboxsignatures[keys["single"][i]])
    }

    this.setState({
        numChildren: totalkeylen,
        targetCancer: cancerQueueMessage,
        targetArr: ta1,
        targetSignatures: ta2
    });
    }
  }

  render (){
    return(
      <div>
      <SpcInputLabel label={"Selected Cancer"}/>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
        <div id="QueueBoxExampleDiv" style={{display: displayvalue2}}>
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
        <div id="QueueBoxContentDiv" style={{display: displayvalue1, position: 'relative', alignItems: 'center', textAlign: 'center'}}>
          <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', margin: 2}}>{this.state.targetCancer}</div>
        </div>
      </Box>
      <Typography style={{padding: '14px 14px'}} />
      <SpcInputLabel label={"Selected Samples"}/>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
      <div style={{display: displayvalue1, position: 'relative', alignItems: 'center', textAlign: 'center', margin: 2}}>{this.state.targetArr}</div>
      </Box>
      <Typography style={{padding: '14px 14px'}} />
      <SpcInputLabel label={"Selected Signature"}/>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
        <div style={{display: displayvalue1, position: 'relative', alignItems: 'center', textAlign: 'center', margin: 2}}>{this.state.targetSignatures}</div>
        <div id="QueueBoxGeneDiv" style={{display: displayvalue3, position: 'relative', alignItems: 'center', textAlign: 'center'}}>
          <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item>
            <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
            {"Selected ".concat(clientgenes.length).concat(" genes.")}
            </div>
            </Grid>
            <Grid item>
            <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', fontSize: 13}}>
            {"Selected ".concat(this.state.totalMatch).concat(" samples.")}
            </div>
            </Grid>
            </Grid>
          </div>
        </div>
      </Box>
      </div>
      );
  }

}

function setLoader(props)
{

}

function SubmitButton(props)
{
  //console.log("SubmitButton", props);
  var functionpointer = ajaxfunc;
  if(props.defaultQuery == true)
  {
    functionpointer = ajaxdq;
  }
  else
  {
    functionpointer = ajaxfunc;
  }
  const classes = useStyles();
  return(
    <Button className={classes.myButton} onClick={functionpointer} style={{ textTransform: 'none'}}>Run query</Button>
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

  componentDidMount() { 
    DQ_UI_fields();
  }

  componentDidUpdate() {
    //console.log("p","test2");
  }

  render()
  {
    //console.log("p","test3");
    return(
      null
    )
  }
}

function updateBQPane(value) {
  //console.log("working");
  this.setState({
      defaultQuery: value
  });
}

class BQPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numChildren: 0,
      defaultQuery: false,
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
    //console.log(this.state.defaultQuery);
    return (
    	<div style={{ fontFamily: 'Arial' }}>
    	  <div>
        <Grid container spacing={0}>
          <Grid item xs={7}>
            <Grid container spacing={0}>
              <Grid item xs={10}>
              </Grid>
            </Grid>
            <div>
            <Typography style={{padding: '2px 4px'}} />
            <CheckboxForm updateBQPane={updateBQPane} qBDefaultMessage={qBDefaultMessage}/>
            <div id="FilterBox_div" style={{display: displayvalue}}>
            <DefaultQueryWrapper value={this.state.defaultQuery} />
      	    <Grid container spacing={2}>
      	      <Grid item>
              <CancerSelect	inherit={this.props}/>
      	      </Grid>
            </Grid>
            <Typography style={{padding: '2px 4px'}} />
            <FilterBox />
            </div>
            </div>
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={0}>
            <Grid item xs={8}></Grid>
            <Grid item xs={1}>
            <div id="sub" style={{display: "none"}}>
              <img src="/material-app/backend/gifmax.gif" width="50" height="50"/>
            </div>
            </Grid>
            <Grid item xs={3}>
            <div style={{alignItems: 'center'}}>
              <SubmitButton defaultQuery={this.state.defaultQuery}/>
            </div>
            </Grid>
            </Grid>
            <div id="QueueBox_div">
              <QueueBox queueboxchildren={queueboxchildren} queueboxsignatures={queueboxsignatures} qBDefaultMessage={qBDefaultMessage}></QueueBox>
            </div>
          </Grid>
        </Grid>
        </div>
      </div>
    );
  }
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

class ViewPaneWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      inCols: []
    }
    updateViewPane = updateViewPane.bind(this);
  }

  componentDidMount() {   
    this.setState({
    inData: splicingreturned,
    inCols: splicingcols
    });
  }

  render()
  {
    //console.log(this.state);
    //console.log("sendToViewPane", sendToViewPane)
    return(
      <div>
        {this.state.inData.length > 0 && (
          <ViewPane css={withStyles(useStyles)} QueryExport={sendToViewPane} Data={this.state.inData} Cols={this.state.inCols}/>
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
      url: "/material-app/backend/queryhistoryaccess.php",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        //console.log(response);
        var responsedata = response["data"];
        var tmp_array = [];
        //for(var i = 0; i < responsedata.length)
        console.log("RESPONSE_changeuser", responsedata);
        //console.log("RESPONSE_TEST", responsedata["date"]);
        //console.log("RESPONSE_OBJ", responsedata["obj"]);
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
    //changeUser = changeUser.bind(this);
  }

  componentDidMount() {
    var bodyFormData = new FormData();
    bodyFormData.append("user",this.state.user);
    axios({
      method: "post",
      url: "/material-app/backend/queryhistoryaccess.php",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        //console.log(response);
        var responsedata = response["data"];
        var tmp_array = [];
        //for(var i = 0; i < responsedata.length)
        console.log("RESPONSE", responsedata);
        //console.log("RESPONSE_TEST", responsedata["date"]);
        //console.log("RESPONSE_OBJ", responsedata["obj"]);
        updateQueryHistory(responsedata);
    })

  }

  render()
  {
    //console.log(this.state);
    //console.log("sendToViewPane", sendToViewPane)
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
  console.log(response["Ys"]["Ve"]);
  console.log("Google response: ", response);
  var user = response["Ys"]["Ve"];
  updateAuthentication(user);
};

function updateAuthentication(value) {
  //console.log("working");
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
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: 22,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  },
});

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
        <Grid container spacing={0}>
        <Grid item xs={9}>
        <Typography className={classes.padding} />
			  <Tabs id="tabset" value={value} onChange={handleChange} aria-label="simple tabs example">
			    <Tab classes={tabstyle} label="Build Query" {...a11yProps(0)} style={{ textTransform: 'none'}}/>
			    <Tab classes={tabstyle} label="Explore Data" {...a11yProps(1)} style={{ textTransform: 'none'}}/>
			    <Tab classes={tabstyle} label="Query History" {...a11yProps(2)} style={{ textTransform: 'none'}}/>
			  </Tabs>
        </Grid>
        <Grid item xs={3}>
        <Typography className={classes.padding} />
        <div>
        <Authentication />
        </div>
        </Grid>
        </Grid>
			</div>
			<div id="tabcontent" style={{display: "block"}}>
			<TabPanel value={value} index={0}>
			  <BQPane regeneratefields={regeneratefields} getfields={getfields} queueboxchildren={queueboxchildren} queueboxsignatures={queueboxsignatures} curCancer={curCancer}/>
			</TabPanel>
			<TabPanel value={value} index={1}>
			  <ViewPaneWrapper />
			</TabPanel>
			<TabPanel value={value} index={2}>
			  <QueryHistoryPaneWrapper />
			</TabPanel>
			</div>
      <div id="aboutpanel" style={{display: "none", margin: 15}}>
        <div>
          <Box borderLeft={3} borderColor={'#0F6A8B'}>
          <div style={{marginLeft: 15, marginTop: 20, fontSize: 24}}>
            <strong><p style={{fontSize: 28}}>What is OncoSplice?</p></strong>
            <p>OncoSplice is an NIH supported research project (<a href="https://reporter.nih.gov/search/gxCJoumpGUCBdoMsV60Ycw/project-details/9495857">R01CA226802</a>) focused on defining and understanding novel splicing-defined patient subtypes across human cancers. The OncoSplice web-browser provides interactive access to diverse cancer datasets, enabling the selection of different patient subsets from existing clinical annotations (XenaBrowser) and splicing-events (known and novel). OncoSplice signatures are defined using the OncoSplice analysis workflow (<a href="https://github.com/venkatmi/oncosplice">https://github.com/venkatmi/oncosplice</a>) and in particular the software splice-ICGS. OncoSplice is a branch of the software AltAnalyze (<a href="http://altanalyze.org">http://altanalyze.org</a>).
</p>
            <p>The OncoSplice webportal is developed in ReactJS and PostgresSEQL and is currently in active development (alpha version). A manuscript describing OncoSplice and the OncoSplice webportal are currently in preparation. For questions, please contact the relevant OncoSplice team members.</p>
            <br />
            <Grid container spacing={5}>
              <Grid item xs={3}>
              <div><strong>Principle Investigator</strong></div>
              <div><strong>Lead Website Architect</strong></div>
              <div><strong>UI-UX Developer</strong></div>
              <div><strong>Co-Lead Data Scientist</strong></div>
              <div><strong>Co-Lead Data Scientist</strong></div>
              <div><strong>OncoSplice Development Lead</strong></div>
              </Grid>
              <Grid item xs={3}>
              <div>Nathan Salomonis</div>
              <div>Stuart Hay</div>
              <div>Adriana Navarro Sainz</div>
              <div>Anukana Bhattacharjee</div>
              <div>Audrey Crowther</div>
              <div>Meenakshi Venkatasubramanian</div>
              </Grid>
              <Grid item xs={3}>
              <div><a href="mailto: Nathan.Salomonis@cchmc.org">Nathan.Salomonis@cchmc.org</a></div>
              <div><a href="mailto: Stuart.Hay@cchmc.org">Stuart.Hay@cchmc.org</a></div>
              <div><a href="mailto: Adriana.NavarroSainz@cchmc.org">Adriana.NavarroSainz@cchmc.org</a></div>
              <div><a href="mailto: Anukana.Bhattacharjee@cchmc.org">Anukana.Bhattacharjee@cchmc.org</a></div>
              <div><a href="mailto: Audrey.Crowther@cchmc.org">Audrey.Crowther@cchmc.org</a></div>
              <div><a href="mailto: mixi03@gmail.com">mixi03@gmail.com</a></div>
              </Grid>
            </Grid>
          </div>
          </Box>
        </div>
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
      <Grid container spacing={3}>    
        <Grid item xs={5}>
          <div className={classes.cntr_special}>OncoSplice: Interactive Data Explorer</div>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "white", textDecoration: "none"}}>Contact</a></div>
        </Grid>
      </Grid>
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