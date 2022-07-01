import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import PreQueueMessage from '../../components/PreQueueMessage';
import QueueMessage from '../../components/QueueMessage';
import SingleItem from '../../components/SingleItem';
import axios from 'axios';

import { makeRequest } from '../../request/CancerDataManagement.js';

import ClientSelectedFilter from "./ClientSelectedFilter";
import FilterMenuPopulate from "./FilterMenuPopulate";

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
    fontSize: "1.2em"
  }
}));

//Interface for adding and removing filters
class ClientAddFilter extends React.Component {
  constructor(props) {
    super(props);
    var P = this.props;
    this.state = {
      numChildren: P.BQstate.keys[P.type].length
    };
  }

  render (){
    const P = this.props;
    const BQstate = P.BQstate;
    return(
      <FilterMenuPopulate 
        BQstate={BQstate} 
        addChild={this.onAddChild}
        parentProps={P.parentProps} 
        currentSelection={P.currentSelection} 
        type={P.type} 
        filterID={P.filterID}
        label={P.label} 
        possibleSelections={P.possibleSelections} 
        range={P.rangeSet}
        sigTranslate={P.sigtranslate}>
      </FilterMenuPopulate>
    )
  }

  onDeleteChild = (keyval) => {
    const P = this.props;
    const BQstate = P.BQstate;
    BQstate.keys = P.removeKey(P.type, keyval, BQstate.keys);
    P.currentSelection[keyval] = "";
    this.setState(state => ({...state, numChildren: state.numChildren - 1}));
    if(P.type == "filter")
    {
      BQstate.preQueueboxValues["children"][keyval] = undefined;
      BQstate.queueboxValues["children"][keyval] = "";
      var args = {};
      args["filter"] = "filter";
      args["keys"] = BQstate.keys;
      args["pre_queueboxchildren"] = BQstate.preQueueboxValues;
      args["queueboxchildren"] = BQstate.queueboxValues;
      args["cancer"] = P.inheritState.cancerType;
      args["parentResultAmt"] = P.parentProps.inherit.resultAmount;
      args["setState"] = P.parentProps.setMeta;
      args["export"] = P.parentProps.inherit.export;
      makeRequest("recursiveMetaDataField", args);
    }
    if(P.type == "single")
    {
      var args = {};
      const deletedSigName = BQstate.preQueueboxValues["signatures"][keyval].props.name;
      BQstate.preQueueboxValues["signatures"][keyval] = undefined;
      BQstate.queueboxValues["signatures"][keyval] = "";
      args["filter"] = "single";
      args["keys"] = BQstate.keys;
      args["name"] = deletedSigName;
      args["pre_queueboxchildren"] = BQstate.preQueueboxValues;
      args["queueboxchildren"] = BQstate.queueboxValues;
      args["completeListOfUIDs"] = BQstate.completeListOfUIDs;
      args["sigTranslate"] = P.sigtranslate;
      args["cancer"] = BQstate.cancer;
      args["parentResultAmt"] = BQstate.resultAmount;
      args["setState"] = P.parentProps.setSig;
      args["export"] = BQstate.export;
      args["listOfSelectedSignatures"] = P.currentSelection;
      deleteSignature(args);
    }
  }

