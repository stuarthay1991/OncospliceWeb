import React from 'react';
import ReactDOM from 'react-dom';
import useStyles from './css/useStyles.js';
import Grid from '@material-ui/core/Grid';
import { isBuild } from './utilities/constants.js';
import oncologo from './images/OncoLOGO2.png';

function loadAbout()
{
  document.getElementById("aboutpanel").style.display = "block";
  document.getElementById("contactpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "none";
}

function loadContact()
{
  document.getElementById("contactpanel").style.display = "block";
  document.getElementById("aboutpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "none";
}

function TopNav() {
  const classes = useStyles();

  var oncoimg = isBuild ? <img src="/ICGS/Oncosplice/testing/OncoLOGO.png" alt="Logo" width="500" height="130"></img> : <img src={oncologo} alt="Logo" width="309" height="108"></img>;

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.mainpane_margin}>
      <Grid container spacing={1}>  
        <Grid item xs={3}>
          <div className={classes.cntr_special}>{oncoimg}</div>
        </Grid> 
        <Grid item xs={4}>
        </Grid> 
        <Grid item xs={5}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "#0F6A8B", textDecoration: "none"}}>Contact</a></div>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default TopNav;