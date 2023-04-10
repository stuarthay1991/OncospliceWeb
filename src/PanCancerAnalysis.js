import useStyles from './css/useStyles.js';
import '@fontsource/roboto';
import Button from '@material-ui/core/Button';
import { Resizable, ResizableBox } from "react-resizable";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import SetExonPlot from './plots/exonPlot.js';
import SetDoubleBarChart from './plots/doubleBarChart.js';
import SetStackedBarChart from './plots/stackedBarChart.js';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import Plot from 'react-plotly.js';
import './App.css';
import { isBuild } from './utilities/constants.js';
import { v4 as uuidv4 } from 'uuid';
import SetConcordanceGraph from './plots/concordanceGraph.js';
import SetVennDiagram from './plots/vennDiagram.js';
//import SetConcordanceGraph from './plots/concordanceGraph.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 3px solid black;

    tr {
      border: 3px solid black;
      height: 10px;
      max-height: 10px;
      overflow: hidden;
      overflow-Y: hidden;
      overflow-X: hidden; 
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      td {
        border: 3px solid black;
        height: 10px;
        max-height: 10px;
        overflow: hidden;
        overflow-Y: hidden;
        overflow-X: hidden;
        color: black;
      }
    }

    tbody {
      tr:not(.HselectedRow) {
        :hover {
            cursor: pointer;
            background-color: #b4c4de;
            color: white;
        }
      }
      tr.HselectedRow {
        background-color: #FFDFBA;
        color: black;    
      }

      tr.HselectedRow > td {
        color: black;    
      }      

    }

    th {
      margin: 0.2;
      padding: 0.6rem;
      height: 10px;
      max-height: 10px;
      border: 3px solid black;
      overflow: hidden;
      overflow-Y: hidden;
      overflow-X: hidden;
      font-size: 14px;

      :last-child {
        border-right: 0;
      }
    }

    td {
      margin: 0.2;
      padding: 0.6rem;
      height: 10px;
      max-height: 10px;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      overflow: hidden;
      overflow-Y: hidden;
      overflow-X: hidden;
      font-size: 12px;

      :last-child {
        border-right: 0;
      }      
    }
  }
