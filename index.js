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

const theme = createMuiTheme({
  overrides: {
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  }
});

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

const responseGoogle = response => {
  //console.log("Google response: ", response);
  var user = response["Ys"]["Ve"];
  updateAuthentication(user);
};

function updateAuthentication(value) {
  this.setState({
      user: value
  });

  changeUser(value);
}
//QnP0q95cm5LOxDO1FHkM44I8

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

  //console.log("MAIN PANE props: ", props);
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  props.addPage(page);
  if(props.pagelist.length > 1 && page=="build")
  {
    window.location.reload(true);
  }
  if(params["options"] != undefined){
    console.log(params["options"]);
  }

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

  const [mpstate, setMpstate] = React.useState({
    viewpaneobj: {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []},
    value: indexToTabName[page],
    bqstate: {
      defaultQuery: false,
      queuebox_values: {"children": undefined, "signatures": undefined},
      pre_queueboxvalues: {"children": {}, "signatures": {}},
      eventfilterSet: null,
      resultamount: {"samples": 0, "events": 0},
      childrenFilters: [],
      postoncosig: [],
      queryFilter: {},
      querySignature: {},
      clientcoord: [],
      clientgenes: [],
      keys: {"filter": [], "single": []},
      range: undefined,
      cancer: "",
      ui_fields: {},
      export: {},
      genes: [],
      coordinates: [],
      signatures: undefined,
      sigTranslate: undefined,
      filterboxSEF: ""
    }
  });

  //console.log("PAGE1", page, mpstate.value);

  var bqstate = mpstate.bqstate;
  var estate = mpstate.viewpaneobj;

  const handleChange = (event, newValue) => {
      document.getElementById("contactpanel").style.display = "none";
      document.getElementById("aboutpanel").style.display = "none";
      document.getElementById("tabcontent").style.display = "block";
      history.push(`/ICGS/Oncosplice/testing/index.html/${tabNameToIndex[newValue]}`);
      //console.log("current history:", history, mpstate);
      //console.log("history", history);
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

  const setViewPane = (list1, list2, list3, list4, list5, exp, bqstate) => {
    var stateobj = {};
    //console.log("setViewPane called: ", list1);
    //console.log("mpstate called: ", mpstate.viewpaneobj);
    //console.log("bqstate called: ", bqstate);
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

  //useLayoutEffect = componentDidMount
  //useEffect = componentDidUpdate
  //console.log("PAGE2", page, mpstate.value);
  React.useEffect(() => {
    if(mpstate.value != indexToTabName[page])
    {
        //console.log("WAHOOBA1", bqstate, mpstate.bqstate);
        //var temp_view_obj = {"inData": [], "inCols": [], "inCC": [], "inRPSI": [], "inTRANS": [], "export": []};
        setMpstate({
          ...mpstate,
          value: indexToTabName[page],
        });
    }
    //console.log("WAHOOBA", mpstate);
    //console.log("USE EFFECT", mpstate.value, indexToTabName[page]);
  }, [mpstate.value])

  //console.log(mpstate);
  // prev_page = page;

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

function App() {
  var pages = [];

  const onAddPage = (invalue) => {
    pages.push(invalue);
  }

  return (
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