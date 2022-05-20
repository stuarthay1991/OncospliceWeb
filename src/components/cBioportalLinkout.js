import React from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import targeturl from '../targeturl.js';

function goToCBio(uuid)
{
	window.open(("https://www.cbioportal.org/comparison/survival?comparisonId=".concat(uuid)), "_blank");
}

const cancerCodeTranslate = {
	"BRCA": "brca_tcga",
	"BLCA": "blca_tcga",
	"LGG": "lgg_tcga",
	"LUAD": "luad_tcga",
	"SKCM": "skcm_tcga",
	"GBM": "gbm_tcga",
	"HNSCC": "hnsc_tcga",
	"COAD": "coadread_tcga",
	"AML_Leucegene": null
}

function sendSamplesRetrieveURL(props)
{
	var data = props.data;
	var cBioportalJsonData = [];
	for (const [key, value] of Object.entries(data)) 
	{
		var lendat = []
		for (var k = 0; k < data[key].length; k++)
		{
			var stredit = data[key][k];
			stredit = stredit.split("_");
			lendat.push((stredit[0].concat("-").concat(stredit[1]).concat("-").concat(stredit[2]).concat("-").concat(stredit[3].slice(0, -1))).toUpperCase());
		}
		if(lendat.length > 0)
		{
			cBioportalJsonData.push(lendat);
		}
	}
	
	var curlCommandJsonDataObject = {"groups": [], "origin": [studyID]};
	var studyID = cancerCodeTranslate[props.cancer];

	for(var i = 0; i < cBioportalJsonData.length; i++)
	{
		curlCommandJsonDataObject["groups"][i] = {};
		curlCommandJsonDataObject["groups"][i]["name"] = props.label[i];
		curlCommandJsonDataObject["groups"][i]["description"] = "";
		curlCommandJsonDataObject["groups"][i]["studies"] = [];
		curlCommandJsonDataObject["groups"][i]["studies"][0] = {};
		curlCommandJsonDataObject["groups"][i]["studies"][0]["id"] = studyID;
		curlCommandJsonDataObject["groups"][i]["studies"][0]["samples"] = cBioportalJsonData[i];
		curlCommandJsonDataObject["groups"][i]["studies"][0]["patients"] = cBioportalJsonData[i];
		curlCommandJsonDataObject["groups"][i]["origin"] = [];
		curlCommandJsonDataObject["groups"][i]["origin"][0] = studyID;
		curlCommandJsonDataObject["groups"][i]["uid"] = "62665b890934121b56df06b5".concat(i.toString());
		curlCommandJsonDataObject["groups"][i]["isSharedGroup"] = false;
		curlCommandJsonDataObject["groups"][i]["nonExistentSamples"] = [];
	}

	var cBioportalFormData = new FormData();
	cBioportalFormData.append("DATA",JSON.stringify(curlCommandJsonDataObject));
	axios({
	    method: "post",
	    url: (targeturl.concat("/backend/cbioportal.php")),
	    data: cBioportalFormData,
	    headers: { "Content-Type": "multipart/form-data" },
	})
	    .then(function (response) {
	      var returned_uuid = response["data"]["id"];
	      //uuid in this case is a comparison id returned by the curl command. It gives us the correct destination for our survival plot.
	      goToCBio(returned_uuid);
	})
}

function CBioportalLinkout(props)
{
	var isDisabled = cancerCodeTranslate[props.cancer] == null ? true : false;
	var buttonStyles = isDisabled == false ? {"cursor":'pointer', "backgroundColor":'#EFAD18', "opacity":1} : {"cursor":'not-allowed', "backgroundColor":'grey', "opacity":0.5};
	var tooltipMessage = isDisabled == false ? "View cBioportal analysis" : "cBioportal analysis not available for this cancer";
	return(
		<Tooltip title={tooltipMessage}>
		<Button uppercase={false} disabled={isDisabled} onClick={() => sendSamplesRetrieveURL(props)} 
		    style={{backgroundColor:buttonStyles["backgroundColor"],
		    borderRadius:'8px',
		    display:'inline-block',
		    cursor:buttonStyles["cursor"],
		    color:'#ffffff',
		    borderColor: 'white',
		    fontFamily: 'Roboto',
		    opacity:buttonStyles["opacity"],
		    fontSize:'16px',
		    fontWeight:'bold',
		    padding:'13px 32px',
		    textDecoration:'none',
		    textShadow:'0px 1px 0px #3d768a',
		    textTransform: 'none'}}>cBioportal</Button>
		</Tooltip>
	)
}

export default CBioportalLinkout;