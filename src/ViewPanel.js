import React from 'react';
import Button from '@material-ui/core/Button';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';
import SpcInputLabel from './components/SpcInputLabel';
import FilterItem from './components/FilterItem';
import CustomizedTables from './components/CustomizedTables';
import LabelHeatmap from './components/LabelHeatmap';
import downloadHeatmapText from './components/downloadHeatmapText';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import targeturl from './targeturl.js';
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Resizable, ResizableBox } from "react-resizable";
import loadingGif from './images/loading.gif';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import './css/sidebar.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import useStyles from './css/useStyles.js';
import { global_colors } from './utilities/constants.js';

import oncospliceClusterViolinPlotPanel from './plots/oncospliceClusterViolinPlotPanel';
import hierarchicalClusterViolinPlotPanel from './plots/hierarchicalClusterViolinPlotPanel';
import sampleFilterViolinPlotPanel from './plots/sampleFilterViolinPlotPanel';
import { gtexSend } from './plots/gtexPlotPanel.js';
import { downloadExonPlotData, downloadPdfFunction, downloadHeatmapFunction} from './downloadDataFile.js';
import SetExonPlot from './plots/exonPlot.js';
import OKMAP_COLUMN_CLUSTERS from './plots/okmapColumnClusters.js';
import OKMAP_OncospliceClusters from './plots/okmapOncospliceClusters.js';
import PlotPanel from './plots/plotPanel.js';
import { isBuild } from './utilities/constants.js';

var routeurl = isBuild ? "https://www.altanalyze.org/oncosplice" : "http://localhost:8081";

var global_meta = [];
var global_sig = [];
var global_data = [];
var global_uifielddict = {};
var global_cancer = "";
var global_signature = "";
var global_trans = "";
var global_cols = [];
var global_cc = [];
var global_OncospliceClusters = [];
var global_Y = "";
var global_adj_height = "";
var global_heat_len = "";
var link1 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=mm10&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";
var link2 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=mm10&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

function metarepost(name, setFilterState, setOkmapLabelState) {
  //console.log("metarepost set", name, setFilterState);
  var bodyFormData = new FormData();
  if(name != "age range")
  {
    name = name.replaceAll("  ", "__");
    name = name.replaceAll(" ", "_");
  }
  bodyFormData.append("NAME", name);
  bodyFormData.append("CANCER", global_cancer);
  var postData = {"data": {
    "name": name,
    "cancerType": global_cancer
  }}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/interactiveFilter"),
    data: postData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var ret = response["data"];
      //console.log("metarepost response data", ret);
      setOkmapLabelState(ret);
      setFilterState({filters: ret["out"], filterset: ret["set"]});
    })
}

function oneUIDrequest(UID) {
  var bodyFormData = new FormData();
  var postData = {"data": {
    "uid": UID,
    "cancerType": global_cancer
  }}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/singleUidData"),
    data: postData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      plotUIDupdate(response["data"]["result"][0])
  })
}

function exonRequest(GENE, in_data, setViewState, viewState, exonPlotState, setExonPlotState) {
  var bodyFormData = new FormData();
  var postedData = {"data": {"gene": GENE}}
  axios({
    method: "post",
    url: routeurl.concat("/api/datasets/exonViewerData"),
    data: postedData,
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      var resp = response["data"];
      //console.log("blobbings", resp["blob"]);
      setViewState({
        toDownloadExon: resp["blob"]["trans"],
        toDownloadGeneModel: resp["blob"]["genemodel"],
        toDownloadJunc: resp["blob"]["junc"]
      });
      setExonPlotState({
        exons: resp["gene"],
        transcripts: resp["transcript"],
        junctions: resp["junc"],
        in_data: in_data,
        scaled: exonPlotState.scaled,
        targetdiv: "supp1",
        downscale: 1
      });
  })
}

function plotUIDupdate(dat)
{
  this.setState({
    fulldat: dat
  })
}

const defaultProps = {
  m: 0.1,
};

const boxProps = {
  border: 3,
};

const gridLayoutStyle = {
  overflow: "scroll",
  margin: 1
}

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

function oldLinkOuts(instuff) {
  var [chr1, chr2] = instuff.split("|");
  var [flatchr1, twor1_split] = chr1.split(":");
  var [flatchr2, twor2_split] = chr2.split(":");

  var link = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

  return (
    <div>
      <a href={`${link}${flatchr1}%3A${twor1_split}%2D${twor1_split[1]}&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG`} target="_blank">{chr1}</a>
      <br />
      <a href={`${link}${flatchr2}%3A${twor2_split}%2D${twor2_split[1]}&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG`} target="_blank">{chr2}</a>
    </div>
  );
}

