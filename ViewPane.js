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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import LabelHeatmap from './components/LabelHeatmap';
import downloadHeatmapText from './components/downloadHeatmapText';
import axios from 'axios';
import tooltip from './tooltip.css';

import Plot from 'react-plotly.js';
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
var global_exon_blob = undefined;
var global_genemodel_blob = undefined;
var global_junc_blob = undefined;
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

function metarepost(name) {
  var bodyFormData = new FormData();
  //box = [];
  if(name != "age range")
  {
    name = name.replaceAll("  ", "__");
    name = name.replaceAll(" ", "_");
  }
  bodyFormData.append("NAME", name);
  bodyFormData.append("CANCER", global_cancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/single.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //var retval = response["data"]["out"];
      //var retset = response["data"]["set"];
      var ret = response["data"];
      //console.log("RET RET RET", ret, global_cancer);
      updateOkmapLabel(ret);
      supFilterUpdate(ret);
      //console.log(retval);
      //console.log(retset);
      //console.log(global_cols);
      //var okheader = new OKMAP_LABEL("HEATMAP_LABEL",global_cols,retval,document,);
    })
}

function oneUIDrequest(UID) {
  var bodyFormData = new FormData();
  bodyFormData.append("UID",UID);
  bodyFormData.append("CANCER",global_cancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/one_uid_retrieve.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //var totalmatch = response["data"]["single"];
      //console.log("oneuid", response["data"]);
      plotUIDupdate(response["data"]["result"][0])
      //var new_vec = response["data"];
      //plot4update(new_vec);
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      //add totalmatch for gene counter
      //callback(clientgenes, exportView);
  })  
}

function exonRequest(GENE, in_data) {
  var bodyFormData = new FormData();
  console.log("EXON_IN", GENE);
  bodyFormData.append("GENE",GENE);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/exon_retrieve.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      console.log("response_exon", response["data"]);
      var resp = response["data"];
      updateExPlot(resp["gene"], resp["trans"], resp["junc"], in_data);
      global_exon_blob = resp["blob"]["trans"];
      global_genemodel_blob = resp["blob"]["genemodel"];
      global_junc_blob = resp["blob"]["junc"];
      //var totalmatch = response["data"]["single"];
      //console.log("oneuid", response["data"]);
      //plotUIDupdate(response["data"]["result"][0])
      //var new_vec = response["data"];
      //plot4update(new_vec);
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      //add totalmatch for gene counter
      //callback(clientgenes, exportView);
  })
}

function GTexSend(UID) {
  //const exportUID = arg["UID"];
  //const exportTISSUE = arg["TISSUE"];

  var bodyFormData = new FormData();
  //console.log("GTEXsend", UID);
  bodyFormData.append("UID",UID);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/GTex.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //var totalmatch = response["data"]["single"];
      /*
      console.log("GTEXreceive", response["data"]);
      for (const [key, value] of Object.entries(response["data"]["result"][0])) {
          console.log(key, value);
      }
      */
      var new_vec = response["data"]["result"][0];
      gtexupdate(new_vec);
      //var new_vec = response["data"];
      //plot4update(new_vec);
      //console.log("1", totalmatch);
      //console.log("2", response["data"]);
      //add totalmatch for gene counter
      //callback(clientgenes, exportView);
  })  
}

function gtexupdate(vec)
{
  this.setState({
    gtex: vec
  })  
}

function plotUIDupdate(dat)
{
  //console.log(dat);
  this.setState({
    fulldat: dat
  })    
}

function plot4update(vec)
{
  this.setState({
    plot4: vec
  })  
}

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

var stat_table = {};

function updateStats(id, input){
    const bottle = [];
    for (const [key, value] of Object.entries(input)) {
        bottle.push(createData(key, value));
    }
    this.setState({
      curSelect: id,
      curAnnots: bottle,
    });
}

function oldLinkOuts(instuff){
  console.log("OLD CLICK", instuff);
  var peach2 = instuff;
  var peach3 = peach2.replace("|", "<br>");
  var peach = peach2.split("|");
  var chr1 = peach[0];
  var chr2 = peach[1];
  var twor1 = chr1.split(":");
  var twor2 = chr2.split(":");
  var flatchr1 = twor1[0];
  var flatchr2 = twor2[0];
  var twor1_split = twor1[1].split("-");
  var twor2_split = twor2[1].split("-");

  var link1 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";
  var link2 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

  //link1 = "<a href=".concat(link1).concat(flatchr1).concat("%3A").concat(twor1_split[0]).concat("%2D").concat(twor1_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG").concat(">").concat(chr1).concat("</a>");

  //link1 = link1.concat("<br>").concat("<a href=").concat(link2).concat(flatchr2).concat("%3A").concat(twor2_split[0]).concat("%2D").concat(twor2_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG").concat(">").concat(chr2).concat("</a>");

  return(
    <div>
    <a href={link1.concat(flatchr1).concat("%3A").concat(twor1_split[0]).concat("%2D").concat(twor1_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{chr1}</a>
    <br />
    <a href={link2.concat(flatchr2).concat("%3A").concat(twor2_split[0]).concat("%2D").concat(twor2_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{chr2}</a>
    </div>
  );

}

function makeLinkOuts(chrm, c1, c2, c3, c4){
  /*var peach2 = instuff;
  var peach3 = peach2.replace("|", "<br>");
  var peach = peach2.split("|");
  var chr1 = peach[0];
  var chr2 = peach[1];
  var twor1 = chr1.split(":");
  var twor2 = chr2.split(":");
  var flatchr1 = twor1[0];
  var flatchr2 = twor2[0];
  var twor1_split = twor1[1].split("-");
  var twor2_split = twor2[1].split("-");*/
  var full1 = chrm.concat(":").concat(c1).concat("-").concat(c2);
  var full2 = chrm.concat(":").concat(c3).concat("-").concat(c4);
  var link1 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";
  var link2 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

  //link1 = "<a href=".concat(link1).concat(flatchr1).concat("%3A").concat(twor1_split[0]).concat("%2D").concat(twor1_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG").concat(">").concat(chr1).concat("</a>");

  //link1 = link1.concat("<br>").concat("<a href=").concat(link2).concat(flatchr2).concat("%3A").concat(twor2_split[0]).concat("%2D").concat(twor2_split[1]).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG").concat(">").concat(chr2).concat("</a>");

  return(
    <div>
    <a href={link1.concat(chrm).concat("%3A").concat(c1).concat("%2D").concat(c2).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{full1}</a>
    <br />
    <a href={link2.concat(chrm).concat("%3A").concat(c3).concat("%2D").concat(c4).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{full2}</a>
    </div>
  );

}



function updateOkmapTable(data){
  var chrm = data["chromosome"];
  if(chrm == undefined)
  {
    var c = data["coordinates"];
    console.log("ALL DATA", data);
    var newcoord = oldLinkOuts(c);
    var new_row = [
    createData("Altexons", data["altexons"]),
    createData("Protein Predictions", data["proteinpredictions"]),
    createData("Cluster ID", data["clusterid"]),
    createData("Coordinates", newcoord),
    createData("Event Annotation", data["eventannotation"]),
    ];
    this.setState({
      curAnnots: new_row
    });
  }
  else
  {
    var c1 = data["coord1"];
    var c2 = data["coord2"];
    var c3 = data["coord3"];
    var c4 = data["coord4"];
    var newcoord = makeLinkOuts(chrm, c1, c2, c3, c4);
    var new_row = [
    createData("Altexons", data["altexons"]),
    createData("Protein Predictions", data["proteinpredictions"]),
    createData("Cluster ID", data["clusterid"]),
    createData("Coordinates", newcoord),
    createData("Event Annotation", data["eventannotation"]),
    ];
    this.setState({
      curAnnots: new_row
    });
  }
}

function updateOkmapLabel(data){
  this.setState({
    retcols: data
  });
}

function updateOkmapCC(data){
  this.setState({
    retcols: data
  });
}

function updateOkmapRPSI(data){
  this.setState({
    retcols: data
  });
}

function createData(name, value) {
  return { name, value };
}

var rows = [
  createData('-none selected-', '-none selected-'),
];

/*function updateFHS(props){
  const [state, setState] = React.useState
}*/

function FilterHeatmapSelect(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    value: Object.entries(global_uifielddict)[0][0],
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    //console.log("metarepost", event.target.value);
    metarepost(event.target.value);
  }

  return (
    <div>
      <SpcInputLabel label={"Show Sample"} />
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          native
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: "HeatmapFilterSelect_id",
          }}
        >
          <option value={state.value}>{state.value}</option>
          {(() => {
            const options = [];
            for (const [key, value] of Object.entries(global_uifielddict)) {
              var name_selected = key.replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              options.push(<option value={key}>{name_selected}</option>);
            }
            return options;
          })()}
        </Select>
      </FormControl>
    </div>
  );
}


class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curAnnots: rows
    };
    updateOkmapTable = updateOkmapTable.bind(this)
  }

  render()
  {

    return(
    <div>
    <SpcInputLabel label={"Event Annotations"}/>
    <div>
    <Box borderColor="#dbdbdb" {...boxProps}>
      <div id="STATS_0">
        <CustomizedTables contents={this.state.curAnnots}/>
      </div>
    </Box>
    </div>
    </div>
    );
  }

}

/*
class SupplementaryPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  render()
  {
    return(
      <div>
      </div>
    );
  } 

}*/

