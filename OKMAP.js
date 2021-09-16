import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import ViewPane from './ViewPane.js';

class OKMAP extends React.Component {
  constructor(props) 
  {
    super(props);
    this.target_div = this.props.target_div_id;
  	this.col_names = this.props.column_names;
  	this.SVG = "None";
  	this.SVG_main_group = "";
  	this.doc = this.props.doc;
    this.norm_flag = this.props.norm;
    this.tempRect = "";
    this.U_xscale = this.props.xscale;
    this.total_height = this.props.len;
    this.dataset = this.props.dataset;
    this.state = {
      selected: "NULL"
    };
  }
  
  baseSVG(w="100%", h="100%") 
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

  //this.U_xscale
  //this.col_names

  }

  writeBase(yscale)
  {
    this.SVG_main_group.append("rect")
      .attr("width", (this.col_names.length * (this.U_xscale - 0.1)))
      .attr("height", (this.total_height * yscale))
      .style("opacity", 1.0)
      .attr("fill", "Black");
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

  writeSingle5(y_point, data, yscale, xscale, col_list, flag=0, hflag=0)
  {
  	var y_pointer = y_point;
  	var x_scale = xscale;
  	var y_scale = yscale;
  	var bubble_1 = d3.select("#".concat(this.target_div).concat("_group"));
  	var bubs = data;
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
            var magic_blue = (50 + (-200*cur_square_val)).toString();
            var magic_others = (cur_square_val * 100).toString();
            selected_color = "rgb(".concat(magic_others).concat(", ").concat(magic_blue).concat(", ").concat(magic_blue).concat(")");
      }
      else
      {
            var magic_yellow = (48 + (cur_square_val * 200)).toString();
            var magic_yellow2 = (48 + (cur_square_val * 200)).toString();
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
    var converteduid = this.uidConvert(data["uid"]);

    this.SVG_main_group.append("text")
      .attr("x", (x_pointer + 10))
      .attr("y", (y_pointer + y_scale/1.66))
      .attr("text-anchor", "start")
      .attr("id", "hrow".concat(y_point.toString()))
      .style("cursor", "pointer")
      .style("font-size", "12px")
      .style('fill', 'black')
      .text(converteduid)
      .on("click", function(){
          d3.select(this).style("fill", "green");
          //updateStats(y_point, data);
      })

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

  rowNormalization(row)
  {

  }

  render (){

    //var map1 = new OKMAP("HEATMAP_0", cbeds, document, ((400/cbeds.length) * adjust_width), rr.length);
    this.baseSVG("100%", ((this.props.yscale * this.props.dataset.length) + 50));
    this.writeBase(this.props.yscale);
    //const set = new Set([]);
    var y_start = 0;
    console.log("length", this.props.dataset.length);
    for(var i = 0; i < this.props.dataset.length; i++)
    {
      //console.log(rr[i]);
      this.writeSingle5(y_start, this.props.dataset[i], this.props.yscale, this.props.xscale, this.props.column_names, 1);
      y_start = y_start + this.props.yscale;
      //set.add(this.props.dataset[i]["symbol"]);
    }
    return(
      null
    );
  }

}

export default OKMAP;