function makeLinkOuts(chrm, c1, c2, c3, c4){
  var full1 = chrm.concat(":").concat(c1).concat("-").concat(c2);
  var full2 = chrm.concat(":").concat(c3).concat("-").concat(c4);
  var link1 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";
  var link2 = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=";

  return(
    <div>
    <a href={link1.concat(chrm).concat("%3A").concat(c1).concat("%2D").concat(c2).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{full1}</a>
    <br />
    <a href={link2.concat(chrm).concat("%3A").concat(c3).concat("%2D").concat(c4).concat("&hgsid=765996783_dwaxAIrKY42kyCWOzQ3yL51ATzgG")} target="_blank">{full2}</a>
    </div>
  );

}

function updateOkmapTable(data, okmapTable, setOkmapTable){
  //console.log(data);
  var chrm = data["chromosome"];
  var newcoord = chrm == undefined ? oldLinkOuts(data["coordinates"]) : makeLinkOuts(chrm, data["coord1"], data["coord2"], data["coord3"], data["coord4"]);
  var new_row = [
  createData("Altexons", data["altexons"]),
  createData("Protein Predictions", data["proteinpredictions"]),
  createData("Cluster ID", data["clusterid"]),
  createData("Coordinates", newcoord),
  createData("Event Annotation", data["eventannotation"]),
  ];
  //console.log("new_row", new_row);
  setOkmapTable({curAnnots: new_row});
}

function updateOkmapLabel(data){
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
    "value": Object.entries(props.uifielddict.dict)[0][0],
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
      "value": event.target.value
    });
    metarepost(event.target.value, props.setFilterState, props.setOkmapLabelState);
  }

  return (
    <div>
      <SpcInputLabel label={"Show Sample"} customFontSize={"1em"} noSpaceAbove={true}/>
      <FormControl variant="filled" className={classes.formControl}>
        <Select
          native
          value={state.value}
          onChange={handleChange}
          style={{backgroundColor: "white", borderColor:'#EFAD18', border:'2px'}}
          inputProps={{
            name: 'value',
            id: "HeatmapFilterSelect_id",
          }}
        >
          <option value={state.value}>{state.value}</option>
          {(() => {
            const options = [];
            for (const [key, value] of Object.entries(props.uifielddict.dict)) {
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
    //updateOkmapTable = updateOkmapTable.bind(this)
  }

  render()
  {
    //console.log("this.state", this.props.okmapTable.curAnnots);
    //if(this.props)
    return(
      <div>
      <SpcInputLabel label={"Event Annotations"}/>
      <div>
      <Box borderColor="#dbdbdb" {...boxProps}>
        <div id="STATS_0">
          <CustomizedTables contents={this.props.okmapTable.curAnnots}/>
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
      OncospliceClusters: null
    };
  }
  componentDidMount() {
    //console.log("HEATMAP RE-MOUNTED:", this.props.data);
    this.updateHeatmap();
  }

  componentDidUpdate(prevProps) {
    //console.log("HHprop", this.props.QueryExport["single"], prevProps.QueryExport["single"])
    if((this.props.okmapLabelState !== prevProps.okmapLabelState || this.props.data.length !== prevProps.data.length) || (this.props.cols.length !== prevProps.cols.length) || (this.props.QueryExport["single"] !== prevProps.QueryExport["single"]))
    {
      //console.log("HHprop2", this.props.QueryExport["single"], prevProps.QueryExport["single"])
      //console.log("HEATMAP RE-RENDERED:", this.props.QueryExport["single"]);
      this.updateHeatmap();
    }
  }

  updateHeatmap() {
    var base_re_wid = window.innerWidth;
    var base_re_high = window.innerHeight;
    var standard_width = 1438;
    var standard_height = 707;
    var adjust_width = (base_re_wid / standard_width) * 1.5;
    var adjust_height = (base_re_high / standard_height) * 1.5;
    var xscale = ((500/this.props.cols.length) * adjust_width);
    this.xscale = xscale;
    var y_start = 0;
    document.getElementById("HEATMAP_0").style.transform = "scaleY(1)";
    global_Y = 15;
    global_adj_height = adjust_height;
    global_heat_len = this.props.data.length;
    var escale = (this.props.cols.length * (this.xscale - 0.1));

    document.getElementById("HEATMAP_0").style.width = escale.toString().concat("px");

    this.setState({
      output: <OKMAP
                dataset={this.props.data}
                column_names={this.props.cols}
                len={this.props.data.length}
                doc={document}
                target_div_id={"HEATMAP_0"}
                xscale={this.xscale}
                yscale={15}
                norm={1}
                signatureName={this.props.QueryExport["single"]}
                viewState={this.props.viewState}
                setViewState={this.props.setViewState}
                gtexState={this.props.gtexState}
                setGtexState={this.props.setGtexState}
                exonPlotState={this.props.exonPlotState}
                setExonPlotState={this.props.setExonPlotState}
                selectionState={this.props.selectionState}
                setSelectionState={this.props.setSelectionState}
                filterState={this.props.filterState}
                setFilterState={this.props.setFilterState}
                plotUIDstate={this.props.plotUIDstate}
                setPlotUIDstate={this.props.setPlotUIDstate}
                okmapTable={this.props.okmapTable}
                setOkmapTable={this.props.setOkmapTable}>
                </OKMAP>,
      label: <OKMAP_LABEL
                target_div_id={"HEATMAP_LABEL"}
                column_names={this.props.cols}
                doc={document}
                xscale={this.xscale}
                setFilterState={this.props.setFilterState}
                uifielddict={this.props.uifielddict}
                setUifielddict={this.props.setUifielddict}
                okmapLabelState={this.props.okmapLabelState}
                setOkmapLabelState={this.props.setOkmapLabelState}
                />,
      CC: <OKMAP_COLUMN_CLUSTERS
                target_div_id={"HEATMAP_CC"}
                column_names={this.props.cc}
                doc={document}
                xscale={this.xscale}/>,
      OncospliceClusters: <OKMAP_OncospliceClusters
                target_div_id={"HEATMAP_OncospliceClusters"}
                refcols={this.props.cols}
                column_names={this.props.OncospliceClusters}
                doc={document}
                trans={global_trans}
                xscale={this.xscale}/>
    })
  }

  render()
  {
    return(
      <div>
      {this.state.output}
      {this.state.label}
      {this.state.CC}
      {this.state.OncospliceClusters}
      </div>
    );
  }
}

function zoomInHeatmap()
{
  if(global_Y >= (400 * global_adj_height))
  {
    return;
  }
  else
  {
    var temp_y_set = global_Y * 1.5;

    var captain_burgerpants = temp_y_set / 15;

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
    return;
  }
  else
  {
    var temp_y_set = global_Y / 1.5;

    var captain_burgerpants = temp_y_set / 15;

    var magic_bob = document.getElementById("HEATMAP_0").style.height;
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
  global_Y = (400 * global_adj_height) / global_heat_len;
  var temp_y_set = global_Y / 15;

  document.getElementById("HEATMAP_0").style.transformOrigin = "0 0";
  document.getElementById("HEATMAP_0").style.overflowY = "visible";
  document.getElementById("HEATMAP_0").style.transform = "scaleY(".concat(temp_y_set.toString()).concat(")");
  document.getElementById("HEATMAP_0").style.height = "400px";

  global_Y = temp_y_set;
  updateOkmap(global_Y);
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
      retcols: this.props.okmapLabelState
    };
    updateOkmapLabel = updateOkmapLabel.bind(this);
  }

  requestUpdate()
  {

  }

  baseSVG(w="120%", h="100%")
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")))
      .attr("class", (this.target_div.concat("_svg_class")));

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));

    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .style("opacity", 0.0)
      .attr("fill", "White");
  }

  writeBase(cols, yscale, xscale)
  {
    this.SVG_main_group.append("rect")
      .style("stroke-width", 0)
      .attr("width", ((cols.length * (xscale - 0.1)) + 75))
      .attr("height", yscale)
      .style("opacity", 0.0)
      .attr("fill", "White");

    var numbo = document.getElementById(this.target_div.concat("_svg")).offsetWidth;

    this.SVG_main_group.append("rect")
      .attr("x", (cols.length * (xscale - 0.1) + 75))
      .attr("y", 0)
      .attr("width", 108)
      .attr("height", 28)
      .style("float", "right")
      .style("fill", "#0F6A8B")
      .style("stroke", "#0F6A8B")
      .style("stroke-width", 2);

    this.SVG_main_group.append("text")
      .attr("x", (cols.length * (xscale - 0.1) + 95))
      .attr("y", 20)
      .attr("text-anchor", "start")
      .style("font-size", "15px")
      .style('fill', 'white')
      .text("Download")
      .on("mouseover", function(){
            d3.select(this).style("fill", "#EFAD18")
            .style("cursor", "pointer");
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "white")
            .style("cursor", "default");
      })
      .on("click", function(){
            downloadHeatmapFunction("heatmap")
      })

  }

  writeBlocks(retcols, xscale, writecols)
  {
    var legend_y = 0;
    var legend_y_increment = 18;
    var legend_x = 0;
    var maxcharlen = 0;
    const maxchardef = 13;
    console.log("Legend Column names", retcols);
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
    console.log("Write Column names", writecols);
    var x_pointer = 0;
    var ikg = [];
    for(var p = 0; p < writecols.length; p++)
    {
      var rect_length = (1 * xscale);
      var coledit = writecols[p];

      /*if(global_cancer == "LAML")
      {
        coledit = coledit.replace("_bed", "");
      }
      coledit = coledit.replace(".", "_");
      coledit = coledit.replace("-", "_");*/
      let parts = coledit.split("_");
      var newcoledit = parts.slice(0, 4).join("_");
      coledit = newcoledit.concat("_bed");
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
    //console.log("2 this.state.retcols", this.state.retcols);
    //console.log("2 this.props.okmapLabelState", this.props.okmapLabelState);
    if(this.props.column_names !== prevProps.column_names)
    {
      //console.log("3 this.state.retcols", this.state.retcols);
      //console.log("3 this.props.okmapLabelState", this.props.okmapLabelState);
      var retval = null;
      var tempnode = document.getElementById(this.target_div);
      tempnode.innerHTML = "";
      this.baseSVG("100%", 100);
      this.writeBase(this.props.column_names, 100, this.props.xscale);
      //console.log("CDU this.state.retcols", this.state.retcols);
      if(this.props.okmapLabelState != "NULL")
      {
        this.writeBlocks(this.props.okmapLabelState, this.props.xscale, this.props.column_names);
        metarepost(Object.entries(this.props.uifielddict.dict)[0][0], this.props.setFilterState, this.props.setOkmapLabelState);
        //document.getElementById("HeatmapFilterSelect_id").value = Object.entries(global_uifielddict)[0][0];
      }
      return(
        null
      );
    }
  }

  componentDidMount() {
    this.baseSVG("100%", 20);
    this.writeBase(20);
    //console.log("gufd", Object.entries(global_uifielddict)[0][0]);
    metarepost(Object.entries(this.props.uifielddict.dict)[0][0], this.props.setFilterState, this.props.setOkmapLabelState);
  }

  render (){
    var retval = null;
    var tempnode = document.getElementById(this.target_div);
    tempnode.innerHTML = "";
    this.baseSVG("100%", 100);
    this.writeBase(this.props.column_names, 100, this.props.xscale);
    //console.log("3 this.props.column_names", this.props.column_names);
    //console.log("this.state.retcols", this.state.retcols);
    //console.log("this.props.okmapLabelState", this.props.okmapLabelState);
    if(this.props.okmapLabelState != "NULL")
    {
      this.writeBlocks(this.props.okmapLabelState, this.props.xscale, this.props.column_names);
    }
    return(
      null
    );
  }

}

