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
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import Plot from 'react-plotly.js';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import {isBuild, rootTableColumnSpliceObj, rootTableColumnGeneObj, BLCA_vals, tableStyledDiv} from './utilities/constants.js';
import SetConcordanceGraph from './plots/concordanceGraph.js';
import SetVennDiagram from './plots/vennDiagram.js';
import loadingGif from './images/loading.gif';
//import SetConcordanceGraph from './plots/concordanceGraph.js';

var routeurl = isBuild ? "http://www.altanalyze.org/oncosplice" : "http://localhost:8081";

const Styles = tableStyledDiv;
function exonRequest(GENE, in_data, fulldata, exonPlotStateScaled, setExonPlotState, tableState, setTableState, sortedColumn) {
    var bodyFormData = new FormData();
    var gene_specific_data = [];
    document.getElementById("panSpliceLoadingDiv").style.display = "block";
    document.getElementById("pancanc_splice").style.opacity = 0.2;
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
        document.getElementById("panSpliceLoadingDiv").style.display = "none";
        document.getElementById("pancanc_splice").style.opacity = 1;
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
        //setTableState({...tableState, sortedColumn: sortedColumn.id})
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

function concordanceRequest(signature, cancer, setConcordanceState, type, annot="none"){
  //console.log("concordreq, signature is... ", signature);
  //Write concordance request
  var tempnode = document.getElementById("concordanceDiv");
  while (tempnode.firstChild) {
      tempnode.removeChild(tempnode.firstChild);
  }
  document.getElementById("concordanceLoadingDiv").style.display = "block";
  document.getElementById("concordanceDiv").style.opacity = 0.2;
  /*var imgElem = document.createElement("img");
  imgElem.src = loadingGif;
  imgElem.width="200";
  imgElem.height="200";
  // add the text node to the newly created div
  document.getElementById("concordanceDiv").appendChild(imgElem);*/
  var postedData = {"data": {"signature": signature, "cancer": "BLCA_TCGA", "type": type, "annot": annot}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/concordance"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"]["list"];
      var hS = response["data"]["hS"];
      document.getElementById("concordanceLoadingDiv").style.display = "none";
      document.getElementById("concordanceDiv").style.opacity = 1;
      setConcordanceState({signatures: resp, homeSignature: hS, originalName: signature, type: type, annot: annot})
      //console.log("concord return...", resp);
  })
}

