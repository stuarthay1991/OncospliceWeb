import * as d3 from 'd3';
import '../css/d3tooltip.css';

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

class SetConcordanceGraph extends React.Component {
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
        input: <CONCORDANCE_GRAPH
          doc={document}
          concordanceState={this.props.concordanceState}
          target_div_id={"concordanceDiv"}
          xScale={this.props.widthRatio}
          yScale={this.props.heightRatio}>
          </CONCORDANCE_GRAPH>
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
          input: <CONCORDANCE_GRAPH 
            doc={document} 
            concordanceState={this.props.concordanceState}
            target_div_id={"concordanceDiv"}
            xScale={this.props.widthRatio}
            yScale={this.props.heightRatio}>
            </CONCORDANCE_GRAPH>
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

class CONCORDANCE_GRAPH extends React.Component {
    constructor(props)
    {
      super(props);
      this.target_div = "concordanceDiv";
      this.SVG_main_group = null;
      this.xscale = 0.05;
      this.doc = this.props.doc;
      this.x_offset = 90;
      this.div = null;
      this.ens_map = {};
      this.state = {
        data: this.props.concordanceState.signatures,
        xScale: this.props.xScale,
        yScale: this.props.yScale,
        fontScale: ((this.props.xScale+this.props.yScale)/2),
        selectedGroup: undefined
      };
    }

    baseSVG(w="100%", h=10000) 
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
  
    writeBase(w="100%", h=10000)
    {
      this.SVG_main_group.append("rect")
        .attr("width", "100%")
        .attr("height", h)
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
        .text("Pancancer Concordance");
    }

    tempOnHover(selectedObject, firstcomponent, secondcomponent, signature_name, mode)
    {
        var S = this.state;
        if(mode == "add")
        {
            var cancerCutoffString = getPosition(signature_name, '_', 2);
            var modString = signature_name.substring(cancerCutoffString+1);
            modString = modString.replaceAll('_', ' ');
            modString = modString.replaceAll('psi ', ' ');
            var xToMove = selectedObject.attr("x");
            var yToMove = selectedObject.attr("y");
            var cValue = selectedObject.attr("cValue");
            var numerator = selectedObject.attr("jVal");
            var denominator = selectedObject.attr("j_cVal");
            var total_length = selectedObject.attr("width");

            selectedObject.attr("opacity", 0.5);

            this.SVG_main_group.append("rect")
                .attr("x", xToMove - 14)
                .attr("y", yToMove-(43*S.yScale))
                .attr("id", "tooltipForConcordnace_id")
                .attr("width", total_length*1.17)
                .attr("height", 41 * S.yScale)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "white")
            
            if(modString.length > 22)
            {
                var text_size = 9;
            }
            else{
                var text_size = 10;
            }

            this.SVG_main_group.append("text")
                .attr("x", xToMove-7)
                .attr("y", yToMove-(31*S.yScale))
                .attr("id", "tooltipForConcordnace_text_1_id")
                .attr("text-anchor", "start")
                .style("font-size", text_size)
                .attr("fill", "black")
                .text(modString);

            if(cValue.length > 4)
            {
                cValue = cValue.substring(0, 4);
            }
            var concordanceValueText = "Concordance value: ".concat(cValue);

            this.SVG_main_group.append("text")
                .attr("x", xToMove-7)
                .attr("y", yToMove-(18.9*S.yScale))
                .attr("id", "tooltipForConcordnace_text_2_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text(concordanceValueText);

            var matchesText = numerator.concat(" / ").concat(denominator).concat(" matches");

            this.SVG_main_group.append("text")
                .attr("x", xToMove-7)
                .attr("y", yToMove-(6.8*S.yScale))
                .attr("id", "tooltipForConcordnace_text_3_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text(matchesText);
        }
        else
        {
            selectedObject.attr("opacity", 0);

            d3.select("#tooltipForConcordnace_id").remove();
            d3.select("#tooltipForConcordnace_text_1_id").remove();
            d3.select("#tooltipForConcordnace_text_2_id").remove();
            d3.select("#tooltipForConcordnace_text_3_id").remove();
        }
    }

    drawBar(signature_name, concordance_value, color, jVal, j_cVal, ypos)
    {
        var S = this.state;
        var x_offset = 150*S.xScale;

        ypos = ypos * S.yScale;

        var total_length = 135 * S.xScale;
        var particular_length = (concordance_value * 135) * S.xScale;

        var parent = this;

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        /*
        var mousemove = function(d) {
            var xToMove = d3.select(this).attr("x");
            var yToMove = d3.select(this).attr("y");
            console.log("MOUSEMOVE", xToMove, yToMove);
            tooltip
                .html("The exact value of<br>this cell is: ")
                .style("left", (xToMove) + "px")
                .style("top", (yToMove - 70) + "px")
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }*/

        //make hollow rect
    
        const firstComp = this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", total_length)
            .attr("height", 15 * S.yScale)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "white");
        
        const secondComp = this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos+1*S.yScale)
            .attr("width", particular_length)
            .attr("height", 14*S.yScale)
            .attr("stroke", color)
            .attr("stroke-width", 1)
            .attr("fill", color);

        this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", total_length)
            .attr("height", 15 * S.yScale)
            .attr("cValue", concordance_value)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("jVal", jVal)
            .attr("j_cVal", j_cVal)
            .attr("fill", "white")
            .attr("opacity", 0)
            .on("mouseover", function() {
                //console.log(cur_obj);
                var pretg = d3.select(this);
                parent.tempOnHover(pretg, firstComp, secondComp, signature_name, "add");
            })
            .on("mouseleave", function() {
                var pretg = d3.select(this);
                parent.tempOnHover(pretg, firstComp, secondComp, signature_name, "remove");
            });
        
        var inputKey = signature_name;
        inputKey = inputKey.replace('psi_', '');
        inputKey = inputKey.replace('_', ' ');
        inputKey = inputKey.replace('_vs_others', '');
        var xstringval = (143*S.xScale).toString();
        var ystringval = ((ypos + 13*S.yScale)).toString();
        const rotval = "rotate(15, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");
        if(inputKey.length > 20)
        {
            inputKey = inputKey.substring(0, 20);
            inputKey = inputKey.concat("...");
        }
        this.SVG_main_group.append("text")
            .attr("x", 143*S.xScale)
            .attr("y", (ypos + 13.2*S.yScale))
            .attr("text-anchor", "end")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", color)
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
          this.setState({
            data: this.props.concordanceState.signatures,
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
      //console.log("TRANSCRIPT LIST: ", this.state.transcripts);
      var y_start = 95;
      var y_val = y_start;
      var maxValue = 0;
      var S = this.state;
      console.log("concordance graph state: ", this.state.data);

      if(this.state.data != undefined)
      {
        // create a tooltip

        var y_interval = 20;

        var sorted_data = this.state.data.sort((a, b)=>{return Number(b["concordance"])-Number(a["concordance"])});

        var total_y_length = y_start + (sorted_data.length * (20 * S.yScale));

        total_y_length = total_y_length + 40 * S.yScale;

        this.baseSVG("100%", total_y_length);
        this.writeBase("100%", total_y_length);
        this.writeTitle();

        for (var i = 0; i < sorted_data.length; i++) 
        {
            this.drawBar(sorted_data[i]["signature"], sorted_data[i]["concordance"], sorted_data[i]["color"], sorted_data[i]["junctionOnly"], sorted_data[i]["junctionAndDirection"], y_val);
            y_val = y_val + y_interval;
        }

        //plot chart
      }
      return(
        null
      );
    }
  
  }
  
  export default SetConcordanceGraph;