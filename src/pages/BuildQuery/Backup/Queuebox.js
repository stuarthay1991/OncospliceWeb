import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';

import SpcInputLabel from '../../components/SpcInputLabel';

const boxProps = {
  border: 3,
};

function QB_SelectedCancer(props)
{
  var displayvalue_userquery = "block";
  var displayvalue_defaultquery = "none";
  if(props.defaultvalue == true)
  {
    displayvalue_defaultquery = "block";
    displayvalue_userquery = "none";
  }
  var canc_message = props.targetCancer;
  if(canc_message == "")
  {
    canc_message = "Please select a cancer."
  }
  return(
    <div>
      <Box>
        <div id="QueueBoxExampleDiv" style={{display: displayvalue_defaultquery}}>
          <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item>
            <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
            {"Select 'Run Query' to see example output."}
            </div>
            </Grid>
            </Grid>
          </div>
        </div>
        <div id="QueueBoxContentDiv" style={{display: displayvalue_userquery, position: 'relative', alignItems: 'center', textAlign: 'center'}}>
          <div style={{color: "#0F6A8B", backgroundColor: "#edf0f5", position: 'relative', minHeight: "40px", minWidth: "40px", alignItems: 'center', textAlign: 'center', marginTop: 2}}>{canc_message}</div>
        </div>
      </Box>
    </div>
  );
}

function QB_format(props)
{
  var targsel = props.targetArrSelections;
  var targarr = props.targetArr;
  var index = props.index;
  var targarr_obj;
  if(index < props.targetArr.length)
  {
    targarr_obj = props.targetArr[index];
  }
  else
  {
    targarr_obj = <strong style={{paddingTop: 5}}>None Selected.</strong>;
  }

  return(
    <div>
    <Grid container spacing={2}>
      <Grid item>
        {targsel[props.value]}
      </Grid>
      <Grid item>
        {targarr_obj}
      </Grid>
    </Grid>
    </div>
  );
}

function QB_SelectedSample(props)
{
  var displayvalue_userquery = "block";
  if(props.defaultvalue == true)
  {
    displayvalue_userquery = "none";
  }
  return(
    <div>
      <Box>
      <div style={{display: displayvalue_userquery, position: 'relative', minHeight: "40px", alignItems: 'left', textAlign: 'center', margin: 2}}>
        {(() => {
            //console.log("Object entries: ", Object.entries(props.targetArrSelections)[0][1]);
            const target = [];
            for(var i = 0; i < Object.entries(props.targetArrSelections).length; i++) {
              target.push(<QB_format targetArrSelections={props.targetArrSelections} targetArr={props.targetArr} value={Object.entries(props.targetArrSelections)[i][0]} index={i}></QB_format>);
            }
            return target;
        })()}
      </div>
      </Box>
    </div>
  );
}

