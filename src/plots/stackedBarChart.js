import * as d3 from 'd3';

const colors = [
    "#003399", // Darker Blue - alt-3
    "#4fc94f", // Grey Green - alt-5
    "#b3b3b3", // Grey - alt-c-term
    "#d3ce3c", // Greyish Yellow - altPromoter
    "#5a9fce", // Light Blue - cassette-exon
    "#00FF00", // Green - intron-retention
    "#c440a3", // Faded Purple - trans-splicing
    "#FF0000", // Red
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FF8000", // Orange
    "#800080", // Purple
    "#008080", // Teal
    "#808000"  // Olive
  ];

class SetStackedBarChart extends React.Component {
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
        input: <STACKED_BAR_CHART 
          stackedBarChartState={this.props.stackedBarChartState}
          doc={document}
          target_div_id={this.props.stackedBarChartState.targetdiv}
          xScale={this.props.widthRatio}
          yScale={this.props.heightRatio}>
          </STACKED_BAR_CHART>
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
        if(this.props.stackedBarChartState)
        this.setState({
          input: <STACKED_BAR_CHART 
            stackedBarChartState={this.props.stackedBarChartState}
            doc={document} 
            target_div_id={this.props.stackedBarChartState.targetdiv}
            xScale={this.props.widthRatio}
            yScale={this.props.heightRatio}>
            </STACKED_BAR_CHART>
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

  class STACKED_BAR_CHART extends React.Component {
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
      this.annotation_names = ["alt-3", "alt-5", "alt-C-term", "altPromoter", "cassette-exon", "intron-retention", "trans-splicing"];
      this.state = {
        data: this.props.stackedBarChartState.data,
        xScale: this.props.xScale,
        yScale: this.props.yScale,
        fontScale: ((this.props.xScale+this.props.yScale)/2),
        selectedGroup: undefined
      };
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
        .attr("fill", "White");
  
    }

    writeTitle()
    {
        var S = this.state;
        this.SVG_main_group.append("text")
        .attr("x", 27*S.xScale)
        .attr("y", 49*S.yScale)
        .attr("text-anchor", "start")
        .style("font-size", 18.5*S.fontScale)
        .style("opacity", 1.0)
        .attr("fill", "black")
        .text("Pancancer Summary");
    }

    writeLegend()
    {
        var S = this.state;

        var rectTextYDistance = 7;
        var rectTextXDistance = 15;
        var interLabelDistance = 11;

        var xRect = 219;
        var xText = 234;

        var yRectStart = 13;
        var yTextStart = 20;

        for(var i = 0; i < this.annotation_names.length; i++)
        {
          
          this.SVG_main_group.append("rect")
            .attr("x", xRect*S.xScale)
            .attr("y", yRectStart*S.yScale)
            .attr("width", 10*S.xScale)
            .attr("height", 10*S.yScale)
            .attr("fill", colors[i]);

          this.SVG_main_group.append("text")
            .attr("x", xText*S.xScale)
            .attr("y", yTextStart*S.yScale)
            .attr("text-anchor", "start")
            .style("font-size", 9*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text(this.annotation_names[i]);

          yRectStart = yRectStart + interLabelDistance;
          yTextStart = yTextStart + interLabelDistance;

        }
    }


    drawAxis(xLength, yLength)
    {
        var S = this.state;
        yLength = yLength * S.yScale;
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
        yLength = yLength * S.yScale;

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
            .text("# Inclusion ASE");
      
    }

    drawBar(inputData, index, ypos, maxval)
    {
        var S = this.state;
        var x_offset = 90*S.xScale;
        var annotVal = inputData[index];
        ypos = ypos * S.yScale;
        var x_now = x_offset;
        var parent = this;

        //console.log("cg_", geneVal, clusterVal);
        for(let i = 0; i < this.annotation_names.length; i++)
        {
            var current_annotation = this.annotation_names[i];
            var widthScale = (annotVal["objects"][current_annotation] / maxval) * 200 * S.xScale;
            this.SVG_main_group.append("rect")
                .attr("x", x_now)
                .attr("y", ypos)            
                .attr("width", widthScale)
                .attr("height", 16*S.yScale)
                .attr("fill", colors[i]);
            x_now = x_now + widthScale;
        }
        
        var inputKey = inputData[index].signature_name;
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
          this.baseSVG();
          this.writeBase();
          this.setState({
            data: this.props.stackedBarChartState.data,
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
      this.baseSVG();
      this.writeBase();
      //console.log("TRANSCRIPT LIST: ", this.state.transcripts);
      var y_start = 95;
      var y_val = y_start;
      var maxValue = 0;
      console.log("stacked bar chart state: ", this.state.data);

      if(this.state.data != null)
      {

        this.writeTitle();
        this.writeLegend();

        var sorted_data_array = [];
        var index_value = 0;
        for (const [key, value] of Object.entries(this.state.data)) {
            const cur_val = 0;
            for (const [annotation_name, number_value] of Object.entries(value))
            {
                console.log("STACKED_LOOP: ", annotation_name, number_value);
                cur_val = cur_val + parseInt(number_value);
            }
            if(cur_val > maxValue){
                maxValue = cur_val;
            }
            sorted_data_array[index_value] = {};
            sorted_data_array[index_value].signature_name = key;
            sorted_data_array[index_value].sum = cur_val;
            sorted_data_array[index_value].objects = value;
            index_value = index_value + 1;
        }
        

        var sorted_data = sorted_data_array.sort((a, b)=>{return Number(b.sum)-Number(a.sum)});
        console.log("STACKED_SORTED:", sorted_data);
        var y_interval = 20.5;
        var total_y_length = (y_interval * sorted_data.length);
        var total_x_length = maxValue + 10;
        this.drawAxis(total_x_length, total_y_length);
        this.drawXTicks(total_x_length, total_y_length, maxValue);

        for(let i = 0; i < sorted_data.length; i++)
        {
            this.drawBar(sorted_data, i, y_val, maxValue);
            y_val = y_val + y_interval;
        }

        //plot chart
      }
      return(
        null
      );
    }
  
  }
  
export default SetStackedBarChart;