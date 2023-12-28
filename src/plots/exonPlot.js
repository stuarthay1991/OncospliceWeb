import * as d3 from 'd3';
import { global_colors } from '../utilities/constants.js';

class SetExonPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }
  componentDidMount() { 
    var base_re_wid = window.innerWidth;
    var base_re_high = window.innerHeight;
    var standard_width = 1438;
    var standard_height = 707;
    var adjust_width = (base_re_wid / standard_width) * 0.40;
    var adjust_height = (base_re_high / standard_height) * 0.40;
    var y_start = 0;

    this.setState({
      input: <EXON_PLOT 
        exonPlotState={this.props.exonPlotState} 
        setExonPlotState={this.props.setExonPlotState} 
        doc={document} 
        target_div_id={this.props.exonPlotState.targetdiv}
        downscale={this.props.exonPlotState.downscale}>
        </EXON_PLOT>
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps)
    {
      var base_re_wid = window.innerWidth;
      var base_re_high = window.innerHeight;
      var standard_width = 1438;
      var standard_height = 707;
      var adjust_width = (base_re_wid / standard_width) * 0.40;
      var adjust_height = (base_re_high / standard_height) * 0.40;
      var y_start = 0;

      this.setState({
        input: <EXON_PLOT 
          exonPlotState={this.props.exonPlotState} 
          setExonPlotState={this.props.setExonPlotState} 
          doc={document} 
          target_div_id={this.props.exonPlotState.targetdiv}
          downscale={this.props.exonPlotState.downscale}>
          </EXON_PLOT>
      })
    }
  }

  render()
  {
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
    this.farthestY = 0;
    this.farthestX = 0;
    this.state = {
      exons: this.props.exonPlotState.exons,
      transcripts: this.props.exonPlotState.transcripts,
      junctions: this.props.exonPlotState.junctions,
      in_data: this.props.exonPlotState.in_data,
      scaled: this.props.exonPlotState.scaled,
      downscale: this.props.exonPlotState.downscale,
      gene_specific_data: this.props.exonPlotState.gene_specific_data,
    };
  }

  baseSVG(w=2000, h=2000) 
  {
    this.SVG = d3.select("#".concat(this.target_div))
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", (this.target_div.concat("_svg")));  

    this.SVG_main_group = this.SVG.append("g").attr("id", (this.target_div.concat("_group")));
         
  }

  writeBase(h=1500)
  {
    this.SVG_main_group.append("rect")
      .attr("width", "100%")
      .attr("height", h)
      .style("opacity", 0.0)
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

      h_adj = in_text.length == 2 ? 40 : 80;

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
    var fontsize = 13 / (this.state.downscale / 1.17);
    for (const [key, value] of Object.entries(trans_input)) 
    {
      
      var cur_obj = this.SVG_main_group.append("text")
          .attr("x", 1)
          .attr("y", (y_start + 15))
          .attr("text-anchor", "start")
          .style("font-size", fontsize)
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
    this.farthestY = y_start + 20;
    this.SVG_main_group.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .style("opacity", 0)
      .attr("id", parent.target_div.concat("_dimensions"))
      .attr("farthestX", Math.ceil(parseInt(parent.farthestX)))
      .attr("farthestY", parseInt(parent.farthestY));
  }

  tempCircleAdd(flag, x, y)
  {
    if(flag == "add")
    {

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

  findRetainedIntrons(GSD)
  {
    var retarray = []
    if(GSD != undefined)
    {
      for(var i = 0; i < GSD.length; i++)
      {
        var pull_split = GSD[i].uid.split("|");
        var first_split = pull_split[0].split(":");
        var second_split = pull_split[1].split(":");
        
        var area1 = first_split[2];
        var area2 = second_split[1];

        var value1 = area1.split("-")[0];
        var value2 = area1.split("-")[1];
        var value3 = area2.split("-")[0];
        var value4 = area2.split("-")[1];
        if(value1.indexOf("I") != -1)
        {
          retarray.push(value1);
        }
        if(value2.indexOf("I") != -1)
        {
          retarray.push(value2);
        }
        if(value3.indexOf("I") != -1)
        {
          retarray.push(value3);
        }
        if(value4.indexOf("I") != -1)
        {
          retarray.push(value4);
        }
      }
    }
    return retarray;
  }

  writeGeneSymbol(symbol)
  {
    var textToWrite = "Gene: ".concat(symbol);
    var burger = this.SVG_main_group.append("text")
    .attr("x", 7)
    .attr("y", 21)
    .attr("text-anchor", "start")
    .style("font-size", 15)
    .style("opacity", 1.0)
    .attr("fill", "black")
    .text(textToWrite);
  }

  writeGSD(GSD)
  {

    var addon_id = "big";

    if(this.state.downscale == true)
    {
      addon_id = "small";
    }



    if(GSD != undefined)
    {
    for(var i = 0; i < GSD.length; i++)
    {
      var pull_split = GSD[i].uid.split("|");
      var first_split = pull_split[0].split(":");
      var second_split = pull_split[1].split(":");
      
      var area1 = first_split[2];
      var area2 = second_split[1];

      //console.log("table_stuff", area1, area2);

      var bl1 = document.getElementById(area1.concat(addon_id).concat("_global_id"));
      var bl2 = document.getElementById(area2.concat(addon_id).concat("_global_id"));

      var pl1 = document.getElementById(area1.concat(addon_id).concat("_path_global_id"));
      var pl2 = document.getElementById(area2.concat(addon_id).concat("_path_global_id"));

      var dpsi = parseFloat(GSD[i].dpsi);
      var rectColor = "blue";
      if(dpsi > 0.0)
      {
        rectColor = "red";
      }

      //console.log("id found: ", bl1);
      //console.log("id found: ", bl2);

      if(bl1 != null)
      {
        if(dpsi > 0.0)
        {
          rectColor = "red";
        }
        else
        {
          rectColor = "blue";
        }
        var pretg1 = d3.select(bl1);
        pretg1.style('fill', rectColor);
      }

      if(bl2 != null)
      {
        if(dpsi > 0.0)
        {
          rectColor = "blue";
        }
        else
        {
          rectColor = "red";
        }
        var pretg2 = d3.select(bl2);
        pretg2.style('fill', rectColor);
      }

      if(pl1 != null)
      {
        if(dpsi > 0.0)
        {
          rectColor = "red";
        }
        else
        {
          rectColor = "blue";
        }
        var gretg1 = d3.select(pl1);
        gretg1.attr('stroke', rectColor);
      }

      if(pl2 != null)
      {
        if(dpsi > 0.0)
        {
          rectColor = "blue";
        }
        else
        {
          rectColor = "red";
        }
        var gretg2 = d3.select(pl2);
        gretg2.attr('stroke', rectColor);
      }
 
    }
    }
  }

  writeJunctions(junc_input, in_data)
  {
    var parent = this;
    const curve = d3.line().curve(d3.curveNatural);
    var juncpointset = [];
    var juncpointset8 = [];
    var juncpointset12 = [];
    //console.log("coordinates_", in_data);
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

      var addon_id = "big";

      if(this.state.downscale == true)
      {
        addon_id = "small";
      }      

      const get_1 = document.getElementById(starting_exon.concat(addon_id).concat("_global_id"));
      const get_2 = document.getElementById(finishing_exon.concat(addon_id).concat("_global_id"));

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
        .attr('id', cur_junc.concat(addon_id).concat("_path_global_id"))
        // with multiple points defined, if you leave out fill:none,
        // the overlapping space defined by the points is filled with
        // the default value of 'black'
        .attr('fill', 'none');

      var burger = this.SVG_main_group.append('circle')
        .attr('cx', t_x_s)
        .attr('cy', finy)
        .attr('r', 5)
        .attr('id', cur_junc.concat(addon_id).concat("_global_id"))
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
        //console.log("ERROR:", error);
        continue;
      }

    }
  }

  writeExons(exon_input, retained_introns)
  {
    var parent = this;
    var starting_point = exon_input[0]["start"];
    var scale_exon_stop = 0;
    var to_x_scale = 0;
    var min_exon_length = 3;
    var max_exon_length = 20;
    var x_offset = 150 / this.state.downscale;
    var addon_id = "big";

    if(this.state.downscale == true)
    {
      addon_id = "small";
    }

    for(var i = 0; i < exon_input.length; i++)
    {
      var exname = exon_input[i]["exon_name"];

      if(i == 0)
      {
        var x_pos_1 = (exon_input[i]["start"] - starting_point) / this.state.downscale;
        var x_pos_2 = (exon_input[i]["stop"] - starting_point) / this.state.downscale;
        if(this.state.scaled == true)
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
        var retainedFound1 = true;
        if(exname.charAt(0) == "I")
        {
          retainedFound1 = false;
          for(var pk = 0; pk < retained_introns.length; pk++)
          {
            if(exname == retained_introns[pk])
            {
              retainedFound1 = true;
              break;
            }
          }
        }
        if(retainedFound1 == false)
        {
          scale_exon_stop = this.state.scaled == true ? scale_exon_stop + 20 : scale_exon_stop + 200;
          continue;
        }
        else
        {
          var x_pos_1 = scale_exon_stop;
          var x_pos_2 = scale_exon_stop + ((exon_input[i]["stop"] - exon_input[i]["start"])  / this.state.downscale);
          if(this.state.scaled == true)
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

    to_x_scale = ((window.innerWidth / 1.25) / this.state.downscale) / scale_exon_stop;

    var last_exon_stop = 0;
    for(var i = 0; i < exon_input.length; i++)
    {
      var special_intron_flag = false;
      const exname = exon_input[i]["exon_name"];
      const hard_start = "Start: ".concat(exon_input[i]["start"].toString()).concat(" bp");
      const hard_stop = "Stop: ".concat(exon_input[i]["stop"].toString()).concat(" bp");

      const hard_width = Math.abs(exon_input[i]["stop"] - exon_input[i]["start"]);
      const hard_width_string = "Width: ".concat(hard_width.toString()).concat(" bp");

      if(i == 0)
      {
        var x_pos_1 = (exon_input[i]["start"] - starting_point) / this.state.downscale;
        var x_pos_2 = (exon_input[i]["stop"] - starting_point) / this.state.downscale;
        if(this.state.scaled == true)
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
        var retainedFound2 = true;
        if(exname.charAt(0) == "I")
        {
          retainedFound2 = false;
          for(var pk = 0; pk < retained_introns.length; pk++)
          {
            if(exname == retained_introns[pk]){
              retainedFound2 = true;
              special_intron_flag = true;
              break;
            }
          }
        }
        if(retainedFound2 == false)
        {
          if(this.state.scaled == true)
          {
            last_exon_stop = last_exon_stop + 20;
            continue;
          }
          else{
            last_exon_stop = last_exon_stop + 200;
            continue;            
          }
        }
        else
        {
          var x_pos_1 = last_exon_stop;
          var x_pos_2 = last_exon_stop + ((exon_input[i]["stop"] - exon_input[i]["start"]) / this.state.downscale);
          if(this.state.scaled == true)
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

      if(special_intron_flag)
      {
        var cur_obj2 = this.SVG_main_group.append("rect")
          .attr("x", (x_offset + x_pos_1))
          .attr("y", 92)
          .attr("width", (x_pos_2 - x_pos_1))
          .attr("height", 6)
          .style("stroke", "grey")
          .style("stroke-width", "1")
          .style("opacity", 0.5)
          .attr("fill", "red")
          .attr("id", exname.concat(addon_id).concat("_global_id"))
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
      }
      else
      {
        var cur_obj = this.SVG_main_group.append("rect")
          .attr("x", (x_offset + x_pos_1))
          .attr("y", 90)
          .attr("width", (x_pos_2 - x_pos_1))
          .attr("height", 10)
          .style("stroke", "grey")
          .style("stroke-width", "1")
          .style("opacity", 1.0)
          .attr("fill", "#e6e6e6")
          .attr("id", exname.concat(addon_id).concat("_global_id"))
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
      }
      if(this.farthestX < (x_pos_2 + x_offset))
      {
        this.farthestX = x_pos_2 + x_offset;
      }

      this.ens_map[exon_input[i]["start"]] = {};
      this.ens_map[exon_input[i]["start"]]["name"] = exname;
      this.ens_map[exon_input[i]["start"]]["x"] = x_offset + x_pos_1;
      this.ens_map[exon_input[i]["start"]]["width"] = (x_pos_2 - x_pos_1);
      this.ens_map[exon_input[i]["start"]]["h_start"] = exon_input[i]["start"];
      this.ens_map[exon_input[i]["start"]]["h_stop"] = exon_input[i]["stop"];

    }
    
  }

  componentDidUpdate (prevProps){
    if(this.props !== prevProps)
    {
      var y_start = 0;
      var tempnode = document.getElementById(this.target_div);
      while (tempnode.firstChild) {
          tempnode.removeChild(tempnode.firstChild);
      }
      this.baseSVG();
      this.writeBase();
      this.setState({
        exons: this.props.exonPlotState.exons,
        transcripts: this.props.exonPlotState.transcripts,
        junctions: this.props.exonPlotState.junctions,
        in_data: this.props.exonPlotState.in_data,
        scaled: this.props.exonPlotState.scaled,
        gene_specific_data: this.props.exonPlotState.gene_specific_data
      })
      return(
        null
      );    
    }
  }

  render (){
    var y_start = 0;
    var tempnode = document.getElementById(this.target_div);
    while (tempnode.firstChild) {
        tempnode.removeChild(tempnode.firstChild);
    }
    //console.log("in exon plot", this.state.gene_specific_data);
    //console.log("TRANSCRIPT LIST: ", this.state.transcripts);
    if(this.state.exons != null && this.state.transcripts != null && this.state.junctions != null)
    {
      var ysim = 110;
      for (const [key, value] of Object.entries(this.state.transcripts))
      {
        ysim = ysim + 20;
      }
      ysim = ysim + 35;
      this.baseSVG(2000, ysim);
      this.writeBase(ysim);
      var sorted_exons = this.state.exons.sort((a, b)=>{return Number(a["start"])-Number(b["start"])})
      //console.log("sorted_exons", sorted_exons);
      var retainedIntrons = this.findRetainedIntrons(this.state.gene_specific_data);
      //console.log("retained Introns", retainedIntrons);
      this.writeExons(sorted_exons, retainedIntrons);
      this.writeJunctions(this.state.junctions, this.state.in_data);
      this.writeTranscripts(this.state.transcripts);
      if(this.state.gene_specific_data != undefined)
      {
        var geneSymbol = this.state.gene_specific_data[0].uid.split(":")[0];
        this.writeGeneSymbol(geneSymbol);
        this.writeGSD(this.state.gene_specific_data);
      }
    }
    else
    {
      this.baseSVG();
      this.writeBase();
      var cur_obj = this.SVG_main_group.append("text")
          .attr("x", 25)
          .attr("y", 20)
          .attr("text-anchor", "start")
          .style("font-size", 18)
          .style("opacity", 1.0)
          .attr("fill", "black")
          .text("Selection required from the table above.");
    }
    return(
      null
    );
  }

}

export default SetExonPlot;