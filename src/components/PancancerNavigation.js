import { Nav, Dropdown } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { makeRequest } from '../request/CancerDataManagement.js';
import Grid from '@material-ui/core/Grid';
import "./rsuitedropdown.css";
import React from "react";

function HayDropdown(props){
  return(
    <Dropdown.Item eventKey={props.eventKey} style={{fontSize: 12, margin: 1, padding: 1}}>
      {props.displayName}
    </Dropdown.Item>
  );
}

function PCHeader({setPanCancerState, startingCancer, startingSignature, startingSimple, startingSignatureList}){
    const [cancerTypeState, setCancerTypeState] = React.useState({"cancerType": startingCancer, "initialized": false});
    const [signatureState, setSignatureState] = React.useState({"signature": startingSignature, "simpleName": startingSimple, "oncocluster": startingSimple, "initialized": false});
    const [signatureListState, setSignatureListState] = React.useState(startingSignatureList);
    const [cancerSignatureGroupState, setCancerSignatureGroupState] = React.useState({"cancerType": startingCancer, "initialized": false});

    const cancerSelectHandle = (e) => {
        setCancerTypeState({"cancerType": e, "initialized": true});
    }

    const cancerSignatureGroupSelectHandle = (e) => {
        setCancerSignatureGroupState({"cancerType": e, "initialized": true});
    }
    
    const signatureSelectHandle = (e) => {
        var selectedOncocluster = e[1];
        if(selectedOncocluster != undefined) {
          if(selectedOncocluster.indexOf(" (") != -1) {
            selectedOncocluster = selectedOncocluster.split(" (")[0];
          }
        } else {
          selectedOncocluster = "R1-V2";
        }
        let simpleName = e[1];
        if(e[1] == undefined) {
          simpleName = e[0];
        }
        setSignatureState({"signature": e[0], "simpleName": e[1], "oncocluster": selectedOncocluster, "initialized": true});
    }

    React.useEffect(() => {
        if(cancerTypeState.initialized || signatureState.initialized) {
            let args = {};
            args["cancerType"] = cancerTypeState.cancerType;
            args["signature"] = signatureState.signature;
            args["pancancerupdate"] = setPanCancerState;
            makeRequest("pancancer", args);
        }
    }, [cancerTypeState, signatureState])

    React.useEffect(() => {
        if(cancerSignatureGroupState.initialized) {
            let args = {};
            args["exportView"] = {};
            args["document"] = document;
            args["callbackOne"] = setSignatureListState;
            args["callbackTwo"] = setSignatureState;
            args["cancerType"] = cancerSignatureGroupState.cancerType;
            makeRequest("updateSignatureList", args);
        }
    }, [cancerSignatureGroupState])

    return(
      <div id="pc_dropdownOptionsDiv" style={{width: "120%"}}>
        <Grid container spacing={1}>
          <Grid id="pc_gridItem1" item>
            <Dropdown title="Cancer Type"
              onSelect={cancerSelectHandle}
              activeKey={cancerTypeState.cancerType}
              placement="bottomStart"
              size="xs"
              trigger="hover">
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
            <div style={{textAlign: "center", color: "blue", fontSize: 12}}>
              <strong>{cancerTypeState.cancerType}</strong>
            </div>
          </Grid>
          <Grid id="pc_gridItem2" item>
            <Dropdown title="Signature Group"
              onSelect={cancerSignatureGroupSelectHandle} 
              activeKey={cancerSignatureGroupState.cancerType}
              placement="bottomStart"
              size="xs"
              trigger="hover">
              {signatureListState && signatureListState.map((sig) => (
                <HayDropdown key={sig[0]} eventKey={sig[0]} displayName={sig[1]} />
              ))}
            </Dropdown>
            <br/>
            <div style={{textAlign: "center", color: "blue", fontSize: 12}}>
              <strong>{signatureState.simpleName || signatureState.signature}</strong>
            </div>
          </Grid>
        </Grid>
      </div>
    );
}

export default PCHeader;
