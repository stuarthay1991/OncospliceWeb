import React from 'react';
import ReactDOM from 'react-dom';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import '@fontsource/roboto';
import axios from 'axios';
import {Helmet} from "react-helmet";
import { createMuiTheme } from '@material-ui/core/styles';
import '../../App.css';
import useStyles from '../../useStyles.js';
import Tooltip from '@material-ui/core/Tooltip';
import loadinggif from './gifmax.gif';

//General components
import TabPanel from '../../components/TabPanel';
import SpcInputLabel from '../../components/SpcInputLabel';
import CheckboxForm from '../../components/CheckboxForm';
import QueueMessage from '../../components/QueueMessage';
import PreQueueMessage from '../../components/PreQueueMessage';
import SingleItem from '../../components/SingleItem';
import { isBuild } from '../../constants.js';

//Page specific components
import SubmitButton from './SubmitButton';
import ResetButton from './ResetButton';
import QueueBox from './Queuebox';
import ClientAddFilter from './ClientAddFilter';
import CancerSelect from './CancerSelect';
import ClientAddCoord from './ClientAddCoord';
import ClientAddGene from './ClientAddGene';
import ClientSEF from './ClientSEF';

//Server interface
import { makeRequest } from '../../request/CancerDataManagement.js';

var queryhistory_dat = [];
var GLOBAL_user = "Default";

