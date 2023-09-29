import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form'
import useStyles from './css/useStyles.js';
import Grid from '@material-ui/core/Grid';
import { isBuild } from './utilities/constants.js';
import React, { useRef } from "react";
import oncologo from './images/OncoLOGO2.png';

function loadAbout()
{
  document.getElementById("aboutpanel").style.display = "block";
  document.getElementById("contactpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "none";
  document.getElementById("pancancer").style.display = "none";
  document.getElementById("dropdownOptionsDiv").style.display = "none";
  document.getElementById("navBarHolder").style.display = "none";
}

function loadHome()
{
  document.getElementById("aboutpanel").style.display = "none";
  document.getElementById("contactpanel").style.display = "none";
  document.getElementById("tabcontent").style.display = "block";
  document.getElementById("pancancer").style.display = "none";  
  document.getElementById("dropdownOptionsDiv").style.display = "block";
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

  const [maskPage, setMaskPage] = React.useState({"name": "data"});

  const prevPageTypeState = useRef();
  const prevMaskPage = useRef();

  const onSelectHandle = (e) => {
    setPageTypeState({"value": e.target.value, "initialized": true});
  }

  const onSelectHome = (e) => {
    setMaskPage({"name": "data"});
  }

  const onSelectAbout = (e) => {
    console.log("wat a dolla");
    setMaskPage({"name": "about"});
  }

  React.useEffect(() => {
    if(prevPageTypeState.current != undefined)
    {
      if(prevPageTypeState.current != pageTypeState)
      {
        if(pageTypeState.value == "Individual Signatures")
        {
          document.getElementById("tabcontent").style.display = "block";
          document.getElementById("pancancerpanel").style.display = "none";
          document.getElementById("gridItem1").style.display = "block";
          document.getElementById("gridItem2").style.display = "block";
          document.getElementById("gridItem3").style.display = "block";
          document.getElementById("gridItem4").style.display = "block";
          document.getElementById("gridItem5").style.display = "block";
          document.getElementById("gridItem6").style.display = "block";
          document.getElementById("gridItem7").style.display = "block";
        }
        else
        {
          document.getElementById("tabcontent").style.display = "none";
          document.getElementById("pancancerpanel").style.display = "block";
          document.getElementById("gridItem1").style.display = "block";
          document.getElementById("gridItem2").style.display = "none";
          document.getElementById("gridItem3").style.display = "none";
          document.getElementById("gridItem4").style.display = "block";
          document.getElementById("gridItem5").style.display = "block";
          document.getElementById("gridItem6").style.display = "none";
          document.getElementById("gridItem7").style.display = "none";      
        }
      }
    }
    prevPageTypeState.current = pageTypeState;
  }, [pageTypeState.value])

  React.useEffect(() => {
    if(prevMaskPage.current != undefined)
    {
      console.log("PM 1");
      if(prevMaskPage.current != maskPage)
      {
        console.log("PM 2", maskPage.name);
        if(maskPage.name == "data")
        {
          document.getElementById("rocket_magnum").style.display = "block";
          if(pageTypeState.value == "Individual Signatures")
          {
            document.getElementById("tabcontent").style.display = "block";
            document.getElementById("pancancerpanel").style.display = "none";
            document.getElementById("gridItem1").style.display = "block";
            document.getElementById("gridItem2").style.display = "block";
            document.getElementById("gridItem3").style.display = "block";
            document.getElementById("gridItem4").style.display = "block";
            document.getElementById("gridItem5").style.display = "block";
            document.getElementById("gridItem6").style.display = "block";
            document.getElementById("gridItem7").style.display = "block";
          }
          else
          {
            document.getElementById("tabcontent").style.display = "none";
            document.getElementById("pancancerpanel").style.display = "block"; 
            document.getElementById("gridItem1").style.display = "block";
            document.getElementById("gridItem2").style.display = "none";
            document.getElementById("gridItem3").style.display = "none";
            document.getElementById("gridItem4").style.display = "block";
            document.getElementById("gridItem5").style.display = "block";
            document.getElementById("gridItem6").style.display = "none";
            document.getElementById("gridItem7").style.display = "none";       
          }
          document.getElementById("aboutpanel").style.display = "none";
          document.getElementById("contactpanel").style.display = "none";
          document.getElementById("dropdownOptionsDiv").style.display = "block";
          document.getElementById("navBarHolder").style.display = "block";
        }
        else
        {
          document.getElementById("rocket_magnum").style.display = "none";
          document.getElementById("aboutpanel").style.display = "block";
          document.getElementById("contactpanel").style.display = "none";
          document.getElementById("tabcontent").style.display = "none";
          document.getElementById("pancancerpanel").style.display = "none";
          document.getElementById("dropdownOptionsDiv").style.display = "none";
          document.getElementById("navBarHolder").style.display = "none";
        }
      }
    }
    prevMaskPage.current = maskPage;
  },  [maskPage.name])

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Roboto'}}>
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
          <div className={classes.cntr_generic}><a onClick={onSelectHome} style={{cursor: "pointer"}}>Home</a> | <a onClick={onSelectAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "#0F6A8B", textDecoration: "none"}}>Contact</a></div>
        </Grid>
        </Grid>
        <Grid container item xs={3} justifyContent="flex-end">
          <span id="rocket_magnum">
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
          </span>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default TopNav;