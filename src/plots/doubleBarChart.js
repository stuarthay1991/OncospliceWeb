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
          setDoubleBarChartState={this.props.setDoubleBarChartState} 
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
            setDoubleBarChartState={this.props.setDoubleBarChartState} 
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
  
    drawBar(inputData, index, ypos, maxval)
    {
        var x_offset = 25;
        var clusterVal = inputData.cluster[index];
        var geneVal = inputData.gene[index];

        console.log("cg_", geneVal, clusterVal);

        var clusterScale = (clusterVal / maxval) * 300;
        var geneScale = (geneVal / maxval) * 300;

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", clusterScale)
            .attr("height", 12)
            .attr("fill", "blue");
        
        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", (ypos+15))
            .attr("width", geneScale)
            .attr("height", 12)
            .attr("fill", "orange");        
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
      var y_start = 25;
      var y_val = y_start;
      var maxValue = 0;
      console.log("double bar chart state: ", this.state.data);
      if(this.state.data.cluster != null)
      {
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
        }

        for(let i = 0; i < this.state.data.cluster.length; i++)
        {
            drawBar(this.state.data, i, y_val, maxValue);
            y_val = y_val + 50;
        }
        //plot chart
      }
      return(
        null
      );
    }
  
  }
  
  export default SetDoubleBarChart;