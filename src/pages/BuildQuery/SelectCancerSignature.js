import React from 'react';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ClientAddFilter from './ClientAddFilter';
import SpcInputLabel from "../../components/SpcInputLabel";
import { makeRequest } from '../../request/CancerDataManagement.js';
import Tooltip from '@material-ui/core/Tooltip';
import BQSelect from "../../components/BQSelect";

function none()
{
  return null;
}

function SelectCancerSignature({P, BQstate}){

  const BQstateSet = P.BQstateSet;

  const [state, setState] = React.useState({
    value: '',
    name: 'hai',
    selection: BQstate.signatures
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
      value: event.target.value
    });
    var args = {};
    args["BQstate"] = BQstate;
    args["P"] = P;
    args["none"] = none;
    args["chicken"] = null;
    args["cancername"] = event.target.value;
    args["setState"] = BQstateSet.updateTargetSignature;
    args["keys"] = BQstate.keys;
    makeRequest("updateSignature", args);
  }
  
  var chicken = BQstate.signatures;

  React.useEffect(() => {
    if(state.selection != BQstate.signatures)
    {
        setState({
          ...state,
          value: state.value,
          selection: BQstate.signatures
        });
    }

  }, [state.value])

  React.useEffect(() => {
    if(state.value == "")   
    {
        setState({
          ...state,
          value: BQstate.compared_cancer,
        });
    }
  })

  return(
  	<>
    <SpcInputLabel label={"Cancer Signature Selection"}/>
    <Tooltip title="Select a cancer signature. Default is that of the currently selected cancer. Signatures from any cancer can be matched with any other cancer listed in the database.">
    <BQSelect
          value={state.value}
          handleChange={handleChange}
          inputID={"CancerSignature_id"}    
    >
    <option value=""></option>
    {(() => {
            const options = [];
            options.push(<option value={"LGG"}>{"LGG signatures"}</option>);
            options.push(<option value={"LUAD"}>{"LUAD signatures"}</option>);
            options.push(<option value={"BRCA"}>{"BRCA signatures"}</option>);
            options.push(<option value={"BLCA"}>{"BLCA signatures"}</option>);
            options.push(<option value={"GBM"}>{"GBM signatures"}</option>);
            options.push(<option value={"HNSCC"}>{"HNSCC signatures"}</option>);
            options.push(<option value={"SKCM"}>{"SKCM signatures"}</option>);
            options.push(<option value={"COAD"}>{"COAD signatures"}</option>);
            options.push(<option value={"AML_Leucegene"}>{"AML_Leucegene signatures"}</option>);
            return options;
    })()}
    </BQSelect>
    </Tooltip>
	</>
  )
}

export default SelectCancerSignature;