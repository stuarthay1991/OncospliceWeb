import styled from 'styled-components';
import { Nav, Dropdown, Button, ButtonToolbar, IconButton} from "rsuite";
export const isBuild = process.env.NODE_ENV === "build";
export const global_colors = ["#0096FF", "#fffb00", "#FF7F7F", "#44D62C", "#9300c4", "#f78000", "#828282", "#32a852", "#8e7be3", "#e6b035",
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
      Header: 'geneid',
      accessor: 'geneid',
      maxWidth: '21px',
    },
    {
      Header: 'symbol',
      accessor: 'symbol',
      maxWidth: '21px',
    },
    {
      Header: 'Logfold',
      accessor: 'logfold',
      maxWidth: '21px',
    },
    {
      Header: 'rawp',
      accessor: 'rawp',
      maxWidth: '21px',
    },
    {
      Header: 'adjp',
      accessor: 'adjp',
      maxWidth: '21px',
    },
    {
      Header: 'avg_self',
      accessor: 'avg_self',
      maxWidth: '21px',
    },
    {
      Header: 'avg_others',
      accessor: 'avg_others',
      maxWidth: '21px',
    }
]

export function DropdownCancers(props){
  return(
    <>
      <Dropdown.Item eventKey={"BLCA"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Bladder Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"BRCA"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Breast Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"CESC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Cervical Squamous Cell Carcinoma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"COAD"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Colon Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"ESCA"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Esophageal Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"GBM"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Glioblastoma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"HNSC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Head and Neck Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"KICH"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Kidney Chromophobe (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"KIRC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Kidney Renal Clear Cell Carcinoma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"LGG"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Low-Grade Gliomas (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"LIHC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Liver Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"LUAD"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Lung Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"OV"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Ovarian Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"PAAD"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Pancreatic Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"PCPG"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Pheochromocytoma and paraganglioma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"PRAD"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Primary Prostate Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"READ"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Rectal Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"SARC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Bone and Connective Tissue Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"SKCM"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Skin Cancer (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"STAD"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Stomach Adenocarcinoma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"TGCT"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Tenosynovial Giant Cell Tumors (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"THCA"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Thyroid Carcinoma (TCGA)"}
      </Dropdown.Item>
      <Dropdown.Item eventKey={"UCEC"} style={{fontSize: 12, margin: 1, padding: 1}}>
      {"Uterine Serous Cancer (TCGA)"}
      </Dropdown.Item>
    </>
  );
}

export const BLCA_vals = {
    "psi_r3_v10_vs_others": 40,
    "psi_r2_v25_vs_others": 80,
    "psi_r1_v6_vs_others": 335,
    "psi_r1_v4_vs_others": 483,
    "psi_r1_v5_vs_others": 4913,
    "psi_r2_v2_vs_others": 392,
    "psi_r2_v11_vs_others": 548,
    "psi_r1_v2_vs_others": 3051,
    "psi_r2_v3_vs_others": 380,
    "psi_r2_v26_vs_others": 272,
    "psi_r2_v16_vs_others": 141,
    "psi_r3_v7_vs_others": 141,
    "psi_r2_v24_vs_others": 104,
    "psi_r2_v22_vs_others": 51,
    "psi_r1_v3_vs_others": 1010,
    "psi_r3_v25_vs_others": 411,
    "psi_r2_v18_vs_others": 94,
    "psi_r3_v0_vs_others": 57,
    "psi_r1_v7_vs_others": 1594,
    "psi_r1_v1_vs_others": 736
}



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
