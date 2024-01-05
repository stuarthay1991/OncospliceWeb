import * as d3 from 'd3';

class SetDoubleBarChart extends React.Component {
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
      if(this.props.widthRatio == undefined)
      {
        this.props.widthRatio = 1;
      }
      if(this.props.heightRatio == undefined)
      {
        this.props.heightRatio = 1;
      }
  
      this.setState({
        input: <DOUBLE_BAR_CHART 
          doubleBarChartState={this.props.doubleBarChartState}
          stackedBarRequest={this.props.stackedBarChartRequest}
          setStackedBarState={this.props.setStackedBarChartData}
          concordanceRequest={this.props.concordanceRequest}
          setConcordanceState={this.props.setConcordanceState}
          resetDaugtherPanels={this.props.resetDaugtherPanels}
          setTableState={this.props.setTableState}
          tablePlotRequest={this.props.tablePlotRequest}
          resetBottomPanels={this.props.resetBottomPanels}
          doc={document}
          target_div_id={this.props.doubleBarChartState.targetdiv}
          xScale={this.props.widthRatio}
          yScale={this.props.heightRatio}>
          </DOUBLE_BAR_CHART>
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
        if(this.props.widthRatio == undefined)
        {
          this.props.widthRatio = 1;
        }
        if(this.props.heightRatio == undefined)
        {
          this.props.heightRatio = 1;
        }

        this.setState({
          input: <DOUBLE_BAR_CHART 
            doubleBarChartState={this.props.doubleBarChartState}
            stackedBarRequest={this.props.stackedBarChartRequest}
            setStackedBarState={this.props.setStackedBarChartData}            
            concordanceRequest={this.props.concordanceRequest}
            setConcordanceState={this.props.setConcordanceState}
            resetDaugtherPanels={this.props.resetDaugtherPanels}
            setTableState={this.props.setTableState}
            tablePlotRequest={this.props.tablePlotRequest}
            resetBottomPanels={this.props.resetBottomPanels}
            doc={document} 
            target_div_id={this.props.doubleBarChartState.targetdiv}
            xScale={this.props.widthRatio}
            yScale={this.props.heightRatio}>
            </DOUBLE_BAR_CHART>
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

  class DOUBLE_BAR_CHART extends React.Component {
    constructor(props)
    {
      super(props);
      this.target_div = this.props.target_div_id;
      this.SVG_main_group = null;
      this.xscale = 0.05;
      this.doc = this.props.doc;
      this.x_offset = 90;
      this.div = null;
      this.ens_map = {};
      this.state = {
        data: this.props.doubleBarChartState,
        xScale: this.props.xScale,
        yScale: this.props.yScale,
        fontScale: ((this.props.xScale+this.props.yScale)/2),
        selectedGroup: undefined
      };
      this.defaultSelection = undefined;
    }
  
    baseSVG(h_in) 
    {
      var w="100%";
      var h= h_in;
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
  
    writeBase(h_in)
    {
      var parent = this;

      this.SVG_main_group.append("rect")
        .attr("width", "100%")
        .attr("height", h_in)
        .style("opacity", 1.0)
        .attr("fill", "White");

      this.rect = d3.select("body").append("rect") 
        .attr("width", 30)
        .attr("height", 30)
        .style("opacity", 1.0)
        .attr("type", "canvas")
        .attr("fill", "White");
  
    }

    writeTitle()
    {
        var S = this.state;
        var parent = this;
        this.SVG_main_group.append("text")
            .attr("x", 30*S.xScale)
            .attr("y", 32*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 18.5*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Pancancer Summary");
      
        this.SVG_main_group.append('circle')
            .attr('cx', 32*S.xScale)
            .attr('cy', 46*S.yScale)
            .attr('r', 6*S.fontScale)
            .attr('fill', "#0F6A8B")
            .attr('stroke', "black")
            .attr('stroke-width', 1)
            .attr('opacity', 1);

        this.SVG_main_group.append('circle')
            .attr('cx', 32*S.xScale)
            .attr('cy', 63*S.yScale)
            .attr('r', 6*S.fontScale)
            .attr('fill', "white")
            .attr('stroke', "black")
            .attr('stroke-width', 1)
            .attr('opacity', 1)
            .on("mouseover", function() {
              //console.log(cur_obj);
              var pretg = d3.select(this).attr("stroke-width", 1)
                .attr("stroke", "purple")
                .attr("cursor", "pointer")
                .attr("fill", "#0F6A8B")
                .attr("opacity", 0.4);
              })
            .on("mouseout", function(d) {   
              //parent.tempTextRemove();
              var pretg = d3.select(this).attr("stroke-width", 1)
              .attr("stroke", "black")
              .attr("cursor", "default")
              .attr("fill", "white")
              .attr("opacity", 1);
            })
            .on("click", function(d) {
              document.getElementById(parent.target_div).style.display = "none";
              document.getElementById("stackedBarChartDiv").style.display = "block";
              parent.props.stackedBarRequest(parent.props.setStackedBarState);
              parent.props.resetDaugtherPanels();
            }); 

        this.SVG_main_group.append("text")
            .attr("x", 44*S.xScale)
            .attr("y", 50*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Show DEGs and splicing events");

        this.SVG_main_group.append("text")
            .attr("x", 44*S.xScale)
            .attr("y", 68*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Show event annotations");

    }

    writeLegend()
    {
        var S = this.state;
        this.SVG_main_group.append("rect")
            .attr("x", 214*S.xScale)
            .attr("y", 33*S.yScale)
            .attr("width", 12*S.xScale)
            .attr("height", 12*S.yScale)
            .attr("fill", "orange");

        this.SVG_main_group.append("text")
            .attr("x", 232*S.xScale)
            .attr("y", 42*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Splicing Events");

        this.SVG_main_group.append("rect")
            .attr("x", 214*S.xScale)
            .attr("y", 49*S.yScale)
            .attr("width", 12*S.xScale)
            .attr("height", 12*S.yScale)
            .attr("fill", "blue");

        this.SVG_main_group.append("text")
            .attr("x", 232*S.xScale)
            .attr("y", 58*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Gene");
    }

    drawAxis(xLength, yLength)
    {
        var S = this.state;
        //yLength = yLength * S.yScale;
        this.SVG_main_group.append("rect")
            .attr("x", (this.x_offset*S.xScale)-(2*S.xScale))
            .attr("y", 95*S.yScale)
            .attr("width", 2*S.xScale)
            .attr("opacity", 0.8)
            .attr("height", (yLength) - (2*S.yScale))
            .attr("fill", "rgb(131, 131, 131)");
        
        this.SVG_main_group.append("rect")
            .attr("x", (this.x_offset*S.xScale)-(2*S.xScale))
            .attr("y", (yLength)+(92*S.yScale))
            .attr("width", xLength*S.xScale)
            .attr("opacity", 0.8)
            .attr("height", 2*S.yScale)
            .attr("fill", "rgb(131, 131, 131)");        
    }

    drawXTicks(xLength, yLength, maxValue)
    {
        var S = this.state;
        var xTickInterval = (200 / 10)*S.xScale;
        //yLength = yLength * S.yScale;

        for(var i = 0; i < 12; i++)
        {
            
            var xVal = (88*S.xScale) + (xTickInterval * i);
            //console.log("xVal", xVal);
            this.SVG_main_group.append("rect")
                .attr("x", xVal)
                .attr("y", (yLength+94*S.yScale))
                .attr("width", 2*S.xScale)
                .attr("height", 4*S.yScale)
                .attr("fill", "rgb(131, 131, 131)");

            this.SVG_main_group.append("rect")
                .attr("x", xVal)
                .attr("y", 95*S.yScale)
                .attr("width", 2*S.xScale)
                .attr("height", yLength)
                .attr("opacity", 0.08)
                .attr("fill", "rgb(131, 131, 131)");

            if(i == 0)
            {
                var xstringval = xVal.toString();
                var ystringval = ((yLength)+(105*S.yScale)).toString();
                const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
                this.SVG_main_group.append("text")
                    .attr("x", (xVal-(2*S.xScale)))
                    .attr("y", (yLength)+(105*S.yScale))
                    .attr("text-anchor", "start")
                    .style("font-size", 8.7*S.fontScale)
                    .style("opacity", 1.0)
                    .attr("fill", "black")
                    .attr("transform", rotval)
                    .text("0");
            }
            else
            {
                var textToMake = ((i / 10) * maxValue).toString();
                textToMake = textToMake.split(".");
                if(textToMake.length > 1){
                    textToMake = textToMake[0];
                }
                var xstringval = xVal.toString();
                var ystringval = ((yLength+105*S.yScale)).toString();
                const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
                this.SVG_main_group.append("text")
                    .attr("x", (xVal)-(2*S.xScale))
                    .attr("y", (yLength+105*S.yScale))
                    .attr("text-anchor", "start")
                    .style("font-size", 8.7*S.fontScale)
                    .style("opacity", 1.0)
                    .attr("fill", "black")
                    .attr("transform", rotval)
                    .text(textToMake);
            }
        }

        this.SVG_main_group.append("text")
            .attr("x", (132)*S.xScale)
            .attr("y", yLength+140*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 16.2*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("# of Unique Entries");
      
    }

    tempOnHover(obj, mode)
    {
    if(mode == "add"){
      var textgroup = document.getElementById(obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"]);
      if(textgroup != undefined)
      {
        if(this.state.selectedGroup != obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"])
        {
          //console.log("tG", d3.select(textgroup).attr("selected"));
          if(d3.select(textgroup).attr("selected") == "false")
          {
            d3.select(textgroup).attr("fill", "red");
          } 
        }
      }
      obj
        .attr("stroke-width", 2)
        .attr("srtoke", "purple");
    }
    else{
      var textgroup = document.getElementById(obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"]);
      if(textgroup != undefined)
      {
        if(this.state.selectedGroup != obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"])
        {
          //console.log("tG", d3.select(textgroup).attr("selected"));
          if(d3.select(textgroup).attr("selected") == "false")
          {
            d3.select(textgroup).attr("fill", "black");
          }
        }   
      }
      obj
        .attr("stroke-width", 0)
        .attr("srtoke", "purple");
    }        
    }

    onBarSelect(obj, signature_name, bar_type, setTableState, tablePlotRequest, setConcordanceState, concordanceRequest)
    {
        var textgroup = document.getElementById(obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"]);
        //console.log("Selected:", signature_name, bar_type, textgroup);
        tablePlotRequest(signature_name, bar_type, setTableState);
        concordanceRequest(signature_name, "BLCA", setConcordanceState, "doublebar");
        this.props.resetBottomPanels();
        //console.log("who needs", d3.select(textgroup).attr("id"));
        this.setState({
          selectedGroup: d3.select(textgroup).attr("id")
        })
    }

    drawBar(inputData, index, ypos, maxval)
    {
        var S = this.state;
        var x_offset = 90*S.xScale;
        var clusterVal = inputData[index].cluster;
        var geneVal = inputData[index].gene;
        //ypos = ypos * S.yScale;

        //console.log("cg_", geneVal, clusterVal);

        var clusterScale = (clusterVal / maxval) * 200 * S.xScale;
        var geneScale = (geneVal / maxval) * 200 * S.xScale;
        var parent = this;

        const group_identifier = inputData[index].key.concat("_g_id");

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", clusterScale)
            .attr("height", 8*S.yScale)
            .attr("id", group_identifier.concat("_splice"))
            .attr("fill", "orange")
            .attr("group_identifier", group_identifier)
            .attr("type", "splice")
            .attr("signature", inputData[index].key)
            .on("mouseover", function() {
                //console.log(cur_obj);
                var pretg = d3.select(this).attr("stroke-width", 2)
                .attr("stroke", "purple")
                .attr("cursor", "pointer");
                parent.tempOnHover(pretg, "add")
                })
            .on("mouseout", function(d) {   
                //parent.tempTextRemove();
                var pretg = d3.select(this).attr("stroke-width", 0)
                .attr("stroke", "purple")
                .attr("cursor", "default");
                parent.tempOnHover(pretg, "remove")
                })
            .on("click", function(d) {
                var pretg = d3.select(this);
                var selectedSignature = pretg["_groups"][0][0]["attributes"]["signature"]["nodeValue"];
                var selectedType = pretg["_groups"][0][0]["attributes"]["type"]["nodeValue"];
                parent.onBarSelect(pretg, selectedSignature, selectedType, parent.props.setTableState, parent.props.tablePlotRequest, parent.props.setConcordanceState, parent.props.concordanceRequest)
            });

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", (ypos)+9*S.yScale)
            .attr("width", geneScale)
            .attr("height", 8*S.yScale)
            .attr("id", group_identifier.concat("_gene"))
            .attr("fill", "blue")
            .attr("group_identifier", group_identifier)
            .attr("type", "gene")
            .attr("signature", inputData[index].key)
            .on("mouseover", function() {
                //console.log(cur_obj);                
                var pretg = d3.select(this).attr("stroke-width", 2)
                .attr("stroke", "purple")
                .attr("cursor", "pointer");
                parent.tempOnHover(pretg, "add")
                })
            .on("mouseout", function(d) {   
                //parent.tempTextRemove();
                var pretg = d3.select(this).attr("stroke-width", 0)
                .attr("stroke", "purple")
                .attr("cursor", "default");
                parent.tempOnHover(pretg, "remove")
                })
            .on("click", function(d) {
                var pretg = d3.select(this);
                var selectedSignature = pretg["_groups"][0][0]["attributes"]["signature"]["nodeValue"];
                var selectedType = pretg["_groups"][0][0]["attributes"]["type"]["nodeValue"];
                parent.onBarSelect(pretg, selectedSignature, selectedType, parent.props.setTableState, parent.props.tablePlotRequest, parent.props.setConcordanceState, parent.props.concordanceRequest)
            });
        
        if(index == 0)
        {
        var currentAddedObject = d3.select("#".concat(group_identifier.concat("_gene")));
        var currentAddedObjectSelectedSignature = currentAddedObject["_groups"][0][0]["attributes"]["signature"]["nodeValue"];
        var currentAddedObjectSelectedType = currentAddedObject["_groups"][0][0]["attributes"]["type"]["nodeValue"];
        this.defaultSelection = {"object": currentAddedObject,
        "selectedSignature": currentAddedObjectSelectedSignature,
        "selectedType": currentAddedObjectSelectedType}
        }
        this.SVG_main_group.append("rect")
            .attr("x", x_offset-(5*S.xScale))
            .attr("y", (ypos+7*S.yScale))
            .attr("width", 3*S.xScale)
            .attr("height", 2*S.yScale)
            .attr("fill", "rgb(131, 131, 131)");        

        var inputKey = inputData[index].key;
        inputKey = inputKey.replace('psi_', '');
        inputKey = inputKey.replace('_', ' ');
        inputKey = inputKey.replace('_vs_others', '');
        var xstringval = (81*S.xScale).toString();
        var ystringval = ((ypos + 12*S.yScale)).toString();
        const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
        this.SVG_main_group.append("text")
            .attr("x", 81*S.xScale)
            .attr("y", (ypos + 12.2*S.yScale))
            .attr("text-anchor", "end")
            .attr("id", group_identifier)
            .attr("group_identifier", group_identifier)
            .attr("selected", "false")
            .style("font-size", 12*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .attr("transform", rotval)
            .text(inputKey);
    }

    componentDidUpdate (prevProps){
        if(this.props !== prevProps)
        {
          var y_start = 0;
          var tempnode = document.getElementById(this.target_div);
          while (tempnode.firstChild) {
              tempnode.removeChild(tempnode.firstChild);
          }
          //this.baseSVG(1300);
          //this.writeBase(1300);
          this.setState({
            data: this.props.doubleBarChartState
          })
          return(
            null
          );    
        }
    }  

    render (){
      var S = this.state;
      var y_start = 0;
      var tempnode = document.getElementById(this.target_div);
      while (tempnode.firstChild) {
          tempnode.removeChild(tempnode.firstChild);
      }
      //console.log("TRANSCRIPT LIST: ", this.state.transcripts);
      var y_start = 95 *S.yScale;
      var y_val = y_start;
      var maxValue = 0;
      //console.log("double bar chart state: ", this.state.data);

      if(this.state.data.cluster != null)
      {

        var sorted_data_array = [];

        for(let i = 0; i < this.state.data.cluster.length; i++)
        {
            if(maxValue < this.state.data.cluster[i])
            {
                maxValue = this.state.data.cluster[i];
            }
            if(maxValue < this.state.data.gene[i])
            {
                maxValue = this.state.data.gene[i];
            }
            sorted_data_array[i] = {};
            sorted_data_array[i].cluster = this.state.data.cluster[i];
            sorted_data_array[i].gene = this.state.data.gene[i];
            sorted_data_array[i].key = this.state.data.key[i];
        }
        
        //console.log("this.state.data LOOK", sorted_data_array);
        var dummy_y = 95*S.yScale;
        var y_interval = 20.5*S.yScale;
        var sorted_data = sorted_data_array.sort((a, b)=>{return Number(b.cluster)-Number(a.cluster)})
        for(let i = 0; i < sorted_data.length; i++)
        {
            dummy_y = dummy_y + y_interval;
        }
        dummy_y = dummy_y + 30*S.yScale;
        this.baseSVG(dummy_y);
        this.writeBase(dummy_y);
        this.writeTitle();
        this.writeLegend();
        //console.log("sorted_data LOOK", sorted_data);

        var total_y_length = (y_interval * this.state.data.cluster.length);
        var total_x_length = maxValue + 10;
        this.drawAxis(total_x_length, total_y_length);
        this.drawXTicks(total_x_length, total_y_length, maxValue);

        for(let i = 0; i < sorted_data.length; i++)
        {
            this.drawBar(sorted_data, i, y_val, maxValue);
            y_val = y_val + y_interval;
        }

        if(this.state.selectedGroup != undefined)
        {
          d3.select(document.getElementById(this.state.selectedGroup)).attr("fill", "red").style("font-size", 13*this.state.fontScale);
        }
        if(this.state.selectedGroup == undefined)
        {
          var arg1 = this.defaultSelection.object;
          var arg2 = this.defaultSelection.selectedSignature;
          var arg3 = this.defaultSelection.selectedType;
          this.onBarSelect(arg1, arg2, arg3, this.props.setTableState, this.props.tablePlotRequest, this.props.setConcordanceState, this.props.concordanceRequest)
        }
        //plot chart
      }
      else{
        this.baseSVG(0);
        this.writeBase(0);
      }
      return(
        null
      );
    }
  
  }
  
export default SetDoubleBarChart;