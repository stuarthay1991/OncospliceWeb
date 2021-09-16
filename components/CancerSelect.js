import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import SpcInputLabel from "./SpcInputLabel";

const widgetlabel = makeStyles((theme) => ({
  root: {
    maxWidth: "360px",
    minWidth: "360px",
    fontSize: "16px"
    }
}));

const labelstyle = makeStyles((theme) => ({
  labelstyle: {
    backgroundColor: '#0F6A8B',
    color: 'white',
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 2
  }
}));

function CancerSelectWidget(props)
{
  const classes = widgetlabel();
  return (
        <Select
          native
          classes={classes}
          value={props.value}
          onChange={props.handleChange}
          inputProps={{
            name: 'value',
            id: "CancerSelect_id",
          }}
        >
          <option value=""></option>
          {(() => {
            const options = [];
            options.push(<option value={"LGG"}>{"LGG"}</option>);
            options.push(<option value={"LAML"}>{"LAML"}</option>);
            options.push(<option value={"LUAD"}>{"LUAD"}</option>);
            options.push(<option value={"BRCA"}>{"BRCA"}</option>);
            options.push(<option value={"BLCA"}>{"BLCA"}</option>);
            options.push(<option value={"GBM"}>{"GBM"}</option>);
            options.push(<option value={"HNSCC"}>{"HNSCC"}</option>);
            options.push(<option value={"SKCM"}>{"SKCM"}</option>);
            options.push(<option value={"COAD"}>{"COAD"}</option>);
            return options;
          })()}
        </Select>
  );
}

function CancerSelectFormControl(props)
{
  const classes = widgetlabel();
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
      value: '',
      name: 'hai',
    };
  }

  componentDidMount()
  {
    const P = this.props.inherit;
    if(P.curCancer != undefined)
    {
      console.log("2", P.curCancer);
      this.setState({
        name: 'hai',
        value: P.curCancer,
      });
      P.regeneratefields(P.curCancer);
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
    P.getfields(event.target.value);
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