import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import SpcInputLabel from "../../components/SpcInputLabel";
import BuildQuerySelect from "../../components/BuildQuerySelect";
import { makeRequest } from '../../request/CancerDataManagement.js';

function CancerSelectWidget(props)
{
  return (
        <Tooltip title="Select a cancer. All filters and signatures subsequently selected will be matched with this cancer data.">
        <BuildQuerySelect
          value={props.value}
          handleChange={props.handleChange}
          inputID={props.inputID}
        >
          <option value=""></option>
          {(() => {
            const options = [];
            options.push(<option value={"LGG"}>{"Low-Grade Glioma (TCGA)"}</option>);
            options.push(<option value={"LUAD"}>{"Lung Adenocarcinoma (TCGA)"}</option>);
            options.push(<option value={"BRCA"}>{"Breast Invasive Carcinoma (TCGA)"}</option>);
            options.push(<option value={"BLCA"}>{"Bladder Cancer (TCGA)"}</option>);
            options.push(<option value={"GBM"}>{"Glioblastoma (TCGA)"}</option>);
            options.push(<option value={"HNSCC"}>{"Head and Neck Squamous Cell Carcinoma (TCGA)"}</option>);
            options.push(<option value={"SKCM"}>{"Skin Cutaneous Melanoma (TCGA)"}</option>);
            options.push(<option value={"COAD"}>{"Colon Adenocarcinoma (TCGA)"}</option>);
            options.push(<option value={"AML_Leucegene"}>{"Acute Myeloid Leukemia (Leucgene)"}</option>);
            return options;
          })()}
        </BuildQuerySelect>
        </Tooltip>
  );
}

function CancerSelectFormControl(props)
{
  return (
  <div>
  <SpcInputLabel label={"Cancer Type"}></SpcInputLabel>
  <FormControl>
    <CancerSelectWidget value={props.value} handleChange={props.handleChange}></CancerSelectWidget>
  </FormControl>
  </div>
  );

}

class CancerSelect extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      value: this.props.prevState.cancer,
      name: 'hai',
    };
  }

  componentDidMount()
  {
    console.log("CANCERSELECT", this.props.prevState.cancer, this.state.value);
    if(this.props.prevState.cancer != this.state.value)
    {
      this.setState({
        name: 'hai',
        value: this.props.prevState.cancer,
      });
      //P.regeneratefields(P.curCancer);
    }
  }

  componentDidUpdate(prevProps)
  {
    console.log("CANCERSELECT_update", this.props.prevState.cancer, this.state.value);
    if(prevProps !== this.props)
    {
      this.setState({
        name: 'hai',
        value: this.props.prevState.cancer,
      });
    }
  }

  handleChange = (event) => {
    const P = this.props.inherit;
    const name = event.target.name;
    console.log("1", event.target.value);
    this.setState({
      name: 'hai',
      value: event.target.value,
    });
    var args = {};
    args["cancername"] = event.target.value;
    args["setState"] = this.props.setUI;
    makeRequest("uiFields", args);
  }

  render ()
  {
  return (
    <Grid item>
    <div style={{marginTop: 12, marginBottom: 12}}>
      <CancerSelectFormControl value={this.state.value} handleChange={this.handleChange}></CancerSelectFormControl>
    </div>
    </Grid>
  );
  }

}

export default CancerSelect;