function updateOkmap(y){ this.setState({zoom_level: y}) }

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
    this.farthestX = 0;
    this.state = {
      zoom_level: this.props.yscale
    };
    this.firstUID = "";
    const setViewState = this.props.setViewState;
    updateOkmap = updateOkmap.bind(this)
  }

  baseSVG(w="100%", h="100%", s="100%")
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")))
      .attr("class", (this.target_div.concat("_svg_class")));

    this.SVG_main_group = this.SVG;
    //this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));

    this.SVG_main_group.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .style("opacity", 0.0)
      .attr("fill", "White");
  }

  writeBase(yscale, xscale, cols, height)
  {
    this.SVG_main_group.append("rect")
      .attr("width", (cols.length * (xscale - 0.1)))
      .attr("height", (height * yscale))
      .attr("id", "svg_base_rect_id")
      .style("opacity", 1.0)
      .attr("fill", "Black");
  }

  baseRLSVG(w="280px", h="100%")
  {
    this.ROWLABELSVG = d3.select("#".concat(this.target_row_label_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_row_label_div.concat("_svg")))
      .attr("class", (this.target_row_label_div.concat("_svg_class")));

    this.SVG_rlg = this.ROWLABELSVG.append("g").attr("id", (this.target_row_label_div.concat("_group")));

    this.SVG_rlg.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "White")
      .attr("type", "canvas")
      .style("opacity", 0.0)
      .attr("fill", "White");
  }

  writeBaseRLSVG(yscale, height)
  {
    this.SVG_rlg.append("rect")
      .attr("width", 280)
      .attr("height", (height * yscale))
      .style("opacity", 0.0)
      .attr("fill", "White")
      .attr("id", "heatmaprowlabeldimensionsid");
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
    var bubble_1 = d3.select("#" + this.target_div + "_group");
    var parent = this;
    var x_pointer = 0;

    for (var p = 0; p < col_list.length; p++) {
        var cur_square_val = parseFloat(data[col_list[p]]);
        var selected_color;

        if (cur_square_val < 0.05 && cur_square_val > -0.05) {
            selected_color = "rgb(0, 0, 0)";
            x_pointer += 1 * x_scale - 0.1;
            continue;
        }

        var integerval = cur_square_val <= -0.05 ? Math.min(Math.max(10 + (-210 * (cur_square_val * 3)), 0), 255) : Math.min(Math.max(10 + (210 * (cur_square_val * 3)), 0), 255);
        var magic_others = Math.min(Math.max(Math.floor(cur_square_val * (cur_square_val <= -0.05 ? 100 : 10)), 0), 255);
        var magic_yellow = integerval.toString();
        var magic_blue = integerval.toString();
        selected_color = "rgb(" + (cur_square_val <= -0.05 ? magic_others : magic_yellow) + ", " + (cur_square_val <= -0.05 ? magic_blue : magic_yellow) + ", " + (cur_square_val <= -0.05 ? magic_blue : magic_others) + ")";

        this.SVG_main_group.append("rect")
            .style("stroke-width", 0)
            .attr("x", x_pointer)
            .attr("y", y_pointer)
            .attr("width", (1 * x_scale))
            .attr("height", y_scale)
            .attr("fill", selected_color);

      x_pointer = x_pointer + ((1 * x_scale) - 0.1);
    }
    this.farthestX = x_pointer;
    var colorei = this.farthestX;
    //console.log("this.farthestX", this.farthestX);
    this.SVG_main_group.append("rect")
      .style("stroke-width", 0)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1)
      .attr("farthestX", colorei)
      .attr("id", "wompumio")
      .style("opacity", 0);
  }

  writeRowLabel(y_point, data, yscale, iterationNumber)
  {
    //console.log("iterationNumber: ", iterationNumber);
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
          updateOkmapTable(data, parent.props.okmapTable, parent.props.setOkmapTable);
          parent.props.setSelectionState({selection: data["uid"]});
          gtexSend(data["examined_junction"], parent.props.setGtexState, parent.props.gtexState);
          var toex = data["examined_junction"].split(":");
          exonRequest(toex[0], data, parent.props.setViewState, parent.props.viewState, parent.props.exonPlotState, parent.props.setExonPlotState);
          parent.props.setPlotUIDstate({fulldat: data});
          parent.setSelected(converteduid);
      })
      .on("mouseover", function(){
            d3.select(this).style("fill", "red");
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "black");
      });

    if(iterationNumber == 0)
    {
      //console.log("Matched: ", iterationNumber, data["uid"]);
      updateOkmapTable(data, parent.props.okmapTable, parent.props.setOkmapTable);
      parent.props.setSelectionState({selection: data["uid"]});
      gtexSend(data["examined_junction"], parent.props.setGtexState, parent.props.gtexState);
      var toex = data["examined_junction"].split(":");
      exonRequest(toex[0], data, parent.props.setViewState, parent.props.viewState, parent.props.exonPlotState, parent.props.setExonPlotState);
      parent.props.setPlotUIDstate({fulldat: data});
      parent.setSelected(converteduid);
    }
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
    var parent = this;

    if(this.CURRENT_SELECTED_UID != null)
    {
    var old_text = document.getElementById((this.CURRENT_SELECTED_UID.concat(this.target_row_label_div).concat("_id")));
    d3.select(old_text)
      .style('fill', 'black')
      .on("mouseover", function(){
            d3.select(this).style("fill", "red");
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "black");
      });
    }

    var cur_text = document.getElementById((id.concat(this.target_row_label_div).concat("_id")));
    d3.select(cur_text)
      .style('fill', 'green')
      .on("mouseover", function(){
            d3.select(this).style("fill", "green");
      })
      .on("mouseout", function(){
            d3.select(this).style("fill", "green");
      });

    this.CURRENT_SELECTED_UID = id;

  }

  componentDidUpdate (prevProps){
    if((this.props.dataset.length !== prevProps.dataset.length) || (this.props.column_names.length !== prevProps.column_names.length || this.props.signatureName != prevProps.signatureName))
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
      for(let i = 0; i < this.props.dataset.length; i++)
      {
        setTimeout(() => {
        this.writeSingle5(y_start, this.props.dataset[i], 15, this.props.xscale, this.props.column_names, 1);
        this.writeRowLabel(y_start, this.props.dataset[i], 15, i);
        y_start = y_start + 15;
        }, 50);
      }
      /*var elements = document.querySelectorAll('[id='.concat('"HEATMAP_0_svg"').concat(']'));
      console.log("elements", elements);

      // Iterate through each matching element
      var i = 0;
      elements.forEach(function(element) {
          element.remove();// Perform operations on each element
      });*/
    }
  }

  render (){
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

      //console.log("rendering heatmap...", this.props.dataset);
      for(let i = 0; i < this.props.dataset.length; i++)
      {
        setTimeout(() => {
        this.writeSingle5(y_start, this.props.dataset[i], this.state.zoom_level, this.props.xscale, this.props.column_names, 1);
        this.writeRowLabel(y_start, this.props.dataset[i], this.state.zoom_level, i);
        y_start = y_start + this.state.zoom_level;
        }, 50);
      }
      /*ar elements = document.querySelectorAll('[id='.concat('"HEATMAP_0_svg"').concat(']'));
      console.log("elements", elements);

      var i = 0;
      elements.forEach(function(element) {
          element.remove();// Perform operations on each element
      });*/
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
        setTimeout(() => {
        this.writeRowLabel(yRL_start, this.props.dataset[k], this.state.zoom_level, k);
        yRL_start = yRL_start + this.state.zoom_level;
        }, 50);
      }
      /*var elements = document.querySelectorAll('[id='.concat('"HEATMAP_0_svg"').concat(']'));
      console.log("elements", elements);

      var i = 0;
      elements.forEach(function(element) {
          element.remove();// Perform operations on each element
      });*/
    }
    return(
      null
    );
  }

}

