import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import '@fontsource/roboto';
import {Helmet} from "react-helmet";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createMuiTheme } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';


import BQPane from './pages/BuildQuery/BuildQueryPane.js';

//import OKMAP from './ViewPane.js';
import useStyles from './useStyles.js';
import ViewPane from './ViewPane.js';
import QueryHistory from './QueryHistory';
import TabPanel from './components/TabPanel';
import SpcInputLabel from './components/SpcInputLabel';
import CheckboxForm from './components/CheckboxForm';
import AboutUs from './components/AboutUs';

import { makeRequest } from './request/CancerDataManagement.js';
//import ClientAddFilter from './ClientAddFilter.js'

//These are just some CSS props
const defaultProps = {
  m: 1,
};

const boxProps = {
  border: 3,
};

const boxProps_padding = {
  border: 3,
  margin: 1,
  paddingRight: '10px',
  display: 'inline-block',
};

//Versioning
var version = "0.1";

//Global Variables
var flag = 0;

var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";
var buildurl = "/ICGS/Oncosplice/build";
var hoturl = "/ICGS/Oncosplice/hotload";
const targeturl = serverurl;

var routeurl = "/ICGS/Oncosplice/testing/index.html"

var queryhistory_dat = [];
var GLOBAL_user = "Default";

//This is a hacky way to transition into the view pane; it is currently vital and in use, but will need to be changed in the future.
//There should be a more simple and streamlined way to do this; but basically the point of this is that I need to wait for the request
//to the server to finish before the Data Exploration tab is loaded, otherwise React will load asynchrously. That's what this object
//currently accomplishes.
class ViewPaneWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      inCols: [],
      inCC: [],
      inRPSI: [],
      inTRANS: [],
      export: []
    }
    //updateViewPane = updateViewPane.bind(this);
  }

  componentDidMount() {   
    if(this.props.entrydata != undefined)
    {
        this.setState({
        inData: this.props.entrydata["inData"],
        inCols: this.props.entrydata["inCols"],
        inCC: this.props.entrydata["inCC"],
        inRPSI: this.props.entrydata["inRPSI"],
        inTRANS: this.props.entrydata["inTRANS"],
        export: this.props.entrydata["export"]
        });
    }
  }

  componentDidUpdate(prevProps) {  
    if(prevProps !== this.props)
    {
      if(this.props.entrydata != undefined)
      {
        this.setState({
        inData: this.props.entrydata["inData"],
        inCols: this.props.entrydata["inCols"],
        inCC: this.props.entrydata["inCC"],
        inRPSI: this.props.entrydata["inRPSI"],
        inTRANS: this.props.entrydata["inTRANS"],
        export: this.props.entrydata["export"]
        });
      }
    }
  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && this.props.validate == 1 && (
          <ViewPane css={withStyles(useStyles)} QueryExport={this.state.export} Data={this.state.inData} Cols={this.state.inCols} CC={this.state.inCC} RPSI={this.state.inRPSI} TRANS={this.state.inTRANS}/>
        )}
      </div>
    );
  }
}

function none()
{
  return null;
}

//This function changes which user is logged in, retrieving their history as needed.
function changeUser(user) {
    GLOBAL_user = user;
    var bodyFormData = new FormData();
    bodyFormData.append("user",user);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistoryaccess.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        var responsedata = response["data"];
        var tmp_array = [];
        //console.log("RESPONSE_changeuser", responsedata);
        updateQueryHistory(responsedata);
    })
    
}

function updateQueryHistory(input) {
    this.setState({
    inData: input
    });
}

function removeQueryHistory(index) {
    const newdat = this.state.inData;
    newdat.splice(index, 1);
    this.setState({
    inData: newdat
    });
}

function addQueryHistory(input) {
    const newdat = this.state.inData;
    newdat.push(input);
    this.setState({
    inData: newdat
    });
}

class QueryHistoryPaneWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      user: "Default"
    }
    updateQueryHistory = updateQueryHistory.bind(this);
    removeQueryHistory = removeQueryHistory.bind(this);
    addQueryHistory = addQueryHistory.bind(this);
  }

  componentDidMount() {
    var bodyFormData = new FormData();
    bodyFormData.append("user",this.state.user);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistoryaccess.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        var responsedata = response["data"];
        var tmp_array = [];
        //console.log("RESPONSE", responsedata);
        updateQueryHistory(responsedata);
    })

  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
        <QueryHistory Data={this.state.inData} removeQueryHistory={removeQueryHistory} goQuery={none}/>
        )}
      </div>
    );
  }
}

//This is part of the Authentication class.
const responseGoogle = response => {
  //console.log("Google response: ", response);
  var user = response["Ys"]["Ve"];
  updateAuthentication(user);
};

//Simple global function to update the state of the Authentication object whenever a new user logs in.
function updateAuthentication(value) {
  this.setState({
      user: value
  });

  changeUser(value);
}
//QnP0q95cm5LOxDO1FHkM44I8

