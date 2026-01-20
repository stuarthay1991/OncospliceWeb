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
      this.updateStackedBarChart();
    }

    componentDidUpdate(prevProps) {
      if(this.props !== prevProps){
        this.updateStackedBarChart();
      }
    }

    updateStackedBarChart()
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
          concordanceRequest={this.props.concordanceRequest}
          setConcordanceState={this.props.setConcordanceState}
          setTableState={this.props.setTableState}
          tablePlotRequest={this.props.tablePlotRequest}
          resetDaugtherPanels={this.props.resetDaugtherPanels}
          resetBottomPanels={this.props.resetBottomPanels}
          doc={document}
          cancerName={this.props.cancerName}
          target_div_id={this.props.stackedBarChartState.targetdiv}
          xScale={this.props.widthRatio}
          yScale={this.props.heightRatio}>
          </STACKED_BAR_CHART>
      })
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
      this.defaultSelection = undefined;
    }

    baseSVG(h_in)
    {
      var w = "100%";
      var h = h_in;
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
        this.SVG_main_group.append("text")
        .attr("x", 27*S.xScale)
        .attr("y", 29*S.yScale)
        .attr("text-anchor", "start")
        .style("font-size", 18.5*S.fontScale)
        .style("opacity", 1.0)
        .attr("fill", "black")
        .text("Pancancer Summary");

        var parent = this;

        this.SVG_main_group.append('circle')
            .attr('cx', 32*S.xScale)
            .attr('cy', 46*S.yScale)
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
              document.getElementById("doubleBarChartDiv").style.display = "block";
              parent.props.resetDaugtherPanels()
            });


        this.SVG_main_group.append('circle')
            .attr('cx', 32*S.xScale)
            .attr('cy', 63*S.yScale)
            .attr('r', 6*S.fontScale)
            .attr('fill', "#0F6A8B")
            .attr('stroke', "black")
            .attr('stroke-width', 1)
            .attr('opacity', 1);

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

    tempStratifiedHover(selectedObject, objData, mode)
    {
      var S = this.state;
      if(mode == "add")
      {
        var xToMove = selectedObject.attr("x");
        var yToMove = selectedObject.attr("y");
        selectedObject.attr("opacity", 1);
        selectedObject.attr("stroke-width", 2);
        this.SVG_main_group.append("rect")
          .attr("x", xToMove - 1)
          .attr("y", yToMove-(48*S.yScale))
          .attr("id", "tooltipForStacked_id")
          .attr("width", 90 * S.xScale)
          .attr("height", 47 * S.yScale)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("opacity", 0.7)
          .attr("fill", "white");

        var textXPosition = parseInt(xToMove + 6) + parseInt((90 * S.xScale) / 2.0);
        console.log("textXPosition", textXPosition);
        this.SVG_main_group.append("text")
          .attr("x", textXPosition)
          .attr("y", yToMove-(31*S.yScale))
          .attr("id", "tooltipForStacked_text_1_id")
          .attr("text-anchor", "middle")
          .style("font-size", 12 * S.fontScale)
          .attr("fill", "red")
          .text(selectedObject.attr("annotation"));

        this.SVG_main_group.append("text")
          .attr("x", textXPosition)
          .attr("y", yToMove-(14*S.yScale))
          .attr("id", "tooltipForStacked_text_2_id")
          .attr("text-anchor", "middle")
          .style("font-size", 12 * S.fontScale)
          .attr("fill", "red")
          .text(selectedObject.attr("annot_val"));

      }
      else
      {
        selectedObject.attr("opacity", 0.7);
        selectedObject.attr("stroke-width", 1);
        d3.select("#tooltipForStacked_id").remove();
        d3.select("#tooltipForStacked_text_1_id").remove();
        d3.select("#tooltipForStacked_text_2_id").remove();
      }
    }

    tempOnHover(selectedObject, objData, mode)
    {
        var S = this.state;
        if(mode == "add")
        {
            var xToMove = selectedObject.attr("x");
            var yToMove = selectedObject.attr("y");

            selectedObject.attr("opacity", 1);
            selectedObject.attr("stroke-width", 2);
            var text_size = 9;

            //console.log("objData", objData);

            this.SVG_main_group.append("rect")
                .attr("x", xToMove - 1)
                .attr("y", yToMove-(95*S.yScale))
                .attr("id", "tooltipForStacked_id")
                .attr("width", 148 * S.yScale)
                .attr("height", 94 * S.yScale)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "white");

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(82*S.yScale))
                .attr("id", "tooltipForStacked_text_1_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("alt-3': ".concat(objData["objects"]["alt-3"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(70*S.yScale))
                .attr("id", "tooltipForStacked_text_2_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("alt-5': ".concat(objData["objects"]["alt-5"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(58*S.yScale))
                .attr("id", "tooltipForStacked_text_3_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("alt-C-term: ".concat(objData["objects"]["alt-C-term"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(46*S.yScale))
                .attr("id", "tooltipForStacked_text_4_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("altPromoter: ".concat(objData["objects"]["altPromoter"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(34*S.yScale))
                .attr("id", "tooltipForStacked_text_5_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("cassette-exon: ".concat(objData["objects"]["cassette-exon"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(22*S.yScale))
                .attr("id", "tooltipForStacked_text_6_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("intron-retention: ".concat(objData["objects"]["intron-retention"]));

            this.SVG_main_group.append("text")
                .attr("x", xToMove+6)
                .attr("y", yToMove-(10*S.yScale))
                .attr("id", "tooltipForStacked_text_7_id")
                .attr("text-anchor", "start")
                .style("font-size", 10)
                .attr("fill", "black")
                .text("trans-splicing: ".concat(objData["objects"]["trans-splicing"]));
        }
        else
        {
            selectedObject.attr("opacity", 0);
            selectedObject.attr("stroke-width", 0);

            d3.select("#tooltipForStacked_id").remove();
            d3.select("#tooltipForStacked_text_1_id").remove();
            d3.select("#tooltipForStacked_text_2_id").remove();
            d3.select("#tooltipForStacked_text_3_id").remove();
            d3.select("#tooltipForStacked_text_4_id").remove();
            d3.select("#tooltipForStacked_text_5_id").remove();
            d3.select("#tooltipForStacked_text_6_id").remove();
            d3.select("#tooltipForStacked_text_7_id").remove();
        }
    }


    drawAxis(xLength, yLength)
    {
        var S = this.state;
        yLength = yLength;
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
        yLength = yLength;

        for(var i = 0; i < 12; i++)
        {

            var xVal = (88*S.xScale) + (xTickInterval * i);
            //console.log("xVal", xVal);
            this.SVG_main_group.append("rect")
                .attr("x", xVal)
                .attr("y", (yLength+(94*S.yScale)))
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

    onSelect(obj, signature_name, annot, setTableState, tablePlotRequest, setConcordanceState, concordanceRequest, cancer)
    {
        //var textgroup = document.getElementById(obj["_groups"][0][0]["attributes"]["group_identifier"]["nodeValue"]);
        //console.log("Selected:", signature_name, bar_type, textgroup);
        tablePlotRequest(signature_name, "splice", setTableState, annot, cancer);
        concordanceRequest(signature_name, cancer, setConcordanceState, "stackedbar", annot);
        this.props.resetBottomPanels();
        //console.log("who needs", d3.select(textgroup).attr("id"));
        this.setState({
          selectedGroup: obj.attr("id")
        })
    }

    drawBar(inputData, index, ypos, maxval)
    {
        var S = this.state;
        var x_offset = 90*S.xScale;
        const annotVal = inputData[index];
        ypos = ypos;
        var x_now = x_offset;
        var parent = this;

        //console.log("cg_", geneVal, clusterVal);
        for(let i = 0; i < this.annotation_names.length; i++)
        {
            var current_annotation = this.annotation_names[i];
            var widthScale = (annotVal["objects"][current_annotation] / maxval) * 200 * S.xScale;
            //const group_identifier = index.concat(annotVal["objects"][current_annotation])
            this.SVG_main_group.append("rect")
                .attr("x", x_now)
                .attr("y", ypos)
                .attr("width", widthScale)
                .attr("height", 16*S.yScale)
                .attr("colorset", colors[i])
                //.attr("group_identifier", group_identifier)
                .attr("annot_val", annotVal["objects"][current_annotation])
                .attr("id", (inputData[index].signature_name).concat(current_annotation).concat(i.toString()))
                .attr("annotation", current_annotation)
                .attr("signature", inputData[index].signature_name)
                .attr("fill", colors[i])
                .attr("opacity", 0.7)
                .attr("stroke", "purple")
                .on("mouseover", function() {
                  var pretg = d3.select(this)
                  if(pretg.attr("id") != parent.state.selectedGroup)
                  {
                    pretg.style("cursor", "pointer");
                    parent.tempStratifiedHover(pretg, inputData[index], "add");
                  }
                })
                .on("mouseout", function() {
                  var pretg = d3.select(this);
                  if(pretg.attr("id") != parent.state.selectedGroup)
                  {
                    pretg.attr("stroke-width", 1);
                    pretg.style("cursor", "default");
                    parent.tempStratifiedHover(pretg, inputData[index], "remove");
                  }
                })
                .on("click", function() {
                  var pretg = d3.select(this).attr("stroke-width", 1);
                  pretg.style("cursor", "default");
                  pretg.attr("stroke", "purple");
                  //.attr("cursor", "pointer")

                  parent.onSelect(pretg, pretg.attr("signature"), pretg.attr("annotation"), parent.props.setTableState, parent.props.tablePlotRequest, parent.props.setConcordanceState, parent.props.concordanceRequest, parent.props.cancerName);
                })
            x_now = x_now + widthScale;
        }

        if(index == 0)
        {
        var id_to_use = inputData[0].signature_name.concat(this.annotation_names[4]).concat("4");
        var currentAddedObject = d3.select("#".concat(id_to_use));
        var currentAddedObjectSelectedSignature = currentAddedObject["_groups"][0][0]["attributes"]["signature"]["nodeValue"];
        var currentAddedObjectSelectedAnnotation = currentAddedObject["_groups"][0][0]["attributes"]["annotation"]["nodeValue"];
        this.defaultSelection = {"object": currentAddedObject,
        "selectedSignature": currentAddedObjectSelectedSignature,
        "selectedAnnotation": currentAddedObjectSelectedAnnotation}
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
          this.baseSVG(2000);
          this.writeBase(2000);
          this.setState({
            data: this.props.stackedBarChartState.data
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
      var y_start = 95 * this.state.yScale;
      var y_val = y_start;
      var maxValue = 0;
      //console.log("stacked bar chart state: ", this.state.data);

      if(this.state.data != null)
      {


        var sorted_data_array = [];
        var index_value = 0;
        for (const [key, value] of Object.entries(this.state.data)) {
            const cur_val = 0;
            for (const [annotation_name, number_value] of Object.entries(value))
            {
                //console.log("STACKED_LOOP: ", annotation_name, number_value);
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
        //console.log("STACKED_SORTED:", sorted_data);
        var y_interval = 20.5 * this.state.yScale;
        var total_y_length = (y_interval * sorted_data.length);
        var total_x_length = maxValue + 10;
        this.baseSVG(total_y_length + (160 * this.state.yScale));
        this.writeBase(total_y_length + (160 * this.state.yScale));
        this.writeTitle();
        this.writeLegend();
        this.drawAxis(total_x_length, total_y_length);
        this.drawXTicks(total_x_length, total_y_length, maxValue);

        for(let i = 0; i < sorted_data.length; i++)
        {
            this.drawBar(sorted_data, i, y_val, maxValue);
            y_val = y_val + y_interval;
        }
        //console.log("TOHSMODFSKO", this.state.selectedGroup);
        if(this.state.selectedGroup != undefined)
        {
          d3.select(document.getElementById(this.state.selectedGroup)).attr("stroke-width", 3).style("stroke", "red");
        }
        if(this.state.selectedGroup == undefined)
        {
          var arg1 = this.defaultSelection.object;
          var arg2 = this.defaultSelection.selectedSignature;
          var arg3 = this.defaultSelection.selectedAnnotation;
          this.onSelect(arg1, arg2, arg3, this.props.setTableState, this.props.tablePlotRequest, this.props.setConcordanceState, this.props.concordanceRequest, this.props.cancerName);
        }
        //plot chart
      }
      else
      {
        this.baseSVG(2000);
        this.writeBase(2000);
      }
      return(
        null
      );
    }

  }

export default SetStackedBarChart;
