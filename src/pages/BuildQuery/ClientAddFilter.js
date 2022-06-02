import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import PreQueueMessage from '../../components/PreQueueMessage';
import SingleItem from '../../components/SingleItem';

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
    fontSize: "16px"
  }
}));

class ClientAddFilter extends React.Component {
  constructor(props) {
    super(props);
    var P = this.props;
    this.state = {
      currentListOfSelectedFilters: P.listOfSelectedFilters,
      currentKeys: P.BQstate.keys,
      numChildren: P.BQstate.keys[P.type].length,
      BQstate: P.BQstate
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
        type={P.type} 
        filterID={P.filterID}
        label={P.label} 
        comboBoxFields={P.comboBoxFields} 
        range={P.rangeSet}
        sigTranslate={P.sigtranslate}>
      </FilterMenuPopulate>
    )
  }

  static getDerivedStateFromProps(props, state) {
    //console.log("GET DERIVED STATE", state);
    //console.log("GET DERIVED PROPS", props);
  }

  componentDidMount() {
    console.log("mounted", this.props);
    //this.setState(prevstate);
  }

  componentDidUpdate(prevProps) {
    //console.log("prev:", prevProps);
    //console.log("cur", this.props);
    if(prevProps !== this.props)
    {
      this.setState(state => ({...state, BQstate: this.props.BQstate}));
    }
  }

  onDeleteChild = (keyval) => {
    const P = this.props;
    const BQstate = P.BQstate;
    BQstate.keys = P.removeKey(P.type, keyval, BQstate.keys);
    P.listOfSelectedFilters[keyval] = "";
    this.setState(state => ({...state, numChildren: state.numChildren - 1}));
    if(P.type == "filter")
    {
      BQstate.pre_queueboxvalues["children"][keyval] = undefined;
      BQstate.queuebox_values["children"][keyval] = "";
      var args = {};
      args["filter"] = "filter";
      args["keys"] = BQstate.keys;
      args["pre_queueboxchildren"] = BQstate.pre_queueboxvalues;
      args["queueboxchildren"] = BQstate.queuebox_values;
      args["cancer"] = P.inheritState.cancerType;
      args["parentResultAmt"] = P.parentProps.inherit.resultamount;
      args["setState"] = P.parentProps.setMeta;
      args["export"] = P.parentProps.inherit.export;
      makeRequest("recursiveMetaDataField", args);
    }
    if(P.type == "single")
    {
      BQstate.pre_queueboxvalues[keyval] = undefined;
      BQstate.queuebox_values[keyval] = "";
      var args = {};
      args["filter"] = "single";
      args["keys"] = BQstate.keys;
      args["pre_queueboxchildren"] = BQstate.pre_queueboxvalues;
      args["queueboxchildren"] = BQstate.queuebox_values;
      args["cancer"] = BQstate.cancer;
      args["parentResultAmt"] = BQstate.resultamount;
      args["setState"] = P.parentProps.setSig;
      args["export"] = BQstate.export;
      makeRequest("recursiveSignature", args);
    }    
  }

  onAddChild = (invalue) => {
    const P = this.props;
    const S = this.state;
    const keyval = document.getElementById(P.filterID).value.concat(S.numChildren.toString());
    const BQstate = P.BQstate;
    BQstate.keys[P.type].push(keyval);
    var listOfSelectedFilters_copy = P.listOfSelectedFilters;
    console.log("BQstate after...", BQstate);
    const filterIDvalue = document.getElementById(P.filterID).value;
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
        listOfSelectedFilters_copy[keyval] = <ClientSelectedFilter
                          BQstate={BQstate}
                          P={P}
                          functioncall={P.functioncall} 
                          key={keyval} 
                          number={S.numChildren} 
                          get={keyval} 
                          deleteChild={this.onDeleteChild} 
                          range={P.rangeSet} 
                          comboBoxFields={P.rangeSet} 
                          selectedFilter={filterIDvalue} 
                          pre_q={BQstate.pre_queueboxvalues}/>;
      }
      else{
        listOfSelectedFilters_copy[keyval] = <ClientSelectedFilter
                          BQstate={BQstate} 
                          P={P}
                          functioncall={P.functioncall} 
                          key={keyval} 
                          number={S.numChildren} 
                          get={keyval} 
                          deleteChild={this.onDeleteChild} 
                          range={P.rangeSet} 
                          comboBoxFields={P.comboBoxFields} 
                          selectedFilter={filterIDvalue} 
                          pre_q={BQstate.pre_queueboxvalues}/>;
      }
      P.parentProps.setChildrenFilters(listOfSelectedFilters_copy, listOfSelectedFilters_copy, BQstate.keys);
    }
    if(P.type == "single"){
      var args = {};
      BQstate.pre_queueboxvalues["signatures"][keyval] = <PreQueueMessage 
                                                            key={keyval} 
                                                            number={S.numChildren} 
                                                            get={keyval} 
                                                            name={invalue}/>
      args["filter"] = "single";
      args["keys"] = BQstate.keys;
      args["pre_queueboxchildren"] = BQstate.pre_queueboxvalues;
      args["queueboxchildren"] = BQstate.queuebox_values;
      args["cancer"] = P.compared_cancer;
      args["parentResultAmt"] = BQstate.resultamount;
      args["sigTranslate"] = P.sigtranslate;
      args["setState"] = P.parentProps.setSig;
      args["name"] = invalue;
      args["keyval"] = keyval;
      args["type"] = P.type;
      args["export"] = BQstate.export;
      listOfSelectedFilters_copy[keyval] = <SingleItem 
                        key={keyval} 
                        number={S.numChildren} 
                        get={keyval} 
                        deleteChild={this.onDeleteChild} 
                        selectedSignature={invalue}/>;
      args["egg"] = P.listOfSelectedFilters;
      makeRequest("signature", args);
    }
    this.setState({
      currentListOfSelectedFilters: listOfSelectedFilters_copy,
      currentKeys: BQstate.keys
    })
    }
}

export default ClientAddFilter;