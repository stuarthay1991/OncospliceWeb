import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import GetAppIcon from '@material-ui/icons/GetApp';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';
import SpcInputLabel from './components/SpcInputLabel';
import FilterItem from './components/FilterItem';
import CustomizedTables from './components/CustomizedTables';
import LabelHeatmap from './LabelHeatmap';
import downloadHeatmapText from './downloadHeatmapText';
import axios from 'axios';

import * as d3 from 'd3';
import useStyles from './useStyles.js';

var global_meta = [];
var global_sig = [];
var global_data = [];
var global_uifielddict = {};
var global_cancer = "";
var global_signature = "";
var global_trans = "";
var global_cols = [];
var global_cc = [];
var global_rpsi = [];
var global_colors = ["#0096FF", "Yellow", "#FF7F7F", "#44D62C", "Purple", "Orange", "Grey", "#32a852", "#8e7be3", "#e6b035", "#b5109f", "#8bab59", "#782b51", "#366fd9", "#f0b3ff", "#5d1ca3", "#d94907", "#32a8a6", "#ada50c", "#bf1b28", "#0000b3", "#ffc61a", "#336600"];
var global_Y = "";
var global_adj_height = "";
var global_heat_len = "";
var link1 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=mm10&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";
var link2 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=mm10&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";
var buildurl = "/ICGS/Oncosplice/build";

var targeturl = serverurl;


const defaultProps = {
  m: 0.1,
};

const boxProps = {
  border: 3,
};

const boxProps_padding = {
  border: 3,
  margin: 0.1,
  paddingRight: '2px',
  display: 'inline-block',
};


function ViewPane(props) {
  const classes = useStyles();
  global_meta = props.Cols;
  global_cancer = props.QueryExport["cancer"];
  global_signature = props.QueryExport["single"];
  global_cols = props.Cols;
  global_cc = props.CC;
  global_rpsi = props.RPSI;
  global_trans = props.TRANS;
  console.log("VIEW PANE", props);
  console.log("VIEW TRANS", global_trans);
  console.log("VIEW PANE_sig", global_signature[global_signature.length - 1]);
  global_uifielddict = props.QueryExport["ui_field_dict"];
  console.log("global_uifielddict", global_uifielddict, props.QueryExport["ui_field_dict"]);
  return (
    <div style={{ fontFamily: 'Arial' }}>
    <Grid container spacing={1}>
      <Grid item xs={8}>
        <ViewPane_Top Data={props.Data} Cols={props.Cols} CC={props.CC} QueryExport={props.QueryExport}/>
        <Typography className={classes.padding} />
        <ViewPane_Hidden />
        <ViewPane_Main Data={props.Data} Cols={props.Cols} CC={props.CC} RPSI={props.RPSI} QueryExport={props.QueryExport}/>
      </Grid>
      <Grid item xs={4}>
        <ViewPane_Side QueryExport={props.QueryExport}/>
      </Grid>
    </Grid>
    </div>
  );
}

function ViewPane_Top(props) {
  const classes = useStyles();
  return (
    <div>
      <Grid container spacing={1}>    
        <Grid item xs={2}>
          <div className={classes.cntr_viewpane}><h3 style={{ fontSize: 27, color: '#0F6A8B', marginTop: 24}}>Plot Settings</h3></div>
        </Grid>
        <Grid item xs={2}>
          <FilterHeatmapSelect />
        </Grid>
        <Grid item xs={5}>
          <span className={classes.cntr_btn}>
          <Button variant="contained" style={{backgroundColor: '#0F6A8B', marginTop: 28, marginLeft: 8}}><ZoomInIcon onClick={zoomInHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 36}}/></Button>
          <Button variant="contained" style={{backgroundColor: '#0F6A8B', marginTop: 28, marginLeft: 8}}><ZoomOutIcon onClick={zoomOutHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 36}}/></Button>
          <Button variant="contained" style={{backgroundColor: '#0F6A8B', marginTop: 28, marginLeft: 8}}><FullscreenIcon onClick={fullViewHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 36}}/></Button>
          <Button variant="contained" style={{backgroundColor: '#0F6A8B', marginTop: 28, marginLeft: 8}}><GetAppIcon onClick={() => downloadHeatmapText(props.Data,props.Cols,props.QueryExport)} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 36}}/></Button>
          </span>
        </Grid>
      </Grid>
    </div>   
  );
}

function ViewPane_Side(props) {
  return(
    <div>
    <LabelHeatmap title={"Selected Sample Subsets"} type={"filter"} QueryExport={props.QueryExport}></LabelHeatmap>
    <LabelHeatmap title={"Selected Signatures"} type={"single"} QueryExport={props.QueryExport}></LabelHeatmap>
    <Stats></Stats>
    </div>
  )
}

function ViewPane_Main(props) {
    const classes = useStyles();
    //console.log("QueryExport", props.QueryExport);
    return(
    <div id="ViewPane_MainPane">
      <Box {...defaultProps}>
        <div id="HEATMAP_LABEL">
        </div>
        <div id="HEATMAP_CC">
        </div>
        <div id="HEATMAP_RPSI">
        </div>
        <div className={classes.flexparent}>
        <span id="HEATMAP_0">
        </span>
        <span id="HEATMAP_ROW_LABEL" style={{width: "280px"}}>
        </span>
        </div>
      </Box> 
      <Heatmap data={props.Data} cols={props.Cols} cc={props.CC} rpsi={props.RPSI}>
      </Heatmap>
    </div>  
    );
}

function ViewPane_Hidden(props) {
  const classes = useStyles();
  return (
    <div className={classes.hidden_panel} id="ViewPane_SubPane">
    <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
        <div className={classes.baseinput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <TextField id="standard-basic" label="Annotate samples by..." className={classes.input} inputProps={{ 'aria-label': 'Annotate samples by' }}/>
        <IconButton type="submit" className={classes.iconSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
        </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
        <div className={classes.baseinput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <TextField id="standard-basic" label="Select Feature Type" className={classes.input} inputProps={{ 'aria-label': 'Select Feature Type' }}/>
        <IconButton type="submit" className={classes.iconSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Typography className={classes.padding} />
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <div>
            <Button variant="contained" style={{ textTransform: 'none'}}>Select data to plot</Button>
          </div>
          <Box borderColor="#dbdbdb" {...boxProps}>
              <Typography className={classes.medpadding} />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Typography className={classes.padding} />
    </div> 
  );
}

export default ViewPane;