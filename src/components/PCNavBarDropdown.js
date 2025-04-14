import { Nav, Dropdown, Button, ButtonToolbar, IconButton} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { makeRequest } from '../request/CancerDataManagement.js';
import Grid from '@material-ui/core/Grid';
import Form from 'react-bootstrap/Form'
import "./rsuitedropdown.css";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useRef } from "react";
import { Typography } from "@material-ui/core";

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

function Header({setPanCancerState, startingCancer, startingSignaureList, startingSampleList, startingSignature, startingSimple}){
    //Heatmap Data State
    //Make request on change
    const [cancerTypeState, setCancerTypeState] = React.useState({"cancerType": startingCancer, "initialized": false});
    const [sampleState, setSampleState] = React.useState();
    const [sampleListState, setSampleListState] = React.useState(startingSampleList);
    const [sampleOptions, setSampleOptions] = React.useState({"key": undefined, "options": []});

    const [signatureState, setSignatureState] = React.useState({"signature": startingSignature, "simpleName": startingSimple, "oncocluster": startingSimple, "initialized": false});
    const [coordState, setCoordState] = React.useState();
    const [geneState, setGeneState] = React.useState();
    const [pageTypeState, setPageTypeState] = React.useState({"value": "Individual Signatures", "initialized": false})

    //signatureState, setSignatureState

    const [cancerSignatureGroupState, setCancerSignatureGroupState] = React.useState({"cancerType": startingCancer, "initialized": false});
    const [signatureListState, setSignatureListState] = React.useState(startingSignaureList);
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
    const prevCancerTypeState = useRef();

    //console.log("starting sample list", startingSampleList);
    //console.log("starting sample list 2", Object.keys(sampleListState)[0], Object.keys(startingSampleList)[0]);

    React.useEffect(() => {
        if(cancerTypeState.initialized == true)
        {
            let sampleArgs = {};
            heatmapArgs["exportView"] = {};

            sampleArgs["cancerType"] = cancerTypeState.cancerType;
            sampleArgs["signature"] = signatureState.signature;
            sampleArgs["exportView"] = {};
            sampleArgs["callback"] = setSampleListState;
            sampleArgs["pancancerupdate"] = setPanCancerState;
            makeRequest("uiFields", sampleArgs);

        }

        prevCancerTypeState.current = cancerTypeState;

      }, [cancerTypeState])

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
                <HayDropdown eventKey="BRCA" displayName="Breast Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="CESC" displayName="Cervical Squamous Cell Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="COAD" displayName="Colon Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="ESCA" displayName="Esophageal Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="GBM" displayName="Glioblastoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="HNSC" displayName="Head and Neck Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="KICH" displayName="Kidney Chromophobe (TCGA)"></HayDropdown>
                <HayDropdown eventKey="KIRC" displayName="Kidney Renal Clear Cell Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LGG" displayName="Low-Grade Gliomas (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LIHC" displayName="Liver Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LUAD" displayName="Lung Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="OV" displayName="Ovarian Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PAAD" displayName="Pancreatic Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PCPG" displayName="Pheochromocytoma and paraganglioma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PRAD" displayName="Primary Prostate Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="READ" displayName="Rectal Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="SARC" displayName="Bone and Connective Tissue Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="SKCM" displayName="Skin Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="STAD" displayName="Stomach Adenocarcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="TGCT" displayName="Tenosynovial Giant Cell Tumors (TCGA)"></HayDropdown>
                <HayDropdown eventKey="THCA" displayName="Thyroid Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="UCEC" displayName="Uterine Serous Cancer (TCGA)"></HayDropdown>
        </Dropdown>
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
                    //console.log("good", Object.entries(signatureListState));
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
                <HayDropdown eventKey="BRCA" displayName="Breast Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="CESC" displayName="Cervical Squamous Cell Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="COAD" displayName="Colon Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="ESCA" displayName="Esophageal Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="GBM" displayName="Glioblastoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="HNSC" displayName="Head and Neck Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="KICH" displayName="Kidney Chromophobe (TCGA)"></HayDropdown>
                <HayDropdown eventKey="KIRC" displayName="Kidney Renal Clear Cell Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LGG" displayName="Low-Grade Gliomas (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LIHC" displayName="Liver Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="LUAD" displayName="Lung Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="OV" displayName="Ovarian Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PAAD" displayName="Pancreatic Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PCPG" displayName="Pheochromocytoma and paraganglioma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="PRAD" displayName="Primary Prostate Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="READ" displayName="Rectal Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="SARC" displayName="Bone and Connective Tissue Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="SKCM" displayName="Skin Cancer (TCGA)"></HayDropdown>
                <HayDropdown eventKey="STAD" displayName="Stomach Adenocarcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="TGCT" displayName="Tenosynovial Giant Cell Tumors (TCGA)"></HayDropdown>
                <HayDropdown eventKey="THCA" displayName="Thyroid Carcinoma (TCGA)"></HayDropdown>
                <HayDropdown eventKey="UCEC" displayName="Uterine Serous Cancer (TCGA)"></HayDropdown>
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