class Heatmap extends React.Component {
  constructor(props) {
    super(props);
    this.xscale = 0;
    this.state = {
      output: null,
      label: null,
      CC: null,
      RPSI: null
    };
  }
  componentDidMount() { 
    //console.log("ComponentMounted");
    var base_re_wid = window.innerWidth;
    var base_re_high = window.innerHeight;
    var standard_width = 1438;
    var standard_height = 707;
    var adjust_width = (base_re_wid / standard_width) * 1.28;
    var adjust_height = (base_re_high / standard_height) * 1.28;
    var xscale = ((500/this.props.cols.length) * adjust_width);
    this.xscale = xscale;
    var y_start = 0;
    var universal_y = 15;
    document.getElementById("HEATMAP_0").style.transform = "scaleY(1)";
    global_Y = universal_y;
    global_adj_height = adjust_height;
    global_heat_len = this.props.data.length;
    var y_scaling = universal_y;
    var escale = (this.props.cols.length * (this.xscale - 0.1));

    document.getElementById("HEATMAP_0").style.width = escale.toString().concat("px");
    //console.log("DATA", this.props.data);
    //console.log("COLS", this.props.cols);
    console.log("ONCOSPLICE CLUSTER BUILD:", this.props.cols, this.props.rpsi);
    this.setState({
      output: <OKMAP dataset={this.props.data} column_names={this.props.cols} len={this.props.data.length} doc={document} target_div_id={"HEATMAP_0"} xscale={xscale} yscale={y_scaling} norm={1}></OKMAP>,
      label: <OKMAP_LABEL target_div_id={"HEATMAP_LABEL"} column_names={this.props.cols} doc={document} xscale={xscale}/>,
      CC: <OKMAP_COLUMN_CLUSTERS target_div_id={"HEATMAP_CC"} column_names={this.props.cc} doc={document} xscale={xscale}/>,
      RPSI: <OKMAP_RPSI target_div_id={"HEATMAP_RPSI"} refcols={this.props.cols} column_names={this.props.rpsi} doc={document} xscale={xscale}/>
    })
  }

  componentDidUpdate(prevProps) {
    if((this.props.data.length !== prevProps.data.length) || (this.props.cols.length !== prevProps.cols.length))
    {
      //console.log("ComponentUpdated");
      var base_re_wid = window.innerWidth;
      var base_re_high = window.innerHeight;
      var standard_width = 1438;
      var standard_height = 707;
      var adjust_width = (base_re_wid / standard_width) * 1.28;
      var adjust_height = (base_re_high / standard_height) * 1.28;
      var xscale = ((500/this.props.cols.length) * adjust_width);
      this.xscale = xscale;
      var y_start = 0;
      var universal_y = 15;
      document.getElementById("HEATMAP_0").style.transform = "scaleY(1)";
      global_Y = universal_y;
      global_adj_height = adjust_height;
      global_heat_len = this.props.data.length;
      var y_scaling = universal_y;
      var escale = (this.props.cols.length * (this.xscale - 0.1));

      document.getElementById("HEATMAP_0").style.width = escale.toString().concat("px");
      //console.log("DATA", this.props.data);
      //console.log("COLS", this.props.cols);

      this.setState({
        output: <OKMAP dataset={this.props.data} column_names={this.props.cols} len={this.props.data.length} doc={document} target_div_id={"HEATMAP_0"} xscale={this.xscale} yscale={y_scaling} norm={1}></OKMAP>,
        label: <OKMAP_LABEL target_div_id={"HEATMAP_LABEL"} column_names={this.props.cols} doc={document} xscale={this.xscale}/>,
        CC: <OKMAP_COLUMN_CLUSTERS target_div_id={"HEATMAP_CC"} column_names={this.props.cc} doc={document} xscale={this.xscale}/>,
        RPSI: <OKMAP_RPSI target_div_id={"HEATMAP_RPSI"} refcols={this.props.cols} column_names={this.props.rpsi} doc={document} xscale={this.xscale}/>
      })
    }
  }

  render()
  {
    //console.log("ComponentRendered", this.state);
    return(
      <div>
      {this.state.output}
      {this.state.label}
      {this.state.CC}
      {this.state.RPSI}
      </div>
    );
  }
}

function zoomInHeatmap()
{
  if(global_Y >= (400 * global_adj_height))
  {
    //loading_gif("off");
    return;
  }
  else
  {
    //zoom_on_off = "off";
    var temp_y_set = global_Y * 1.5;

    var captain_burgerpants = temp_y_set / 15;

    //document.getElementById("HEATMAP_1").style.display = "none";
    //document.getElementById("HEATMAP_0").style.display = "block";
    //document.getElementById("HEATMAP_2").style.display = "none";

    document.getElementById("HEATMAP_0").style.transformOrigin = "0 0";
    document.getElementById("HEATMAP_0").style.overflowY = "visible";
    document.getElementById("HEATMAP_0").style.height = document.getElementById("HEATMAP_0").style.height * captain_burgerpants;
    document.getElementById("HEATMAP_0").style.transform = "scaleY(".concat(captain_burgerpants.toString()).concat(")");

    global_Y = temp_y_set;
    updateOkmap(global_Y);
  }
}

function zoomOutHeatmap()
{
  if(global_Y < ((400 * global_adj_height) / global_heat_len))
  {
    //loading_gif("off");
    return;
  }
  else
  {
    //zoom_on_off = "off";
    var temp_y_set = global_Y / 1.5;

    var captain_burgerpants = temp_y_set / 15;

    var magic_bob = document.getElementById("HEATMAP_0").style.height;
    //console.log("boogie bob extreme", magic_bob);
    var fantastic_fred = magic_bob.substring(0, (magic_bob.length - 2));
    var wacky_winston = parseFloat(fantastic_fred) * captain_burgerpants;
    wacky_winston = (wacky_winston.toString()).concat("px");

    document.getElementById("HEATMAP_0").style.transformOrigin = "0 0";
    document.getElementById("HEATMAP_0").style.overflowY = "visible";   
    document.getElementById("HEATMAP_0").style.transform = "scaleY(".concat(captain_burgerpants.toString()).concat(")");
    document.getElementById("HEATMAP_0").style.height = wacky_winston;

    global_Y = temp_y_set;
    updateOkmap(global_Y);
  }

}

function fullViewHeatmap()
{
  //zoom_on_off = "off";
  global_Y = (400 * global_adj_height) / global_heat_len;
  var temp_y_set = global_Y / 15;

  document.getElementById("HEATMAP_0").style.transformOrigin = "0 0";
  document.getElementById("HEATMAP_0").style.overflowY = "visible";
  document.getElementById("HEATMAP_0").style.transform = "scaleY(".concat(temp_y_set.toString()).concat(")");
  document.getElementById("HEATMAP_0").style.height = "400px";

  global_Y = temp_y_set;
  updateOkmap(global_Y);
}

class OKMAP_RPSI extends React.Component {
  constructor(props)
  {
    super(props);
    this.target_div = this.props.target_div_id;
    this.col_names = this.props.column_names;
    this.refcols = this.props.refcols;
    this.SVG = "None";
    this.SVG_main_group = "";
    this.doc = this.props.doc;
    this.xscale = this.props.xscale;
    this.state = {
      retcols: "NULL"
    };
    updateOkmapRPSI = updateOkmapRPSI.bind(this)
  }

  baseSVG(w="120%", h="100%") 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
      
    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("stroke-width", 0)
      .attr("type", "canvas")
      .attr("fill", "White");    
  }

  writeBase(cols, yscale, xscale)
  {
    this.SVG_main_group.append("rect")
      .attr("width", ((cols.length * (xscale - 0.1)) + 75))
      .attr("height", yscale)
      .style("opacity", 1.0)
      .attr("fill", "White");
  }

  writeBlocks(xscale, writecols, refcols)
  {
    var x_pointer = 0;
    var ikg = [];
    for(var p = 0; p < refcols.length; p++)
    {
      var rect_length = (1 * xscale);
      var coledit = writecols[refcols[p]];
      var colortake = parseInt(coledit);
      var color;
      if(colortake == "0")
      {
        color = "white";
      }
      else if(colortake == "1")
      {
        color = "black";
      }
      else
      {
        color = "white";
      }
      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", x_pointer)
          .attr("y", 0)
          .attr("width", rect_length)
          .attr("height", 16)
          .attr("fill", color);
      
      x_pointer = x_pointer + ((1 * xscale) - 0.1);
    }

    x_pointer = x_pointer + 6;
    this.SVG_main_group.append("text")
        .attr("x", x_pointer)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "11px")
        .style('fill', 'black')
        .text(global_trans.concat(" Clusters"));

  }

  render (){
    var retval = null;
    var tempnode = document.getElementById(this.target_div);
    tempnode.innerHTML = "";
    this.baseSVG("100%", 16);
    this.writeBase(this.props.refcols, 16, this.props.xscale);
    this.writeBlocks(this.props.xscale, this.props.column_names, this.props.refcols);
    return(
      null
    );
  }

}

class OKMAP_COLUMN_CLUSTERS extends React.Component {
  constructor(props)
  {
    super(props);
    this.target_div = this.props.target_div_id;
    this.col_names = this.props.column_names;
    this.SVG = "None";
    this.SVG_main_group = "";
    this.doc = this.props.doc;
    this.xscale = this.props.xscale;
    this.state = {
      retcols: "NULL"
    };
    updateOkmapCC = updateOkmapCC.bind(this)
  }

