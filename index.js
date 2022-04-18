import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import Select from '@material-ui/core/Select';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import BQPane from './pages/BuildQuery/BuildQueryPane.js';

//import OKMAP from './ViewPane.js';
import useStyles from './useStyles.js';
import ViewPane from './ViewPane.js';
import AboutUs from './components/AboutUs';
import MainPanel from './MainPanel.js';
import TopNav from './TopNav.js';

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

function none()
{
  return null;
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
      <Route exact path={routeurl.concat("/:page?")} render={props => <MainPanel {...props} addPage={onAddPage} pagelist={pages}/>} />
      <Route exact path={routeurl.concat("/:page?/:options?")} render={props => <MainPanel {...props} addPage={onAddPage} pagelist={pages}/>} />
    </Switch>
    </div>
    </Router>
  );

}

ReactDOM.render(<App />, document.getElementById("root"));