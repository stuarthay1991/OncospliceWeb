import React from 'react';
import * as d3 from 'd3';
import { global_colors } from '../utilities/constants.js';

class OKMAP_OncospliceClusters extends React.Component {
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
      .style("opacity", 0.0)
      .attr("type", "canvas")
      .attr("fill", "White");    
  }

  writeBase(cols, yscale, xscale)
  {
    this.SVG_main_group.append("rect")
      .attr("width", ((cols.length * (xscale - 0.1)) + 75))
      .attr("height", yscale)
      .style("opacity", 0.0)
      .attr("fill", "White");
  }

  writeBlocks(xscale, writecols, refcols)
  {
    var x_pointer = 0;
    var ikg = [];
    //console.log("refcols", refcols);
    //var refcols = refcols.map(item => item.slice(0, -4));
    //console.log("writecols", writecols);
    const findMatchingKey = (obj, probeKey) => {
      if (obj[probeKey] !== undefined) return probeKey;
      const keys = Object.keys(obj);
      const exact = keys.find(k => k === probeKey);
      if (exact !== undefined) return exact;
      const inclusive = keys.find(k => k.includes(probeKey) || probeKey.includes(k));
      return inclusive;
    };
    for(var p = 0; p < refcols.length; p++)
    {
      var rect_length = (1 * xscale);
      var matchKey = findMatchingKey(writecols, refcols[p]);
      var coledit = matchKey !== undefined ? writecols[matchKey] : undefined;
      var colortake = parseInt(coledit);
      var color;
      if(colortake == "0.0" || colortake == "0")
      {
        color = "white";
      }
      else if(colortake == "1.0" || colortake == "1")
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
    var clusterName = this.props.trans;
    if(clusterName != undefined)
    {
      clusterName = clusterName.concat(" Clusters");
    }
    else
    {
      clusterName = "NA"
    }
    this.SVG_main_group.append("text")
        .attr("x", x_pointer)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "11px")
        .style('fill', 'black')
        .text(clusterName);

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

export default OKMAP_OncospliceClusters;