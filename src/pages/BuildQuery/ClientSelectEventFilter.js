import React from 'react';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ClientAddFilter from './ClientAddFilter';
import ClientAddCoord from './ClientAddCoord';
import ClientAddGene from './ClientAddGene';
import SelectCancerSignature from './SelectCancerSignature';
import Tooltip from '@material-ui/core/Tooltip';

import SpcInputLabel from "../../components/SpcInputLabel";
import BQSelect from "../../components/BQSelect";

function none()
{
  return null;
}

function ClientSEF_select(props){
  return(
    <Tooltip title="Select the event filtration type. Events can be matched by genomic coordinates, gene symbols or cancer signatures.">
    <BQSelect
          value={props.value}
          handleChange={props.handleChange}
          inputID={"SEF_id"}
    >
    <option value=""></option>
    {(() => {
            const options = [];
            options.push(<option value={"Oncosplice Signature Filter"}>{"Oncosplice Signature Filter"}</option>);
            options.push(<option value={"Gene Symbol Filter"}>{"Gene Symbol Filter"}</option>);
            options.push(<option value={"Coordinate Filter"}>{"Coordinate Filter"}</option>);
            return options;
    })()}
    </BQSelect>
    </Tooltip>
  )
}

class ClientSEF extends React.Component {
  constructor(props) {
    super(props);
    const BQstate = this.props.BQstate;
    this.state = {
        value: BQstate.filterboxSEF,
        name: 'hai',
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const P = this.props;
    const S = this.state;
    const BQstate = P.BQstate;
    const BQstateSet = P.BQstateSet;
    this.setState({
      ...this.state,
      [name]: event.target.value,
    });
    if(event.target.value == "Oncosplice Signature Filter"){

      var new_clientGenes = [];
      var new_clientCoord = [];
      const obj1 = <SelectCancerSignature
        P={P}
        BQstate={BQstate}
      />;
      BQstateSet.updatePage(BQstate.keys, BQstate.queueboxValues, new_clientGenes, new_clientCoord, "Oncosplice Signature Filter", obj1, "block");

    }
    if(event.target.value == "Gene Symbol Filter"){
      const obj2 = <ClientAddGene
        filterID={"clientinputgene"}
        BQstate={BQstate}
        clientGenes={BQstate.clientGenes}
        cancer={BQstate.cancer}
        export={BQstate.export}
        callback={BQstateSet.setGene}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queueboxValues;
      new_Q["signatures"] = {};
      var new_clientCoord = [];
      BQstateSet.updatePage(new_keys, new_Q, BQstate.clientGenes, new_clientCoord, "Gene Symbol Filter", obj2, "none");
    }
    if(event.target.value == "Coordinate Filter"){
      const obj3 = <ClientAddCoord
        filterID={"clientinputcoord"}
        clientCoord={BQstate.clientCoord}
        cancer={BQstate.cancer}
        export={BQstate.export}
        callback={BQstateSet.setCoord}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queueboxValues;
      new_Q["signatures"] = {};
      var new_clientGenes = [];
      BQstateSet.updatePage(new_keys, new_Q, new_clientGenes, BQstate.clientCoord, "Coordinate Filter", obj3, "none");
    }
  };

  componentDidUpdate(prevProps) {
    const BQstate = this.props.BQstate;
    if(prevProps.BQstate.cancer !== BQstate.cancer){
      this.setState({
        value: ""
      })
    }
    else if(prevProps !== this.props){
      this.setState({
        value: BQstate.filterboxSEF
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

export default ClientSEF;