  baseSVG(w="120%", h="100%") 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
      
    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("stroke-width", 0)
      .attr("type", "canvas")
      .attr("fill", "White");    
  }

  writeBase(cols, yscale, xscale)
  {
    this.SVG_main_group.append("rect")
      .attr("width", ((cols.length * (xscale - 0.1)) + 75))
      .attr("height", yscale)
      .style("opacity", 1.0)
      .attr("fill", "White");
  }

  writeBlocks(xscale, writecols)
  {
    var x_pointer = 0;
    var ikg = [];
    for(var p = 0; p < writecols.length; p++)
    {
      var rect_length = (1 * xscale);
      var coledit = writecols[p];
      var colortake = parseInt(coledit);
      var color;
      if(colortake == 1)
      {
        color = "orange";
      }
      else if(colortake == 2)
      {
        color = "blue";
      }
      else
      {
        color = "green";
      }
      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", x_pointer)
          .attr("y", 0)
          .attr("width", rect_length)
          .attr("height", 16)
          .attr("fill", color);
      
      x_pointer = x_pointer + ((1 * xscale) - 0.1);
    }

    x_pointer = x_pointer + 6;
    this.SVG_main_group.append("text")
        .attr("x", x_pointer)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "11px")
        .style('fill', 'black')
        .text("Hierarchical Clusters");
  }

  render (){
    var retval = null;
    var tempnode = document.getElementById(this.target_div);
    tempnode.innerHTML = "";
    this.baseSVG("100%", 16);
    this.writeBase(this.props.column_names, 16, this.props.xscale);
    this.writeBlocks(this.props.xscale, this.props.column_names);
    return(
      null
    );
  }

}

class OKMAP_LABEL extends React.Component {
  constructor(props)
  {
    super(props);
    this.target_div = this.props.target_div_id;
    this.col_names = this.props.column_names;
    this.SVG = "None";
    this.SVG_main_group = "";
    this.doc = this.props.doc;
    this.xscale = this.props.xscale;
    this.state = {
      retcols: "NULL"
    };
    updateOkmapLabel = updateOkmapLabel.bind(this)
  }

  baseSVG(w="120%", h="100%") 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
      
    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .attr("fill", "White");    
  }

  writeBase(cols, yscale, xscale)
  {
    this.SVG_main_group.append("rect")
      .style("stroke-width", 0)
      .attr("width", ((cols.length * (xscale - 0.1)) + 75))
      .attr("height", yscale)
      .style("opacity", 1.0)
      .attr("fill", "White");
  }

  writeBlocks(retcols, xscale, writecols)
  {
    var legend_y = 0;
    var legend_y_increment = 18;
    var legend_x = 0;
    var maxcharlen = 0;
    const maxchardef = 13;
    for(var p = 0; p < retcols["set"].length; p++)
    {
      if(p != 0 && p % 4 == 0)
      {
        var makedisfunc = 70 * (maxcharlen / maxchardef);
        if(makedisfunc < 50)
        {
          makedisfunc = 50;
        }
        legend_x = legend_x + makedisfunc + 20;
        legend_y = 0;
        maxcharlen = 0;
      }
      var colortake = retcols["color"][retcols["set"][p]];
      colortake = parseInt(colortake);
      var color = global_colors[colortake];
      //console.log("DING: ", retcols["set"][p], colortake);
      var curchars = retcols["set"][p];
      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", legend_x)
          .attr("y", legend_y)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color);

      this.SVG_main_group.append("text")
          .attr("x", (legend_x+20))
          .attr("y", (legend_y+9))
          .attr("text-anchor", "start")
          .style("font-size", "11px")
          .style('fill', 'black')
          .text(curchars);

    if(curchars != null)
    {
    if(curchars.length > maxcharlen)
    {
        maxcharlen = curchars.length;
    }}
    legend_y = legend_y + legend_y_increment;
    }

    if(retcols["set"].length != 0 && retcols["set"].length % 4 == 0)
    {
        legend_x = legend_x + 50;
        legend_y = 0;
    }
    else
    {
      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", legend_x)
          .attr("y", legend_y)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", 'black');

      this.SVG_main_group.append("text")
          .attr("x", (legend_x+20))
          .attr("y", (legend_y+9))
          .attr("text-anchor", "start")
          .style("font-size", "11px")
          .style('fill', 'black')
          .text("No annotation");
    }

    var x_pointer = 0;
    var ikg = [];
    for(var p = 0; p < writecols.length; p++)
    {
      var rect_length = (1 * xscale);
      var coledit = writecols[p];

      if(global_cancer == "LAML")
      {
        coledit = coledit.replace("_bed", "");
      }
      coledit = coledit.replace(".", "_");
      coledit = coledit.replace("-", "_");
      var type = retcols["out"][coledit];
      var colortake = retcols["color"][type];
      colortake = parseInt(colortake);
      var color = global_colors[colortake];
      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", x_pointer)
          .attr("y", 85)
          .attr("width", rect_length)
          .attr("height", 20)
          .attr("fill", color);
      
      x_pointer = x_pointer + ((1 * xscale) - 0.1);
    }

    x_pointer = x_pointer + 6;
    this.SVG_main_group.append("text")
        .attr("x", x_pointer)
        .attr("y", 98)
        .attr("text-anchor", "start")
        .style("font-size", "11px")
        .style('fill', 'black')
        .text("Filter Samples");    
  }

  componentDidUpdate (prevProps){
    if(this.props.column_names !== prevProps.column_names)
    {
      var retval = null;
      var tempnode = document.getElementById(this.target_div);
      tempnode.innerHTML = "";
      this.baseSVG("100%", 100);
      this.writeBase(this.props.column_names, 100, this.props.xscale);
      console.log("component UPDATED", this.state.retcols, global_cancer);
      if(this.state.retcols != "NULL")
      {
        this.writeBlocks(this.state.retcols, this.props.xscale, this.props.column_names);
        metarepost(Object.entries(global_uifielddict)[0][0]); 
        document.getElementById("HeatmapFilterSelect_id").value = Object.entries(global_uifielddict)[0][0];
      }
      //else
      //{
      //}
      return(
        null
      );    
    }
  }

  componentDidMount() {
    this.baseSVG("100%", 20);
    this.writeBase(20);
    metarepost(Object.entries(global_uifielddict)[0][0]);
  }  

  render (){
    var retval = null;
    var tempnode = document.getElementById(this.target_div);
    tempnode.innerHTML = "";
    this.baseSVG("100%", 100);
    this.writeBase(this.props.column_names, 100, this.props.xscale);
    if(this.state.retcols != "NULL")
    {
      this.writeBlocks(this.state.retcols, this.props.xscale, this.props.column_names);
    }
    return(
      null
    );
  }

}

function updateOkmap(y)
{
  this.setState({
    zoom_level: y
  })
}

class OKMAP extends React.Component {
  constructor(props) 
  {
    super(props);
    this.target_div = this.props.target_div_id;
    this.target_row_label_div = "HEATMAP_ROW_LABEL";
    this.col_names = this.props.column_names;
    this.SVG = "None";
    this.SVG_main_group = "";
    this.doc = this.props.doc;
    this.norm_flag = this.props.norm;
    this.tempRect = "";
    this.U_xscale = this.props.xscale;
    this.total_height = this.props.len;
    this.dataset = this.props.dataset;
    this.CURRENT_SELECTED_UID = null;
    this.state = {
      zoom_level: this.props.yscale
    };
    updateOkmap = updateOkmap.bind(this)
  }
  
