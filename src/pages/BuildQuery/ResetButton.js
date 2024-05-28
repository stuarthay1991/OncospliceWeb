import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from '../../css/useStyles.js';
import '../../App.css';

function reload() {
    window.location.href = "http://www.altanalyze.org/ICGS/Oncosplice/build/index.html/build";
}

function ResetButton(){
  const classes = useStyles();
  return(
  	<Tooltip title="Remove all queries.">
    <Button onClick={() => reload()} uppercase={false} style={{  backgroundColor:'#EFAD18',
  																			borderRadius:'8px',
																			display:'inline-block',
																			cursor:'pointer',
																			color:'#ffffff',
																			borderColor: 'white',
																			fontFamily: 'Roboto',
																			fontSize:'22px',
																			fontWeight:'bold',
																			padding:'13px 32px',
																			textDecoration:'none',
																			textShadow:'0px 1px 0px #3d768a',
																			textTransform: 'none'}}>Reset</Button>
    </Tooltip>
  )
}
//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
export default ResetButton;