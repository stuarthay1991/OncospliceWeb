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
import DefaultQueryCheckboxForm from '../../components/DefaultQueryCheckboxForm';
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
import ClientSelectEventFilter from './ClientSelectEventFilter';

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
      fieldSet: BQstate.uiFields,
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
        fieldSet: BQstate.uiFields,
        sigSet: BQstate.signatures,
        rangeSet: BQstate.range,
        eventfilterSet: BQstate.SEFobj,
        BQstate: BQstate
    })
  }

  componentDidUpdate(prevProps) {
    const BQstate = this.props.BQstate;
    if(prevProps.inherit.cancer != BQstate.cancer){
      this.setState({
        cancerType: BQstate.cancer,
        number: 0,
        fieldSet: BQstate.uiFields,
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
        fieldSet: BQstate.uiFields,
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
        possibleSelections={S.fieldSet}
        currentSelection={BQstate.childrenFilters}
        type={"filter"}
        filterID={"meta_filter_id"}
        label={"Add Sample Filter"}>
      </ClientAddFilter>
      </div>
      <ClientSelectEventFilter
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
            possibleSelections={BQstate.signatures}
            currentSelection={BQstate.listOfSelectedSignatures}
            type={"single"}
            filterID={"sig_filter_id"}
            label={"Oncosplice Signature Filter"}
            comparedCancer={BQstate.comparedCancer}
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

function updateBQPanel(value) {
  this.setState({
      defaultQuery: value
  });
}

class BQPanel extends React.Component {
  constructor(props) {
    super(props)
    var prevstate = this.props.prevstate;
    this.state = {
      defaultQuery: false,
      queueboxValues: {"children": undefined, "signatures": undefined},
      preQueueboxValues: {"children": {}, "signatures": {}},
      completeListOfUIDs: {},
      eventfilterSet: null,
      resultAmount: {"samples": 0, "events": 0},
      childrenFilters: {},
      listOfSelectedSignatures: [],
      queryFilter: {},
      querySignature: {},
      clientCoord: [],
      clientGenes: [],
      keys: {"filter": [], "single": []},
      range: undefined,
      cancer: "",
      uiFields: {},
      export: {},
      genes: [],
      coordinates: [],
      signatures: undefined,
      sigTranslate: undefined,
      filterboxSEF: "",
      SEFobj: null,
      comparedCancer: null,
      sigdisplay: "none"
    }
    updateBQPanel = updateBQPanel.bind(this)
  }

  render(){
    var displayvalue = "block";
    if(this.state.defaultQuery == false){
      displayvalue = "block";
    }
    else{
      displayvalue = "none";
    }
    return (
      <div style={{ marginLeft: 100, fontFamily: 'Arial' }}>
        <div>
        <Grid container spacing={3}>
          <Grid item sm={12} md={5}>
            <Grid container spacing={0}>
              <Grid item xs={10}>
              </Grid>
            </Grid>
            <div style={{marginTop: 20}}>
            <DefaultQueryCheckboxForm updateBQPanel={updateBQPanel}/>
            <div id="FilterBox_div" style={{display: displayvalue, marginTop: 5, overflowX: "scroll"}}>
            <Grid item container spacing={2}>
              <CancerSelect inherit={this.props} prevState={this.state}
                setUI={(in_uiFields, in_cancer, in_qbox, range, sigs, resamt, sigT, exp) => this.setState({
                uiFields: in_uiFields, 
                cancer: in_cancer,
                queueboxValues: in_qbox,
                keys: {"filter": [], "single": []},
                range: range,
                signatures: sigs,
                resultAmount: resamt,
                sigTranslate: sigT,
                export: exp,
                childrenFilters: [],
                listOfSelectedSignatures: [],
                clientGenes: [],
                clientCoord: [],
                eventsAndSignaturesDict: {},
                filterboxSEF: "",
                SEFobj: null,
                sigdisplay: "none",
                comparedCancer_signature: {},
                comparedCancer: in_cancer
                })}
                />
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
                resultAmount: resamt,
                queueboxValues: qbox,
                preQueueboxValues: pre_qbox,
                keys: keys,
                export: exp
              })}
              setSig={(resamt, qbox, keys, exp, pO, cLOU) => this.setState({
                resultAmount: resamt,
                queueboxValues: qbox,
                keys: keys,
                export: exp,
                listOfSelectedSignatures: pO,
                querySignature: pO,
                completeListOfUIDs: cLOU
              })}
              setGene={(cG, exp, resamt) => this.setState({
                clientGenes: cG,
                export: exp,
                resultAmount: resamt
              })}
              setCoord={(cC, exp) => this.setState({
                clientCoord: cC,
                export: exp
              })}
              updateTargetSignature={(canc, sigs, sigT, keys, tsobj) => this.setState({
                signatures: sigs,
                sigTranslate: sigT,
                keys: keys,
                comparedCancer: canc,
                listOfSelectedSignatures: [],
                clientGenes: [],
                clientCoord: [],
                querySignature: {},
                queueboxValues: {"children": {}, "signatures": {}, "cancer": this.state.queueboxValues["cancer"]},
                preQueueboxValues: {"children": {}, "signatures": {}}
              })}
              updatePage={(k,q,cG,cC,fSEF,SEFobj,disp) => this.setState({
                keys: k,
                queueboxValues: q,
                clientGenes: cG,
                clientCoord: cC,
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
            <Grid container spacing={2}>
              <Grid item xs={4}></Grid>
              <Grid item xs={2}>
              <div id="sub" style={{display: "none"}}>
                {gifimg}
              </div>
              </Grid>
              <Grid item xs={6}>
                <span style={{position: "relative", float: "right"}}>
                <div style={{float: 'right', alignItems: 'center'}}>
                  <ResetButton
                  />
                </div>
                <div style={{float: 'right', alignItems: 'center'}}>
                  <SubmitButton
                    BQstate={this.state}
                    BQprops={this.props}
                  />
                </div>
                </span>
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

export default BQPanel;