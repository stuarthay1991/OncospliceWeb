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
  
      this.setState({
        input: <DOUBLE_BAR_CHART 
          doubleBarChartState={this.props.doubleBarChartState}
          setTableState={this.props.setTableState}
          tablePlotRequest={this.props.tablePlotRequest}
          doc={document} 
          target_div_id={this.props.doubleBarChartState.targetdiv}>
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
    
        this.setState({
          input: <DOUBLE_BAR_CHART 
            doubleBarChartState={this.props.doubleBarChartState}
            setTableState={this.props.setTableState}
            tablePlotRequest={this.props.tablePlotRequest}
            doc={document} 
            target_div_id={this.props.doubleBarChartState.targetdiv}>
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
        this.SVG_main_group.append("text")
        .attr("x", 27)
        .attr("y", 49)
        .attr("text-anchor", "start")
        .style("font-size", 18.5)
        .style("opacity", 1.0)
        .attr("fill", "black")
        .text("Pancancer Summary");
    }

    writeLegend()
    {
        this.SVG_main_group.append("rect")
            .attr("x", 214)
            .attr("y", 33)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "orange");

        this.SVG_main_group.append("text")
            .attr("x", 232)
            .attr("y", 42)
            .attr("text-anchor", "start")
            .style("font-size", 11)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Splicing Events");

        this.SVG_main_group.append("rect")
            .attr("x", 214)
            .attr("y", 49)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "blue");

        this.SVG_main_group.append("text")
            .attr("x", 232)
            .attr("y", 58)
            .attr("text-anchor", "start")
            .style("font-size", 11)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("Gene");
    }

    drawAxis(xLength, yLength)
    {
        this.SVG_main_group.append("rect")
            .attr("x", this.x_offset-2)
            .attr("y", 95)
            .attr("width", 2)
            .attr("opacity", 0.8)
            .attr("height", (yLength - 2))
            .attr("fill", "rgb(131, 131, 131)");
        
        this.SVG_main_group.append("rect")
            .attr("x", this.x_offset-2)
            .attr("y", (yLength+92))
            .attr("width", xLength)
            .attr("opacity", 0.8)
            .attr("height", 2)
            .attr("fill", "rgb(131, 131, 131)");        
    }

    drawXTicks(xLength, yLength, maxValue)
    {
        var xTickInterval = 180 / 10;

        for(var i = 0; i < 12; i++)
        {
            
            var xVal = 88 + (xTickInterval * i);
            //console.log("xVal", xVal);
            this.SVG_main_group.append("rect")
                .attr("x", xVal)
                .attr("y", (yLength+94))
                .attr("width", 2)
                .attr("height", 4)
                .attr("fill", "rgb(131, 131, 131)");

            this.SVG_main_group.append("rect")
                .attr("x", xVal)
                .attr("y", 95)
                .attr("width", 2)
                .attr("height", (yLength))
                .attr("opacity", 0.08)
                .attr("fill", "rgb(131, 131, 131)");

            if(i == 0)
            {
                var xstringval = xVal.toString();
                var ystringval = (yLength+105).toString();
                const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
                this.SVG_main_group.append("text")
                    .attr("x", (xVal-2))
                    .attr("y", (yLength+105))
                    .attr("text-anchor", "start")
                    .style("font-size", 8.7)
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
                var ystringval = (yLength+105).toString();
                const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
                this.SVG_main_group.append("text")
                    .attr("x", (xVal-2))
                    .attr("y", (yLength+105))
                    .attr("text-anchor", "start")
                    .style("font-size", 8.7)
                    .style("opacity", 1.0)
                    .attr("fill", "black")
                    .attr("transform", rotval)
                    .text(textToMake);
            }
        }

        this.SVG_main_group.append("text")
            .attr("x", (132))
            .attr("y", (yLength+140))
            .attr("text-anchor", "start")
            .style("font-size", 16.2)
            .style("opacity", 1.0)
            .attr("fill", "black")
            .text("# of Unique Entries");
      
    }

    tempOnHover(obj, mode)
    {
    if(mode == "add"){
      obj
        .attr("stroke-width", 2)
        .attr("srtoke", "purple");
    }
    else{
      obj
        .attr("stroke-width", 0)
        .attr("srtoke", "purple");
    }        
    }

    onBarSelect(obj, signature_name, bar_type, setTableState, tablePlotRequest)
    {
        console.log("Selected:", signature_name, bar_type)
        tablePlotRequest(signature_name, bar_type, setTableState);
    }

    drawBar(inputData, index, ypos, maxval)
    {
        var x_offset = 90;
        var clusterVal = inputData[index].cluster;
        var geneVal = inputData[index].gene;

        //console.log("cg_", geneVal, clusterVal);

        var clusterScale = (clusterVal / maxval) * 180;
        var geneScale = (geneVal / maxval) * 180;
        var parent = this;

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", clusterScale)
            .attr("height", 4)
            .attr("fill", "orange")
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
                parent.onBarSelect(pretg, selectedSignature, selectedType, parent.props.setTableState, parent.props.tablePlotRequest)
            });    

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", (ypos+5))
            .attr("width", geneScale)
            .attr("height", 4)
            .attr("fill", "blue")
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
                parent.onBarSelect(pretg, selectedSignature, selectedType, parent.props.setTableState, parent.props.tablePlotRequest)
            });
            
        this.SVG_main_group.append("rect")
            .attr("x", x_offset-5)
            .attr("y", (ypos+2.2))
            .attr("width", 3)
            .attr("height", 2)
            .attr("fill", "rgb(131, 131, 131)");        

        var inputKey = inputData[index].key;
        inputKey = inputKey.replace('psi_', '');
        inputKey = inputKey.replace('_', ' ');
        inputKey = inputKey.replace('_vs_others', '');
        var xstringval = "82";
        var ystringval = ((ypos + 5)).toString();
        const rotval = "rotate(35, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
        this.SVG_main_group.append("text")
            .attr("x", 82)
            .attr("y", (ypos + 5.2))
            .attr("text-anchor", "end")
            .style("font-size", 8.5)
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
            data: this.props.doubleBarChartState,
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
      console.log("double bar chart state: ", this.state.data);

      if(this.state.data.cluster != null)
      {

        this.writeTitle();
        this.writeLegend();

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
        
        console.log("this.state.data LOOK", sorted_data_array);

        var sorted_data = sorted_data_array.sort((a, b)=>{return Number(b.cluster)-Number(a.cluster)})

        console.log("sorted_data LOOK", sorted_data);

        var y_interval = 14;
        var total_y_length = (y_interval * this.state.data.cluster.length);
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
  
  export default SetDoubleBarChart;