var gifimg = isBuild ? <img src={"/ICGS/Oncosplice/testing/gifmax.gif"} width="50" height="50"/> : <img src={loadinggif} width="50" height="50"/>;

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
    const BQstate = this.props.BQstate;
    this.state = {
      cancerType: BQstate.cancer,
      number: 0,
      fieldSet: BQstate.ui_fields,
      sigSet: BQstate.signatures,
      rangeSet: BQstate.range,
      eventfilterSet: BQstate.SEFobj,
      BQstate: BQstate
    };
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
  }

  componentDidMount (){
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    const BQstate = this.props.BQstate;
    this.setState({
        cancerType: BQstate.cancer,
        number: 0,
        fieldSet: BQstate.ui_fields,
        sigSet: BQstate.signatures,
        rangeSet: BQstate.range,
        eventfilterSet: BQstate.SEFobj,
        BQstate: BQstate
    })
  }

  componentDidUpdate(prevProps) {
    //console.log("Look at state", this.state)
    const BQstate = this.props.BQstate;
    if(prevProps.inherit.cancer != BQstate.cancer){
      this.setState({
        cancerType: BQstate.cancer,
        number: 0,
        fieldSet: BQstate.ui_fields,
        sigSet: BQstate.signatures,
        rangeSet: BQstate.range,
        eventfilterSet: BQstate.SEFobj,
        BQstate: BQstate
      })
    }
    else if(prevProps != this.props){
      this.setState({
        cancerType: BQstate.cancer,
        number: 0,
        fieldSet: BQstate.ui_fields,
        sigSet: BQstate.signatures,
        rangeSet: BQstate.range,
        eventfilterSet: BQstate.SEFobj,
        BQstate: BQstate
      })
    }
  }

  render (){
    const P = this.props;
    const S = this.state;
    const BQstate = this.state.BQstate;
    const children = [];
    updateFilterBox = updateFilterBox.bind(this);
    updateFilterBoxSEF = updateFilterBoxSEF.bind(this);
    if(this.state.cancerType != "NULL" && this.state.fieldSet != undefined && this.state.sigSet != undefined){
      children.push(<div>
      <div>
      <ClientAddFilter 
        BQstate={BQstate}
        inheritState={S} 
        parentProps={P}
        removeKey={removeKey}
        functioncall={none}
        rangeSet={S.rangeSet}
        chicken={S.fieldSet}
        egg={BQstate.childrenFilters}
        type={"filter"}
        filterID={"meta_filter_id"}
        label={"Add Sample Filter"}>
      </ClientAddFilter>
      </div>
      <ClientSEF
        BQstate={BQstate}
        FilterBoxState={this.state}
        BQstateSet={this.props}
        sigvalue={this.state.sigSet}
        removeKey={removeKey}
        />
      <div>
      {this.state.eventfilterSet}
      <div id="signature_repository" style={{display: BQstate.sigdisplay}}>
      <ClientAddFilter
            BQstate={BQstate}
            inheritState={S}
            parentProps={P}
            removeKey={removeKey}
            functioncall={none}
            chicken={BQstate.signatures}
            egg={BQstate.postoncosig}
            type={"single"}
            filterID={"sig_filter_id"}
            label={"Oncosplice Signature Filter"}
            compared_cancer={BQstate.compared_cancer}
            sigtranslate={BQstate.sigTranslate}
      />
      </div>
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
      completeListOfUIDs: {},
      eventfilterSet: null,
      resultamount: {"samples": 0, "events": 0},
      childrenFilters: {},
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
      SEFobj: null,
      compared_cancer: null,
      sigdisplay: "none"
    }
    updateBQPane = updateBQPane.bind(this)
  }

  /*
  componentDidMount() {
    var prevstate = this.props.prevstate;
    console.log("mounted_prevstate", this.props);
    this.setState(prevstate);
  }*/

  componentDidUpdate(prevProps){
    console.log("CDU STATE", this.state);
  }

  render(){
    var displayvalue = "block";
    if(this.state.defaultQuery == false){
      displayvalue = "block";
    }
    else{
      displayvalue = "none";
    }
    //console.log("CURRENT_LOADING_STATE", this.state);
    return (
      <div style={{ marginLeft: 100, fontFamily: 'Arial' }}>
        <div>
        <Grid container spacing={0}>
          <Grid item sm={12} md={5}>
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
                clientcoord: [],
                eventsAndSignaturesDict: {},
                filterboxSEF: "",
                SEFobj: null,
                sigdisplay: "none",
                compared_cancer_signature: {},
                compared_cancer: in_cancer
                })}
                />
              </Grid>
            </Grid>
            <Typography style={{padding: '2px 4px'}} />
            <FilterBox
              BQstate={this.state}
              inherit={this.state}
              setChildrenFilters={(cF, egg, keys) => this.setState({
                childrenFilters: cF,
                queryFilter: egg,
                keys: keys
              })}
              setMeta={(resamt, qbox, pre_qbox, keys, exp) => this.setState({
                resultamount: resamt,
                queuebox_values: qbox,
                pre_queueboxvalues: pre_qbox,
                keys: keys,
                export: exp
              })}
              setSig={(resamt, qbox, keys, exp, pO, cLOU) => this.setState({
                resultamount: resamt,
                queuebox_values: qbox,
                keys: keys,
                export: exp,
                postoncosig: pO,
                querySignature: pO,
                completeListOfUIDs: cLOU
              })}
              setGene={(cG, exp, resamt) => this.setState({
                clientgenes: cG,
                export: exp,
                resultamount: resamt
              })}
              setCoord={(cC, exp) => this.setState({
                clientcoord: cC,
                export: exp
              })}
              updateTargetSignature={(canc, sigs, sigT, keys, tsobj) => this.setState({
                signatures: sigs,
                sigTranslate: sigT,
                keys: keys,
                compared_cancer: canc,
                postoncosig: [],
                clientgenes: [],
                clientcoord: [],
                querySignature: {},
                queuebox_values: {"children": {}, "signatures": {}, "cancer": this.state.queuebox_values["cancer"]},
                pre_queueboxvalues: {"children": {}, "signatures": {}}
              })}
              updatePage={(k,q,cG,cC,fSEF,SEFobj,disp) => this.setState({
                keys: k,
                queuebox_values: q,
                clientgenes: cG,
                clientcoord: cC,
                filterboxSEF: fSEF,
                SEFobj: SEFobj,
                sigdisplay: disp
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
            <Grid item xs={6}></Grid>
            <Grid item xs={1}>
            <div id="sub" style={{display: "none"}}>
              {gifimg}
            </div>
            </Grid>
            <Grid item xs={2}>
            <div style={{float: 'right', alignItems: 'center'}}>
              <ResetButton
              />
            </div>
            </Grid>
            <Grid item xs={3}>
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
        </Grid>
        </div>
      </div>
    );
  }
}

export default BQPane;