function QB_SelectedSignature(props)
{
  var displayvalue_userquery = "block";
  var displayvalue_sigquery = "none";
  var displayvalue_geneinput = "none";
  var displayvalue_coordinput = "none";
  if(props.displayvalue == "Oncosplice Signature Filter")
  {
    displayvalue_sigquery = "block";
    displayvalue_geneinput = "none";
    displayvalue_coordinput = "none";
  }
  if(props.displayvalue == "Gene Symbol Filter")
  {
    displayvalue_sigquery = "none";
    displayvalue_geneinput = "block";
    displayvalue_coordinput = "none";
  }
  if(props.displayvalue == "Coordinate Filter")
  {
    displayvalue_sigquery = "none";
    displayvalue_geneinput = "none";
    displayvalue_coordinput = "block";
  }
  if(props.defaultvalue == true)
  {
    displayvalue_userquery = "none";
  }
  return(
    <div>
      <div style={{display: displayvalue_userquery}}>
      <Box>
        <div style={{display: displayvalue_sigquery, position: 'relative', minHeight: "40px", alignItems: 'left', textAlign: 'center', margin: 2}}>
          {(() => {
              const target = [];
              for(var i = 0; i < Object.entries(props.targetSigSelections).length; i++) {
                target.push(<QB_format targetArrSelections={props.targetSigSelections} targetArr={props.targetSignatures} value={Object.entries(props.targetSigSelections)[i][0]} index={i}></QB_format>);
              }
              return target;
          })()}
        </div>
        <div id="QueueBoxGeneDiv" style={{display: displayvalue_geneinput, position: 'relative', alignItems: 'left', textAlign: 'center'}}>
          <div style={{position: 'relative', minHeight: "40px", alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
                {"Selected ".concat(props.numberGenes).concat(" genes.")}
                </div>
                </Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', fontSize: 13}}>
                {"Selected ".concat(props.numberGenes).concat(" genes.")}
                </div>
                </Grid>
            </Grid>
          </div>
        </div> 
        <div id="QueueBoxCoordDiv" style={{display: displayvalue_coordinput, position: 'relative', alignItems: 'left', textAlign: 'center'}}>
            <div style={{position: 'relative', minHeight: "40px", alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', margin: 12}}>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', paddingTop: 5, paddingBottom: 5, fontSize: 19}}>
                {"Selected ".concat(props.numberCoords).concat(" Coordinates.")}
                </div>
                </Grid>
                <Grid item>
                <div style={{position: 'relative', alignItems: 'center', textAlign: 'center', backgroundColor: '#edeff2', fontSize: 13}}>
                {"Selected ".concat(props.numberCoords).concat(" coordinates.")}
                </div>
                </Grid>
            </Grid>
            </div>
        </div>        
      </Box> 
      </div> 
    </div>  
  );
}


function QB_displayEventsSigs(props)
{
  return(
    <div style={{position: 'relative', fontSize: 16, paddingTop:6, paddingBottom:5, backgroundColor: '#E8E8E8'}}>
    <Grid container spacing={1}>
    <Grid item>
    <div style={{marginLeft: 15, alignItems: 'left', textAlign: 'left'}}>
    <strong>Prospective Results: </strong>
    </div>
    </Grid>
    <Grid item>
    <div style={{marginRight: 10, alignItems: 'right', textAlign: 'right'}}>
    {props.amount["samples"].toString().concat(" samples and ").concat(props.amount["events"].toString()).concat(" events")}
    </div>
    </Grid>
    </Grid>
    </div>
  );
}

class QueueBox extends React.Component {
  constructor(props) {
    super(props)
    const BQstate = this.props.BQstate;
    this.state = {
      numChildren: 0,
      targetCancer: BQstate.queuebox_values["cancer"],
      targetArr: [],
      targetArrSelections: [],
      targetSignatures: [],
      targetSigSelections: [],
      numberGenes: 0,
      numberCoords: 0,
      defaultOn: false,
      totalMatch: 0,
      resultAmount: BQstate.resultAmount
    }
  }

  componentDidMount (){
    const BQstate = this.props.BQstate;
    //console.log("Queuebox mounted:", BQstate.keys["filter"], BQstate.queuebox_values["children"])
    if(BQstate.keys["filter"].length > 0 || BQstate.keys["single"].length > 0)
    {
    var ta1 = [];
    var ta2 = [];
    var totalkeylen = BQstate.keys["filter"].length + BQstate.keys["single"].length;
    for(var i = 0; i < BQstate.keys["filter"].length; i++)
    {
      ta1.push(BQstate.queuebox_values["children"][BQstate.keys["filter"][i]])
    }

    for(var i = 0; i < BQstate.keys["single"].length; i++)
    {
      ta2.push(BQstate.queuebox_values["signature"][BQstate.keys["single"][i]])
    }

    this.setState({
        numChildren: totalkeylen,
        targetCancer: BQstate.queuebox_values["cancer"],
        targetArr: ta1,
        targetSignatures: ta2
    });
    }
  }

  componentDidUpdate(prevProps) {
    const BQstate = this.props.BQstate;
    if(prevProps !== this.props)
    {
      //console.log("Queuebox update:", BQstate.keys["filter"], BQstate.childrenFilters)
      var ta1 = [];
      var ta2 = [];
      var arr = BQstate.queuebox_values["children"];
      var sig = BQstate.queuebox_values["signatures"];
      for(var i = 0; i < BQstate.keys["filter"].length; i++)
      {
        ta1.push(arr[BQstate.keys["filter"][i]])
      }

      for(var i = 0; i < BQstate.keys["single"].length; i++)
      {
        ta2.push(sig[BQstate.keys["single"][i]])
      }
      this.setState({
        targetCancer: BQstate.queuebox_values["cancer"],
        resultAmount: BQstate.resultAmount,
        targetArr: ta1,
        targetSignatures: ta2,
        targetArrSelections: BQstate.childrenFilters,
        targetSigSelections: BQstate.postoncosig,
        numberGenes: BQstate.clientgenes.length,
        numberCoords: BQstate.clientcoord.length
      })
    }
    //console.log("queuebox", this.state, this.props);
  }

  render (){
    const BQstate = this.props.BQstate;
    return(
      <div>
      <SpcInputLabel label={"Selected Criteria"}/>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
      <QB_SelectedCancer targetCancer={this.state.targetCancer} defaultvalue={BQstate.defaultQuery}/>
      <QB_SelectedSample targetArrSelections={this.state.targetArrSelections} targetArr={this.state.targetArr} defaultvalue={BQstate.defaultQuery}/>
      <QB_SelectedSignature 
        targetSigSelections={this.state.targetSigSelections} 
        targetSignatures={this.state.targetSignatures} 
        totalMatch={this.state.totalMatch}
        numberGenes={this.state.numberGenes}
        numberCoords={this.state.numberCoords}
        displayvalue={BQstate.filterboxSEF}
        defaultvalue={BQstate.defaultQuery}
        />
      <QB_displayEventsSigs amount={this.state.resultAmount}/>
      </Box>
      </div>
    );
  }
}

export default QueueBox;