`

function exonRequest(GENE, in_data, fulldata, exonPlotStateScaled, setExonPlotState, tableState, setTableState, sortedColumn) {
    var bodyFormData = new FormData();
    var gene_specific_data = [];
    //console.log("Data structure: ", fulldata);
    for(let i = 0; i < fulldata.length; i++)
    {
      let curpointer = fulldata[i];
      var pasta = curpointer.uid.split(":");
      var ensg_id = pasta[1];
      if(ensg_id == GENE)
      {
        var fullinputcoords = curpointer.coordinates;
        var peach = fullinputcoords.split("|");
        var chr1 = peach[0];
        var chr2 = peach[1];
        var twor1 = chr1.split(":");
        var twor2 = chr2.split(":");
        var flatchr1 = twor1[0];
        var flatchr2 = twor2[0];
        var twor1_split = twor1[1].split("-");
        var twor2_split = twor2[1].split("-"); 
        var coord1 = twor1_split[0];
        var coord2 = twor1_split[1];
        var coord3 = twor2_split[0];
        var coord4 = twor2_split[1];
        curpointer["coord1"] = coord1;
        curpointer["coord2"] = coord2;
        curpointer["coord3"] = coord3;
        curpointer["coord4"] = coord4;
        gene_specific_data.push(curpointer);
      }
    }
    //console.log("gene_specific_data", gene_specific_data);
    var postedData = {"data": {"gene": GENE}}
    axios({
      method: "post",
      url: routeurl.concat("/api/datasets/exonViewerData"),
      data: postedData,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        var resp = response["data"];
        setExonPlotState({
          exons: resp["gene"], 
          transcripts: resp["transcript"], 
          junctions: resp["junc"],
          in_data: in_data,
          gene_specific_data: gene_specific_data,
          scaled: exonPlotStateScaled,
          targetdiv: "pancanc_splice",
          downscale: 1.45
        });
        setTableState({...tableState, sortedColumn: sortedColumn.id})

    })
}

function stackedBarChartRequest(setStackedBarChartState){
  var postedData = {"data": {"cancer": "BLCA_TCGA"}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/stackedBarChart"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"];
      setStackedBarChartState({
        data: resp,
        targetdiv: "stackedBarChartDiv" 
      })
  })
}

function concordanceRequest(signature, cancer, setConcordanceState){
  console.log("concordreq, signature is... ", signature);
  var postedData = {"data": {"signature": signature, "cancer": "BLCA_TCGA"}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/concordance"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"];
      setConcordanceState({signatures: resp})
      console.log("concord return...", resp);
  })
}

function tablePlotRequest(SIGNATURE, type, setTableState) {
  var bodyFormData = new FormData();
  var postedData = {"data": {"signature": SIGNATURE, "type": type}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/updatepantable"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"];
      //console.log("OUTPUTTT", resp);
      setTableState({
        type: type,
        data: resp["outputdata"],
        sortedColumn: "UID"
      });
  })
}

function popUID(uuid, uid, inputcoords, fulldata, exonPlotState, setExonPlotState, tableState, setTableState, sortedColumn){
    var allSelected = document.getElementsByClassName("HselectedRow");
    if(allSelected.length > 0)
    {
      for(var i = 0; i < allSelected.length; i++)
      {
        allSelected[i].className = "default";
      }
    }
    var important = document.getElementById(uuid);
    //console.log("POP_UID", important);
    important.className = "HselectedRow";
    var pasta = uid.split(":");
    var ensg_id = pasta[1];
    var fullinputcoords = inputcoords;
    var peach = fullinputcoords.split("|");
    var chr1 = peach[0];
    var chr2 = peach[1];
    var twor1 = chr1.split(":");
    var twor2 = chr2.split(":");
    var flatchr1 = twor1[0];
    var flatchr2 = twor2[0];
    var twor1_split = twor1[1].split("-");
    var twor2_split = twor2[1].split("-"); 
    var coord1 = twor1_split[0];
    var coord2 = twor1_split[1];
    var coord3 = twor2_split[0];
    var coord4 = twor2_split[1];
    var coord_block = {"coord1": coord1, "coord2": coord2, "coord3": coord3, "coord4": coord4};
    exonRequest(ensg_id, coord_block, fulldata, exonPlotState, setExonPlotState, tableState, setTableState, sortedColumn);
}

const BLCA_vals = {"psi_pde4d_del_vs_others": 875,
"psi_r2_v11_vs_others": 316,
"psi_r2_v27_vs_others": 348,
"psi_r2_v1_vs_others": 3792,
"psi_r2_v18_vs_others": 184,
"psi_r2_v4_vs_others": 156,
"psi_r2_v6_vs_others": 28,
"psi_rbm10_mut+sox4_amp_vs_others": 22,
"psi_sox4_amp+tp53_mut_vs_others": 384,
"psi_fgfr3_mut_vs_others": 703,
"psi_r2_v17_vs_others": 267,
"psi_kras_mut_vs_others": 11,
"psi_r3_v5_vs_others": 107,
"psi_r3_v21_vs_others": 3436,
"psi_r3_v9_vs_others": 965,
"psi_r3_v26_vs_others": 1421,
"psi_noninvasive_blca_history_vs_others": 124,
"psi_tp53_mut_vs_others": 483,
"psi_r2_v15_vs_others": 631,
"psi_asian_vs_others": 1695,
"psi_r3_v7_vs_others": 30,
"psi_r2_v16_vs_others": 606,
"psi_r2_v13_vs_others": 452,
"psi_r2_v25_vs_others": 33,
"psi_r2_v2_vs_others": 1400,
"psi_cdkn2a_del+fgfr3_mut_vs_others": 547,
"psi_r2_v3_vs_others": 950,
"psi_r3_v6_vs_others": 60,
"psi_r2_v22_vs_others": 541,
"psi_r2_v20_vs_others": 214,
"psi_rbm10_mut_vs_others": 280,
"psi_r3_v19_vs_others": 56,
"psi_r2_v21_vs_others": 744,
"psi_r2_v9_vs_others": 487}

function uidConvert(input_uid)
{
  input_uid = input_uid.split(":");
    var uid_secondcomp = input_uid[2];
    uid_secondcomp = uid_secondcomp.split("|");
    var uid_final = input_uid[0].concat(":").concat(uid_secondcomp[0]).concat("|").concat(input_uid[3]);
    return uid_final;
}

function Table({ columns, data, exonPlotStateScaled, setExonPlotState, tableState, setTableState}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
            {
                id: tableState.sortedColumn,
                desc: false
            }
        ]
      }
    },
    useSortBy
  )

  React.useEffect(() => {
    var allSelected = document.getElementsByClassName("HselectedRow");
    if(allSelected.length > 0)
    {
      for(var i = 0; i < allSelected.length; i++)
      {
        allSelected[i].className = "default";
      }
    }
  }, [columns])

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  var sortedColumn = undefined;

  headerGroups.map(headerGroup => (
    headerGroup.headers.map(column => (
      sortedColumn = column.isSorted ? column : sortedColumn
    ))
  ))

  console.log(sortedColumn);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              //console.log("ROW", row);
              const setClick = row.original.uid;
              const inputcoords = row.original.coordinates;
              const id = uuidv4();
              //console.log("input_coords", inputcoords);
              return (
                <tr {...row.getRowProps()} id={id} onClick={() => popUID(id, setClick, inputcoords, data, exonPlotStateScaled, setExonPlotState, tableState, setTableState, sortedColumn)}>
                  {row.cells.map(cell => {
                    //console.log("CELL", cell);
                    if(cell.column.Header == "Protein Predictions")
                    {
                      if(cell.value != null)
                      {
                        if(cell.value.length > 40)
                        {
                          cell.value = (cell.value.substring(0, 40)).concat("...");
                        }
                      }
                    }
                    if(cell.column.Header == "UID")
                    {
                      if(cell.value != null)
                      {
                        cell.value = uidConvert(cell.value);
                      }
                    }
                    return (
                      <td {...cell.getCellProps()} style={{"maxHeight": "20px"}}>{cell.value}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

function RootTable(props) {

  var column_obj;

  var column_splice_obj = [
      {
        Header: 'UID',
        accessor: 'uid',
        id: 'UID',
        maxWidth: '20px',
      },
      {
        Header: 'Event Direction',
        accessor: 'event_direction',
        id: 'event_direction',
        maxWidth: '20px',
      },
      {
        Header: 'Cluster ID',
        accessor: 'clusterid',
        id: 'clusterid',
        maxWidth: '20px',
      },
      {
        Header: 'Event Annotation',
        accessor: 'eventannotation',
        id: 'eventannotation',
        maxWidth: '20px',
      },
      {
        Header: 'Coordinates',
        accessor: 'coordinates',
        id: 'coordinates',
        maxWidth: '20px',
      },
      {
        Header: 'Protein Predictions',
        accessor: 'proteinpredictions',
        id: 'proteinpredictions',
        maxWidth: '20px',
      },
      {
        Header: 'dPSI',
        accessor: 'dpsi',
        id: 'dpsi',
        maxWidth: '20px',
      },
      {
        Header: 'rawp',
        accessor: 'rawp',
        id: 'rawp',
        maxWidth: '20px',
      },
      {
        Header: 'adjp',
        accessor: 'adjp',
        id: 'adjp',
        maxWidth: '20px',
      },
      {
        Header: 'Avg Others',
        accessor: 'avg_others',
        id: 'avg_others',
        maxWidth: '20px',
      }
  ]

  var column_gene_obj = [
    {
      Header: 'Signature Name',
      accessor: 'signature_name',
      maxWidth: '20px',
    },
    {
      Header: 'Gene ID',
      accessor: 'geneid',
      maxWidth: '20px',
    },
    {
      Header: 'System Code',
      accessor: 'systemcode',
      maxWidth: '20px',
    },
    {
      Header: 'Logfold',
      accessor: 'logfold',
      maxWidth: '20px',
    },
    {
      Header: 'rawp',
      accessor: 'rawp',
      maxWidth: '20px',
    },
    {
      Header: 'adjp',
      accessor: 'adjp',
      maxWidth: '20px',
    },
    {
      Header: 'symbol',
      accessor: 'symbol',
      maxWidth: '20px',
    },
    {
      Header: 'avg_self',
      accessor: 'avg_self',
      maxWidth: '20px',
    },
    {
      Header: 'avg_others',
      accessor: 'avg_others',
      maxWidth: '20px',
    }
  ]

  var columns_splc = React.useMemo(
    () => [
      {
        Header: 'Signature Events',
        columns: column_splice_obj,
      },
    ],
    []
  )

  var columns_gene = React.useMemo(
    () => [
      {
        Header: 'Signature Events',
        columns: column_gene_obj,
      },
    ],
    []
  )  

  if(props.input == undefined)
  {
    /*var data1 = {
        signature_name: "Bob",
        uid: "Bobbington",
        event_direction: "40",
        clusterid: "3",
        eventannotation: "1",
        coordinates: "fantastic",
        proteinpredictions: "ond",
        dpsi: "ond",
        rawp: "ond",
        adjp: "ond",
        avg_others: "ond"
    }

    var data2 = {
        signature_name: "Flob",
        uid: "Bobbington",
        event_direction: "40",
        clusterid: "3",
        eventannotation: "1",
        coordinates: "fantastic",
        proteinpredictions: "ond",
        dpsi: "ond",
        rawp: "ond",
        adjp: "ond",
        avg_others: "ond"
    }

    var data = [data1, data2];*/
    var data = [];
  }
  else{
    var data = [];
    for(let i = 0; i < props.input.length; i++)
    {
        let curpointer = props.input[i];
        if(props.type == "splice")
        {
          let curdat = {
              uid: curpointer["uid"],
              event_direction: curpointer["event_direction"],
              clusterid: curpointer["clusterid"],
              eventannotation: curpointer["eventannotation"],
              coordinates: curpointer["coordinates"],
              proteinpredictions: curpointer["proteinpredictions"],
              dpsi: curpointer["dpsi"],
              rawp: curpointer["rawp"],
              adjp: curpointer["adjp"],
              avg_others: curpointer["avg_others"]
          }
          data.push(curdat);
        }
        else
        {
          let curdat = {
            signature_name: curpointer["signature_name"],
            geneid: curpointer["geneid"],
            systemcode: curpointer["systemcode"],
            logfold: curpointer["logfold"],
            rawp: curpointer["rawp"],
            adjp: curpointer["adjp"],
            avg_self: curpointer["avg_self"],
            avg_others: curpointer["avg_others"]
          }
          data.push(curdat);  
        }
        
    }
  }
  var available_height = window.innerHeight;
  var s_height = 0.55 * available_height;

  var columns = columns_splc;

  if(props.type == "splice")
  {
    columns = columns_splc;
  }
  else{
    columns = columns_gene;
  }

  return (
    <div style={{overflowX: "scroll", overflowY: "scroll", maxHeight: s_height, marginBottom: "6px"}}>
    <Styles>      
      <Table columns={columns} data={data} exonPlotStateScaled={props.exonPlotStateScaled} setExonPlotState={props.setExonPlotState} tableState={props.tableState} setTableState={props.setTableState}/>
    </Styles>
    </div>
  )
}
  
function ItemWrapper(props){
    return(
        <div style={{overflow: "scroll", height: "100%", width: "100%", backgroundColor: "white"}}>
            <div style={{margin: 40, backgroundColor: "white"}}>
                {props.children}
            </div>
        </div>
    );
}

function PanCancerAnalysis(props){
    //var state = React.useState(0);
    var available_width = window.innerWidth;
    var available_height = window.innerHeight;
    console.log("standard_width: ", window.innerWidth);
    console.log("standard_height: ", window.innerHeight);
    //var scaled_width = window.innerWidth / 1920;
    //var scaled_height = window.innerHeight / 985;
    //var standard_width = 1438;
    //var standard_height = 707;
    var scaled_width = window.innerWidth / 1438;
    var scaled_height = window.innerHeight / 707;
    const [exonPlotState, setExonPlotState] = React.useState({
        exons: null,
        transcripts: null,
        junctions: null,
        in_data: null,
        scaled: false,
        targetdiv: "pancanc_splice",
        downscale: 1.45
    });

    const [concordanceState, setConcordanceState] = React.useState({
        signatures: undefined
    });

    const [tableState, setTableState] = React.useState({
        type: "splice",
        data: undefined,
        sortedColumn: "UID"
    });

    var doubleBarChartData = {cluster: null, gene: null, targetdiv: "doubleBarChartDiv"};
    const [stackedBarChartData, setStackedBarChartData] = React.useState({
      data: null,
      targetdiv: "stackedBarChartDiv" 
    })

    if(props.cancerName == "BLCA")
    {
        var datarray_x1 = [];
        var datarray_y1 = [];

        var datarray_x2 = [];
        var datarray_y2 = [];
        const plotobjs = [];
        var counter = 0;

        doubleBarChartData = {cluster: [], gene: [], key: [], targetdiv: "doubleBarChartDiv"};

        for (const [key, value] of Object.entries(props.clusterLength)) {

            doubleBarChartData.cluster.push(value.length);
            doubleBarChartData.gene.push(BLCA_vals[key]);
            doubleBarChartData.key.push(key);
        }
    }
    //var set_height_0 = available_height * 0.8;
    //var set_height_1 = available_height * 0.5;
    //var set_height_2 = available_height * 0.4;

    //const [fullSignatureState, setFullSignatureState] = React.useState();

    var panel_CancerSummary = {
        width: 0.235 * available_width,
        height: 0.93 * available_height,
        minWidth: 0.235 * available_width,
        minHeight: 0.93 * available_height,
        maxWidth: 0.235 * available_width,
        maxHeight: 0.93 * available_height
    }

    var panel_Testing = {
        width: 0.75 * available_width,
        height: 1.5 * available_height,
        minWidth: 0.75 * available_width,
        minHeight: 1.5 * available_height,
        maxWidth: 0.75 * available_width,
        maxHeight: 1.5 * available_height        
    }

    var panel_PanCancerConcordance = {
        width: 0.22 * available_width,
        height: 0.55 * available_height,
        minWidth: 0.22 * available_width,
        minHeight: 0.55 * available_height,
        maxWidth: 0.22 * available_width,
        maxHeight: 0.55 * available_height
    }
    var panel_OverlappingEvents = {
        width: 0.22 * available_width,
        height: 0.4 * available_height,
        minWidth: 0.22 * available_width,
        minHeight: 0.4 * available_height,
        maxWidth: 0.22 * available_width,
        maxHeight: 0.4 * available_height
    }
    var panel_SignatureEvents = {
        width: 0.51 * available_width,
        height: 0.55 * available_height,
        minWidth: 0.51 * available_width,
        minHeight: 0.55 * available_height,
        maxWidth: 0.51 * available_width,
        maxHeight: 0.55 * available_height
    }
    var panel_SplicingGraph = {
        width: 0.51 * available_width,
        height: 0.4 * available_height,
        minWidth: 0.51 * available_width,
        minHeight: 0.4 * available_height,
        maxWidth: 0.51 * available_width,
        maxHeight: 0.4 * available_height
    }

    console.log("Concordance state...", concordanceState)

    return(
        <div style={{display: 'flex', backgroundColor: "#f7f7f7"}}>
            <div style={{width: 0.26 * available_width}}>
            <Box
                className="box"
                width={panel_CancerSummary.width}
                height={panel_CancerSummary.height}
                minConstraints={[panel_CancerSummary.minWidth, panel_CancerSummary.minHeight]}
                maxConstraints={[panel_CancerSummary.maxWidth, panel_CancerSummary.maxHeight]}
            >
                <SetDoubleBarChart 
                  heightRatio={scaled_height} 
                  widthRatio={scaled_width} 
                  doubleBarChartState={doubleBarChartData} 
                  tablePlotRequest={tablePlotRequest} 
                  tableState={tableState} 
                  setTableState={setTableState}
                  concordanceRequest={concordanceRequest}
                  concordanceState={concordanceState}
                  setConcordanceState={setConcordanceState}
                  setStackedBarChartData={setStackedBarChartData}
                  stackedBarChartRequest={stackedBarChartRequest}></SetDoubleBarChart>
                <div width="100%" id="doubleBarChartDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}></div>
                <SetStackedBarChart 
                  heightRatio={scaled_height} 
                  widthRatio={scaled_width} 
                  stackedBarChartState={stackedBarChartData}></SetStackedBarChart>
                <div width="100%" id="stackedBarChartDiv" style={{display: "none", overflow: "scroll", height: "100%", width: "100%"}}></div>
            </Box>
            </div>
            <div style={{width: 0.8 * available_width}}>
            <div style={{ fontFamily: 'Arial', display: 'flex', flexWrap: 'wrap' }}>
            <ResizableBox
                className="box"
                width={panel_PanCancerConcordance.width}
                height={panel_PanCancerConcordance.height}
                minConstraints={[panel_PanCancerConcordance.minWidth, panel_PanCancerConcordance.minHeight]}
                maxConstraints={[panel_PanCancerConcordance.maxWidth, panel_PanCancerConcordance.maxHeight]}
            >
              <SetConcordanceGraph 
                heightRatio={scaled_height} 
                widthRatio={scaled_width} 
                concordanceState={concordanceState}>  
              </SetConcordanceGraph>
              <div width="100%" id="concordanceDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}></div>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SignatureEvents.width}
                height={panel_SignatureEvents.height}
                minConstraints={[panel_SignatureEvents.minWidth, panel_SignatureEvents.minHeight]}
                maxConstraints={[panel_SignatureEvents.maxWidth, panel_SignatureEvents.maxHeight]}
            >                
                <RootTable input={tableState.data} type={tableState.type} exonPlotStateScaled={exonPlotState.scaled} setExonPlotState={setExonPlotState} tableState={tableState} setTableState={setTableState}></RootTable>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_OverlappingEvents.width}
                height={panel_OverlappingEvents.height}
                minConstraints={[panel_OverlappingEvents.minWidth, panel_OverlappingEvents.minHeight]}
                maxConstraints={[panel_OverlappingEvents.maxWidth, panel_OverlappingEvents.maxHeight]}
            >
              <div width="100%" id="overlapDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}></div>
              <SetVennDiagram></SetVennDiagram>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SplicingGraph.width}
                height={panel_SplicingGraph.height}
                minConstraints={[panel_SplicingGraph.minWidth, panel_SplicingGraph.minHeight]}
                maxConstraints={[panel_SplicingGraph.maxWidth, panel_SplicingGraph.maxHeight]}
            >
                <div style={{overflow: "scroll", height: "100%", width: "100%", backgroundColor: "white", margin: 10}}>
                <SetExonPlot exonPlotState={exonPlotState} setExonPlotState={setExonPlotState}></SetExonPlot>
                <div id="pancanc_splice"></div>
                </div>
            </ResizableBox>
            </div>
            </div>
        </div>
    );
}

export default PanCancerAnalysis;