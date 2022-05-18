import React from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import targeturl from '../targeturl.js';

function openNewURL(id)
{
	window.open(("https://www.cbioportal.org/comparison/survival?comparisonId=".concat(id)), "_blank");
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
	var senddata = [];
	for (var i = 0; i < data.length; i++) 
	{
		var tempdata = data[i];
		var lendat = []
		for (var k = 0; k < tempdata.length; k++)
		{
			var stredit = tempdata[k];
			stredit = stredit.split("_");
			lendat.push((stredit[0].concat("-").concat(stredit[1]).concat("-").concat(stredit[2]).concat("-").concat(stredit[3].slice(0, -1))).toUpperCase());
		}
		if(lendat.length > 0)
		{
			senddata.push(lendat);
		}
	}
	var bodyFormData = new FormData();
	var datobj = {};
	datobj["groups"] = [];
	var studyID = cancerCodeTranslate[props.cancer];

	for(var i = 0; i < senddata.length; i++)
	{
		datobj["groups"][i] = {};
		datobj["groups"][i]["name"] = props.label[i];
		datobj["groups"][i]["description"] = "";
		datobj["groups"][i]["studies"] = [];
		datobj["groups"][i]["studies"][0] = {};
		datobj["groups"][i]["studies"][0]["id"] = studyID;
		datobj["groups"][i]["studies"][0]["samples"] = senddata[i];
		datobj["groups"][i]["studies"][0]["patients"] = senddata[i];
		datobj["groups"][i]["origin"] = [];
		datobj["groups"][i]["origin"][0] = studyID;
		datobj["groups"][i]["uid"] = "62665b890934121b56df06b5".concat(i.toString());
		datobj["groups"][i]["isSharedGroup"] = false;
		datobj["groups"][i]["nonExistentSamples"] = [];
	}
	
	datobj["origin"] = [];
	datobj["origin"][0] = studyID;

	bodyFormData.append("DATA",JSON.stringify(datobj));
	axios({
	    method: "post",
	    url: (targeturl.concat("/backend/cbioportal.php")),
	    data: bodyFormData,
	    headers: { "Content-Type": "multipart/form-data" },
	})
	    .then(function (response) {
	      //console.log("response_exon", response["data"]);
	      var resp = response["data"]["id"];
	      openNewURL(resp);
	})
}

function CBioportalLinkout(props)
{
	var isDisabled = cancerCodeTranslate[props.cancer] == null ? true : false;
	var buttonstyles = isDisabled == false ? {"cursor":'pointer', "backgroundColor":'#EFAD18', "opacity":1} : {"cursor":'not-allowed', "backgroundColor":'grey', "opacity":0.5};
	var tooltipmessage = isDisabled == false ? "View cBioportal analysis" : "cBioportal analysis not available for this cancer";
	return(
		<Tooltip title={tooltipmessage}>
		<Button uppercase={false} disabled={isDisabled} onClick={() => sendSamplesRetrieveURL(props)} 
		    style={{backgroundColor:buttonstyles["backgroundColor"],
		    borderRadius:'8px',
		    display:'inline-block',
		    cursor:buttonstyles["cursor"],
		    color:'#ffffff',
		    borderColor: 'white',
		    fontFamily: 'Roboto',
		    opacity:buttonstyles["opacity"],
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