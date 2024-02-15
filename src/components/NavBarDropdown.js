import { Nav, Dropdown, Button, ButtonToolbar, IconButton} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { makeRequest } from '../request/CancerDataManagement.js';
import Grid from '@material-ui/core/Grid';
import Form from 'react-bootstrap/Form'
import "./rsuitedropdown.css";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useRef } from "react";
import { Typography } from "@material-ui/core";
import jsonGBM from "../gbmBasic.js";
import jsonBLCA from "../BLCAbasic.js";
import jsonBLCAsignature from "../BLCAsignature.js";

const StyledDropdown = withStyles({
  root: {
    fontSize: "0.5em"
  }
})(Dropdown);

const StyledDropdownItem = withStyles({
  root: {
    fontSize: "0.5em"
  }
})(Dropdown.Item);

const instance = (
  <ButtonToolbar>

   <Dropdown title="More..." >
       <Dropdown.Item >Edit</Dropdown.Item>
       <Dropdown.Item >View</Dropdown.Item>
       <Dropdown.Item >Delete</Dropdown.Item>
   </Dropdown>

   <Dropdown
     title="New"
     renderTitle={(children)=>{
       return <Button appearance="primary">{children} </Button>
     }}
     >
       <Dropdown.Item >New User</Dropdown.Item>
       <Dropdown.Item >New Group</Dropdown.Item>
   </Dropdown>

 </ButtonToolbar>
);

function HayDropdownParent(props){
  return(
  <Dropdown    
  title={props.title}
  activeKey={props.activeKey}
  onSelect={props.onSelect}
  placement="bottomStart"
  size="xs"
  trigger="hover">
  {props.children}
  </Dropdown>
  );
}

function HayDropdown(props){
  return(
  <Dropdown.Item eventKey={props.eventKey} style={{fontSize: 12, margin: 1, padding: 1}}>
  {props.displayName}
  </Dropdown.Item>
  );
}

