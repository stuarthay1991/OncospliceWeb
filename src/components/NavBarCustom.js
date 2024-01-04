import { Nav, Dropdown, Button, ButtonToolbar, IconButton} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import React, { Fragment } from "react";
import { makeRequest } from '../request/CancerDataManagement.js';
import Grid from '@material-ui/core/Grid';
import Form from 'react-bootstrap/Form'
import "./dropdown.css";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';

import {DropdownButton, DropdownList, DropdownItem, DropdownParent} from './HayDropdown.js';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";

function Header({setViewPane}){

    const GenericItem = withStyles({
      root: {
        fontSize: "0.6em"
      }
    })(MenuItem);

    //Heatmap Data State
    //Make request on change
    const [cancerTypeState, setCancerTypeState] = React.useState({"cancerType": "GBM", "initialized": false});
    const [signatureState, setSignatureState] = React.useState({"signature": "psi_tcga_gbm_r1_v2_vs_others", "simpleName": "R1-V2", "oncocluster": "R1-V2", "initialized": false});
    const [sampleListState, setSampleListState] = React.useState({
      "gene_expression_subtype": [
          "Mesenchymal",
          "NA",
          "Proneural",
          "G-CIMP",
          "Neural",
          "Classical"
      ],
      "survival_status": [
          "DECEASED",
          "LIVING",
          "NA"
      ],
      "overall_survival__months_": [
          "0-42",
          "42-85.6",
          "85.6-127.6"
      ],
      "diagnosis_age": [
          "10.9-35.9",
          "35.9-64.3",
          "64.3-89.3"
      ],
      "disease_free__months_": [
          "0-42",
          "42-85.6",
          "85.6-127.6"
      ],
      "disease_free_status": [
          "Recurred",
          "DiseaseFree",
          "NA",
          "Recurred/Progressed"
      ],
      "sex": [
          "MALE",
          "FEMALE",
          "NA"
      ],
      "therapy_class": [
          "Standard Radiation",
          "Unspecified Therapy",
          "Unspecified Radiation, TMZ Chemo",
          "Unspecified Radiation",
          "TMZ Chemoradiation, TMZ Chemo",
          "Alkylating Chemoradiation, TMZ Chemo",
          "TMZ Chemo",
          "Nonstandard Radiation",
          "Unspecified Radiation, Alkylating Chemo",
          "Alkylating Chemoradiation, Alkylating Chemo",
          "Standard Radiation, TMZ Chemo",
          "NA",
          "Nonstandard Radiation, Alkylating Chemo",
          "Nonstandard Radiation, TMZ Chemo",
          "Alkylating Chemo",
          "Standard Radiation, Alkylating Chemo"
      ],
      "g_cimp_methylation": [
          "G-CIMP",
          "non-G-CIMP",
          "NA"
      ],
      "idh1_status": [
          "R132G",
          "NA",
          "WT",
          "R132C",
          "R132H"
      ],
      "mgmt_status": [
          "UNMETHYLATED",
          "METHYLATED",
          "NA"
      ]
    });
    const [pageTypeState, setPageTypeState] = React.useState({"value": "Individual Signatures", "initialized": false})
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

    const dropdownBtn = document.getElementById("btn");
    const toggleArrow = document.getElementById("arrow");
    
    /*const toggleDropdown = () => {
      document.getElementById("dropdown").classList.toggle("show");
      if(document.getElementById("exmoreicon").style.display == "block")
      {
        document.getElementById("exlessicon").style.display = "block";
        document.getElementById("exmoreicon").style.display = "none";
      }
      else
      {
        document.getElementById("exlessicon").style.display = "none";
        document.getElementById("exmoreicon").style.display = "block";        
      }
      //toggleArrow.classList.toggle("arrow");
    };*/
    
    /*const dropdownBtnClick = (e) => {
      //e.stopPropagation();
      toggleDropdown();
    }*/
    
    /*document.documentElement.addEventListener("click", function () {
      if (dropdownMenu.classList.contains("show")) {
        toggleDropdown();
      }
    });*/

    const cancerSelectHandle = (event) => {
        //console.log(event.target.attributes.value.nodeValue, event);
        setCancerTypeState({"cancerType": event.target.attributes.value.nodeValue, "initialized": true});
        document.getElementById("div_Cancer Type_id").classList.toggle("show");
        document.getElementById("exmoreicon_Cancer Type_id").style.display = "block";
        document.getElementById("exlessicon_Cancer Type_id").style.display = "none";
    }

    const cancerSignatureGroupSelectHandle = (e) => {
        setCancerSignatureGroupState({"cancerType": e.target.attributes.value.nodeValue, "initialized": true});
        document.getElementById("div_Cancer Signature Selection_id").classList.toggle("show");
        document.getElementById("exmoreicon_Cancer Signature Selection_id").style.display = "block";
        document.getElementById("exlessicon_Cancer Signature Selection_id").style.display = "none";
    }

    const signatureSelectHandle = (e) => {
        console.log("signature selected: ", e);
        console.log("deeper selected: ", e.target.attributes.value);
        document.getElementById("div_Cancer Signature Filter_id").classList.toggle("show");
        document.getElementById("exmoreicon_Cancer Signature Filter_id").style.display = "block";
        document.getElementById("exlessicon_Cancer Signature Filter_id").style.display = "none";
        var newEvent = e.target.attributes.value.nodeValue.split(",");
        var simpleName = newEvent[1];
        var literatureName = newEvent[0];
        console.log("both: ", simpleName, literatureName);
        var selectedOncocluster = simpleName;
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
        if(simpleName == undefined)
        {
          simpleName = literatureName;
        }
        setSignatureState({"signature": literatureName, "simpleName": simpleName, "oncocluster": selectedOncocluster, "initialized": true});
    }

    const selectSampleHandle = (e) => {
        //console.log("sample selected", e);
        var newEvent = e.target.attributes.value.nodeValue.split(",");
        var valName = newEvent[1];
        var keyName = newEvent[0];
        document.getElementById("div_".concat(keyName).concat("_id")).classList.toggle("show");
        document.getElementById("exmoreicon_".concat(keyName).concat("_id")).style.display = "block";
        document.getElementById("exlessicon_".concat(keyName).concat("_id")).style.display = "none";
        console.log("both: ", keyName, valName);
        setSampleState({"key": keyName, "value": valName});
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

    const onSelectEventType = (e) => {
      document.getElementById("div_Event Type_id").classList.toggle("show");
      document.getElementById("exmoreicon_Event Type_id").style.display = "block";
      document.getElementById("exlessicon_Event Type_id").style.display = "none";
      setEventTypeState({"eventType": e.target.attributes.value.nodeValue, "initialized": true});
      console.log(e);
    }

    //for selecting first signature: Object.keys(signatureListState)[0]

    React.useEffect(() => {
        if(cancerTypeState.initialized == true || signatureState.initialized == true || coordState != undefined || geneState != undefined  || sampleState != undefined)
        {
            console.log("coordState", coordState);
            console.log("sampleListState", sampleListState);
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
            heatmapArgs["comparedCancer"] = cancerSignatureGroupState.cancerType;
            heatmapArgs["cancerType"] = cancerTypeState.cancerType;
            makeRequest("updateHeatmapData", heatmapArgs);

            let sampleArgs = {};
            sampleArgs["cancerType"] = cancerTypeState.cancerType;
            sampleArgs["exportView"] = {};
            sampleArgs["callback"] = setSampleListState;
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

    React.useEffect(() => {
      if(pageTypeState.initialized)
      {
        if(pageTypeState.value == "Individual Signatures")
        {
          document.getElementById("tabcontent").style.display = "block";
          document.getElementById("pancancerpanel").style.display = "none";
        }
        else
        {
          document.getElementById("tabcontent").style.display = "none";
          document.getElementById("pancancerpanel").style.display = "block";        
        }
      }
    }, [pageTypeState.value])

    /*React.useEffect(() => {
      const dropdownMenu = document.getElementById("dropdown");
      /*ocument.documentElement.addEventListener("click", function () {
      if (dropdownMenu.classList.contains("show")) {
          toggleDropdown();
      }
      })
    })*/


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
    <Fragment>
      <div>
        <Grid container>
        <Grid container spacing={1} item xs={9}>
        <Grid item>
          <DropdownParent title={"Cancer Type"}>
            <DropdownButton title={"Cancer Type"} type={"vertical"}></DropdownButton>
            <DropdownList title={"Cancer Type"} type={"vertical"}>
              <DropdownItem value="LGG" handleClick={cancerSelectHandle} displayText={"Low-Grade Glioma (TCGA)"}/>
              <DropdownItem value="LUAD" handleClick={cancerSelectHandle} displayText={"Lung Adenocarcinoma (TCGA)"}/>
              <DropdownItem value="BRCA" handleClick={cancerSelectHandle} displayText={"Breast Invasive Carcinoma (TCGA)"}/>
              <DropdownItem value="BLCA" handleClick={cancerSelectHandle} displayText={"Bladder Cancer (TCGA)"}/>
              <DropdownItem value="GBM" handleClick={cancerSelectHandle} displayText={"Glioblastoma (TCGA)"}/>
              <DropdownItem value="HNSCC" handleClick={cancerSelectHandle} displayText={"Head and Neck Squamous Cell Carcinoma (TCGA)"}/>
              <DropdownItem value="SKCM" handleClick={cancerSelectHandle} displayText={"Skin Cutaneous Melanoma (TCGA)"}/>
              <DropdownItem value="COAD" handleClick={cancerSelectHandle} displayText={"Colon Adenocarcinoma (TCGA)"}/>
              <DropdownItem value="AML_Leucegene" handleClick={cancerSelectHandle} displayText={"Acute Myeloid Leukemia (Leucgene)"}/>
            </DropdownList>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: "blue"}}><strong>{cancerTypeState.cancerType}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Sample Filter"}>
              <DropdownButton title={"Sample Filter"} type={"multi"}></DropdownButton>
              <DropdownList title={"Sample Filter"} type={"multi"}>
              {(() => {
                    //console.log("good", Object.entries(sampleListState));
                    const dropdownItems = [];         
                    for (const [key, value] of Object.entries(sampleListState))
                    {
                        let newDropdownItems = [];
                        for(let i = 0; i < value.length; i++)
                        {
                            newDropdownItems.push(<DropdownItem value={[key, value[i]]} handleClick={selectSampleHandle} displayText={value[i]}/>);
                        }
                        dropdownItems.push(<DropdownParent title={key}><Grid container><Grid item><DropdownButton title={key} type={"side"}></DropdownButton></Grid><Grid item><DropdownList title={key} type={"side"}>{newDropdownItems}</DropdownList></Grid></Grid></DropdownParent>);
                    }
                    return dropdownItems;
                })()}
              </DropdownList>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: "blue"}}><strong>{sampleState != undefined && (sampleState.value)}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Event Type"}>
            <DropdownButton title={"Event Type"} type={"vertical"}></DropdownButton>
            <DropdownList title={"Event Type"} type={"vertical"}>
              <DropdownItem value="Signature" handleClick={onSelectEventType} displayText={"Signature"}/>
              <DropdownItem value="Genes" handleClick={onSelectEventType} displayText={"Genes"}/>
              <DropdownItem value="Coordinates" handleClick={onSelectEventType} displayText={"Coordinates"}/>
            </DropdownList>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: "blue"}}><strong>{eventTypeState.eventType}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Cancer Signature Selection"}>
            <DropdownButton title={"Cancer Signature Selection"} type={"vertical"}></DropdownButton>
            <DropdownList title={"Cancer Signature Selection"} type={"vertical"}>
              <DropdownItem value="LGG" handleClick={cancerSignatureGroupSelectHandle} displayText={"Low-Grade Glioma (TCGA)"}/>
                <DropdownItem value="LUAD" handleClick={cancerSignatureGroupSelectHandle} displayText={"Lung Adenocarcinoma (TCGA)"}/>
                <DropdownItem value="BRCA" handleClick={cancerSignatureGroupSelectHandle} displayText={"Breast Invasive Carcinoma (TCGA)"}/>
                <DropdownItem value="BLCA" handleClick={cancerSignatureGroupSelectHandle} displayText={"Bladder Cancer (TCGA)"}/>
                <DropdownItem value="GBM" handleClick={cancerSignatureGroupSelectHandle} displayText={"Glioblastoma (TCGA)"}/>
                <DropdownItem value="HNSCC" handleClick={cancerSignatureGroupSelectHandle} displayText={"Head and Neck Squamous Cell Carcinoma (TCGA)"}/>
                <DropdownItem value="SKCM" handleClick={cancerSignatureGroupSelectHandle} displayText={"Skin Cutaneous Melanoma (TCGA)"}/>
                <DropdownItem value="COAD" handleClick={cancerSignatureGroupSelectHandle} displayText={"Colon Adenocarcinoma (TCGA)"}/>
                <DropdownItem value="AML_Leucegene" handleClick={cancerSignatureGroupSelectHandle} displayText={"Acute Myeloid Leukemia (Leucgene)"}/>
            </DropdownList>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: "blue"}}><strong>{cancerSignatureGroupState.cancerType}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Cancer Signature Filter"}>
                <DropdownButton title={"Cancer Signature Filter"} type={"vertical"}></DropdownButton>
                <div class={"dropdown_vertical"} id={"div_Cancer Signature Filter_id"} style={{height: "300px", overflowY: "scroll"}}>
                  {(() => {
                      //console.log("good", Object.entries(signatureListState));
                      const dropdownItems = [];         
                      for (const [key, value] of Object.entries(signatureListState))
                      {
                          dropdownItems.push(<DropdownItem value={[key, value]} displayText={value} handleClick={signatureSelectHandle}/>)
                      }
                      return dropdownItems;
                  })()}
                </div>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: signatureTextDisplayColor}}><strong>{signatureState.simpleName}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Enter Coordinates"}>
            <DropdownButton title={"Enter Coordinates"} type={"vertical"}></DropdownButton>
              <div class={"dropdown_vertical"} id={"div_Enter Coordinates_id"} style={{maxHeight: "300px", overflowY: "scroll"}}>
                <textarea id="clientinputcoord" onChange={onChangeCoord} placeholder="Enter coordinates here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
              </div>
          </DropdownParent>
          <div style={{textAlign: "center", color: geneTextDisplayColor}}><strong>{coordState != undefined && (coordState[0])}</strong></div>
        </Grid>
        <Grid item>
          <DropdownParent title={"Enter Genes"}>
            <DropdownButton title={"Enter Genes"} type={"vertical"}></DropdownButton>
              <div class={"dropdown_vertical"} id={"div_Enter Genes_id"} style={{maxHeight: "300px", overflowY: "scroll"}}>
                <textarea id="clientinputgene" onChange={onChangeGene} placeholder="Enter gene symbols here" style={{minWidth: 360, fontSize: 17, minHeight: 60}}/>
              </div>
          </DropdownParent>
          <div style={{textAlign: "center", fontSize: "0.9em", color: geneTextDisplayColor}}><strong>{geneState != undefined && (geneState[0])}</strong></div>
        </Grid>
        </Grid>
        <Grid container item xs={3} justifyContent="flex-end">
          <Form.Control as="select"
                  value={pageTypeState.value}
                  onChange={onSelectHandle}
                  name="value"
                  style={{
                    backgroundColor: '#0F6A8B',
                    color: "white",
                    fontSize: "0.9em",
                    height: "75%",
                    margin: 2,
                    padding: 2,
                    bordeRadius: 3,
                    cursor: "pointer"
                  }}>
                  <option value="Individual Signatures">Individual Signatures</option>
                  <option value="Pancancer Analysis">Pancancer Analysis</option>
          </Form.Control>
        </Grid>
        </Grid>
      </div>
    </Fragment>);
    
}

export default Header;