const spboxProps = {border: 3};

function selectionToSup(selection){
  this.setState({
    selection: selection
  })
}

function supFilterUpdate(data)
{
  this.setState({
    filters: data["out"],
    filterset: data["set"]
  })
}

function updateExPlot(exons, transcripts, junctions, in_data){
  this.setState({
      exons: exons,
      transcripts: transcripts,
      junctions: junctions,
      in_data: in_data
  });
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
      props.setExonPlotState({exons: props.exonPlotState.exons,
                        transcripts: props.exonPlotState.transcripts,
                        junctions: props.exonPlotState.junctions,
                        in_data: props.exonPlotState.in_data,
                        scaled: event.target.checked,
                        targetdiv: "supp1",
                        downscale: 1
      })
    };

  return(
  <Tooltip title="Show exon lengths in raw format---no width changes.">
  <div style={{marginLeft: 3}}>
  <FormControlLabel
      control={
          <SpcCheckbox
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
          />
          }
      label="Use Scaled"
  />
  </div>
  </Tooltip>
  );
}

function resizeFunction(event, { element, size }) {
  this.setState({ width: size.width, height: size.height });
}

function ViewPanel(props) {
  const classes = useStyles();
  global_meta = props.Cols;
  global_cancer = props.QueryExport["cancer"];
  global_signature = props.QueryExport["single"];
  //console.log("new signature!", props.QueryExport["single"]);
  global_cols = props.Cols;
  global_cc = props.CC;
  global_OncospliceClusters = props.OncospliceClusters;
  global_trans = props.TRANS;
  /*
  var available_width = screen.width;
  var available_height = screen.height;
  */
  var available_width = window.innerWidth;
  var available_height = window.innerHeight;
  //console.log("width and height", available_width, available_height);
  //console.log("VIEW DATA ENTERED:", props.Data);
  const [viewState, setViewState] = React.useState({
    toDownloadExon: undefined,
    toDownloadGeneModel: undefined,
    toDownloadJunc: undefined
  });
  const [exonPlotState, setExonPlotState] = React.useState({
      exons: null,
      transcripts: null,
      junctions: null,
      in_data: null,
      scaled: false,
      targetdiv: "supp1",
      downscale: 1
  });

  var okmapTableStartingData = [createData('-none selected-', '-none selected-')];
  

  const [selectionState, setSelectionState] = React.useState({selection: null});
  const [filterState, setFilterState] = React.useState({filters: null, filterset: null});
  const [plotUIDstate, setPlotUIDstate] = React.useState({fulldat: null});
  const [okmapTable, setOkmapTable] = React.useState({curAnnots: okmapTableStartingData});
  //console.log("okmaptable", okmapTable);
  const [gtexState, setGtexState] = React.useState({gtexPlot: null});
  
  const [resizeState, setResizeState] = React.useState({heatmapBox: null, sidePanel: null});
  const [uifielddict, setUifielddict] = React.useState({dict: props.QueryExport["ui_field_dict"]});
  const [okmapLabelState, setOkmapLabelState] = React.useState("NULL");

  //console.log("okmapLabelState", okmapLabelState);

  //global_uifielddict = props.QueryExport["ui_field_dict"];

  const resizeHandles = ['s','w','e','n','sw','nw','se','ne'];

  //Refactor after this
  var Selection = selectionState.selection;
  //console.log("selectionpants", Selection);
  var set = null;
  var plotobj1, plotobj2, plotobj3 = null;
  var elm1 = filterState.filters;
  var elm2 = filterState.filterset;
  if(Selection != null && filterState.filterset != null && plotUIDstate.fulldat != null)
  {
    var plotobj1 = oncospliceClusterViolinPlotPanel(Selection, plotUIDstate.fulldat, props.Cols, props.OncospliceClusters, props.TRANS, global_cancer);
    var plotobj2 = hierarchicalClusterViolinPlotPanel(plotUIDstate.fulldat, Selection, props.Cols, props.CC, global_cancer);
    var plotobj3 = sampleFilterViolinPlotPanel(Selection, plotUIDstate.fulldat, props.Cols, elm1, elm2, global_cancer);
  }
  else
  {
    var plotobj1, plotobj2, plotobj3 = <h4>No selection set</h4>;
  }

  if(Selection != null && gtexState.gtexPlot != null)
  {
    var plotobj4 = gtexState.gtexPlot;
  }
  else
  {
    var plotobj4 = plotUIDstate.fulldat == null ? <h4>No selection set</h4> : <h4>No GTEX available for given UID</h4>;
  }

  var panel_A = {
    width: 0.680 * available_width,
    height: 0.6 * available_height,
    minWidth: 0.680 * available_width,
    minHeight: 0.3 * available_height,
    maxWidth:  0.809 * available_width,
    maxHeight: 0.8 * available_height
  }
  var panel_B = {
    width: 0.286 * available_width,
    height: 0.6 * available_height,
    minWidth: 0.148 * available_width,
    minHeight: 0.3 * available_height,
    maxWidth: 0.809 * available_width,
    maxHeight: 0.8 * available_height
  }
  var panel_C = {
    width: 0.98 * available_width,
    height: 0.7 * available_height,
    minWidth: 0.98 * available_width,
    minHeight: 0.7 * available_height,
    maxWidth: 0.98 * available_width,
    maxHeight: 0.7 * available_height
  }

  return (
    <><div style={{ fontFamily: 'Arial', display: 'flex', flexWrap: 'wrap' }}>
      <ResizableBox
        className="box"
        width={panel_A.width}
        height={panel_A.height}
        margin={10}
        minConstraints={[panel_A.minWidth, panel_A.minHeight]}
        maxConstraints={[panel_A.maxWidth, panel_A.maxHeight]}
      >
        <ViewPanel_Main
          Data={props.Data}
          Cols={props.Cols}
          CC={props.CC}
          OncospliceClusters={props.OncospliceClusters}
          QueryExport={props.QueryExport}
          viewState={viewState}
          setViewState={setViewState}
          gtexState={gtexState}
          setGtexState={setGtexState}
          exonPlotState={exonPlotState}
          setExonPlotState={setExonPlotState}
          selectionState={selectionState}
          setSelectionState={setSelectionState}
          filterState={filterState}
          setFilterState={setFilterState}
          plotUIDstate={plotUIDstate}
          setPlotUIDstate={setPlotUIDstate}
          okmapTable={okmapTable}
          setOkmapTable={setOkmapTable}
          uifielddict={uifielddict}
          setUifielddict={setUifielddict}
          okmapLabelState={okmapLabelState}
          setOkmapLabelState={setOkmapLabelState}
          />
      </ResizableBox>

      <ResizableBox
        className="box"
        width={panel_B.width}
        height={panel_B.height}
        margin={10}
        minConstraints={[panel_B.minWidth, panel_B.minHeight]}
        maxConstraints={[panel_B.maxWidth, panel_B.maxHeight]}
      >
        <div style={{overflow: "scroll", height: "100%", width: "100%", display: "inline-block"}}>
        <PlotPanel plotLabel={"OncoClusters"} inputType={"oncosplice"}>{plotobj1}</PlotPanel>
        <PlotPanel plotLabel={"HierarchyClusters"} inputType={"hierarchical"}>{plotobj2}</PlotPanel>
        <PlotPanel plotLabel={"Filters"} inputType={"samplefilter"}>{plotobj3}</PlotPanel>
        <PlotPanel plotLabel={"GTEX"} inputType={"gtex"}>{plotobj4}</PlotPanel>
        <Stats okmapTable={okmapTable}></Stats>
        <SetExonPlot exonPlotState={exonPlotState} setExonPlotState={setExonPlotState}></SetExonPlot>
        </div>
      </ResizableBox>
    </div><div>
        <ResizableBox
          className="box"
          width={panel_C.width}
          height={panel_C.height}
          margin={10}
          minConstraints={[panel_C.minWidth, panel_C.minHeight]}
          maxConstraints={[panel_C.maxWidth, panel_C.maxHeight]}
        >
          <div style={{overflow: "scroll", height: "100%", width: "100%"}}>
          <Grid container spacing={1}>
            <Grid item xs={2}><SpcInputLabel label={"ExonPlot"} /></Grid>
            <Grid item><ScalingCheckbox exonPlotState={exonPlotState} setExonPlotState={setExonPlotState} /></Grid>
            <Grid item><Button variant="contained" style={{ backgroundColor: '#0F6A8B', color: "white" }} onClick={() => downloadExonPlotData("transcript.csv", viewState.toDownloadExon)}>Download Transcript</Button></Grid>
            <Grid item><Button variant="contained" style={{ backgroundColor: '#0F6A8B', color: "white" }} onClick={() => downloadExonPlotData("genemodel.csv", viewState.toDownloadGeneModel)}>Download Gene Model</Button></Grid>
            <Grid item><Button variant="contained" style={{ backgroundColor: '#0F6A8B', color: "white" }} onClick={() => downloadExonPlotData("junctions.csv", viewState.toDownloadJunc)}>Download Junctions</Button></Grid>
            <Grid item><Button variant="contained" style={{ backgroundColor: '#0F6A8B', color: "white" }} onClick={() => downloadPdfFunction(selectionState.selection)}>Download PDF</Button></Grid>
          </Grid>
          <Box borderColor="#dbdbdb" {...spboxProps}>
            <div style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }} id="supp1"></div>
          </Box>
          </div>
        </ResizableBox>
      </div></>
  );
}