  baseSVG(w="100%", h="100%", s="100%") 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
      
    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .attr("fill", "White"); 
  }

  writeBase(yscale, xscale, cols, height)
  {
    //console.log("WRITEBASE: this.col_names.length", cols.length);
    //console.log("WRITEBASE: xscale", xscale);
    this.SVG_main_group.append("rect")
      .attr("width", (cols.length * (xscale - 0.1)))
      .attr("height", (height * yscale))
      .style("opacity", 1.0)
      .attr("fill", "Black");
  }

  baseRLSVG(w="280px", h="100%")
  {
    this.ROWLABELSVG = d3.select("#".concat(this.target_row_label_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_row_label_div.concat("_svg")));

    this.SVG_rlg = this.ROWLABELSVG.append("g").attr("id", (this.target_row_label_div.concat("_group")));
    
    this.SVG_rlg.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .attr("fill", "White");
  }

  writeBaseRLSVG(yscale, height)
  {
    this.SVG_rlg.append("rect")
      .attr("width", "280px")
      .attr("height", (height * yscale))
      .style("opacity", 1.0)
      .attr("fill", "White");
  }

  writeHead(xscale, col_list)
  {
    var x_pointer = 0;

    for(var p = 0; p < col_list.length; p++)
    {
      var mid_section = (x_pointer + (xscale/2.0));
        this.SVG_main_group.append("text")
            .attr("x", mid_section)
            .attr("y", 12)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style('fill', 'black')
            .text(col_list[p]);
      x_pointer = x_pointer + xscale;
    }
  }

  writeSingle5(y_pointer, data, y_scale, x_scale, col_list, flag=0, hflag=0)
  {
    var bubble_1 = d3.select("#".concat(this.target_div).concat("_group"));
    var bubs = data;
    var parent = this;
    //console.log(data);

    var x_pointer = 0;
    //console.log("DATAPUSH", data, col_list)
    for(var p = 0; p < col_list.length; p++)
    {
      var rect_length = (1 * x_scale);
      var cur_square_val = parseFloat(data[col_list[p]]);
      //console.log("DATAPUSH", cur_square_val);
      var selected_color;
      if(cur_square_val < 0.05 && cur_square_val > -0.05)
      {
        selected_color = "rgb(0, 0, 0)";
        x_pointer = x_pointer + ((1 * x_scale) - 0.1);
        continue;
      }
      else if(cur_square_val <= -0.05)
      {
            var integerval = 10 + (-210 * (cur_square_val * 3));
            if(integerval > 255)
            {
              integerval = 255;
            }
            var magic_blue = (integerval).toString();
            var magic_others = (cur_square_val * 100).toString();
            selected_color = "rgb(".concat(magic_others).concat(", ").concat(magic_blue).concat(", ").concat(magic_blue).concat(")");
      }
      else
      {
            var integerval2 = 10 + (210 * (cur_square_val * 3));
            if(integerval2 > 255)
            {
              integerval2 = 255;
            }
            var magic_yellow = (integerval2).toString();
            var magic_yellow2 = (integerval2).toString();
            var magic_others = (cur_square_val * 10).toString();
            selected_color = "rgb(".concat(magic_yellow).concat(", ").concat(magic_yellow2).concat(", ").concat(magic_others).concat(")");
      }

      this.SVG_main_group.append("rect")
          .style("stroke-width", 0)
          .attr("x", x_pointer)
          .attr("y", y_pointer)
          .attr("width", rect_length)
          .attr("height", y_scale)
          .attr("fill", selected_color);
        
      x_pointer = x_pointer + ((1 * x_scale) - 0.1);
    }
  }

  writeRowLabel(y_point, data, yscale)
  {
    var parent = this;
    var converteduid = this.uidConvert(data["uid"]);
    var y_set = (y_point + yscale/1.7);
    var fontsize = 12 * (yscale / 15.0);

    if(fontsize > 16)
    {
      fontsize = 16;
    }

    this.SVG_rlg.append("text")
      .attr("x", (10))
      .attr("y", y_set)
      .attr("text-anchor", "start")
      .attr("id", converteduid.concat(this.target_row_label_div).concat("_id"))
      .attr("original", y_point)
      .attr("scale", yscale)
      .style("cursor", "pointer")
      .style("font-size", (fontsize.toString().concat("px")))
      .style('fill', 'black')
      .text(converteduid)
      .on("click", function(){
          updateOkmapTable(data);
          selectionToSup(data);
          GTexSend(data["examined_junction"]);
          var toex = data["examined_junction"].split(":");
          exonRequest(toex[0], data);
          oneUIDrequest(data["uid"]);
          parent.setSelected(converteduid);
          //updateStats(y_point, data);
      })
      .on("mouseover", function(){
            d3.select(this).style("fill", "red");
            //parent.tempRectAdd(this.attributes, parent.col_names, parent.U_xscale);
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "black");
            //parent.tempRectRemove();
      });
  }

  uidConvert(uid)
  {
    uid = uid.split(":");
    var uid_secondcomp = uid[2];
    uid_secondcomp = uid_secondcomp.split("|");
    var uid_final = uid[0].concat(":").concat(uid_secondcomp[0]).concat("|").concat(uid[3]);
    return uid_final
  }

  tempRectAdd(y_origin, col_list, xscale)
  {
    this.SVG_main_group.append("rect")
          .style("fill", "white")
          .style("stroke-width", 0)
          .style("opacity", 0.2)
          .attr("x", 0)
          .attr("y", y_origin.original.value)
          .attr("width", (col_list.length * xscale))
          .attr("height", y_origin.scale.value)
          .attr("id", "TEMPORARY_HIGHLIGHT");
  }

  tempRectRemove()
  {
    var rect_to_remove = document.getElementById("TEMPORARY_HIGHLIGHT");
    d3.select(rect_to_remove).remove();
  }  

  setSelected(id)
  {
    //document.getElementById(id).style.fill = "green";
    //console.log(this.CURRENT_SELECTED_UID);

    var parent = this;

    if(this.CURRENT_SELECTED_UID != null)
    {
    var old_text = document.getElementById((this.CURRENT_SELECTED_UID.concat(this.target_row_label_div).concat("_id")));
    d3.select(old_text)
      .style('fill', 'black')
      .on("mouseover", function(){
            d3.select(this).style("fill", "red");
            //parent.tempRectAdd(this.attributes, parent.col_names, parent.U_xscale);
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "black");
            //parent.tempRectRemove();
      });
    }

    var cur_text = document.getElementById((id.concat(this.target_row_label_div).concat("_id")));
    d3.select(cur_text)
      .style('fill', 'green')
      .on("mouseover", function(){
            d3.select(this).style("fill", "green");
            //parent.tempRectAdd(this.attributes, parent.col_names, parent.U_xscale);
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "green");
            //parent.tempRectRemove();
      }); 

    this.CURRENT_SELECTED_UID = id;      

  }

  componentDidUpdate (prevProps){
    if((this.props.dataset.length !== prevProps.dataset.length) || (this.props.column_names.length !== prevProps.column_names.length))
    {
      var tempnode = document.getElementById(this.target_div);
      var y_start = 0;
      while (tempnode.firstChild) {
        tempnode.removeChild(tempnode.firstChild);
      }
      var tempnodeRL = document.getElementById(this.target_row_label_div);
      while (tempnodeRL.firstChild) {
        tempnodeRL.removeChild(tempnodeRL.firstChild);
      }
      tempnode.innerHTML = "";
      tempnodeRL.innerHTML = "";
      setTimeout(() => {
      this.baseSVG("100%", ((15 * this.props.dataset.length) + 50), this.props.len);
      this.baseRLSVG("100%", ((15 * this.props.dataset.length) + 50));
      this.writeBase(15, this.props.xscale, this.props.column_names, this.props.len);
      this.writeBaseRLSVG(15, this.props.len);
      }, 50);
      //const set = new Set([]);
      //console.log("length", this.props.dataset.length);
      for(let i = 0; i < this.props.dataset.length; i++)
      {
        //console.log(rr[i]);
        setTimeout(() => {
        this.writeSingle5(y_start, this.props.dataset[i], 15, this.props.xscale, this.props.column_names, 1);
        this.writeRowLabel(y_start, this.props.dataset[i], 15);
        y_start = y_start + 15;
        }, 50);      
      }
    }
  }

  render (){
    //console.log("NEW OKMAP RENDER", this.props.column_names);

    //var map1 = new OKMAP("HEATMAP_0", cbeds, document, ((400/cbeds.length) * adjust_width), rr.length);
    var tempnode = document.getElementById(this.target_div);
    var y_start = 0;
    if(tempnode.hasChildNodes() == "")
    {
      setTimeout(() => {
      this.baseSVG("100%", ((this.state.zoom_level * this.props.dataset.length) + 50), this.props.len);
      this.baseRLSVG("100%", ((this.state.zoom_level * this.props.dataset.length) + 50));
      this.writeBase(this.state.zoom_level, this.props.xscale, this.props.column_names, this.props.len);
      this.writeBaseRLSVG(this.state.zoom_level);
      }, 50);
      //const set = new Set([]);
      //console.log("length", this.props.dataset.length);
      for(let i = 0; i < this.props.dataset.length; i++)
      {
        //console.log(rr[i]);
        setTimeout(() => {
        this.writeSingle5(y_start, this.props.dataset[i], this.state.zoom_level, this.props.xscale, this.props.column_names, 1);
        this.writeRowLabel(y_start, this.props.dataset[i], this.state.zoom_level);
        y_start = y_start + this.state.zoom_level;
        }, 50);
        //set.add(this.props.dataset[i]["symbol"]);
      }
    }
    else
    {
      var tempnodeRL = document.getElementById(this.target_row_label_div);
      tempnodeRL.innerHTML = "";
      this.baseRLSVG("100%", ((this.state.zoom_level * this.props.dataset.length) + 50));
      this.writeBaseRLSVG(this.state.zoom_level);
      var yRL_start = 0;
      for(let k = 0; k < this.props.dataset.length; k++)
      {
        //console.log(rr[i]);
        setTimeout(() => {
        this.writeRowLabel(yRL_start, this.props.dataset[k], this.state.zoom_level);
        yRL_start = yRL_start + this.state.zoom_level;
        }, 50);
        //set.add(this.props.dataset[i]["symbol"]);
      }
    }
    return(
      null
    );
  }

}

const spboxProps = {
  border: 3,
};

function selectionToSup(selection){
  this.setState({
    selection: selection
  })
}

function loopThroughGene(ss, s, col, cc, rpsi, trans){
  var Selection = s;
  var myArray1 = [];
  var myArray2 = [];
  for(var i = 0; i < col.length; i++)
  {
    var curcol = col[i];
    if(rpsi[curcol] == "0")
    {
      myArray1.push(ss[curcol]);
    }
  }
  for(var i = 0; i < col.length; i++)
  {
    var curcol = col[i];
    if(rpsi[curcol] == "1")
    {
      myArray2.push(ss[curcol]);
    }
  }
  var output = {};
  output["arr1"] = myArray1;
  output["arr2"] = myArray2;
  var plotobj = <Plot
            data={[
              {
                x: "Group1",
                y: output["arr1"],
                type: 'violin',
                name: "Others",
                mode: 'lines+markers',
                marker: {color: 'grey'},
              },
              {
                x: "Group2",
                y: output["arr2"],
                type: 'violin',
                name: trans,
                mode: 'lines+markers',
                marker: {color: 'black'},
              }
            ]}

            layout={ {width: 535,
                      margin: {
                          l: 48,
                          r: 48,
                          b: 48,
                          t: 40
                      },
                      title: {
                          text: s["pancanceruid"],
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                            }
                      },
                      yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        },
                      },
                      xaxis:{
                        title: {
                          text: 'Clusters',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      },
                      height: 200} }
  />;
  return plotobj;
}

