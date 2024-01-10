import React from 'react';
import ReactDOM from 'react-dom';
import useStyles from './css/useStyles.js';
import AboutUs from './components/AboutUs';
import '@fontsource/roboto';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import targeturl from './targeturl.js';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import './App.css';
import Header from './components/NavBarDropdown.js';
import ViewPanelWrapper from './ViewPanelWrapper.js';
import { makeRequest } from './request/CancerDataManagement.js';
//import Authentication from './Authentication.js';
import PanCancerAnalysis from './PanCancerAnalysis.js';

const spcTabStyles = makeStyles({
  root: {
    backgroundColor: "#edf0f5",
    color: '#0F6A8B',
    fontSize: "1em",
    paddingRight: 34,
    paddingLeft: 34,
    marginLeft: 5,
    marginRight: 5
  },
  selected: {
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: "1em",
    paddingRight: 34,
    paddingLeft: 34,
    marginLeft: 5,
    marginRight: 5
  }
});

var GLOBAL_user = "Default";

function none()
{
  return null;
}

function MainPanel(props){
  const classes = useStyles();
  const tabstyle = spcTabStyles();

  //What is crucial here is the item "page." This contains the appendage to the base url that dictates what part of the website to view.
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  //Each time the user selects an option, it is recorded in the "pagelist" cache variable which is not used now, but could be useful later.
  props.addPage(page);
  
  //These are just basic converters to change the url appendage "page" to an integer value so it can be compatible with the tab system that I'm using.
  const tabNameToIndex = {
    1: "explore",
    2: "history"
  };

  const indexToTabName = {
    explore: 1,
    history: 2
  };

  //This is crucial. The purpose of this state object is to pass the correct information to rebuild the page exactly as it was in the cache. It is currently
  //unused, because of the aforementioned bugs, but it will be necessary when we implement the UUID system.
  const [mpstate, setMpstate] = React.useState({
    //"viewpaneobj" informs the Data Exploration tab, where the heatmap is stored. Objects here inform what values the heatmap and other plots have.
    //In order, "inData" describes the heatmap row values, "inCols" describes the column header values, "inCC" describes the hierarchical clusters, "inRPSI"
    //describes the Oncosplice clusters, "inTRANS" is a dictionary to relate between postgres-friendly modified strings and their original values, and "export"
    //contains an array of misc information to help build the heatmap.
    viewpaneobj: {"heatmapInputData": [], "inCols": [], "inCC": [], "inOncospliceClusters": [], "inTRANS": [], "export": []},
    //"value" dictates what page we are currently viewing.
    value: indexToTabName[page],
    //Currently logged in user.
    authentication: {
      user: "Default",
      data: []
    }
  });

  if(process.env.NODE_ENV == "build")
  {
    var routeurl = "/ICGS/Oncosplice/build/index.html/";
  }
  else
  {
    var routeurl = "/app/"
  }
  //Whenever a Tab is selected, this function is triggered.
  const handleChange = (event, newValue) => {
      //Since the contact & about panel are not strictly part of the tabs, they should always be hidden.
      document.getElementById("contactpanel").style.display = "none";
      document.getElementById("aboutpanel").style.display = "none";
      //The tabcontent div should always be displayed when a tab is selected.
      document.getElementById("tabcontent").style.display = "block";
      //This is currently not useful; for previous purposes of cache history, the page selected is pushed into the history array.
      history.push(routeurl.concat(`${tabNameToIndex[newValue]}`));
      //This is a hack. If the "build query" tab is re-selected, the page reloads in order to prevent bugs.
      if(newValue == 0)
      {
        var temp_view_obj = {"heatmapInputData": [], "inCols": [], "inCC": [], "inOncospliceClusters": [], "inTRANS": [], "export": []};
        window.location.reload(true);
      }
      setMpstate({
        ...mpstate,
        value: newValue,
        viewpaneobj: temp_view_obj,
      });
  };

  //The purpose of this function is to allow the "build query" pane to transition to the "data exploration" pane when a query has been sent through.
  const setViewPane = (list1, list2, list3, list4, list5, exp) => {
    var stateobj = {};
    //console.log("heatmap updating...", list1)
    stateobj["heatmapInputData"] = list1;
    stateobj["inCols"] = list2;
    stateobj["inCC"] = list3;
    stateobj["inOncospliceClusters"] = list4;
    stateobj["inTRANS"] = list5;
    stateobj["export"] = exp;
    history.push(routeurl.concat(`${tabNameToIndex[1]}`));
    setMpstate({
        viewpaneobj: stateobj,
        authentication: mpstate.authentication,
        value: 1
    });
  }

  const [panCancerState, setPanCancerState] = React.useState({"DEtableData": undefined, "tableData": undefined, "clusterLength": undefined, "cancer": undefined});

  //update query history function
  const updateQH = (new_user, data) => {
        setMpstate({
          ...mpstate,
          authentication: {
            user: new_user,
            data: data
          }
        });    
  }


  //This is a hack I useed. For whatever reason, I would sometimes have issues getting the correct tab to show up. This function fixed it, ahd while
  //I'm not 100% sure why, it works, and so therefore it stays.
  
  var mpv = mpstate.viewpaneobj;
  //console.log("mpv", mpv);
  React.useEffect(() => {
    //console.log("mpstate updating...", mpstate.viewpaneobj)
    if(mpstate.value != indexToTabName[page])
    {
        setMpstate({
          ...mpstate,
          value: indexToTabName[page],
        });
    }
  }, [mpstate.value])

  //Fetch data from the heatmap
  /*React.useEffect(() => {
    console.log("mpstate updating...", mpstate.viewpaneobj)
    if(mpv !== mpstate.viewpaneobj)
    {

    }
  }, [mpstate.viewpaneobj])*/

  if(props.pagelist.length <= 1 && page == "explore")
  {
    var args = {};
    var functionpointer = makeRequest;
    args["setState"] = setViewPane;
    args["pancancerupdate"] = setPanCancerState;
    args["export"] = {};
    args["cancer"] = "BRCA";
    args["doc"] = document;
    makeRequest("defaultQuery", args);
  }
  //This is the layout of the main pane in action.
  //It's important to note that the "Tabs" element informs the UI for the Tabs, while further down the "tabcontent" div informs the actual substance of those tab selections.
  //"Authentication" informs the currently broken google authentication feature, which will be crucial to implementing the UUID based routing framework.
  /*      <div style={{float: "right"}}>
          <Authentication updateQH={updateQH}/>
        </div>*/
  return (
    <div className={classes.root} style={{ fontFamily: 'Roboto'}}>
      <div id="navBarHolder" className={classes.demo2}>
        <div className={classes.tabholder}>
        <div>
          <Header setViewPane={setViewPane} setPanCancerState={setPanCancerState}/>
        </div>
        </div>
      </div>
      <div id="tabcontent" style={{display: "block"}}>
      {mpstate.value === 1 && <ViewPanelWrapper entrydata={mpstate.viewpaneobj} validate={indexToTabName[page]}/>}
      </div>
      <div id="pancancerpanel" style={{display: "none"}}>
        <PanCancerAnalysis clusterLength={panCancerState.clusterLength} tableData={panCancerState.tableData} cancerName={panCancerState.cancer}/>
      </div>
      <div id="aboutpanel" style={{display: "none", backgroundColor: "#0f6a8b"}}>
        <AboutUs />
      </div>
      <div id="contactpanel" style={{display: "none", margin: 15}}>
        <div>
          <Box borderLeft={3} borderColor={'#0F6A8B'}>
          <div style={{marginLeft: 15, marginTop: 20, fontSize: "1.5em"}}>
            <p>Contact: <a href="mailto: altanalyze@gmail.com">altanalyze@gmail.com</a></p>
          </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default MainPanel;