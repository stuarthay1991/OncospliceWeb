import React from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import targeturl from '../targeturl.js';

function openNewURL(props)
{

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
			lendat.push((stredit[0].concat("-").concat(stredit[1]).concat("-").concat(stredit[2]).concat("-").concat(stredit[3])).toUpperCase());
		}
		if(lendat.length > 0)
		{
			senddata.push(lendat);
		}
	}
	var bodyFormData = new FormData();
	var datobj = {};
	datobj["groups"] = [];
	datobj["groups"][0] = {};
	datobj["groups"][0]["name"] = "Breast";
	datobj["groups"][0]["description"] = "";
	datobj["groups"][0]["studies"] = [];
	datobj["groups"][0]["studies"][0] = {};
	datobj["groups"][0]["studies"][0]["id"] = "brca_tcga";
	datobj["groups"][0]["studies"][0]["samples"] = senddata[0];
	datobj["groups"][0]["studies"][0]["patients"] = senddata[0];
	datobj["groups"][0]["origin"] = [];
	datobj["groups"][0]["origin"][0] = "brca_tcga";
	datobj["groups"][0]["uid"] = "62665b890934121b56df06b5";
	datobj["groups"][0]["isSharedGroup"] = false;
	datobj["groups"][0]["nonExistentSamples"] = [];

	datobj["groups"][1] = {};
	datobj["groups"][1]["name"] = "Breast";
	datobj["groups"][1]["description"] = "";
	datobj["groups"][1]["studies"] = [];
	datobj["groups"][1]["studies"][0] = {};
	datobj["groups"][1]["studies"][0]["id"] = "brca_tcga";
	datobj["groups"][1]["studies"][0]["samples"] = senddata[1];
	datobj["groups"][1]["studies"][0]["patients"] = senddata[1];
	datobj["groups"][1]["origin"] = [];
	datobj["groups"][1]["origin"][0] = "brca_tcga";
	datobj["groups"][1]["uid"] = "62665b9404dc35387469649a";
	datobj["groups"][1]["isSharedGroup"] = false;
	datobj["groups"][1]["nonExistentSamples"] = [];

	bodyFormData.append("DATA",JSON.stringify(datobj));
	axios({
	    method: "post",
	    url: (targeturl.concat("/backend/cbioportal.php")),
	    data: bodyFormData,
	    headers: { "Content-Type": "multipart/form-data" },
	})
	    .then(function (response) {
	      //console.log("response_exon", response["data"]);
	      var resp = response["data"];
	      console.log("CBIO", resp);
	})
}

function CBioportalLinkout(data)
{
	return(
		<Tooltip title="View cBioportal analysis">
		<Button uppercase={false} onClick={() => sendSamplesRetrieveURL(data)} 
		    style={{backgroundColor:'#EFAD18',
		    borderRadius:'8px',
		    display:'inline-block',
		    cursor:'pointer',
		    color:'#ffffff',
		    borderColor: 'white',
		    fontFamily: 'Roboto',
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