function loopThroughHC(ss, s, col, cc, rpsi){
  //console.log("cc_run", cc)
  var Selection = s;
  var myArray1 = [];
  var myArray2 = [];
  var myArray3 = [];
  for(var i = 0; i < col.length; i++)
  {
    var curcol = col[i];
    if(cc[i] == "1")
    {
      myArray1.push(ss[curcol]);
    }
    if(cc[i] == "2")
    {
      myArray2.push(ss[curcol]);
    }
    if(cc[i] == "3")
    {
      myArray3.push(ss[curcol]);
    }
  }
  var output = {};
  output["arr1"] = myArray1;
  output["arr2"] = myArray2;
  output["arr3"] = myArray3;
  if(output["arr3"].length > 0)
  {
    var plotobj = <Plot
              data={[
                {
                  y: output["arr1"],
                  type: 'violin',
                  mode: 'lines+markers',
                  name: "Cluster 1",
                  marker: {color: 'orange'},
                },
                {
                  y: output["arr2"],
                  type: 'violin',
                  mode: 'lines+markers',
                  name: "Cluster 2",
                  marker: {color: 'blue'},
                },
                {
                  y: output["arr3"],
                  type: 'violin',
                  mode: 'lines+markers',
                  name: "Cluster 3",
                  marker: {color: 'green'},
                }
              ]}
              layout={ {width: 535,
                        height: 200,
                        margin: {
                          l: 48,
                          r: 48,
                          b: 48,
                          t: 40
                        },
                        title: {
                          text: s["pancanceruid"],
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                            }
                        },   
                        yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        },
                        },
                        xaxis:{
                        title: {
                          text: 'Clusters',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      }} }
    />;    
  }
  else
  {
    var plotobj = <Plot
              data={[
                {
                  y: output["arr1"],
                  type: 'violin',
                  mode: 'lines+markers',
                  name: "Cluster 1",
                  marker: {color: 'orange'},
                },
                {
                  y: output["arr2"],
                  type: 'violin',
                  mode: 'lines+markers',
                  name: "Cluster 2",
                  marker: {color: 'blue'},
                }
              ]}
              xaxis={{
                title: {
                  text: 'x Axis',
                  font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                  }
                },
              }}
              layout={ {width: 535,
                        height: 200,
                        margin: {
                          l: 48,
                          r: 48,
                          b: 48,
                          t: 40
                        },
                        title: {
                          text: s["pancanceruid"],
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                            }
                        }, 
                        yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }},
                        xaxis:{
                        title: {
                          text: 'Clusters',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      }} }
    />;     
  }

  return plotobj;
}

function loopThroughFilter(ss, s, col, cc, rpsi, out, set){
  var datarray = [];
  //console.log("lTF", out);
  //console.log("set", set);
  for(var i = 0; i < set.length; i++)
  {   

      var curstack = [];
      for(var k = 0; k < col.length; k++)
      {
        if(out[col[k]] == set[i])
        {
          curstack.push(ss[col[k]]);
        }
      }
      var name = set[i];
      var curcolor = global_colors[i];
      datarray.push({
        y: curstack,
        type: 'violin',
        mode: 'lines+markers',
        name: name,
        marker: {color: curcolor},
      });
  }
  var plotobj = <Plot
              data={datarray}
              layout={ {width: 535, 
                        height: 300,
                        margin: {
                          l: 48,
                          r: 48,
                          b: 100,
                          t: 40
                        },
                        title: {
                          text: s["pancanceruid"],
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                            }
                        },
                        yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }},
                        xaxis:{
                        title: {
                          text: 'Filters',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      }} }
  />;
  return plotobj;
}

function loopThroughGtex(vec){
  var datarray = [];
  var counter = 0;
  for (const [key, value] of Object.entries(vec)) {
          if(key != "uid")
          {
          //console.log(key, value);
          var tmparr = value.split("|");
          
          var curcolor = global_colors[counter];
          datarray.push({
            y: tmparr,
            type: 'violin',
            mode: 'lines+markers',
            name: key,
            marker: {color: curcolor},
          });

          counter = counter + 1;
          }
  }

  var plotobj = <Plot
              data={datarray}
              layout={ {width: 525, 
                        height: 450,
                        margin: {
                          l: 48,
                          r: 32,
                          b: 200,
                          t: 40
                        },
                        showlegend: false,
                        title: {
                          text: "GTEX",
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                            }
                        },
                        yaxis:{
                        range: [0, 1],
                        title: {
                          text: 'PSI Value',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }},
                        xaxis:{
                        title: {
                          text: 'GTEX',
                          font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: '#7f7f7f'
                          }
                        }
                      }} }
  />;
  return plotobj;
}


function supFilterUpdate(data)
{
  this.setState({
    filters: data["out"],
    filterset: data["set"]
  })  
}

class SupplementaryPlot extends React.Component {
  constructor(props) 
  {
    super(props);
    this.state = {
      selection: null,
      filters: null,
      filterset: null,
      matches: null,
      fulldat: null,
      gtex: null
    };
    //var other_gene_matches = [];
    selectionToSup = selectionToSup.bind(this);
    supFilterUpdate = supFilterUpdate.bind(this);
    plot4update = plot4update.bind(this);
    gtexupdate = gtexupdate.bind(this);
    plotUIDupdate = plotUIDupdate.bind(this);
  }

  componentDidMount(){
      var Data = this.props.Data;
      console.log("DATA MOUNT:", Data[0]);
      updateOkmapTable(Data[0]);
      selectionToSup(Data[0]);
  }

  render(){
    var Data = this.props.Data;
    var Cols = this.props.Cols;
    var Selection = this.state.selection;
    var set = null;
    var plotobj1 = null;
    var plotobj2 = null;
    var plotobj3 = null;
    //console.log("current state", this.state.filterset, this.state.filters);
    var elm1 = this.state.filters;
    var elm2 = this.state.filterset;
    if(Selection != null && this.state.filterset != null && this.state.fulldat != null)
    {
      var plotobj1 = loopThroughGene(this.state.fulldat, Selection, this.props.Cols, this.props.CC, this.props.RPSI, this.props.TRANS);
      var plotobj2 = loopThroughHC(this.state.fulldat, Selection, this.props.Cols, this.props.CC, this.props.RPSI, this.props.TRANS);
      var plotobj3 = loopThroughFilter(this.state.fulldat, Selection, this.props.Cols, this.props.CC, this.props.RPSI, elm1, elm2);
    }
    else
    {
      var plotobj1 = <h4>No selection set</h4>;
      var plotobj2 = <h4>No selection set</h4>;
      var plotobj3 = <h4>No selection set</h4>;
    }

    if(Selection != null && this.state.gtex != null)
    {
      var plotobj4 = loopThroughGtex(this.state.gtex);
    }
    else
    {
      if(this.state.fulldat == null)
      {
        var plotobj4 = <h4>No selection set</h4>;
      }
      else
      {
        var plotobj4 = <h4>No GTEX available for given UID</h4>;
      }
    }

    //var plotdata = [trace1, trace2];
    //Plotly.newPlot('supp1', plotdata); 
    return(
      <>
      <div style={{marginBottom: 10}}>
      <SpcInputLabel label={"OncoClusters"} />
      <Box borderColor="#dbdbdb" {...spboxProps}>
        <div>
          {plotobj1}
        </div>
      </Box>
      </div>
      <div style={{marginBottom: 10}}>
      <SpcInputLabel label={"HierarchyClusters"} />
      <Box borderColor="#dbdbdb" {...spboxProps}>
        <div>
          {plotobj2}
        </div>
      </Box>
      </div>
      <div style={{marginBottom: 10}}>
      <SpcInputLabel label={"Filters"} />
      <Box borderColor="#dbdbdb" {...spboxProps}>
        <div>
          {plotobj3}
        </div>
      </Box>
      </div>
      <div style={{marginBottom: 10}}>
      <SpcInputLabel label={"GTEX"} />
      <Box borderColor="#dbdbdb" {...spboxProps}>
        <div>
          {plotobj4}
        </div>
      </Box>
      </div>
      </>
    )
  }
}

function updateExPlot(exons, transcripts, junctions, in_data){
  this.setState({
      exons: exons,
      transcripts: transcripts,
      junctions: junctions,
      in_data: in_data
  });
}

class SetExonPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }
  componentDidMount() { 
    //console.log("ComponentMounted");
    var base_re_wid = window.innerWidth;
    var base_re_high = window.innerHeight;
    var standard_width = 1438;
    var standard_height = 707;
    var adjust_width = (base_re_wid / standard_width) * 0.40;
    var adjust_height = (base_re_high / standard_height) * 0.40;
    var y_start = 0;

    this.setState({
      input: <EXON_PLOT doc={document} target_div_id={"supp1"}></EXON_PLOT>
    })
  }

  render()
  {
    //console.log("ComponentRendered", this.state);
    return(
      <div>
      {this.state.input}
      </div>
    );
  }
}


