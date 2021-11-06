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
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import LockIcon from '@material-ui/icons/Lock';
import InputBase from '@material-ui/core/InputBase';
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
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

//import OKMAP from './ViewPane.js';
import useStyles from './useStyles.js';
import BQPane from './BuildQueryPane.js';
import ViewPane from './ViewPane.js';
import QueryHistory from './QueryHistory';
import TabPanel from './components/TabPanel';
import SpcInputLabel from './components/SpcInputLabel';
import CheckboxForm from './components/CheckboxForm';
import AboutUs from './components/AboutUs';
import { makeRequest } from './components/CancerDataManagement.js';
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
var splicingreturned = [];
var splicingcols = [];
var splicingcc = [];
var splicingrpsi = [];
var splicingtrans = "";
var sendToViewPane = {};
var keys = {};
var ui_field_dict;
var ui_field_range;

var cur_filter_amt = 0;
var childrenFilters = [];
var postoncosig = [];
var clientgenes = [];
var clientcoord = [];
var queueboxchildren = {};
var pre_queueboxchildren = {};
var queueboxsignatures = {};
var pre_queueboxsignatures = {};
var sigTranslate;
var sigFilters;
var curCancer;
var cancerQueueMessage;

var displayvalue_userquery = "block";
var displayvalue_sigquery = "block";
var displayvalue_defaultquery = "none";
var displayvalue_geneinput = "none";
var displayvalue_coordinput = "none";
var current_number_of_events = 0;
var current_number_of_samples = 0;

var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";
var buildurl = "/ICGS/Oncosplice/build";

var targeturl = serverurl;

var queryhistory_dat = [];
var GLOBAL_user = "Default";

keys["filter"] = [];
keys["single"] = [];

function none()
{
  return null;
}

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
    updateViewPane = updateViewPane.bind(this);
  }

  componentDidMount() {   
    this.setState({
    inData: [],
    inCols: [],
    inCC: [],
    inRPSI: [],
    inTRANS: [],
    export: []
    });
  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
          <ViewPane css={withStyles(useStyles)} QueryExport={this.state.export} Data={this.state.inData} Cols={this.state.inCols} CC={this.state.inCC} RPSI={this.state.inRPSI} TRANS={this.state.inTRANS}/>
        )}
      </div>
    );
  }
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
        console.log("RESPONSE_changeuser", responsedata);
        updateQueryHistory(responsedata);
    })
    
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
        console.log("RESPONSE", responsedata);
        updateQueryHistory(responsedata);
    })

  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
        <QueryHistory Data={this.state.inData} removeQueryHistory={removeQueryHistory} goQuery={ajaxviewquery}/>
        )}
      </div>
    );
  }
}

const responseGoogle = response => {
  console.log("Google response: ", response);
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

function MainPane() {
  const classes = useStyles();
  const tabstyle = spcTabStyles();
  const [mpstate, setMpstate] = React.useState({
    viewpaneobj: {},
    value: initial_val,
  });

  const handleChange = (event, newValue) => {
      document.getElementById("contactpanel").style.display = "none";
      document.getElementById("aboutpanel").style.display = "none";
      document.getElementById("tabcontent").style.display = "block";
      setMpstate({
        value: newValue
      });
  };

  const setViewPane = (list1, list2, list3, list4, list5, exp) => {
    stateobj = {};
    stateobj["inData"] = list1;
    stateobj["inCols"] = list2;
    stateobj["inCC"] = list3;
    stateobj["inRPSI"] = list4;
    stateobj["inTRANS"] = list5;
    stateobj["export"] = exp;
    setMpstate({
        viewpaneobj: stateobj
    });
  }

  return (
    <div className={classes.root} style={{ fontFamily: 'Roboto' }}>
      <div className={classes.demo2}>
        <div className={classes.tabholder}>
        <Grid container spacing={0}>
        <Grid item sm={12} md={9}>
        <Typography className={classes.padding} />
        <Tabs id="tabset" value={value} onChange={handleChange} aria-label="simple tabs example" indicatorColor="primary">
          <Tab classes={tabstyle} label="Build Query" {...a11yProps(0)} style={{ textTransform: 'none'}}/>
          <Tab classes={tabstyle} label="Explore Data" {...a11yProps(1)} style={{ textTransform: 'none'}}/>
          <Tab classes={tabstyle} icon={<LockIcon />} label="Query History" {...a11yProps(2)} style={{ textTransform: 'none'}}></Tab>
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
      <TabPanel value={value} index={0}>
        <BQPane updateViewPane={setViewPane}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ViewPaneWrapper />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <QueryHistoryPaneWrapper />
      </TabPanel>
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
      <Grid container spacing={3}>    
        <Grid item xs={5}>
          <div className={classes.cntr_special}>OncoSplice: Cancer Genomics Browser</div>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.cntr_generic}><a style={{cursor: "pointer"}}>My Account</a> | <a onClick={loadAbout} style={{cursor: "pointer"}}>What is OncoSplice?</a> | <a href="mailto: altanalyze@gmail.com" style={{cursor: "pointer", color: "white", textDecoration: "none"}}>Contact</a></div>
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'Roboto' }}>
    <Helmet>
      <script src="https://d3js.org/d3.v5.js" type="text/javascript" />
    </Helmet>
    <TopNav />
    <MainPane />
    </div>
  );

}

ReactDOM.render(<App />, document.getElementById("root"));