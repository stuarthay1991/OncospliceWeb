import styled from 'styled-components';

export const isBuild = process.env.NODE_ENV === "build";
export const global_colors = ["#0096FF", "Yellow", "#FF7F7F", "#44D62C", "Purple", "Orange", "Grey", "#32a852", "#8e7be3", "#e6b035", 
"#b5109f", "#8bab59", "#782b51", "#366fd9", "#f0b3ff", "#5d1ca3", "#d94907", "#32a8a6", "#ada50c", "#bf1b28", "#0000b3", "#ffc61a", "#336600"];

export const rootTableColumnSpliceObj = [
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

export const rootTableColumnGeneObj = [
    {
      Header: 'symbol',
      accessor: 'symbol',
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

export const BLCA_vals = {"psi_pde4d_del_vs_others": 875,
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

export const tableStyledDiv = styled.div`
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


// // #make the global color structure like this
// export const global_colors = { "Yellow": "#0096FF"}