class EXON_PLOT extends React.Component {
  constructor(props)
  {
    super(props);
    this.target_div = this.props.target_div_id;
    this.SVG_main_group = null;
    this.xscale = 0.05;
    this.doc = this.props.doc;
    this.div = null;
    this.ens_map = {};
    this.state = {
      exons: null,
      transcripts: null,
      junctions: null,
      in_data: null,
      scaled: false
    };
    updateExPlot = updateExPlot.bind(this)
    setScaling = setScaling.bind(this)
  }

  baseSVG(w="100%", h=2000) 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
      
    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("stroke-width", 0)
      .attr("type", "canvas")
      .attr("fill", "White");    
  }

  writeBase()
  {
    this.SVG_main_group.append("rect")
      .attr("width", "100%")
      .attr("height", 2000)
      .style("opacity", 1.0)
      .attr("fill", "White");

    this.rect = d3.select("body").append("rect") 
      .attr("width", 30)
      .attr("height", 30)
      .style("opacity", 1.0)
      .attr("type", "canvas")
      .attr("fill", "red");

  }

  tempTextAdd(name, originX, originY, id_in)
  {
    this.SVG_main_group.append("text")
      .attr("x", originX)
      .attr("y", (originY - 30))
      .attr("text-anchor", "start")
      .attr("id", "TEMPORARY_HIGHLIGHT") 
      .style("font-size", "16px")
      .style('fill', 'red')
      .text(name);
  }

  tempTextRemove()
  {
    var text_to_remove = document.getElementById("TEMPORARY_HIGHLIGHT");
    d3.select(text_to_remove).remove();
  }

  tempOnHover(in_x, in_y, in_text, flag)
  {

    if(flag == "add")
    {
      var h_adj = 0;

      if(in_text.length == 2)
      {
        h_adj = 40;
      }
      else
      {
        h_adj = 80;
      }

      this.SVG_hover_group = this.SVG.append("g").attr("id", "Ubaid".concat(in_x.toString()));
        


      if(in_text.length == 2)
      {
        var set_y = in_y-h_adj;
        var set_x = in_x+65;

        var set_y_text = in_y-21;
        var set_x_text = in_x+95;


        if(set_y < 10)
        {
          set_y = 10;
          set_x = in_x + 105;

          set_y_text = set_y + 20;
          set_x_text = set_x + 20;
        }

        this.SVG_hover_group.append("rect")
          .attr("x", set_x)
          .attr("y", set_y)
          .attr("width", 120)
          .attr("height", 50)
          .style("stroke-width", 3)
          .style("stroke", "black")
          .attr("fill", "black");

        this.SVG_hover_group.append("text")
          .attr("x", set_x_text)
          .attr("y", set_y_text)
          .attr("text-anchor", "start")
          .style("font-size", "10px")
          .style('fill', 'white')

          .text(in_text[0]);

        this.SVG_hover_group.append("text")
          .attr("x", set_x_text)
          .attr("y", set_y_text+18)
          .attr("text-anchor", "start")
          .style("font-size", "10px")
          .style('fill', 'white')

          .text((in_text[1].concat(" bp")));
      }
      else
      {

        this.SVG_hover_group.append("rect")
          .attr("x", in_x+65)
          .attr("y", in_y-h_adj)
          .attr("width", 93)
          .attr("height", 80)
          .style("stroke-width", 3)
          .style("stroke", "black")
          .attr("fill", "black");

        for(var i_k = 0; i_k < in_text.length; i_k++)
        {
          this.SVG_hover_group.append("text")
            .attr("x", in_x+95)
            .attr("y", ((in_y-64 + (i_k * 18))))
            .attr("text-anchor", "start")
            .style("font-size", "10px")
            .style('fill', 'white')
            .text(in_text[i_k]);
        }
      }

    }
    else
    {
      var tunabi = document.getElementById("Ubaid".concat(in_x.toString()));
      d3.select(tunabi).remove();
    }
  }


  writeTranscripts(trans_input)
  {
    var parent = this;
    var y_start = 110;
    console.log("ENS MAP", this.ens_map);
    for (const [key, value] of Object.entries(trans_input)) 
    {
      console.log("Trans input key:", trans_input[key]);
      
      var cur_obj = this.SVG_main_group.append("text")
          .attr("x", 8)
          .attr("y", (y_start + 15))
          .attr("text-anchor", "start")
          .style("font-size", "13px")
          .style("opacity", 1.0)
          .attr("fill", "black")
          .text(key);

      var current_start = 10000000;
      var current_end = 0;

      for(var i = 0; i < (trans_input[key].length); i++)
      {
        try{
        var cur_ens_id = trans_input[key][i];

        const cur_u = this.ens_map[cur_ens_id];
        if(cur_u["x"] < current_start)
        {
          current_start = cur_u["x"];
        } 
        if(cur_u["x"] > current_end)
        {
          current_end = cur_u["x"];
        }
        }
        catch(error)
        {
          console.log("FAIL", trans_input[key][i]);
        }        
      }

      this.SVG_main_group.append("rect")
        .attr("x", current_start)
        .attr("y", y_start + 9)
        .attr("width", (current_end - current_start))
        .attr("height", 2)
        .attr("fill", "grey");

      for(var i = 0; i < (trans_input[key].length); i++)
      {
        try{
        var cur_ens_id = trans_input[key][i];

        const current_unit = this.ens_map[cur_ens_id];

        const hard_start = "Start: ".concat(current_unit["h_start"].toString()).concat(" bp");
        const hard_stop = "Stop: ".concat(current_unit["h_stop"].toString()).concat(" bp");

        const hard_width = Math.abs(current_unit["h_stop"] - current_unit["h_start"]);
        const hard_width_string = "Width: ".concat(hard_width.toString()).concat(" bp");


        var cur_obj = this.SVG_main_group.append("rect")
          .attr("x", current_unit["x"])
          .attr("y", (y_start + 5))
          .attr("width", current_unit["width"])
          .attr("height", 10)
          .attr("t_ens_name", current_unit["name"])
          .attr("transcript", key)
          .style("stroke", "grey")
          .style("stroke-width", "1")
          .style("opacity", 1.0)
          .attr("fill", "#e6e6e6")
          .on("mouseover", function() {
              //console.log(cur_obj);
              var pretg = d3.select(this);
              var gmos = pretg["_groups"][0][0]["attributes"]["t_ens_name"]["nodeValue"];
              var temp_x = pretg["_groups"][0][0]["attributes"]["x"]["nodeValue"];
              var temp_y = pretg["_groups"][0][0]["attributes"]["y"]["nodeValue"];
              //parent.tempTextAdd(gmos, temp_x, temp_y, pip);
              parent.tempOnHover(temp_x, temp_y, [current_unit["name"], hard_start, hard_stop, hard_width_string], "add")
              })          
          .on("mouseout", function(d) {   
              //parent.tempTextRemove();
              var pretg = d3.select(this);
              var gmos = pretg["_groups"][0][0]["attributes"]["t_ens_name"]["nodeValue"];
              var temp_x = pretg["_groups"][0][0]["attributes"]["x"]["nodeValue"];
              var temp_y = pretg["_groups"][0][0]["attributes"]["y"]["nodeValue"];
              parent.tempOnHover(temp_x, temp_y, [current_unit["name"], hard_start, hard_stop, hard_width_string], "remove")
          });
        }
        catch(error)
        {
          console.log("FAIL", trans_input[key][i]);
        }
      }
      y_start = y_start + 20;

    }
  }

  tempCircleAdd(flag, x, y)
  {
    if(flag == "add")
    {
      /*var j_id_t = document.getElementById(j_id);
      console.log("CIRCLE_GET", j_id_t);
      var temp_x_1 = parseFloat(j_id_t["attributes"]["cx"]["nodeValue"]);
      var temp_y_1 = parseFloat(j_id_t["attributes"]["cy"]["nodeValue"]);
      var temp_r = parseFloat(j_id_t["attributes"]["r"]["nodeValue"]);*/

      this.SVG_main_group.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 7)
        .attr('id', "TEMP_CIRCLE_ID")
        .style('fill', '#e60000');
    }
    else
    {
      var circ_to_remove = document.getElementById("TEMP_CIRCLE_ID");
      d3.select(circ_to_remove).remove();
    }
  }

  tempBorderHighlight(flag, g1, g2, m1, m2)
  {
    if(flag == "add")
    {
      d3.select(g1)
        .style('fill', '#e60000')
        .style('stroke', '#e60000');

      d3.select(g2)
        .style('fill', '#e60000')
        .style('stroke', '#e60000');

      const f1 = "no";
      const f2 = "no";

      d3.selectAll("rect").each(function(d, i){
        const cur_make = d3.select(this);
        if(cur_make.attr("t_ens_name") == m1){
          cur_make.style('fill', '#e60000')
          .style('stroke', '#e60000');
        }
        if(cur_make.attr("t_ens_name") == m2){
          cur_make.style('fill', '#e60000')
          .style('stroke', '#e60000');
        }
      })
      /*
      var gmos_1 = g1["attributes"]["exname"]["nodeValue"];
      var temp_x_1 = parseFloat(g1["attributes"]["x"]["nodeValue"]);
      var temp_y_1 = parseFloat(g1["attributes"]["y"]["nodeValue"]);
      var temp_wid_1 = parseFloat(g1["attributes"]["width"]["nodeValue"]);

      var gmos_2 = g2["attributes"]["exname"]["nodeValue"];
      var temp_x_2 = parseFloat(g2["attributes"]["x"]["nodeValue"]);
      var temp_y_2 = parseFloat(g2["attributes"]["y"]["nodeValue"]);
      var temp_wid_2 = parseFloat(g2["attributes"]["width"]["nodeValue"]);*/

    }
    else
    {
      d3.select(g1)
        .style("fill", "#e6e6e6")
        .style('stroke', 'grey');

      d3.select(g2)
        .style("fill", "#e6e6e6")
        .style('stroke', 'grey');

      d3.selectAll("rect").each(function(d, i){
        const cur_make = d3.select(this);
        if(cur_make.attr("t_ens_name") == m1){
          cur_make.style('fill', '#e6e6e6')
          .style('stroke', 'grey');
        }
        if(cur_make.attr("t_ens_name") == m2){
          cur_make.style('fill', '#e6e6e6')
          .style('stroke', 'grey');
        }
      })

    }
  }

  writeJunctions(junc_input, in_data)
  {
    var parent = this;
    const curve = d3.line().curve(d3.curveNatural);
    var juncpointset = [];
    var juncpointset8 = [];
    var juncpointset12 = [];
    for(var i = 0; i < junc_input.length; i++)
    {
      try {
      var junc_iter = junc_input[i];
      const cur_junc = junc_iter["junction"];
      var sign = junc_iter["strand"];
      if(sign == "+")
      {
        var parse = cur_junc.split("-");
        var starting_exon = parse[0];
        var finishing_exon = parse[1];
      }
      else
      {
        var parse = cur_junc.split("-");
        var starting_exon = parse[1];
        var finishing_exon = parse[0];
      }

      const get_1 = document.getElementById(starting_exon.concat("_global_id"));
      const get_2 = document.getElementById(finishing_exon.concat("_global_id"));

      //console.log(get_2["_groups"])
      //console.log(get_2["attributes"])
      //console.log(get_2["_groups"]["exname"])

      const gmos_1 = get_1["attributes"]["exname"]["nodeValue"];
      var temp_x_1 = parseFloat(get_1["attributes"]["x"]["nodeValue"]);
      var temp_y_1 = parseFloat(get_1["attributes"]["y"]["nodeValue"]);
      var temp_wid_1 = parseFloat(get_1["attributes"]["width"]["nodeValue"]);

      const gmos_2 = get_2["attributes"]["exname"]["nodeValue"];
      var temp_x_2 = parseFloat(get_2["attributes"]["x"]["nodeValue"]);
      var temp_y_2 = parseFloat(get_2["attributes"]["y"]["nodeValue"]);
      var temp_wid_2 = parseFloat(get_2["attributes"]["width"]["nodeValue"]);

      var junctions_matched = 0;

      var junc2_start = get_2["attributes"]["start"]["nodeValue"];
      var junc1_end = get_1["attributes"]["stop"]["nodeValue"];
      const junclength = "Junction length: ".concat((parseInt(get_2["attributes"]["start"]["nodeValue"]) - parseInt(get_1["attributes"]["stop"]["nodeValue"])).toString());

      if(in_data["coord1"] == junc1_end && in_data["coord2"] == junc2_start){junctions_matched = 2;}
      if(in_data["coord2"] == junc1_end && in_data["coord1"] == junc2_start){junctions_matched = 2;}
      if(in_data["coord3"] == junc1_end && in_data["coord4"] == junc2_start){junctions_matched = 2;}
      if(in_data["coord4"] == junc1_end && in_data["coord3"] == junc2_start){junctions_matched = 2;}

      if(junctions_matched >= 2){
        var junction_color = "orange";
        var circle_color = "#ff9933";
      }
      else
      {
        var junction_color = "#008080";
        var circle_color = "black";
      }

      var potent_end = (temp_x_1+temp_wid_1);
      var curve_s_x = potent_end + ((temp_x_2 - potent_end) / 2);

      var t_x_s = curve_s_x;
      var y_adj = 0;

      for(var ted = 0; ted < juncpointset.length; ted++)
      {
        var iter_ted = juncpointset[ted];
        if(Math.abs((iter_ted - t_x_s)) < 10)
        {
          y_adj = 12;
        }
      }

      if(y_adj == 12)
      {
        for(var ted = 0; ted < juncpointset8.length; ted++)
        {
          var iter_ted = juncpointset8[ted];
          if(Math.abs((iter_ted - t_x_s)) < 10)
          {
            y_adj = 24;
          }
        }        
      }

      if(y_adj == 24)
      {
        for(var ted = 0; ted < juncpointset12.length; ted++)
        {
          var iter_ted = juncpointset12[ted];
          if(Math.abs((iter_ted - t_x_s)) < 10)
          {
            y_adj = 36;
          }
        }        
      }

      var points = [[potent_end, 90], [t_x_s, (65 - y_adj)], [temp_x_2, 90]];

      if(y_adj == 0)
      {
        juncpointset.push(t_x_s);
      }
      if(y_adj == 12)
      {
        juncpointset8.push(t_x_s);
      }
      if(y_adj == 24)
      {
        juncpointset12.push(t_x_s);
      }
      var finy = (65 - y_adj);
      this.SVG_main_group.append('path')
        .attr('d', curve(points))
        .attr('stroke', junction_color)
        // with multiple points defined, if you leave out fill:none,
        // the overlapping space defined by the points is filled with
        // the default value of 'black'
        .attr('fill', 'none');
      //#4d0000
      var burger = this.SVG_main_group.append('circle')
        .attr('cx', t_x_s)
        .attr('cy', finy)
        .attr('r', 5)
        .attr('id', cur_junc.concat("_global_id"))
        .style('fill', circle_color)
        .on("mouseover", function() {
              var pretg = d3.select(this);
              var temp_x = pretg["_groups"][0][0]["attributes"]["cx"]["nodeValue"];
              var temp_y = pretg["_groups"][0][0]["attributes"]["cy"]["nodeValue"];

              parent.tempCircleAdd("add", temp_x, temp_y)
              parent.tempBorderHighlight("add", get_1, get_2, gmos_1, gmos_2)

              parent.tempOnHover(temp_x, temp_y, [cur_junc, junclength], "add")
            })          
        .on("mouseout", function(d) {
              var pretg = d3.select(this);
              var temp_x = pretg["_groups"][0][0]["attributes"]["cx"]["nodeValue"];
              var temp_y = pretg["_groups"][0][0]["attributes"]["cy"]["nodeValue"];

              parent.tempCircleAdd("remove", (cur_junc.concat("_global_id")))
              parent.tempBorderHighlight("remove", get_1, get_2, gmos_1, gmos_2)

              parent.tempOnHover(temp_x, temp_y, [cur_junc, junclength], "remove")
        });
      }
      catch (error) {
        console.log("ERROR:", error);
        continue;
      }

    }
  }

  writeExons(exon_input)
  {
    var parent = this;
    var starting_point = exon_input[0]["start"];
    var scale_exon_stop = 0;
    var to_x_scale = 0;
    var min_exon_length = 3;
    var max_exon_length = 20;
    var x_offset = 150;
    for(var i = 0; i < exon_input.length; i++)
    {
      var exname = exon_input[i]["exon_name"];

      if(i == 0)
      {
        var x_pos_1 = exon_input[i]["start"] - starting_point;
        var x_pos_2 = exon_input[i]["stop"] - starting_point;
        if(this.state.scaled == false)
        {
          if((x_pos_2 - x_pos_1) > 20)
          {
            scale_exon_stop = 20;
          }
          else if((x_pos_2 - x_pos_1) < 3)
          {
            scale_exon_stop = 3;
          }
          else
          {
            scale_exon_stop = x_pos_2;
          }
        }
        else
        {
          scale_exon_stop = x_pos_2;
        }
      }
      else
      {
        if(exname.charAt(0) == "I")
        {
          scale_exon_stop = scale_exon_stop + 20;
          continue;
        }
        else
        {
          var x_pos_1 = scale_exon_stop;
          var x_pos_2 = scale_exon_stop + (exon_input[i]["stop"] - exon_input[i]["start"]);
          if(this.state.scaled == false)
          {
            if((exon_input[i]["stop"] - exon_input[i]["start"]) < 3)
            {
              scale_exon_stop = scale_exon_stop + 3;
            }
            else if((exon_input[i]["stop"] - exon_input[i]["start"]) > 20)
            {
              scale_exon_stop = scale_exon_stop + 20;
            }
            else
            {
              scale_exon_stop = x_pos_2;
            }
          }
          else
          {
            scale_exon_stop = x_pos_2;
          }
        }
      }
    }

    to_x_scale = (window.innerWidth / 1.25) / scale_exon_stop;

    var last_exon_stop = 0;
    for(var i = 0; i < exon_input.length; i++)
    {
      const exname = exon_input[i]["exon_name"];
      const hard_start = "Start: ".concat(exon_input[i]["start"].toString()).concat(" bp");
      const hard_stop = "Stop: ".concat(exon_input[i]["stop"].toString()).concat(" bp");

      const hard_width = Math.abs(exon_input[i]["stop"] - exon_input[i]["start"]);
      const hard_width_string = "Width: ".concat(hard_width.toString()).concat(" bp");

      if(i == 0)
      {
        var x_pos_1 = exon_input[i]["start"] - starting_point;
        var x_pos_2 = exon_input[i]["stop"] - starting_point;
        if(this.state.scaled == false)
        {
          if((x_pos_2 - x_pos_1) > 20)
          {
            x_pos_2 = x_pos_1 + 20;
            last_exon_stop = 20;
          }
          else if((x_pos_2 - x_pos_1) < 3)
          {
            x_pos_2 = x_pos_1 + 3;
            last_exon_stop = 3;
          }
          else
          {
            last_exon_stop = x_pos_2;
          }
        }
        else
        {
          last_exon_stop = x_pos_2;
        }
      }
      else
      {
        if(exname.charAt(0) == "I")
        {
          last_exon_stop = last_exon_stop + 20;
          continue;
        }
        else
        {
          var x_pos_1 = last_exon_stop;
          var x_pos_2 = last_exon_stop + (exon_input[i]["stop"] - exon_input[i]["start"]);
          if(this.state.scaled == false)
          {
            if((exon_input[i]["stop"] - exon_input[i]["start"]) < 3)
            {
              x_pos_2 = x_pos_1 + 3;
              last_exon_stop = last_exon_stop + 3;
            }
            else if((exon_input[i]["stop"] - exon_input[i]["start"]) > 20)
            {
              x_pos_2 = x_pos_1 + 20;
              last_exon_stop = last_exon_stop + 20;
            }
            else
            {
              last_exon_stop = x_pos_2;
            }
          }
          else
          {
            last_exon_stop = x_pos_2;
          }
        }
      }

      x_pos_1 = x_pos_1 * to_x_scale;
      x_pos_2 = x_pos_2 * to_x_scale;

      var higs = this.div;

      var cur_obj = this.SVG_main_group.append("rect")
        .attr("x", (x_offset + x_pos_1))
        .attr("y", 90)
        .attr("width", (x_pos_2 - x_pos_1))
        .attr("height", 10)
        .style("stroke", "grey")
        .style("stroke-width", "1")
        .style("opacity", 1.0)
        .attr("fill", "#e6e6e6")
        .attr("id", exname.concat("_global_id"))
        .attr("exname", exname)
        .attr("ensembl_exon_id", exon_input[i]["ensembl_exon_id"])
        .attr("start", exon_input[i]["start"])
        .attr("stop", exon_input[i]["stop"])
        .on("mouseover", function() {
            //console.log(cur_obj);
            var pretg = d3.select(this);
            var gmos = pretg["_groups"][0][0]["attributes"]["exname"]["nodeValue"];
            var temp_x = pretg["_groups"][0][0]["attributes"]["x"]["nodeValue"];
            var temp_y = pretg["_groups"][0][0]["attributes"]["y"]["nodeValue"];
            const pip = exname.concat("_global_id")
            //parent.tempTextAdd(gmos, temp_x, temp_y, pip);
            parent.tempOnHover(temp_x, temp_y, [exname, hard_start, hard_stop, hard_width_string], "add")
            })          
        .on("mouseout", function(d) {   
            //parent.tempTextRemove();
            var pretg = d3.select(this);
            var gmos = pretg["_groups"][0][0]["attributes"]["exname"]["nodeValue"];
            var temp_x = pretg["_groups"][0][0]["attributes"]["x"]["nodeValue"];
            var temp_y = pretg["_groups"][0][0]["attributes"]["y"]["nodeValue"];
            parent.tempOnHover(temp_x, temp_y, [exname, hard_start, hard_stop, hard_width_string], "remove")
        });

      //var ens_id = exon_input[i]["ensembl_exon_id"];
      //var ens_id_split = ens_id.split("|");

      //for(var k = 0; k < ens_id_split.length; k++)
      //{
      this.ens_map[exon_input[i]["start"]] = {};
      this.ens_map[exon_input[i]["start"]]["name"] = exname;
      this.ens_map[exon_input[i]["start"]]["x"] = x_offset + x_pos_1;
      this.ens_map[exon_input[i]["start"]]["width"] = (x_pos_2 - x_pos_1);
      this.ens_map[exon_input[i]["start"]]["h_start"] = exon_input[i]["start"];
      this.ens_map[exon_input[i]["start"]]["h_stop"] = exon_input[i]["stop"];
      //}

    }
    
  }

  /*
  componentDidUpdate (prevProps){
    if(this.props !== prevProps)
    {
      if(this.state.exons != null && this.state.exons != null && this.state.exons != null)
      {
        
      }
    }
  }*/

  render (){
    //console.log("NEW OKMAP RENDER", this.props.column_names);

    //var map1 = new OKMAP("HEATMAP_0", cbeds, document, ((400/cbeds.length) * adjust_width), rr.length);
    //var tempnode = document.getElementById(this.target_div);
    var y_start = 0;
    var tempnode = document.getElementById(this.target_div);
    while (tempnode.firstChild) {
        tempnode.removeChild(tempnode.firstChild);
    }
    this.baseSVG();
    this.writeBase();
    if(this.state.exons != null && this.state.transcripts != null && this.state.junctions != null)
    {
      var sorted_exons = this.state.exons.sort((a, b)=>{return Number(a["start"])-Number(b["start"])})
      console.log(sorted_exons);
      this.writeExons(sorted_exons);
      this.writeJunctions(this.state.junctions, this.state.in_data);
      this.writeTranscripts(this.state.transcripts)
    }
    return(
      null
    );
  }

}

