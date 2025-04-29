import '@fontsource/roboto';
import React from 'react';
import MinorTable from './components/MinorTable.js';
import {isBuild, rootHeatmapTableObj, cancerValueToName} from './utilities/constants.js';
import axios from 'axios';

var routeurl = isBuild ? "https://www.altanalyze.org/neoxplorer" : "http://localhost:8081";
var localAddress = isBuild ? "https://www.altanalyze.org/ICGS/Oncosplice/neo/index.html" : "http://localhost:8080/app";

function setupLinkForHeatmap(cancer, signature){    
    var simplename = signature.substring(4).replace(/_/g, "-");
    var url = localAddress.concat("/explore/").concat(cancer.toUpperCase()).concat("/").concat(signature).concat("/").concat(simplename).concat("/None/None");
    const hyperlinkObject = <a href={url} target="_blank">Go</a>;
    return hyperlinkObject;    
}

function setUpLinkForPancancer(cancer, signature){
    var simplename = signature.substring(4).replace(/_/g, "-");
    var url = localAddress.concat("/pancancer/").concat(cancer.toUpperCase()).concat("/").concat(signature).concat("/").concat(simplename).concat("/None/None");
    const hyperlinkObject = <a href={url} target="_blank">Go</a>;
    return hyperlinkObject;    
}

function tablePlotRequest(cancerName, signature, type, pseudoPage, setTableState, newPageSize){
    var type="initial";
    var cancerName = cancerName;
    var postedData = {"data": {"cancerName": cancerName, "signature": signature, "type": type, "pseudoPage": pseudoPage, "newPageSize": newPageSize}}
    axios({
      method: "post",
      url: routeurl.concat("/api/datasets/gettableforheatmapselect"),
      data: postedData,
      headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
        var resp = response["data"];
        //document.getElementById("tableLoadingDiv").style.display = "none";
        //document.getElementById("rootTable").style.opacity = 1;
        console.log("OUTPUTTT", type, resp);
        var dataTemp = [];
        for(let i = 0; i < resp.outputdata.length; i++)
        {
            let curpointer = resp.outputdata[i];
            var signatureSetUp = curpointer["signature_name"];
            let curdat = {
                cancer: cancerValueToName[curpointer["cancer_name"]],
                signature_name: curpointer["datagroup"],
                annotation: curpointer["annotation"],
                heatmap: setupLinkForHeatmap(curpointer["cancer_name"], signatureSetUp),
                pancancer: setUpLinkForPancancer(curpointer["cancer_name"], signatureSetUp)
            }
            dataTemp.push(curdat);
        }
        console.log("dataTemp", dataTemp);
        setTableState({
            type: type,
            data: dataTemp,
            page: 0,
            pseudoPage: pseudoPage,
            pageSize: newPageSize,
            totalEntries: resp.totalentries
        });
    })
}

function TableForHeatmapSelect(props) {
    //console.log("TABLEMAN PROPS", props);
    const [tableState, setTableState] = React.useState({
        type: "initial",
        data: undefined,
        page: 0,
        pseudoPage: 0,
        pageSize: 30,
        totalEntries: 0
    });
    const [loading, setLoading] = React.useState(true); // Track loading state
    //const [data, setData] = React.useState([]); // To store processed data from props or elsewhere
    //gtexpsi_fullsig
    React.useEffect(() => {
        if(tableState.data == undefined)
        {
            tablePlotRequest(props.postedCancer, props.postedAnnotation, "initial", 0, setTableState, 30);
        }
    }, [])
    var columns = rootHeatmapTableObj;
    var tableHeaderName = "Signature selection for ";
    if(props.postedCancer == "None"){
        tableHeaderName = tableHeaderName.concat("All Cancers");
    }
    else {
        tableHeaderName = tableHeaderName.concat(cancerValueToName[props.postedCancer.toLowerCase()]);
    }
    var columns_splc = React.useMemo(
        () => [
          {
            Header: tableHeaderName,
            columns: columns
          },
        ],
        [props]
      )

    return(
        <MinorTable tableState={tableState} setTableState={setTableState} columns={columns_splc} tablePlotRequest={tablePlotRequest}/>
    );
}

export default TableForHeatmapSelect;