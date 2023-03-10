import useStyles from './css/useStyles.js';
import '@fontsource/roboto';
import Button from '@material-ui/core/Button';
import { Resizable, ResizableBox } from "react-resizable";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import SetExonPlot from './plots/exonPlot.js';
import SetDoubleBarChart from './plots/doubleBarChart.js';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import Plot from 'react-plotly.js';
import './App.css';
import { isBuild } from './utilities/constants.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
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
        height: 10px;
        max-height: 10px;
        overflow: hidden;
        overflow-Y: hidden;
        overflow-X: hidden;    
      }
    }

    tbody {
      tr {
        :hover {
            cursor: pointer;
            background-color: #b4c4de;
            color: white;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      max-width: 100px;
      height: 10px;
      max-height: 10px;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      overflow: hidden;
      overflow-Y: hidden;
      overflow-X: hidden;
      font-size: 7px;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function exonRequest(GENE, in_data, fulldata, exonPlotState, setExonPlotState) {
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
    console.log("gene_specific_data", gene_specific_data);
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
          scaled: exonPlotState.scaled,
          targetdiv: "pancanc_splice",
          downscale: 2
        });
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
      console.log("OUTPUTTT", resp);
      setTableState({
        type: type,
        data: resp["outputdata"]
      });
  })
}

function popUID(uid, inputcoords, fulldata, exonPlotState, setExonPlotState){
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
    exonRequest(ensg_id, coord_block, fulldata, exonPlotState, setExonPlotState);
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


function plotlySetup(clusterLength, cancername, setDoubleBarChartState){
    console.log("cancername", cancername);


    if(clusterLength != undefined)
    {
        if(cancername == "BLCA")
        {
            var datarray_x1 = [];
            var datarray_y1 = [];

            var datarray_x2 = [];
            var datarray_y2 = [];
            const plotobjs = [];
            var counter = 0;

            var doubleBarChartData = {"cluster": [], "gene": []};

            for (const [key, value] of Object.entries(clusterLength)) {
 
                doubleBarChartData["cluster"].push(value.length);
                doubleBarChartData["gene"].push(BLCA_vals[key]);
            }
            console.log("pre-doubleBarChartData", doubleBarChartData);
            var available_width = window.innerWidth;
            var available_height = window.innerHeight;
            setDoubleBarChartState({
                cluster: doubleBarChartData["cluster"],
                gene: doubleBarChartData["gene"],
                targetdiv: "doubleBarChartDiv"
            });
            //return plotobjs;  
        }
        /*else
        {
            var datarray_x = [];
            var datarray_y = [];
            var counter = 0;
            for (const [key, value] of Object.entries(clusterLength)) {
                console.log("KV", key, value)
                datarray_x.push(value.length);
                datarray_y.push(key);
            }
            
            var datarray = [{
                x: datarray_x,
                y: datarray_y,
                type: 'bar',
                orientation: 'h'
            }];
            var available_width = window.innerWidth;
            var available_height = window.innerHeight;
        
            const plotobj = <Plot 
                data={datarray}
                layout={{
                    width: 270, 
                    height: 500,
                    margin: {
                    l: 120,
                    r: 10,
                    b: 50,
                    t: 10
                    },
                    font: {
                        family: 'Arial, monospace',
                        size: 8,
                        color: '#7f7f7f'
                    }
                }}
            />
            return plotobj;
        }*/
    }
    /*else{
        return null;
    }*/
}

function Table({ columns, data, exonPlotState, setExonPlotState }) {
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
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20)

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
              //console.log("input_coords", inputcoords);
              return (
                <tr {...row.getRowProps()} onClick={() => popUID(setClick, inputcoords, data, exonPlotState, setExonPlotState)}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
        Header: 'Signature Name',
        accessor: 'signature_name',
        maxWidth: '20px',
      },
      {
        Header: 'UID',
        accessor: 'uid',
        maxWidth: '20px',
      },
      {
        Header: 'Event Direction',
        accessor: 'event_direction',
        maxWidth: '20px',
      },
      {
        Header: 'Cluster ID',
        accessor: 'clusterid',
        maxWidth: '20px',
      },
      {
        Header: 'Event Annotation',
        accessor: 'eventannotation',
        maxWidth: '20px',
      },
      {
        Header: 'Coordinates',
        accessor: 'coordinates',
        maxWidth: '20px',
      },
      {
        Header: 'Protein Predictions',
        accessor: 'proteinpredictions',
        maxWidth: '20px',
      },
      {
        Header: 'dPSI',
        accessor: 'dpsi',
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
        Header: 'Avg Others',
        accessor: 'avg_others',
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
              signature_name: curpointer["signature_name"],
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
    <Styles>
      <div style={{overflowX: "scroll", overflowY: "scroll", maxHeight: s_height}}>
      <Table columns={columns} data={data} exonPlotState={props.exonPlotState} setExonPlotState={props.setExonPlotState}/>
      </div>
    </Styles>
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
    const [exonPlotState, setExonPlotState] = React.useState({
        exons: null,
        transcripts: null,
        junctions: null,
        in_data: null,
        scaled: false,
        targetdiv: "pancanc_splice",
        downscale: 2
    });

    const [tableState, setTableState] = React.useState({
        type: "splice",
        data: undefined,
    });

    var doubleBarChartData = {cluster: null, gene: null, targetdiv: "doubleBarChartDiv"};

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
                <SetDoubleBarChart doubleBarChartState={doubleBarChartData} tablePlotRequest={tablePlotRequest} tableState={tableState} setTableState={setTableState}></SetDoubleBarChart>
                <div id="doubleBarChartDiv"></div>
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
                <ItemWrapper>
                    <h3>PanCancer Concordance</h3>
                </ItemWrapper>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SignatureEvents.width}
                height={panel_SignatureEvents.height}
                minConstraints={[panel_SignatureEvents.minWidth, panel_SignatureEvents.minHeight]}
                maxConstraints={[panel_SignatureEvents.maxWidth, panel_SignatureEvents.maxHeight]}
            >
                <RootTable input={tableState.data} type={tableState.type} exonPlotState={exonPlotState} setExonPlotState={setExonPlotState}></RootTable>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_OverlappingEvents.width}
                height={panel_OverlappingEvents.height}
                minConstraints={[panel_OverlappingEvents.minWidth, panel_OverlappingEvents.minHeight]}
                maxConstraints={[panel_OverlappingEvents.maxWidth, panel_OverlappingEvents.maxHeight]}
            >
                <ItemWrapper>
                <h3>Overlapping Events</h3>
                </ItemWrapper>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SplicingGraph.width}
                height={panel_SplicingGraph.height}
                minConstraints={[panel_SplicingGraph.minWidth, panel_SplicingGraph.minHeight]}
                maxConstraints={[panel_SplicingGraph.maxWidth, panel_SplicingGraph.maxHeight]}
            >
                <div style={{overflow: "scroll", height: "100%", width: "100%", backgroundColor: "white", margin: 10}}>
                <h3>Splicing Graph</h3>
                <SetExonPlot exonPlotState={exonPlotState} setExonPlotState={setExonPlotState}></SetExonPlot>
                <div id="pancanc_splice" style={{width: 900}}></div>
                </div>
            </ResizableBox>
            </div>
            </div>
        </div>
    );
}

export default PanCancerAnalysis;