  onAddChild = (invalue) => {
    const P = this.props;
    const keyval = document.getElementById(P.filterID).value.concat(this.state.numChildren.toString());
    const BQstate = P.BQstate;
    BQstate.keys[P.type].push(keyval);
    var currentSelectionCopy = P.currentSelection;
    console.log("BQstate after...", BQstate);
    const filterIDvalue = document.getElementById(P.filterID).value;
    //console.log("added value", invalue, P);
    var found = false;
    if(P.rangeSet != undefined)
    {
      for (const [newkey, newvalue] of Object.entries(P.rangeSet)) {
        if(newkey == filterIDvalue){
          found = true;
          break;
        }
      }
    }
    if(P.type == "filter"){
      if(found){
        currentSelectionCopy[keyval] = <ClientSelectedFilter
                          BQstate={BQstate}
                          P={P} 
                          functioncall={P.functioncall} 
                          key={keyval} 
                          number={this.state.numChildren} 
                          get={keyval} 
                          deleteChild={this.onDeleteChild} 
                          range={P.rangeSet} 
                          possibleSelections={P.rangeSet} 
                          currentSelection={filterIDvalue} 
                          pre_q={BQstate.preQueueboxValues}/>;
      }
      else{
        currentSelectionCopy[keyval] = <ClientSelectedFilter
                          BQstate={BQstate} 
                          P={P} 
                          functioncall={P.functioncall} 
                          key={keyval} 
                          number={this.state.numChildren} 
                          get={keyval} 
                          deleteChild={this.onDeleteChild} 
                          range={P.rangeSet} 
                          possibleSelections={P.possibleSelections} 
                          currentSelection={filterIDvalue} 
                          pre_q={BQstate.preQueueboxValues}/>;
      }
      P.parentProps.setChildrenFilters(currentSelectionCopy, currentSelectionCopy, BQstate.keys);
    }
    if(P.type == "single"){
      var args = {};
      BQstate.preQueueboxValues["signatures"][keyval] = <PreQueueMessage 
                                                            key={keyval} 
                                                            number={this.state.numChildren} 
                                                            get={keyval} 
                                                            name={invalue}/>
      args["filter"] = "single";
      args["keys"] = BQstate.keys;
      args["pre_queueboxchildren"] = BQstate.preQueueboxValues;
      args["queueboxchildren"] = BQstate.queueboxValues;
      args["cancer"] = P.comparedCancer;
      args["parentResultAmt"] = BQstate.resultAmount;
      args["completeListOfUIDs"] = BQstate.completeListOfUIDs;
      args["sigTranslate"] = P.sigtranslate;
      args["setState"] = P.parentProps.setSig;
      args["name"] = invalue;
      args["keyval"] = keyval;
      args["type"] = P.type;
      args["export"] = BQstate.export;
      //name, number, filter
      currentSelectionCopy[keyval] = <SingleItem 
                        key={keyval} 
                        number={this.state.numChildren} 
                        get={keyval} 
                        deleteChild={this.onDeleteChild}
                        currentSelection={invalue}/>;
      args["currentSelection"] = P.currentSelection;
      makeRequest("signature", args);
    }
    }
}

function deleteSignature(arg)
{
  //name, number, filter
  const keys = arg["keys"];
  const Q = arg["queueboxchildren"];
  var prospectedQueryResults = arg["parentResultAmt"];
  var completeListOfUIDs = arg["completeListOfUIDs"];
  const sigTranslate = arg["sigTranslate"];
  const callback = arg["setState"];
  const preQ = arg["pre_queueboxchildren"];
  var name = arg["name"];
  for(const key in completeListOfUIDs)
  {
    var current_list = completeListOfUIDs[key];
    for(let i in current_list)
    {
      if(name == current_list[i])
      {
        current_list.splice(i, 1);
      }
    }
    if(current_list.length == 0)
    {
      delete completeListOfUIDs[key];
    }
    else
    {
      completeListOfUIDs[key] = current_list; 
    }
  }

  const exportView = arg["export"];
  exportView["single"] = [];
  //Reset export
  for(let i in keys["single"])
  {
    var signatureName = preQ["signatures"][keys["single"][i]].props.name;
    signatureName = signatureName.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      signatureName = sigTranslate[signatureName] != undefined ? sigTranslate[signatureName].replace("+", "positive_") : signatureName.replace(" ", "_");
    }
    exportView["single"].push(signatureName); 
  }
  
  //delete from listOfSelectedSignatures
  const listOfSelectedSignatures = arg["listOfSelectedSignatures"];
  for (const key in listOfSelectedSignatures)
  {
    if(listOfSelectedSignatures[key] == "")
    {
      delete listOfSelectedSignatures[key];
    }
  }

  prospectedQueryResults = {"samples": arg["parentResultAmt"]["samples"], "events": Object.keys(completeListOfUIDs).length};
  callback(prospectedQueryResults, Q, keys, exportView, listOfSelectedSignatures, completeListOfUIDs);
}

export default ClientAddFilter;