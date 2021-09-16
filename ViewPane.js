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
import LabelHeatmap from './components/LabelHeatmap';
import downloadHeatmapText from './components/downloadHeatmapText';
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
      console.log("RET RET RET", ret, global_cancer);
      updateOkmapLabel(ret);
      //console.log(retval);
      //console.log(retset);
      //console.log(global_cols);
      //var okheader = new OKMAP_LABEL("HEATMAP_LABEL",global_cols,retval,document,);
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

function makeLinkOuts(instuff){
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


function updateOkmapTable(data){
  var newcoord = makeLinkOuts(data["coordinates"]);
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

      if(global_cancer == "LAML" || global_cancer == "LGG")
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