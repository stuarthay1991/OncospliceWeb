import React from 'react';
import ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ClientAddFilter from './ClientAddFilter';
import SpcInputLabel from "../../components/SpcInputLabel";
import { makeRequest } from '../../request/CancerDataManagement.js';

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

function none()
{
  return null;
}

function SelectCancerSignature({P, parentProps, S, BQstate}){
  const wla4 = widgetlabel4();

  const [state, setState] = React.useState({
    value: BQstate.compared_cancer,
    name: 'hai',
    selection: BQstate.signatures
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    var args = {};
    args["BQstate"] = BQstate;
    args["P"] = P;
    args["none"] = none;
    args["chicken"] = null;
    args["cancername"] = event.target.value;
    args["setState"] = P.FilterBoxProps.updateTargetSignature;
    args["keys"] = BQstate.keys;
    makeRequest("updateSignature", args);
  }
  
  var chicken = BQstate.signatures;
  console.log("SelectCancerSignature1", BQstate.compared_cancer, state.value);
  console.log("SelectCancerSignature2", BQstate.signatures, state.selection);

  React.useEffect(() => {
    if(state.selection != BQstate.signatures)
    {
        //console.log("WAHOOBA1", bqstate, mpstate.bqstate);
        //var temp_view_obj = {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []};
        console.log("Use effect 1");
        setState({
          ...state,
          value: BQstate.compared_cancer,
          selection: BQstate.signatures
        });
    }
    console.log("Use effect 2", BQstate.compared_cancer, state.value);
    console.log("Use effect 3", BQstate.signatures, state.selection);

  }, [state.value])
  /*if()
  {

  }*/
  /*const obj1 = <ClientAddFilter
        BQstate={BQstate}
        inheritState={P.FilterBoxState}
        parentProps={P.FilterBoxProps}
        removeKey={P.removeKey}
        functioncall={none}
        chicken={BQstate.signatures}
        egg={BQstate.postoncosig}
        type={"single"}
        filterID={"sig_filter_id"}
        label={"Oncosplice Signature Filter"}
  />;*/
  //P.FilterBoxProps.updatePage(BQstate.keys, BQstate.queuebox_values, new_clientgenes, new_clientcoord, "Oncosplice Signature Filter", obj1);

  return(
  	<>
    <SpcInputLabel label={"Cancer Signature Selection"}/>
    <Select
          native
          classes={wla4}
          value={BQstate.compared_cancer}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: "CancerSignature_id",
          }}
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
    </Select>
	</>
  )
}

export default SelectCancerSignature;