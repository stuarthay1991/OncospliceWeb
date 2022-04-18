import React from 'react';
import ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ClientAddFilter from './ClientAddFilter';
import ClientAddCoord from './ClientAddCoord';
import ClientAddGene from './ClientAddGene';
import SelectCancerSignature from './SelectCancerSignature';
import Tooltip from '@material-ui/core/Tooltip';

import SpcInputLabel from "../../components/SpcInputLabel";

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

function ClientSEF_select(props){
  const wla4 = widgetlabel4();
  return(
    <Tooltip title="Select the event filtration type. Events can be matched by genomic coordinates, gene symbols or cancer signatures.">
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
    const parentProps = P.parentProps;
    const S = this.state;
    const BQstate = this.props.BQstate;
    this.setState({
      ...this.state,
      [name]: event.target.value,
    });
    if(event.target.value == "Oncosplice Signature Filter"){

      var new_clientgenes = [];
      var new_clientcoord = [];
      const obj1 = <SelectCancerSignature
        P={P}
        parentProps={parentProps}
        S={S}
        BQstate={BQstate}
      />;
      P.FilterBoxProps.updatePage(BQstate.keys, BQstate.queuebox_values, new_clientgenes, new_clientcoord, "Oncosplice Signature Filter", obj1, "block");

    }
    if(event.target.value == "Gene Symbol Filter"){
      const obj2 = <ClientAddGene
        filterID={"clientinputgene"}
        BQstate={BQstate}
        clientgenes={BQstate.clientgenes}
        cancer={BQstate.cancer}
        export={BQstate.export}
        callback={P.FilterBoxProps.setGene}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientcoord = [];
      P.FilterBoxProps.updatePage(new_keys, new_Q, BQstate.clientgenes, new_clientcoord, "Gene Symbol Filter", obj2, "none");
    }
    if(event.target.value == "Coordinate Filter"){
      const obj3 = <ClientAddCoord
        filterID={"clientinputcoord"}
        clientcoord={BQstate.clientcoord}
        cancer={BQstate.cancer}
        export={BQstate.export}
        callback={P.FilterBoxProps.setCoord}
      />;
      var new_keys = BQstate.keys;
      new_keys["single"] = [];
      var new_Q = BQstate.queuebox_values;
      new_Q["signatures"] = {};
      var new_clientgenes = [];
      P.FilterBoxProps.updatePage(new_keys, new_Q, new_clientgenes, BQstate.clientcoord, "Coordinate Filter", obj3, "block");
    }
  };

  componentDidUpdate(prevProps) {
    const BQstate = this.props.BQstate;
    //console.log("update", BQstate.filterboxSEF);
    if(prevProps.BQstate.cancer !== BQstate.cancer){
      //console.log("ClientSEF", this.state);
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