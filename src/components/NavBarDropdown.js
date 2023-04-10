import { Nav, Dropdown, Button, ButtonToolbar, IconButton} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import React, { Fragment } from "react";
import { makeRequest } from '../request/CancerDataManagement.js';
import Grid from '@material-ui/core/Grid';
import Form from 'react-bootstrap/Form'
import "./rsuitedropdown.css";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";

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

function Header({setViewPane, setPanCancerState}){
    //Heatmap Data State
    //Make request on change
    const [cancerTypeState, setCancerTypeState] = React.useState({"cancerType": "GBM", "initialized": false});
    const [signatureState, setSignatureState] = React.useState({"signature": "psi_tcga_gbm_r1_v2_vs_others", "simpleName": "R1-V2", "oncocluster": "R1-V2", "initialized": false});
    const [sampleListState, setSampleListState] = React.useState({"samples": {}, "initialized": false});
    
    const [sampleState, setSampleState] = React.useState();
    const [coordState, setCoordState] = React.useState();
    const [geneState, setGeneState] = React.useState();

    //signatureState, setSignatureState

    const [cancerSignatureGroupState, setCancerSignatureGroupState] = React.useState({"cancerType": "GBM", "initialized": false});
    const [signatureListState, setSignatureListState] = React.useState({
    'psi_tcga_gbm_r1_v2_vs_others': 'R1-V2 (WT-IDH1)',
    'psi_tcga_gbm_r2_v16_vs_others': 'R2-V16 (Proneural_Splicing Enriched)',
    'psi_tcga_gbm_r2_v2_vs_others': 'R2-V2 (Mesenchymal)',
    'psi_tcga_gbm_r2_v22_vs_others': 'R2-V22 (Neural_Splicing Enriched)',
    'psi_tcga_gbm_r2_v27_vs_others': 'R2-V27 (Un-IDH1)',
    'psi_tcga_gbm_r2_v29_vs_others': 'R2-V29 (Good Survival)',
    'psi_tcga_gbm_r2_v3_vs_others': 'R2-V3 (Proneural)',
    'psi_tcga_gbm_r2_v4_vs_others': 'R2-V4 (G-CIMP)',
    'psi_tcga_gbm_r2_v6_vs_others': 'R2-V6 (Splicing Enriched)',
    'psi_tcga_gbm_r2_v8_vs_others': 'R2-V8 (Splicing Enriched)',
    'psi_tcga_gbm_r1_v1_vs_others': 'R1-V1',
    'psi_tcga_gbm_r2_v5_vs_others': 'R2-V5',
    'psi_tcga_gbm_r3_v1_vs_others': 'R3-V1'
    });
    const [eventTypeState, setEventTypeState] = React.useState({"eventType": "Signature", "initialized": false});

    const cancerSelectHandle = (e) => {
        setCancerTypeState({"cancerType": e, "initialized": true});
    }

    const cancerSignatureGroupSelectHandle = (e) => {
        setCancerSignatureGroupState({"cancerType": e, "initialized": true});
    }

    const onSelectEventType = (e) => {
      setEventTypeState({"eventType": e, "initialized": true});
      console.log(e);
    }

    const signatureSelectHandle = (e) => {
        console.log("signature selected: ", e);
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
        setEventTypeState({"eventType": "Coords", "initialized": true});
        setCoordState(pile_of_coords);

        /*
        args["clientCoord"] = pile_of_coords;
        args["num"] = pile_of_coords.length;
        args["cancer"] = cancer;
        args["export"] = exp;
        args["setState"] = callback;
        makeRequest("coord", args);*/
        
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
        setEventTypeState({"eventType": "Genes", "initialized": true});
        setGeneState(pile_of_uids);
        /*
        console.log(pile_of_uids.length);
        console.log(pile_of_uids);
        var args = {};
        args["clientGenes"] = pile_of_uids;
        args["num"] = pile_of_uids.length;
        args["cancer"] = cancer;
        args["export"] = exp;
        args["setState"] = callback;
        args["resamt"] = resamt;
        makeRequest("gene", args);
        console.log(e);*/
    }

    const onSelectHandle = (e) => {
        setPageTypeState({"value": e.target.value, "initialized": true});
    }

    //for selecting first signature: Object.keys(signatureListState)[0]

    React.useEffect(() => {
        if(cancerTypeState.initialized == true || signatureState.initialized == true || coordState != undefined || geneState != undefined)
        {
            console.log("coordState", coordState);
            let heatmapArgs = {};
            heatmapArgs["exportView"] = {};
            heatmapArgs["document"] = document;
            heatmapArgs["callback"] = setViewPane;
            heatmapArgs["signature"] = [signatureState.signature];
            heatmapArgs["oncocluster"] = [signatureState.oncocluster];
            heatmapArgs["eventType"] = eventTypeState.eventType;
            heatmapArgs["sample"] = sampleState;
            heatmapArgs["coords"] = coordState;
            heatmapArgs["genes"] = geneState;
            heatmapArgs["pancancerupdate"] = setPanCancerState;
            heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
            heatmapArgs["cancerType"] = cancerTypeState.cancerType;
            makeRequest("updateHeatmapData", heatmapArgs);

            let sampleArgs = {};
            sampleArgs["cancerType"] = cancerTypeState.cancerType;
            sampleArgs["signature"] = signatureState.signature;
            sampleArgs["exportView"] = {};
            sampleArgs["callback"] = setSampleListState;
            sampleArgs["pancancerupdate"] = setPanCancerState;
            makeRequest("uiFields", sampleArgs);
        }
      }, [cancerTypeState, signatureState, sampleState, coordState, geneState])

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
      }, [cancerSignatureGroupState])

    var signatureTextDisplayColor = "blue";
    var geneTextDisplayColor = "blue";
    var coordTextDisplayColor = "blue";

    if(eventTypeState.eventType == "Signature")
    {
      signatureTextDisplayColor = "blue";
      geneTextDisplayColor = "grey";
      coordTextDisplayColor = "grey";
    }
    if(eventTypeState.eventType == "Coords")
    {
      coordTextDisplayColor = "blue";
      geneTextDisplayColor = "grey";
      coordTextDisplayColor = "grey";
    }
    if(eventTypeState.eventType == "Genes")
    {
      geneTextDisplayColor = "blue";
      signatureTextDisplayColor = "grey";
      coordTextDisplayColor = "grey";
    }
    return(
      <div>
        <Grid container spacing={1}>
        <Grid item>
        <Dropdown
                title="Cancer Type"
                onSelect={cancerSelectHandle}
                renderTitle={(children)=>{
                  return <Button appearance="primary">{children} </Button>
                }}
                activeKey={cancerTypeState.cancerType}
                placement="bottomStart"
                trigger = "hover">
                <Dropdown.Item eventKey="LGG">
                Low-Grade Glioma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="LUAD">
                Lung Adenocarcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="BRCA">
                Breast Invasive Carcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="BLCA">
                Bladder Cancer (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="GBM">
                Glioblastoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="HNSCC">
                Head and Neck Squamous Cell Carcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="SKCM">
                Skin Cutaneous Melanoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="COAD">
                Colon Adenocarcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="AML_Leucegene">
                Acute Myeloid Leukemia (Leucgene)
                </Dropdown.Item>
                
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue"}}><strong>{cancerTypeState.cancerType}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown    
                title="Sample Filter"
                activeKey="GBM"
                onSelect={selectSampleHandle}
                placement="bottomStart"
                trigger = "hover">
                <span style={{overflowY: "scroll", height: "300px"}}>
                {(() => {
                    //console.log("good", Object.entries(sampleListState));
                    const dropdownItems = [];         
                    for (const [key, value] of Object.entries(sampleListState))
                    {
                        let newDropdownItems = [];
                        for(let i = 0; i < value.length; i++)
                        {
                            newDropdownItems.push(<Dropdown.Item eventKey={[key, value[i]]}>{value[i]}</Dropdown.Item>)
                        }
                        dropdownItems.push(<Dropdown.Menu
                                            title={key}
                                            onSelect={selectSampleHandle}
                                            activeKey="GBM"
                                            placement="rightStart"
                                            trigger = "hover"><div style={{overflowY: "scroll", height: "200px"}}>{newDropdownItems}</div>
                                            </Dropdown.Menu>)
                    }
                    return dropdownItems;
                })()}
                </span>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue"}}><strong>{sampleState != undefined && (sampleState.value)}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown
                title="Event Type"
                onSelect={onSelectEventType}
                activeKey="Signature"
                placement="bottomStart"
                trigger = "hover">
                <Dropdown.Item eventKey="Signature">
                Signature
                </Dropdown.Item>
                <Dropdown.Item eventKey="Genes">
                Genes
                </Dropdown.Item>
                <Dropdown.Item eventKey="Coordinates">
                Coordinates
                </Dropdown.Item>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue"}}><strong>{eventTypeState.eventType}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown
                title="Cancer Signature Selection"
                onSelect={cancerSignatureGroupSelectHandle}
                activeKey={cancerSignatureGroupState.cancerType}
                placement="bottomStart"
                trigger = "hover">
                <div style={{overflowY: "scroll"}}>
                <Dropdown.Item eventKey="LGG">
                Low-Grade Glioma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="LUAD">
                Lung Adenocarcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="BRCA">
                Breast Invasive Carcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="BLCA">
                Bladder Cancer (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="GBM">
                Glioblastoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="HNSCC">
                Head and Neck Squamous Cell Carcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="SKCM">
                Skin Cutaneous Melanoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="COAD">
                Colon Adenocarcinoma (TCGA)
                </Dropdown.Item>
                <Dropdown.Item eventKey="AML_Leucegene">
                Acute Myeloid Leukemia (Leucgene)
                </Dropdown.Item>
                </div>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: "blue"}}><strong>{cancerSignatureGroupState.cancerType}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown
                title="Signature Name"
                onSelect={signatureSelectHandle}
                activeKey={signatureState.signature}
                placement="bottomStart"
                trigger = "hover"
                >
                <div style={{height: "300px", overflowY: "scroll"}}>
                {(() => {
                    //console.log("good", Object.entries(signatureListState));
                    const dropdownItems = [];         
                    for (const [key, value] of Object.entries(signatureListState))
                    {
                        dropdownItems.push(<Dropdown.Item eventKey={[key, value]}>{value}</Dropdown.Item>)
                    }
                    return dropdownItems;
                })()}
                </div>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: signatureTextDisplayColor}}><strong>{signatureState.simpleName}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown
                title="Enter Coordinates"
                activeKey={"none"}
                placement="bottomStart"
                trigger = "hover">
                <textarea id="clientinputcoord" onChange={onChangeCoord} placeholder="Enter coordinates here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: geneTextDisplayColor}}><strong>{coordState != undefined && (coordState[0])}</strong></div>
        </Grid>
        <Grid item>
        <Dropdown
                title="Enter Genes"
                activeKey={"none"}
                placement="bottomStart"
                trigger = "hover">
                <textarea id="clientinputgene" onChange={onChangeGene} placeholder="Enter gene symbols here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
        </Dropdown>
        <br/>
        <div style={{textAlign: "center", color: coordTextDisplayColor}}><strong>{geneState != undefined && (geneState[0])}</strong></div>
        </Grid>
        </Grid>
      </div>);
    
}

export default Header;