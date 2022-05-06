import React from 'react';
import ReactDOM from 'react-dom';
import useStyles from './useStyles.js';
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
import BQPane from './pages/BuildQuery/BuildQueryPane.js';
import ViewPaneWrapper from './ViewPaneWrapper.js';
import Authentication from './Authentication.js';
import QueryHistoryPaneWrapper from './QueryHistoryPaneWrapper.js';

const spcTabStyles = makeStyles({
  root: {
    backgroundColor: "#edf0f5",
    color: '#0F6A8B',
    fontSize: 16,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  },
  selected: {
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: 16,
    paddingRight: 43,
    paddingLeft: 43,
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

  //This is a hack I used to solve a serious problem I was having with storing cache data in the website router. Basically, whenever a user would
  //select a new tab, serious bugs would start appearing. The history was recorded in the cache and it would display properly at first, but I was
  //running into a multitude of serious errors that were taking way to long to fix. The solution Nathan & I agreed upon was to just reload the entire
  //application whenever a user moved back to the "build query" pane.
  if(props.pagelist.length > 1 && page=="build")
  {
    window.location.reload(true);
  }
  if(params["options"] != undefined){
    console.log(params["options"]);
  }

  //These are just basic converters to change the url appendage "page" to an integer value so it can be compatible with the tab system that I'm using.
  const tabNameToIndex = {
    0: "build",
    1: "explore",
    2: "history"
  };

  const indexToTabName = {
    build: 0,
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
    viewpaneobj: {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []},
    //"value" dictates what page we are currently viewing.
    value: indexToTabName[page],
    //Currently logged in user.
    authentication: {
      user: "Default",
      data: []
    },
    //"bqstate" describes what will be shown on the "build query" tab. This is where most of the problems lie. It is needlessly complicated at present and could
    //use redesign, but currently it is too risky to move anything.
    bqstate: {
      defaultQuery: false, //This informs whether or not the "default query" selection has been ticked.
      queuebox_values: {"children": undefined, "signatures": undefined}, //This represents what will be populated into the queuebox on the right hand side of the build query pane. As the user selects options, the list will populate.
      pre_queueboxvalues: {"children": {}, "signatures": {}}, //This is currently just used to store some information for clinical metadata and signature queries. It holds the same keys as queryboxchildren, but it used much less and will likely be replaced with a more pertinent variable in the future.
      eventfilterSet: null, //This denotes whether the event filter has been selected or not; will likely remove in the future as it is redundant.
      resultamount: {"samples": 0, "events": 0}, //This informs the "prospective results" at the bottom of the querybox. 
      childrenFilters: {}, //When a filter is selected on the left hand side of the build query pane, a set of sub-options for that filter will appear in the queuebox on the right. For example, if a user selects "Age" the age ranges will appear in a combobox inside the queuebox. This varaible holds those values.
      postoncosig: [], // When a signature is selected, it is added to this variable. Using "keys" to retrieve it, it is used in both the query and populating the queuebox.
      queryFilter: {}, // This currently holds the same information as childrenFilters and will likely be deleted soon.
      querySignature: {}, // This currently holds the same information as postoncosig and will likely be deleted soon.
      clientcoord: [], //If the user has selected genomic coordinates in their query, this list will hold them. This list is sent directly to the database for retrieval.
      clientgenes: [], //If the user has selected genes in their query, this list will hold them. This list is sent directly to the database for retrieval.
      keys: {"filter": [], "single": []}, //The "keys" are crucial. These are a way to keep track of every filter and signature that has been selected, a unique ID is created on the fly for each one and stored here.
      range: undefined, //Some filters have numerical, rather than categorical, values. This keeps track of whether or not the chosen filter is numerical, and whether or not that numerical filter has ranges of numbers, as opposed to individual numbers. For example, instead of individual ages of patients, a RANGE will have groups of ages, such as "18-30", "31-50", etc.
      cancer: "", //This informs the currently selected cancer.
      ui_fields: {}, //This is important. When the user initially selects a cancer, there are a set of clinical metadata filters specific to that cancer that must be retrieved from the database. These are then used to populate the UI. This object informs that process.
      export: {}, //This is misc information that is sent to the "export" object in viewpaneobj.
      genes: [], //I'm almost certain this is deprecated and will be removed soon.
      coordinates: [], //I'm almost certain this is deprecated and will be removed soon.
      signatures: undefined, // When a cancer for signatures specifically is selected, the list to choose from each signature is populated here.
      sigTranslate: undefined, //The signatures have two different values: one is a strict literature value, and another is a more readable, shortened version. This dictionary allows us to switch between the two.
      filterboxSEF: "", //"Select Event Filter object." This informs the the associated dropdown menu, allowing the user to select between genes, coordinates or signatures.
      SEFobj: null, //This directly holds the UI object of the Select Event Filter. It's a sloppy solution that I may change quite soon.
      compared_cancer: null, //If the signature filter has been selected, a user may choose any other cancer's signatures to match with the current cancer. The cancer chosen will appear here.
      sigdisplay: "none" //This informs whether or not to display the signatures div. It's a sloppy solution that I may change quite soon.
    }
  });

  //Whenever a Tab is selected, this function is triggered.
  const handleChange = (event, newValue) => {
      //Since the contact & about panel are not strictly part of the tabs, they should always be hidden.
      document.getElementById("contactpanel").style.display = "none";
      document.getElementById("aboutpanel").style.display = "none";
      //The tabcontent div should always be displayed when a tab is selected.
      document.getElementById("tabcontent").style.display = "block";
      //This is currently not useful; for previous purposes of cache history, the page selected is pushed into the history array.
      history.push(`/app/${tabNameToIndex[newValue]}`);
      //This is a hack. If the "build query" tab is re-selected, the page reloads in order to prevent bugs.
      if(newValue == 0)
      {
        var temp_view_obj = {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []};
        window.location.reload(true);
      }
      setMpstate({
        ...mpstate,
        value: newValue,
        bqstate: mpstate.bqstate,
        viewpaneobj: temp_view_obj,
      });
  };

  //The purpose of this function is to allow the "build query" pane to transition to the "data exploration" pane when a query has been sent through.
  const setViewPane = (list1, list2, list3, list4, list5, exp, bqstate) => {
    var stateobj = {};
    stateobj["inData"] = list1;
    stateobj["inCols"] = list2;
    stateobj["inCC"] = list3;
    stateobj["inRPSI"] = list4;
    stateobj["inTRANS"] = list5;
    stateobj["export"] = exp;
    history.push(`/app/${tabNameToIndex[1]}`);
    setMpstate({
        viewpaneobj: stateobj,
        authentication: mpstate.authentication,
        value: 1,
        bqstate: bqstate,
    });
  }

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
  React.useEffect(() => {
    if(mpstate.value != indexToTabName[page])
    {
        setMpstate({
          ...mpstate,
          value: indexToTabName[page],
        });
    }
  }, [mpstate.value])

  //This is the layout of the main pane in action.
  //It's important to note that the "Tabs" element informs the UI for the Tabs, while further down the "tabcontent" div informs the actual substance of those tab selections.
  //"Authentication" informs the currently broken google authentication feature, which will be crucial to implementing the UUID based routing framework.
  return (
    <div className={classes.root} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.demo2}>
        <div className={classes.tabholder}>
        <Grid container spacing={0}>
        <Grid item sm={12} md={9}>
        <Typography className={classes.padding} />
        <Tabs id="tabset" value={mpstate.value} onChange={handleChange} aria-label="simple tabs example" TabIndicatorProps={{style: {background:'#EFAD18'}}}>
          <Tab classes={tabstyle} label="Build Query" style={{ textTransform: 'none'}}/>
          <Tab classes={tabstyle} label="Explore Data" style={{ textTransform: 'none'}}/>
          <Tab classes={tabstyle} icon={<LockIcon />} label="Query History" style={{ textTransform: 'none'}}></Tab>
        </Tabs>
        </Grid>
        <Grid item sm={12} md={3}>
        <Typography className={classes.padding} />
        <div style={{float: "right"}}>
          <Authentication updateQH={updateQH}/>
        </div>
        </Grid>
        </Grid>
        </div>
      </div>
      <div id="tabcontent" style={{display: "block"}}>
      {mpstate.value === 0 && <BQPane setViewPane={setViewPane}/>}
      {mpstate.value === 1 && <ViewPaneWrapper entrydata={mpstate.viewpaneobj} validate={indexToTabName[page]}/>}
      {mpstate.value === 2 && <QueryHistoryPaneWrapper user={mpstate.authentication.user} data={mpstate.authentication.data}/>}
      </div>
      <div id="aboutpanel" style={{display: "none", margin: 15}}>
        <AboutUs />
      </div>
      <div id="contactpanel" style={{display: "none", margin: 15}}>
        <div>
          <Box borderLeft={3} borderColor={'#0F6A8B'}>
          <div style={{marginLeft: 15, marginTop: 20, fontSize: 24}}>
            <p>Contact: <a href="mailto: altanalyze@gmail.com">altanalyze@gmail.com</a></p>
          </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default MainPanel;