import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

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

  const [state, setState] = React.useState({
    target_length: Object.entries(props.targetSigSelections).length
  });
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

  var number_e = props.resamt["events"];
  var g_message = "No matches found!";
  if(number_e > 0 && parseInt(props.numberGenes) > 0)
  {
    g_message = "Matches found in database!";
  }

  var target = [];
  for(var i = 0; i < Object.entries(props.targetSigSelections).length; i++) {
    target.push(<QB_format targetArrSelections={props.targetSigSelections} targetArr={props.targetSignatures} value={Object.entries(props.targetSigSelections)[i][0]} index={i}></QB_format>);
  }
  
  React.useEffect(() => {
    target = [];
    for(var i = 0; i < Object.entries(props.targetSigSelections).length; i++) {
      target.push(<QB_format targetArrSelections={props.targetSigSelections} targetArr={props.targetSignatures} value={Object.entries(props.targetSigSelections)[i][0]} index={i}></QB_format>);
    }
    setState({
        target_length: Object.entries(props.targetSigSelections).length
    });
  }, [props.targetSigSelections])


  return(
    <div>
      <div style={{display: displayvalue_userquery}}>
      <Box>
        <div style={{display: displayvalue_sigquery, position: 'relative', minHeight: "40px", alignItems: 'left', textAlign: 'center', margin: 2}}>
          {target}
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
                {g_message}
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
    <Tooltip title="This section describes the matches found for your current filter/signature selections in the database. Samples denote columns, while events denote rows.
     In order to run a query, your number of prospective samples and events must be above zero.">
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
    </Tooltip>
  );
}

class QueueBox extends React.Component {
  constructor(props) {
    super(props)
    const BQstate = this.props.BQstate;
    this.state = {
      BQstate: BQstate,
      targetFilters: [],
      targetSignatures: []
    }
  }


  componentDidMount (){
    const BQstate = this.props.BQstate;
    //console.log("Queuebox mounted:", BQstate.keys["filter"], BQstate.queuebox_values["children"])
    var ta1 = [];
    var ta2 = [];
    for(var i = 0; i < BQstate.keys["filter"].length; i++)
    {
      ta1.push(BQstate.queuebox_values["children"][BQstate.keys["filter"][i]])
    }

    for(var i = 0; i < BQstate.keys["single"].length; i++)
    {
      ta2.push(BQstate.queuebox_values["signature"][BQstate.keys["single"][i]])
    }

    this.setState({
        BQstate: BQstate,
        targetFilters: ta1,
        targetSignatures: ta2
    });
  }

  componentDidUpdate(prevProps) {
    const BQstate = this.props.BQstate;
    if(prevProps !== this.props)
    {
      var ta1 = [];
      var ta2 = [];
      var qfilters = BQstate.queuebox_values["children"];
      var qsigs = BQstate.queuebox_values["signatures"];
      var kfilters = BQstate.keys["filter"];
      var ksigs = BQstate.keys["single"];
      console.log("Queuebox updated", BQstate);
      for(var i = 0; i < kfilters.length; i++)
      {
        ta1.push(qfilters[kfilters[i]]);
      }

      for(var i = 0; i < ksigs.length; i++)
      {
        ta2.push(qsigs[ksigs[i]]);
      }

      this.setState({
        BQstate: BQstate,
        targetFilters: ta1,
        targetSignatures: ta2
      })

    }
  }

  render (){
    const S = this.state;

    return(
      <div>
      <Tooltip title="This section displays the current queries you have selected.">
      <SpcInputLabel label={"Selected Criteria"}/>
      </Tooltip>
      <Box borderColor="#dbdbdb" {...boxProps} style={{position: 'relative', alignItems: 'center', textAlign: 'center'}}>
      <QB_SelectedCancer targetCancer={S.BQstate.queuebox_values["cancer"]} defaultvalue={S.BQstate.defaultQuery}/>
      <QB_SelectedSample targetArrSelections={S.BQstate.listOfSelectedFilters} targetArr={S.targetFilters} defaultvalue={S.BQstate.defaultQuery}/>
      <QB_SelectedSignature 
        targetSigSelections={S.BQstate.listOfSelectedSignatures} 
        targetSignatures={S.targetSignatures}
        numberGenes={S.BQstate.clientgenes.length}
        numberCoords={S.BQstate.clientcoord.length}
        displayvalue={S.BQstate.filterboxSEF}
        defaultvalue={S.BQstate.defaultQuery}
        resamt={S.BQstate.resultamount}
        />
      <QB_displayEventsSigs amount={S.BQstate.resultamount}/>
      </Box>
      </div>
    );
  }
}

export default QueueBox;