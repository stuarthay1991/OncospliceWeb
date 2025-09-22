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
                pancancer: setUpLinkForPancancer(curpointer["cancer_name"], signatureSetUp),
                ases: curpointer["ases"],
                degs: curpointer["degs"],
                samples: curpointer["samples"]
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
    const [searchTerm, setSearchTerm] = React.useState(""); // Add search state
    const [filteredData, setFilteredData] = React.useState(undefined); // Add filtered data state

    //const [data, setTableState] = React.useState([]); // To store processed data from props or elsewhere
    //gtexpsi_fullsig
    React.useEffect(() => {
        if(tableState.data == undefined)
        {
            tablePlotRequest(props.postedCancer, props.postedAnnotation, "initial", 0, setTableState, 30);
        }
    }, [])

    // Add search filter function
    const filterData = (data, searchTerm) => {
        if (!searchTerm.trim()) return data;
        
        return data.filter(item => 
            item.cancer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.signature_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.annotation.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Filter data when search term or table data changes
    React.useEffect(() => {
        if (tableState.data) {
            const filtered = filterData(tableState.data, searchTerm);
            setFilteredData(filtered);
        }
    }, [searchTerm, tableState.data]);

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
        <div>
            {/* Search Bar */}
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <label style={{ marginLeft: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                    Search:
                </label>
                <input
                    type="text"
                    placeholder="Search signatures, cancers, or annotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        marginLeft: '10px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '300px',
                        marginRight: '8px'
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        style={{
                            marginLeft: '10px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                            cursor: 'pointer'
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>
            
            {/* Table with filtered data */}
            <MinorTable 
                tableState={{
                    ...tableState,
                    data: filteredData || tableState.data
                }} 
                setTableState={setTableState} 
                columns={columns_splc} 
                tablePlotRequest={tablePlotRequest}
            />
        </div>
    );
}

export default TableForHeatmapSelect;