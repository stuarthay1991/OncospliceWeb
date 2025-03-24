import '@fontsource/roboto';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useRef } from "react";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import styled from 'styled-components'
import { useTable, useSortBy, usePagination } from 'react-table';


const Styles = styled.div`
padding: 1rem;

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            table-layout: fixed;
        }

        th, td {
            padding: 10px 15px;
            border: 1px solid #ddd;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        th {
            background-color: #f4f4f4;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f1f1f1;
        }
}
`
  
function Table({ columns, data, tableState, newPageTotal, tablePlotRequest, setTableState, pseudoPage }) {
    // Use the state and functions returned from useTable to build your UI
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
    } = useTable({
      columns,
      data,
      initialState: {
        pageSize: tableState.pageSize,
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
    )

    var data = tableState.data;
  
    const pageIterate = (inputValue) => {
        if(inputValue == "next")
        {
            var newPseudoPage = pseudoPage+1;
            tablePlotRequest("gtexpsi", "initial", newPseudoPage, setTableState, tableState.pageSize);
        }
        else if(inputValue == "previous")
        {
            var newPseudoPage = pseudoPage-1;
            tablePlotRequest("gtexpsi", "initial", newPseudoPage, setTableState, tableState.pageSize);
        }
        else if(inputValue == "first")
        {
            var newPseudoPage = 0;
            tablePlotRequest("gtexpsi", "initial", newPseudoPage, setTableState, tableState.pageSize);
        }
        else
        {
            var newPseudoPage = newPageTotal-1;
            tablePlotRequest("gtexpsi", "initial", newPseudoPage, setTableState, tableState.pageSize);
        }
    }

    // Render the UI for your table
    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map(
                    (row, i) => {
                    prepareRow(row);
                    //console.log("input_coords", inputcoords);
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
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
                <button onClick={() => pageIterate("first")} disabled={pseudoPage==0}>
                {"<<"}
                </button>{" "}
                <button onClick={() => pageIterate("previous")} disabled={pseudoPage==0}>
                {"<"}
                </button>{" "}
                <button onClick={() => pageIterate("next")} disabled={pseudoPage==newPageTotal-1}>
                {">"}
                </button>{" "}
                <button onClick={() => pageIterate("last")} disabled={pseudoPage==newPageTotal-1}>
                {">>"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {parseInt(pseudoPage)+1} of {newPageTotal}
                    </strong>{" "}
                </span>
                <span>
                | Go to page:{" "}
                <input
                    type="number"
                    defaultValue={pageIndex+1}
                    onChange={(e) => {
                    var newPseudoPage = e.target.value-1;
                    console.log("fsfsfooo", Number(e.target.value));
                    tablePlotRequest("gtexpsi", "initial", newPseudoPage, setTableState, tableState.pageSize);
                    }}
                    style={{ width: "100px" }}
                />
                </span>{" "}
                <select
                value={tableState.pageSize}
                onChange={(e) => {
                    setPageSize(e.target.value);
                    tablePlotRequest("gtexpsi", "initial", pseudoPage, setTableState, e.target.value);
                }}
                >
                {[10, 20, 30, 40, 50, 100, 1000].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
                </select>
            </div>
      </>
    )
}

const convertFloatToIntAndString = (stringInput, pageSize) => {
    var floatValue = parseFloat(stringInput);
    pageSize = parseFloat(pageSize);
    var newPageNumber = floatValue / pageSize;
    if (isNaN(newPageNumber)) {
      throw new Error("Invalid number input");
    }
    var newFloatValue =  Math.ceil(newPageNumber);    
    const integerValue = Math.trunc(newFloatValue); // Convert to an integer
    const stringValue = integerValue.toString(); // Convert back to a string
    return stringValue;
  };

function MajorTable(props) {
    var columns = props.columns;
    var tableState = props.tableState;
    var data = tableState.data;
    if(data == undefined)
    {
        var new_data = [];
        let curdat = {
            uid: "none",
            event_direction: "none",
            clusterid: "none",
            eventannotation: "none",
            coordinates: "none",
            proteinpredictions: "none",
            dpsi: "none",
            rawp: "none",
            adjp: "none",
            avg_others: "none"
        }
        new_data.push(curdat);
        data = new_data;
    }
    var newPageTotal = convertFloatToIntAndString(tableState.totalEntries, tableState.pageSize);
    console.log("data columns", data, columns);
    return (
        <div id="rootTable" style={{overflowX: "scroll", overflowY: "scroll", marginBottom: "6px"}}>
        <Styles>
          <Table columns={columns} 
          tableState={tableState}
          data={data}
          newPageTotal={newPageTotal}
          tablePlotRequest={props.tablePlotRequest}
          setTableState={props.setTableState}
          pseudoPage={props.tableState.pseudoPage}
          />
        </Styles>
        </div>
    ) 
}
  
export default MajorTable;