function tablePlotRequest(SIGNATURE, type, setTableState, annotation="none") {
  var bodyFormData = new FormData();
  document.getElementById("tableLoadingDiv").style.display = "block";
  document.getElementById("rootTable").style.opacity = 0.2;
  
  var postedData = {"data": {"signature": SIGNATURE, "type": type}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/updatepantable"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"];
      document.getElementById("tableLoadingDiv").style.display = "none";
      document.getElementById("rootTable").style.opacity = 1;
      //console.log("OUTPUTTT", resp);
      setTableState({
        type: type,
        data: resp["outputdata"],
        sortedColumn: {
          name: "UID",
          order: false
        },
        signature: SIGNATURE,
        annotation: annotation,
        page: 0
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
    var twor1_split = twor1[1].split("-");
    var twor2_split = twor2[1].split("-"); 
    var coord1 = twor1_split[0];
    var coord2 = twor1_split[1];
    var coord3 = twor2_split[0];
    var coord4 = twor2_split[1];
    var coord_block = {"coord1": coord1, "coord2": coord2, "coord3": coord3, "coord4": coord4};
    exonRequest(ensg_id, coord_block, fulldata, exonPlotState, setExonPlotState, tableState, setTableState, sortedColumn);
}

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
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
            {
                id: tableState.sortedColumn.name,
                desc: tableState.sortedColumn.order
            }
        ],
        pageSize: tableState.pageSize,
        pageIndex: tableState.page
      }
    },
    useSortBy,
    usePagination
  )

  /*React.useEffect(() => {
    var allSelected = document.getElementsByClassName("HselectedRow");
    if(allSelected.length > 0)
    {
      for(var i = 0; i < allSelected.length; i++)
      {
        allSelected[i].className = "default";
      }
    }
  }, [columns])*/

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  var sortedColumn = undefined;

  headerGroups.map(headerGroup => (
    headerGroup.headers.map(column => (
      sortedColumn = column.isSorted ? column : sortedColumn
    ))
  ))

  const pageIterate = (inputValue) => {
    if(inputValue == "next")
    {
      //nextPage();
      console.log("tableState.page", tableState.page);
      gotoPage(tableState.page+1);
      setTableState({...tableState, page: tableState.page+1});
    }
    else if(inputValue == "previous")
    {
      previousPage();
      setTableState({...tableState, page: tableState.page-1});
    }
    else if(inputValue == "first")
    {
      gotoPage(0);
      setTableState({...tableState, page: 0});
    }
    else
    {
      gotoPage(pageCount - 1);
      setTableState({...tableState, page: pageCount - 1});
    }
  }
  React.useEffect(() => {
    if(sortedColumn == undefined)
    {
      sortedColumn = {id: undefined, isSortedDesc: undefined};
    }
    if(tableState.sortedColumn.name != sortedColumn.id || tableState.sortedColumn.order != sortedColumn.isSortedDesc ){
      setTableState({...tableState, sortedColumn: {
        name: sortedColumn.id,
        order: sortedColumn.isSortedDesc
      }})
    }
  })
  //console.log("sorted_column", sortedColumn);

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
          {page.map(
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
      <div className="pagination">
        <button onClick={() => pageIterate("first")} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => pageIterate("previous")} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => pageIterate("next")} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => pageIterate("last")} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex+1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
              //console.log("fsfsfooo", Number(e.target.value));
              setTableState({...tableState, page: Number(e.target.value) - 1});
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={tableState.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setTableState({...tableState, pageSize: Number(e.target.value)});
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

function RootTable(props) {

  var column_splice_obj = rootTableColumnSpliceObj;
  var column_gene_obj = rootTableColumnGeneObj;

  var columns_splc = React.useMemo(
    () => [
      {
        Header: 'Events for signature: '.concat(props.tableState.signature).concat(' | Annotations: ').concat(props.tableState.annotation),
        columns: column_splice_obj,
      },
    ],
    [props]
  )

  var columns_gene = React.useMemo(
    () => [
      {
        Header: 'Events for signature: '.concat(props.tableState.signature).concat(' | Annotations: ').concat(props.tableState.annotation),
        columns: column_gene_obj,
      },
    ],
    [props]
  )  

  if(props.input == undefined)
  {
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
            symbol: curpointer["symbol"],
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
    <div id="rootTable" style={{overflowX: "scroll", overflowY: "scroll", maxHeight: s_height, marginBottom: "6px"}}>
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
    //console.log("standard_width: ", window.innerWidth);
    //console.log("standard_height: ", window.innerHeight);
    //var scaled_width = window.innerWidth / 1920;
    //var scaled_height = window.innerHeight / 985;
    //var standard_width = 1438;
    //var standard_height = 707;
    var loading_Gif = isBuild ? <img src="/ICGS/Oncosplice/testing/loading.gif" width="200" height="60"></img> : <img src={loadingGif} width="200" height="60"></img>;

    console.log("cWindow", window.innerHeight);
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
        signatures: undefined,
        homeSignature: undefined,
        originalName: undefined,
        type: undefined,
        annot: undefined
    });

    const [vennState, setVennState] = React.useState({
      data: null,
      homeSignature: undefined,
      homeCount: 0,
      totalCount: 0,
      commonCount: 0
    });

    const [tableState, setTableState] = React.useState({
        type: "splice",
        data: undefined,
        sortedColumn: {
          name: "UID",
          order: false
        },
        signature: undefined,
        annotation: "none",
        page: 1,
        pageSize: 10
    });

    var doubleBarChartData = {cluster: null, gene: null, targetdiv: "doubleBarChartDiv"};
    const [stackedBarChartData, setStackedBarChartData] = React.useState({
      data: null,
      targetdiv: "stackedBarChartDiv" 
    })

    const resetDaugtherPanels = () => {
      setVennState({
        data: null,
        homeSignature: undefined,
        homeCount: 0,
        totalCount: 0,
        commonCount: 0
      })
      setConcordanceState({
        signatures: undefined,
        homeSignature: undefined,
        originalName: undefined,
        type: undefined,
        annot: undefined
      })
      setTableState({
        type: "splice",
        data: undefined,
        sortedColumn: {
          name: "UID",
          order: false
        },
        signature: undefined,
        annotation: "none",
        page: 1,
        pageSize: 10
      })
      setExonPlotState({
      exons: null,
      transcripts: null,
      junctions: null,
      in_data: null,
      scaled: false,
      targetdiv: "pancanc_splice",
      downscale: 1.45
      })
    }

    const resetBottomPanels = () => {
      setVennState({
        data: null,
        homeSignature: undefined,
        homeCount: 0,
        totalCount: 0,
        commonCount: 0
      })
      setExonPlotState({
        exons: null,
        transcripts: null,
        junctions: null,
        in_data: null,
        scaled: false,
        targetdiv: "pancanc_splice",
        downscale: 1.45
      })   
    }

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

    var panel_CancerSummary = {
        width: 0.235 * available_width,
        height: 0.93 * available_height,
        minWidth: 0.235 * available_width,
        minHeight: 0.93 * available_height,
        maxWidth: 0.235 * available_width,
        maxHeight: 0.93 * available_height
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

    //console.log("Concordance state...", concordanceState)

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
                  stackedBarChartRequest={stackedBarChartRequest}
                  resetDaugtherPanels={resetDaugtherPanels}
                  resetBottomPanels={resetBottomPanels}></SetDoubleBarChart>
                <div width="100%" id="doubleBarChartDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}></div>
                <SetStackedBarChart 
                  heightRatio={scaled_height}
                  widthRatio={scaled_width}
                  stackedBarChartState={stackedBarChartData}
                  tablePlotRequest={tablePlotRequest} 
                  tableState={tableState} 
                  setTableState={setTableState}
                  concordanceRequest={concordanceRequest}
                  concordanceState={concordanceState}
                  setConcordanceState={setConcordanceState}
                  resetDaugtherPanels={resetDaugtherPanels}
                  resetBottomPanels={resetBottomPanels}>
                  </SetStackedBarChart>
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
                concordanceState={concordanceState}
                vennState={vennState}
                setVennState={setVennState}>
              </SetConcordanceGraph>
              <div id="concordanceLoadingDiv" style={{position: "absolute", marginLeft: 15, display: "none", textAlign: "center", marginTop: 30}}>
              {loading_Gif}
              </div>
              <div width="100%" id="concordanceDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}>
              <h3>Select a signature from the graph on the left.</h3>
              </div>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SignatureEvents.width}
                height={panel_SignatureEvents.height}
                minConstraints={[panel_SignatureEvents.minWidth, panel_SignatureEvents.minHeight]}
                maxConstraints={[panel_SignatureEvents.maxWidth, panel_SignatureEvents.maxHeight]}>    
              <div id="tableLoadingDiv" style={{position: "absolute", marginLeft: 15, display: "none", textAlign: "center", marginTop: 30}}>
              {loading_Gif}
              </div>
                <RootTable input={tableState.data} type={tableState.type} exonPlotStateScaled={exonPlotState.scaled} setExonPlotState={setExonPlotState} tableState={tableState} setTableState={setTableState}></RootTable>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_OverlappingEvents.width}
                height={panel_OverlappingEvents.height}
                minConstraints={[panel_OverlappingEvents.minWidth, panel_OverlappingEvents.minHeight]}
                maxConstraints={[panel_OverlappingEvents.maxWidth, panel_OverlappingEvents.maxHeight]}
            >
              <div width="100%" id="overlapDiv" style={{overflow: "scroll", height: "100%", width: "100%"}}>
              <h3>Selection from concordance values above required.</h3>
              </div>
              <SetVennDiagram sizeObj={panel_OverlappingEvents} vennState={vennState} setTableState={setTableState}></SetVennDiagram>
            </ResizableBox>
                    
            <ResizableBox
                className="box"
                width={panel_SplicingGraph.width}
                height={panel_SplicingGraph.height}
                minConstraints={[panel_SplicingGraph.minWidth, panel_SplicingGraph.minHeight]}
                maxConstraints={[panel_SplicingGraph.maxWidth, panel_SplicingGraph.maxHeight]}
            >
                <div id="panSpliceLoadingDiv" style={{position: "absolute", marginLeft: 15, display: "none", textAlign: "center", marginTop: 30}}>
                {loading_Gif}
                </div>
                <div style={{overflow: "scroll", height: "100%", width: "100%", backgroundColor: "white", margin: 10}}>
                <SetExonPlot exonPlotState={exonPlotState} setExonPlotState={setExonPlotState}></SetExonPlot>
                <div id="pancanc_splice"></div>
                <h3>Selection required from table above.</h3>
                </div>
            </ResizableBox>
            </div>
            </div>
        </div>
    );
}

export default PanCancerAnalysis;