function ViewPanel_Side(props) {
  return(
    <div>
    <h3 style={{ fontFamily: 'Arial', color:'#0F6A8B'}}>
      {"Cancer: ".concat(props.QueryExport["cancer"])}
    </h3>
    </div>
  )
}

//Test comment
function ViewPanel_Main(props) {
    
    var elements = document.querySelectorAll(".HEATMAP_0_svg_class");
    //console.log("elements", elements.length);

    var i = 0;
    if(elements.length == 2)
    {
      elements[1].remove();
    }

    var row_label_elements = document.querySelectorAll(".HEATMAP_ROW_LABEL_svg_class");
    //console.log("row_label_elements", row_label_elements.length);

    var i = 0;
    if(row_label_elements.length == 2)
    {
      row_label_elements[1].remove();
    }    
    /*elements.forEach(function(element) {
        console.log("element pants", element);
        element.remove();// Perform operations on each element
    });*/
    const classes = useStyles();
    var loading_Gif = isBuild ? <img src="/ICGS/Oncosplice/build/loading.gif" width="200" height="60"></img> : <img src={loadingGif} width="200" height="60"></img>;
    const [isShown, setIsShown] = React.useState(false);
    return(
    <div id="ViewPane_MainPane" style={{overflow: "scroll", height: "100%", width: "100%", display: "flex"}}>
        <div className="containerSidebar" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
          {isShown && (
          <div className="sidebar" style={{marginLeft: 5}}>
            <div><Button variant="contained" style={{marginTop: "5px", backgroundColor: '#0F6A8B'}}><ZoomInIcon onClick={zoomInHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 26}}/></Button></div>
            <div><Button variant="contained" style={{marginTop: "5px", backgroundColor: '#0F6A8B'}}><ZoomOutIcon onClick={zoomOutHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 26}}/></Button></div>
            <div><Button variant="contained" style={{marginTop: "5px", backgroundColor: '#0F6A8B'}}><FullscreenIcon onClick={fullViewHeatmap} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 26}}/></Button></div>
            <div><Button variant="contained" style={{marginTop: "5px", marginBottom: "5px", backgroundColor: '#0F6A8B'}}><GetAppIcon onClick={() => downloadHeatmapText(props.Data,props.Cols,props.QueryExport,props.CC,props.OncospliceClusters)} style={{backgroundColor: '#0F6A8B', color: 'white', fontSize: 26}}/></Button></div>
            <div><Typography className={classes.smallpadding} /></div>
            <div><FilterHeatmapSelect uifielddict={props.uifielddict} setFilterState={props.setFilterState} setOkmapLabelState={props.setOkmapLabelState}/></div>
          </div>
          )}
        </div>
        <div style= {{flex: 1}}>
        <Typography className={classes.padding} />
        <div id="heatmapLoadingDiv" style={{position: "absolute", marginLeft: 35, marginTop: 5, display: "none", textAlign: "center", marginTop: 30}}>
              {loading_Gif}
        </div>
        <div style={{marginLeft: 5}} id="HEATMAP_LABEL"></div>
        <div style={{marginLeft: 5}} id="HEATMAP_CC"></div>
        <div style={{marginLeft: 5}} id="HEATMAP_OncospliceClusters"></div>
        <div className={classes.flexparent} style={{marginLeft: 5}}>
        <span id="HEATMAP_0" ></span>
        <span id="HEATMAP_ROW_LABEL" style={{width: "280px"}}></span>
        </div>
      <Heatmap
        data={props.Data}
        cols={props.Cols}
        cc={props.CC}
        QueryExport={props.QueryExport}
        OncospliceClusters={props.OncospliceClusters}
        viewState={props.viewState}
        setViewState={props.setViewState}
        gtexState={props.gtexState}
        setGtexState={props.setGtexState}
        exonPlotState={props.exonPlotState}
        setExonPlotState={props.setExonPlotState}
        selectionState={props.selectionState}
        setSelectionState={props.setSelectionState}
        filterState={props.filterState}
        setFilterState={props.setFilterState}
        plotUIDstate={props.plotUIDstate}
        setPlotUIDstate={props.setPlotUIDstate}
        okmapTable={props.okmapTable}
        setOkmapTable={props.setOkmapTable}
        uifielddict={props.uifielddict}
        setUifielddict={props.setUifielddict}
        okmapLabelState={props.okmapLabelState}
        setOkmapLabelState={props.setOkmapLabelState}>
      </Heatmap>
      </div>
    </div>
    );
}

export default ViewPanel;