const SpcCheckbox = withStyles({
  root: {
    color: "#0F6A8B",
    '&$checked': {
      color: "#0F6A8B",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function setScaling(boolean_val)
{
  this.setState({
    scaled: boolean_val
  });
}

function ScalingCheckbox(props)
{
  const [state, setState] = React.useState({
      checkedB: false,
    });

    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
      //props.updateBQPane(event.target.checked);
      //props.qBDefaultMessage(event.target.checked);
      setScaling(event.target.checked);
      console.log(event.target.checked);
    };

  return(
  <div style={{marginLeft: 3}}>
  <FormControlLabel
      control={
          <SpcCheckbox
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
          />
          }
      label="Use Unscaled"
  />
  </div>
  );
}


function downloadTranscript(){
  console.log(global_exon_blob);
  var blob_text = "";
  for (const [key, value] of Object.entries(global_exon_blob[0])) {
        blob_text = blob_text.concat(key);
        blob_text = blob_text.concat(",");
  }

  blob_text = blob_text.slice(0, -1);
  blob_text = blob_text.concat("\n");

  for(var i = 0; i < global_exon_blob.length; i++)
  {
    for (const [key, value] of Object.entries(global_exon_blob[i])) {
          blob_text = blob_text.concat(value);
          blob_text = blob_text.concat(",");
    }
    blob_text = blob_text.slice(0, -1);
    blob_text = blob_text.concat("\n");
  }

  var filename;
  filename = "transcript.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

function downloadGeneModel(){
  console.log(global_genemodel_blob);
  var blob_text = "";
  for (const [key, value] of Object.entries(global_genemodel_blob[0])) {
        blob_text = blob_text.concat(key);
        blob_text = blob_text.concat(",");
  }

  blob_text = blob_text.slice(0, -1);
  blob_text = blob_text.concat("\n");

  for(var i = 0; i < global_genemodel_blob.length; i++)
  {
    for (const [key, value] of Object.entries(global_genemodel_blob[i])) {
          blob_text = blob_text.concat(value);
          blob_text = blob_text.concat(",");
    }
    blob_text = blob_text.slice(0, -1);
    blob_text = blob_text.concat("\n");
  }

  var filename;
  filename = "genemodel.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

function downloadJunctions(){
  console.log(global_junc_blob);
  var blob_text = "";
  for (const [key, value] of Object.entries(global_junc_blob[0])) {
        blob_text = blob_text.concat(key);
        blob_text = blob_text.concat(",");
  }

  blob_text = blob_text.slice(0, -1);
  blob_text = blob_text.concat("\n");

  for(var i = 0; i < global_junc_blob.length; i++)
  {
    for (const [key, value] of Object.entries(global_junc_blob[i])) {
          blob_text = blob_text.concat(value);
          blob_text = blob_text.concat(",");
    }
    blob_text = blob_text.slice(0, -1);
    blob_text = blob_text.concat("\n");
  }

  var filename;
  filename = "junctions.csv";

  var uri = "data:application/octet-stream," + encodeURIComponent(blob_text);
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;

  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}


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
        <ViewPane_Side Data={props.Data} Cols={props.Cols} CC={props.CC} RPSI={props.RPSI} TRANS={props.TRANS} QueryExport={props.QueryExport}/>
      </Grid>
    </Grid>
    <div style={{margin: 10}}>
      <Grid container spacing={1}>
      <Grid item xs={2}>
      <SpcInputLabel label={"ExonPlot"} />
      </Grid>
      <Grid item>
        <ScalingCheckbox />
      </Grid>
      <Grid item>
        <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white"}} onClick={downloadTranscript}>Download Transcript</Button>
      </Grid>
      <Grid item>
        <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white"}} onClick={downloadGeneModel}>Download Gene Model</Button>
      </Grid>
      <Grid item>
        <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white"}} onClick={downloadJunctions}>Download Junctions</Button>
      </Grid>
      <Grid item>
        <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white"}}>Download PDF</Button>
      </Grid>
      </Grid>
      <Box borderColor="#dbdbdb" {...spboxProps}>
        <div style={{marginLeft: 20, marginTop: 10, marginBottom: 10}} id="supp1">
        </div>
      </Box>
    </div>
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
    <SupplementaryPlot title={"OncoClusters"} function={loopThroughGene} CC={props.CC} RPSI={props.RPSI} TRANS={props.TRANS} Data={props.Data} Cols={props.Cols}></SupplementaryPlot>
    <Stats></Stats>
    <SetExonPlot></SetExonPlot>
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