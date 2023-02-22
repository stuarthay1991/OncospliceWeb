import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form'
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
  const [pageTypeState, setPageTypeState] = React.useState({"value": "Individual Signatures", "initialized": false})
  var oncoimg = isBuild ? <img src="/ICGS/Oncosplice/testing/OncoLOGO2.png" alt="Logo" width="180" height="63"></img> : <img src={oncologo} alt="Logo" width="180" height="63"></img>;

  const onSelectHandle = (e) => {
    setPageTypeState({"value": e.target.value, "initialized": true});
  }

  React.useEffect(() => {
    if(pageTypeState.initialized)
    {
      if(pageTypeState.value == "Individual Signatures")
      {
        document.getElementById("tabcontent").style.display = "block";
        document.getElementById("pancancerpanel").style.display = "none";
      }
      else
      {
        document.getElementById("tabcontent").style.display = "none";
        document.getElementById("pancancerpanel").style.display = "block";        
      }
    }
  }, [pageTypeState.value])

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.mainpane_margin}>
      <Grid container spacing={1}>
        <Grid container item xs={9}>
        <Grid item xs={3}>
          <div className={classes.cntr_special}>{oncoimg}</div>
        </Grid>
        <Grid item xs={3}>
          <div id="LoadingStatusDisplay" style={{display: "none"}}>Loading...</div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "#0F6A8B", textDecoration: "none"}}>Contact</a></div>
        </Grid>
        </Grid>
        <Grid container item xs={3} justifyContent="flex-end">
          <Form.Control as="select"
                  value={pageTypeState.value}
                  onChange={onSelectHandle}
                  name="value"
                  style={{
                    backgroundColor: '#0F6A8B',
                    color: "white",
                    fontSize: "0.9em",
                    height: "66%",
                    margin: 2,
                    padding: 2,
                    bordeRadius: 3,
                    cursor: "pointer"
                  }}>
                  <option value="Individual Signatures">Individual Signatures</option>
                  <option value="Pancancer Analysis">Pancancer Analysis</option>
          </Form.Control>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default TopNav;