function Header({setViewPane, setPanCancerState}){
    //Heatmap Data State
    //Make request on change
    const [cancerTypeState, setCancerTypeState] = React.useState({"cancerType": "BLCA", "initialized": false});
    const [sampleState, setSampleState] = React.useState();
    const [sampleListState, setSampleListState] = React.useState(jsonBLCA);
    const [sampleOptions, setSampleOptions] = React.useState({"key": undefined, "options": []});
    
    const [signatureState, setSignatureState] = React.useState({"signature": "psi_r1_v7_vs_others", "simpleName": "R1-V7", "oncocluster": "R1-V7", "initialized": false});
    const [coordState, setCoordState] = React.useState();
    const [geneState, setGeneState] = React.useState();
    const [pageTypeState, setPageTypeState] = React.useState({"value": "Individual Signatures", "initialized": false})

    //signatureState, setSignatureState

    const [cancerSignatureGroupState, setCancerSignatureGroupState] = React.useState({"cancerType": "BLCA", "initialized": false});
    const [signatureListState, setSignatureListState] = React.useState(jsonBLCAsignature);
    const [eventFontState, setEventFontState] = React.useState({"sigFontColor": "blue","coordFontColor": "grey","geneFontColor": "grey"})

    const cancerSelectHandle = (e) => {
        setCancerTypeState({"cancerType": e, "initialized": true});
    }

    const cancerSignatureGroupSelectHandle = (e) => {
        setCancerSignatureGroupState({"cancerType": e, "initialized": true});
    }

    const signatureSelectHandle = (e) => {
        //console.log("signature selected: ", e);
        var selectedOncocluster = e[1];
        if(selectedOncocluster != undefined)
        {
          if(selectedOncocluster.indexOf(" (") != -1)
          {
            selectedOncocluster = selectedOncocluster.split(" (")[0];
          }
        }
        else
        {
          selectedOncocluster = "R1-V2";
        }
        let simpleName = e[1];
        if(e[1] == undefined)
        {
          simpleName = e[0];
        }
        setSignatureState({"signature": e[0], "simpleName": e[1], "oncocluster": selectedOncocluster, "initialized": true});
    }

    const sampleMenuPopulate = (e) => {
      var listOfValues = sampleListState[e];
      setSampleOptions({"key": e, "options": listOfValues});
      setSampleState({"key": undefined, "value": undefined})
    }

    const selectSampleHandle = (e) => {
        //console.log("sample selected", e);
        setSampleState({"key": e[0], "value": e[1]});
    }

    const onChangeCoord = (e) => {
        var all_coords = document.getElementById("clientinputcoord").value;
        var delimiter = "\n";
        if(all_coords.indexOf("\n") != -1 && all_coords.indexOf(",") == -1)
        {
          delimiter = "\n";
        }
        if(all_coords.indexOf("\n") == -1 && all_coords.indexOf(",") != -1)
        {
          delimiter = ",";
        }
        if(all_coords.indexOf("\n") != -1 && all_coords.indexOf(",") != -1)
        {
          if(all_coords.split(",").length > all_coords.split("\n").length)
          {
            delimiter = ",";
            all_coords = all_coords.replace("\n", "");
          }
          else
          {
            delimiter = "\n";
          }
        }
      
        all_coords = all_coords.split(delimiter);
        var pile_of_coords = [];
      
        for(var i=0; i<all_coords.length; i++)
        {
          if(all_coords[i] != "")
          {
            pile_of_coords.push(all_coords[i]);
          }
        }
        var args = {};
        setCoordState(pile_of_coords);
    }

    const onChangeGene = (e) => {
        var all_uids = document.getElementById("clientinputgene").value;
        var delimiter = "\n";
        if(all_uids.indexOf("\n") != -1 && all_uids.indexOf(",") == -1)
        {
          delimiter = "\n";
        }
        if(all_uids.indexOf("\n") == -1 && all_uids.indexOf(",") != -1)
        {
          delimiter = ",";
        }
        if(all_uids.indexOf("\n") != -1 && all_uids.indexOf(",") != -1)
        {
          if(all_uids.split(",").length > all_uids.split("\n").length)
          {
            delimiter = ",";
            all_uids = all_uids.replace("\n", "");
          }
          else
          {
            delimiter = "\n";
          }
        }
      
        all_uids = all_uids.split(delimiter);
      
        var pile_of_uids = [];
      
        for(var i=0; i<all_uids.length; i++)
        {
          if(all_uids[i] != "")
          {
            pile_of_uids.push(all_uids[i]);
          }
        }
        setGeneState(pile_of_uids);
    }

    const onSelectHandle = (e) => {
        setPageTypeState({"value": e.target.value, "initialized": true});
    }
    //for selecting first signature: Object.keys(signatureListState)[0]

    //console.log("jsonGBM", jsonGBM);
    const prevCancerSignatureGroupState = useRef();
    const prevSignatureState = useRef();
    const prevCoordState = useRef();
    const prevGeneState = useRef();
    const prevCancerTypeState = useRef();
    const prevSampleState = useRef();

    React.useEffect(() => {
        if(cancerTypeState.initialized == true || signatureState.initialized == true || coordState != undefined || geneState != undefined)
        {
            let heatmapArgs = {};
            heatmapArgs["document"] = document;
            heatmapArgs["callback"] = setViewPane;
            heatmapArgs["pancancerupdate"] = setPanCancerState;
            let sampleArgs = {};
            heatmapArgs["exportView"] = {};
            if(prevSignatureState.current.signature != signatureState.signature)
            {
              setEventFontState({
                "sigFontColor": "blue",
                "coordFontColor": "grey",
                "geneFontColor": "grey"
              })
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Signature";
              heatmapArgs["sample"] = sampleState;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);
              //setEventTypeState({"eventType": "Coords", "initialized": true})
            }
            else if(prevCoordState.current != coordState)
            {
              setEventFontState({
                "sigFontColor": "grey",
                "coordFontColor": "blue",
                "geneFontColor": "grey"
              })
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Coordinates";
              heatmapArgs["sample"] = sampleState;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);
              //setEventTypeState({"eventType": "Coords", "initialized": true})
            }
            else if(prevGeneState.current != geneState)
            {
              setEventFontState({
                "sigFontColor": "grey",
                "coordFontColor": "grey",
                "geneFontColor": "blue"
              })
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Genes";
              heatmapArgs["sample"] = sampleState;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);
              //setEventTypeState({"eventType": "Coords", "initialized": true})
            }
            else if(prevCancerTypeState.current != prevCancerTypeState)
            {
              document.getElementById("coordTextInfo").style.color = "grey";
              document.getElementById("geneTextInfo").style.color = "grey";
              document.getElementById("sigTextInfo").style.color = "blue";
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Signature";
              heatmapArgs["sample"] = undefined;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);
              setSampleOptions({"key": undefined, "options": []});
              setSampleState();
            }
            else
            {
              document.getElementById("coordTextInfo").style.color = "grey";
              document.getElementById("geneTextInfo").style.color = "grey";
              document.getElementById("sigTextInfo").style.color = "blue";
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Signature";
              heatmapArgs["sample"] = sampleState;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);              
            }

            sampleArgs["cancerType"] = cancerTypeState.cancerType;
            sampleArgs["signature"] = signatureState.signature;
            sampleArgs["exportView"] = {};
            sampleArgs["callback"] = setSampleListState;
            sampleArgs["pancancerupdate"] = setPanCancerState;
            makeRequest("uiFields", sampleArgs);

        }

        prevCancerTypeState.current = cancerTypeState;
        prevSignatureState.current = signatureState;
        prevCoordState.current = coordState;
        prevGeneState.current = geneState;
        
      }, [cancerTypeState, signatureState, coordState, geneState])

    React.useEffect(() => {
        if(sampleState != undefined)
        {
            if(sampleState != prevSampleState.current && sampleState.key != undefined && sampleState.value != undefined)
            {
              let heatmapArgs = {};
              let sampleArgs = {};
              heatmapArgs["document"] = document;
              heatmapArgs["callback"] = setViewPane;
              heatmapArgs["exportView"] = {};
              heatmapArgs["signature"] = [signatureState.signature];
              heatmapArgs["oncocluster"] = [signatureState.oncocluster];
              heatmapArgs["eventType"] = "Signature";
              heatmapArgs["sample"] = sampleState;
              heatmapArgs["coords"] = coordState;
              heatmapArgs["genes"] = geneState;
              heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
              heatmapArgs["cancerType"] = cancerTypeState.cancerType;
              makeRequest("updateHeatmapData", heatmapArgs);

              sampleArgs["cancerType"] = cancerTypeState.cancerType;
              sampleArgs["signature"] = signatureState.signature;
              sampleArgs["exportView"] = {};
              sampleArgs["callback"] = setSampleListState;
              sampleArgs["pancancerupdate"] = setPanCancerState;
              makeRequest("uiFields", sampleArgs);
            }
        }
        prevSampleState.current = sampleState;
      }, [sampleState])

    React.useEffect(() => {
        if(cancerSignatureGroupState.initialized == true)
        {
            let args = {};
            args["exportView"] = {};
            args["document"] = document;
            //args["updateHeatmapArgs"] = {"callback": setViewPane, "document": document, "exportView": {}, "signature": signatureState.signature, "comparedCancer": cancerSignatureGroupState.cancerType, "cancerType": cancerTypeState.cancerType, "sample": sampleState};
            args["callbackOne"] = setSignatureListState;
            args["callbackTwo"] = setSignatureState;
            args["cancerType"] = cancerSignatureGroupState.cancerType;
            makeRequest("updateSignature", args);
        }
        prevCancerSignatureGroupState.current = cancerSignatureGroupState;
      }, [cancerSignatureGroupState])

    return(
      <div id="dropdownOptionsDiv" style={{width: "120%"}}>
        <Grid container spacing={1}>
        <Grid id="gridItem1" item>
        <Dropdown title="Cancer Type" 
        onSelect={cancerSelectHandle} 
        activeKey={cancerTypeState.cancerType}
        placement="bottomStart"
        size="xs"
        trigger = "hover">
                <HayDropdown eventKey="BLCA" displayName="Bladder Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PCPG" displayName="Pheochromocytoma and paraganglioma (TCGA)"></HayDropdown>        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue", fontSize: 12}}><strong>{cancerTypeState.cancerType}</strong></div>
        </Grid>
        <Grid id="gridItem2" item>
        <Dropdown title="Sample Filter" 
        activeKey="BLCA" 
        onSelect={sampleMenuPopulate}
        placement="bottomStart"
        size="xs"
        trigger = "hover">
                <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                {(() => {
                    //console.log("good", Object.entries(sampleListState));
                    const dropdownItems = [];         
                    for (const [key, value] of Object.entries(sampleListState))
                    {
                        dropdownItems.push(<HayDropdown eventKey={key} displayName={key}></HayDropdown>)
                    }
                    return dropdownItems;
                })()}
                </div>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue", fontSize: 12}}><strong>{sampleOptions.key != undefined && (sampleOptions.key)}</strong></div>
        </Grid>
        <Grid id="gridItem3" item>
        <Dropdown title={"Sample Selection"}
        activeKey="BLCA"
        onSelect={selectSampleHandle}
        placement="bottomStart"
        size="xs"
        trigger = "hover">                
                {(() => {
                    console.log("good", Object.entries(signatureListState));
                    const dropdownItems = [];
                    for(var i = 0; i < sampleOptions.options.length; i++)
                    {
                        dropdownItems.push(<HayDropdown eventKey={[sampleOptions.key, sampleOptions.options[i]]} displayName={sampleOptions.options[i]}></HayDropdown>)
                    }
                    return dropdownItems;
                })()}
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue", fontSize: 12}}><strong>{sampleState != undefined && (sampleState.value)}</strong></div>
        </Grid>
        <Grid id="gridItem4" item>
        <Dropdown title="Cancer Signature Selection"
                onSelect={cancerSignatureGroupSelectHandle}
                activeKey={cancerSignatureGroupState.cancerType}
                placement="bottomStart"
                size="xs"
                trigger = "hover">
                <HayDropdown eventKey="BLCA" displayName="Bladder Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PCPG" displayName="Pheochromocytoma and paraganglioma (TCGA)"></HayDropdown>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue", fontSize: 12}}><strong>{cancerSignatureGroupState.cancerType}</strong></div>
        </Grid>
        <Grid id="gridItem5" item>
        <Dropdown
                title="Signature Name"
                onSelect={signatureSelectHandle}
                activeKey={signatureState.signature}
                placement="bottomStart"
                size="xs"
                trigger = "hover">
                <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                {(() => {
                    //console.log("good", Object.entries(signatureListState));
                    const dropdownItems = [];         
                    for (const [key, value] of Object.entries(signatureListState))
                    {
                        dropdownItems.push(<HayDropdown eventKey={[key, value]} displayName={value}></HayDropdown>)
                    }
                    return dropdownItems;
                })()}
                </div>
        </Dropdown>
        <br/>
        <div id="sigTextInfo" style={{textAlign: "center", color: eventFontState.sigFontColor, fontSize: 12}}><strong>{signatureState.simpleName}</strong></div>
        </Grid>
        <Grid id="gridItem6" item>
        <Dropdown
                title="Enter Coordinates"
                activeKey={"none"}
                placement="bottomStart"
                size="xs"
                trigger = "hover">
                <textarea id="clientinputcoord" onChange={onChangeCoord} placeholder="Enter coordinates here" style={{minWidth: 100, fontSize: 12, minHeight: 60}}/>
        </Dropdown>
        <br/>
        <div id="geneTextInfo" style={{textAlign: "center", color: eventFontState.coordFontColor, fontSize: 12}}><strong>{coordState != undefined && (coordState[0])}</strong></div>
        </Grid>
        <Grid id="gridItem7" item>
        <Dropdown
                title="Enter Genes"
                activeKey={"none"}
                placement="bottomStart"
                size="xs"
                trigger = "hover">
                <textarea id="clientinputgene" onChange={onChangeGene} placeholder="Enter gene symbols" style={{minWidth: 50, fontSize: 12, minHeight: 60}}/>
        </Dropdown>
        <br/>
        <div id="coordTextInfo" style={{textAlign: "center", color: eventFontState.geneFontColor, fontSize: 12}}><strong>{geneState != undefined && (geneState[0])}</strong></div>
        </Grid>
        </Grid>
      </div>);
    
}

export default Header;