//This function is used to display the name of the logged in user. It was working fine locally, but on the server it's parent class is broken,
//so unfortunately right now it is unused.
function UsernameDisplay(props) {
  
  return(
    <div>
    <Grid container spacing={3}>
      <Grid item>
    <div style={{marginTop: 6, fontSize: 20}}>Hello, <strong>{props.user}</strong> ! </div>
    </Grid>
    <Grid item>
    <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white", fontSize: 12, margin: 2}} onClick={() => updateAuthentication("Default")}>Logout</Button>
    </Grid>
    </Grid>
    </div>
  );
}

//This class object is used specifically for the google authentication. It is currently broken, and it is vital in the future to fix it.
class Authentication extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        user: "Default",
      }
      updateAuthentication = updateAuthentication.bind(this);
  }

  render()
  {
  return(
      <div>
        {this.state.user != "Default" && (
        <div>
          <UsernameDisplay user={this.state.user}/>
        </div>
        )}
        {this.state.user == "Default" && (
        <div>
          <GoogleLogin clientId="113946767130-k3hs8dhjbctc9dtaamubobdftphlr60q.apps.googleusercontent.com" onSuccess={responseGoogle} onFailure={responseGoogle}/>
        </div> 
        )}
      </div>
    );
  }

}

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

const spcTabRoot = makeStyles({
  root: {
    backgroundColor: "white",
    color: '#0F6A8B',
    fontSize: 20,
    paddingRight: 43,
    paddingLeft: 43,
    marginLeft: 5,
    marginRight: 5
  }
});

function tabLabelQH()
{
  return (
    <LockIcon />
  );
}

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function updateViewPane(list1, list2, list3, list4, list5, exp){
  this.setState({
    inData: list1,
    inCols: list2,
    inCC: list3,
    inRPSI: list4,
    inTRANS: list5,
    export: exp
  });
}

function MainPane(props){
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
      history.push(`/ICGS/Oncosplice/testing/index.html/${tabNameToIndex[newValue]}`);
      //This is a hack. If the "build query" tab is re-selected, the page reloads in order to prevent bugs.
      if(newValue == 0)
      {
        var temp_view_obj = {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []};
        window.location.reload(true);
      }
      setMpstate({
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
    history.push(`/ICGS/Oncosplice/testing/index.html/${tabNameToIndex[1]}`);
    setMpstate({
        viewpaneobj: stateobj,
        value: 1,
        bqstate: bqstate,
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
        <Authentication />
        </div>
        </Grid>
        </Grid>
        </div>
      </div>
      <div id="tabcontent" style={{display: "block"}}>
      {mpstate.value === 0 && <BQPane setViewPane={setViewPane}/>}
      {mpstate.value === 1 && <ViewPaneWrapper entrydata={mpstate.viewpaneobj} validate={indexToTabName[page]}/>}
      {mpstate.value === 2 && <QueryHistoryPaneWrapper />}
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

function TopNav() {
  
  const classes = useStyles();

  return (
    <div className={classes.mainpane} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.mainpane_margin}>
      <Grid container spacing={1}>   
        <Grid item xs={5}>
        </Grid> 
        <Grid item xs={2}>
          <div className={classes.cntr_special}><img src="/ICGS/Oncosplice/testing/OncoLOGO.png" alt="Logo" width="177" height="148"></img></div>
        </Grid>
        <Grid item xs={5}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "#0F6A8B", textDecoration: "none"}}>Contact</a></div>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

//App function is the top level function, all components are underneath this function. At this level the routing is controlled.
function App() {

  //This is a list of pages visited on this website on the cache. It is not in use now but could be useful later.
  var pages = [];

  const onAddPage = (invalue) => {
    pages.push(invalue);
  }

  return (
    //The <Redirect> component always ensures that the "splash page" for the website is the "build query" tab.
    //In the "Route" component, any parameter supplied after the base url is encoded as a parameter in the child component, "MainPane".
    //MainPane is the component which controls everything below the header; 99% of this web application's content falls under it.
    //For further information, please see "MainPane" component.
    <Router>
    <div style={{ fontFamily: 'Roboto' }}>
    <Helmet>
      <script src="https://d3js.org/d3.v5.js" type="text/javascript" />
    </Helmet>
    <TopNav />
    <Switch>
      <Redirect exact from={routeurl} to={routeurl.concat("/build")} />
      <Route exact path={routeurl.concat("/:page?")} render={props => <MainPane {...props} addPage={onAddPage} pagelist={pages}/>} />
      <Route exact path={routeurl.concat("/:page?/:options?")} render={props => <MainPane {...props} addPage={onAddPage} pagelist={pages}/>} />
    </Switch>
    </div>
    </Router>
  );

}

ReactDOM.render(<App />, document.getElementById("root"));