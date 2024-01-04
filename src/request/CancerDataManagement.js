import React from 'react';
import ReactDOM from 'react-dom';
import targeturl from '../targeturl.js';
import axios from 'axios';
import uiFields from './uiFields.js';
import updateSigature from './updateSignature.js';
import defaultQuery from './defaultQuery.js';
import fetchHeatmapData from './fetchHeatmapData.js';
import updateHeatmapData from './updateHeatmapData.js';
import gene from './gene.js';
import coord from './coord.js';
import recursiveMetaDataField from './recursiveMetaDataField.js';
import metaDataField from './metaDataField.js';
import signature from './signature.js';
import updateSignature from './updateSignature.js';

//GLOBALS
const exportToViewPane = {};

export function makeRequest(to, arg)
{
	if(to == "uiFields"){ uiFields(arg, targeturl);}
	if(to == "metaDataField"){ metaDataField(arg, targeturl);}
	if(to == "recursiveMetaDataField"){ recursiveMetaDataField(arg, targeturl);}
	if(to == "signature"){ signature(arg, targeturl);}
	if(to == "fetchHeatmapData"){ fetchHeatmapData(arg, targeturl);}
  if(to == "updateHeatmapData"){ updateHeatmapData(arg, targeturl);}
	if(to == "gene"){ gene(arg, targeturl);}
	if(to == "coord"){ coord(arg, targeturl);}
	if(to == "defaultQuery"){ defaultQuery(arg, targeturl);}
  if(to == "updateSignature"){ updateSignature(arg, targeturl);}
}