import * as d3 from 'd3';
import '../css/d3tooltip.css';

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

function utilityCleanSignatureName(toSendInputKey)
{
  /*toSendInputKey = toSendInputKey.replace('HNSCC', '');
  toSendInputKey = toSendInputKey.replace('PCPG', '');
  toSendInputKey = toSendInputKey.replace('PRAD', '');
  toSendInputKey = toSendInputKey.replace('BRCA', '');
  toSendInputKey = toSendInputKey.replace('BLCA', '');
  toSendInputKey = toSendInputKey.replace('LGG', '');
  toSendInputKey = toSendInputKey.replace('tcga', '');
  toSendInputKey = toSendInputKey.replace('TCGA', '');
  toSendInputKey = toSendInputKey.replace('AML', '');
  toSendInputKey = toSendInputKey.replace('Leucegene', '');
  toSendInputKey = toSendInputKey.replace('SKCM', '');
  toSendInputKey = toSendInputKey.replace('COAD', '');
  toSendInputKey = toSendInputKey.replaceAll('_', ' ');
  toSendInputKey = toSendInputKey.replace('GBM', '');
  toSendInputKey = toSendInputKey.replace('gbm', '');
  toSendInputKey = toSendInputKey.replace('LUAD', '');*/
  return toSendInputKey;
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
          vennState={this.props.vennState}
          setVennState={this.props.setVennState}
          cancerName={this.props.cancerName}
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
            vennState={this.props.vennState}
            setVennState={this.props.setVennState}
            cancerName={this.props.cancerName}
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
      this.homeSignatureTotal = 0;
      this.state = {
        data: this.props.concordanceState.signatures,
        cancerName: this.props.cancerName,
        homeSignature: this.props.concordanceState.homeSignature,
        originalName: this.props.concordanceState.originalName,
        type: this.props.concordanceState.type,
        annot: this.props.concordanceState.annot,
        xScale: this.props.xScale,
        yScale: this.props.yScale,
        fontScale: ((this.props.xScale+this.props.yScale)/2),
        selectedGroup: undefined
      };
      this.defaultSelection = undefined;
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
        .attr("y", 29*S.yScale)
        .attr("text-anchor", "start")
        .style("font-size", 18.5*S.fontScale)
        .style("opacity", 1.0)
        .attr("fill", "black")
        .text("Pancancer Concordance");

        var t1 = S.homeSignature.name;
        t1 = t1.replace('_TCGA', '');
        t1 = t1.replace('psi_', '');
        //t1 = t1.replace('_', ' ');
        t1 = t1.replace('_vs_others', '');
        t1 = t1.toUpperCase();
        t1 = t1.replace(/_/g, "-");
        if(S.type == "stackedbar")
        {
          t1 = t1.concat(": ").concat(S.annot);
        }
        this.SVG_main_group.append("text")
          .attr("x", 27*S.xScale)
          .attr("y", 44*S.yScale)
          .attr("text-anchor", "start")
          .style("font-size", 13.5*S.fontScale)
          .style("opacity", 1.0)
          .attr("fill", "black")
          .text(t1);
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

    drawBar(inputData, ypos, index)
    {
        const signature_name = inputData["signature"];
        const concordance_value = inputData["concordance"];
        const color = inputData["color"];
        const jVal = inputData["junctionOnly"];
        const j_cVal = inputData["junctionAndDirection"];
        const totalC = inputData["totalAmount"];
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

        var homeKey = S.homeSignature.name;
        homeKey = homeKey.replace('_TCGA', '');
        homeKey = homeKey.replace('psi_', '');
        /*homeKey = homeKey.replace('_', ' ');
        homeKey = homeKey.replace('_vs_others', '');*/
        homeKey = homeKey.toUpperCase();
        homeKey = homeKey.replace(/_/g, "-");
        if(homeKey.length > 25)
        {
            homeKey = homeKey.substring(0, 25);
            homeKey = homeKey.concat("...");
        }

        //make hollow rect
        var inputKey = signature_name;
        inputKey = inputKey.replace('_tcga', '');
        //inputKey = inputKey.replace('hnscc', '');
        inputKey = inputKey.replace('psi_', '');
        //inputKey = inputKey.replace('_', ' ');
        inputKey = inputKey.replace('_vs_others', '');
        inputKey = inputKey.toUpperCase();
        inputKey = inputKey.replace(/^.*?_/, "");
        inputKey = inputKey.replace(/_/g, "-");

        if(inputKey.length > 30)
        {
            inputKey = inputKey.substring(0, 30);
            inputKey = inputKey.concat("...");
        }

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

        var cur_id = homeKey.concat(inputKey).concat(ypos.toString()).concat("_id");
        var special_selector = this.SVG_main_group.append("rect")
            .attr("x", x_offset)
            .attr("y", ypos)
            .attr("width", total_length)
            .attr("height", 15 * S.yScale)
            .attr("cValue", concordance_value)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("homeKey", homeKey)
            .attr("inputKey", inputKey)
            .attr("id", cur_id)
            .attr("jVal", jVal)
            .attr("j_cVal", j_cVal)
            .attr("fill", "white")
            .attr("opacity", cur_id == parent.state.selectedGroup ? 0.7 : 0)
            .on("mouseover", function() {
                //console.log(cur_obj);
                var pretg = d3.select(this);
                if(pretg.attr("id") != parent.state.selectedGroup)
                {
                  pretg.attr("cursor", "pointer");
                  parent.tempOnHover(pretg, firstComp, secondComp, signature_name, "add");
                }
            })
            .on("mouseleave", function() {
                var pretg = d3.select(this);
                if(pretg.attr("id") != parent.state.selectedGroup)
                {
                  pretg.attr("cursor", "default");
                  parent.tempOnHover(pretg, firstComp, secondComp, signature_name, "remove");
                }
            })
            .on("click", function() {
                var pretg = d3.select(this);
                var dataSend = {};
                var toSendInputKey = pretg.attr("inputKey");
                toSendInputKey = utilityCleanSignatureName(toSendInputKey);
                dataSend.homeSignature = pretg.attr("homeKey");
                dataSend.comparedSignature = toSendInputKey;
                dataSend.homeCount = S.homeSignature.count;
                dataSend.comparedCount = totalC;
                dataSend.commonCount = j_cVal;
                dataSend.comparedOriginal = signature_name;
                dataSend.homeOriginal = S.homeSignature;
                dataSend.cancerName = S.cancerName.concat("_TCGA");
                dataSend.annot = S.annot;
                //console.log("concordance clicked...", homeKey, inputKey);
                //retrieveDataForVenn(parent.props, signature_name, S.homeSignature);
                parent.setState({
                  selectedGroup: pretg.attr("id")
                })
                parent.props.setVennState({data: dataSend});
            });


        var xstringval = (143*S.xScale).toString();
        var ystringval = ((ypos + 13*S.yScale)).toString();
        const rotval = "rotate(15, ".concat(xstringval).concat(", ").concat(ystringval).concat(")");

        this.SVG_main_group.append("text")
            .attr("x", 143*S.xScale)
            .attr("y", (ypos + 13.2*S.yScale))
            .attr("text-anchor", "end")
            .style("font-size", 11*S.fontScale)
            .style("opacity", 1.0)
            .attr("fill", color)
            .attr("ref_id", cur_id)
            .attr("transform", rotval)
            .attr("font-weight", cur_id == parent.state.selectedGroup ? 700 : 400)
            .text(inputKey)
            .on("mouseover", function() {
              //console.log(cur_obj);
              var pretg1 = d3.select(this);
              var pretg2 = pretg1.attr("ref_id");
              pretg2 = d3.select(document.getElementById(pretg2));
              if(pretg2.attr("id") != parent.state.selectedGroup)
              {
                pretg1.attr("cursor", "pointer");
                pretg1.attr("font-weight", 550);
                parent.tempOnHover(pretg2, firstComp, secondComp, signature_name, "add");
              }
            })
            .on("mouseleave", function() {
              var pretg1 = d3.select(this);
              var pretg2 = pretg1.attr("ref_id");
              pretg2 = d3.select(document.getElementById(pretg2));
              if(pretg2.attr("id") != parent.state.selectedGroup)
              {
                pretg1.attr("cursor", "default");
                pretg1.attr("font-weight", 400);
                parent.tempOnHover(pretg2, firstComp, secondComp, signature_name, "remove");
              }
            })
            .on("click", function() {
                var pretg1 = d3.select(this);
                var pretg2 = pretg1.attr("ref_id");
                pretg2 = d3.select(document.getElementById(pretg2));
                var dataSend = {};
                var toSendInputKey = pretg2.attr("inputKey");
                toSendInputKey = utilityCleanSignatureName(toSendInputKey);
                dataSend.homeSignature = pretg2.attr("homeKey");
                dataSend.comparedSignature = toSendInputKey;
                dataSend.homeCount = S.homeSignature.count;
                dataSend.comparedCount = totalC;
                dataSend.commonCount = j_cVal;
                dataSend.comparedOriginal = signature_name;
                dataSend.homeOriginal = S.homeSignature;
                dataSend.cancerName = S.cancerName.concat("_TCGA");
                dataSend.annot = S.annot;
                //console.log("concordance clicked...", homeKey, inputKey);
                //retrieveDataForVenn(parent.props, signature_name, S.homeSignature);
                parent.setState({
                  selectedGroup: pretg2.attr("id")
                })
                parent.props.setVennState({data: dataSend});
            });

        if(index == 0)
        {
          if(this.state.selectedGroup == undefined)
          {
            var pretg = d3.select(document.getElementById(cur_id));
            var defaultSend = {};
            var toSendInputKey = pretg.attr("inputKey");
            toSendInputKey = utilityCleanSignatureName(toSendInputKey);
            defaultSend.homeSignature = pretg.attr("homeKey");
            defaultSend.comparedSignature = toSendInputKey;
            defaultSend.homeCount = S.homeSignature.count;
            defaultSend.comparedCount = totalC;
            defaultSend.commonCount = j_cVal;
            defaultSend.comparedOriginal = signature_name;
            defaultSend.homeOriginal = S.homeSignature;
            defaultSend.cancerName = S.cancerName.concat("_TCGA");
            defaultSend.annot = S.annot;
            this.defaultSelection = defaultSend;
            parent.setState({
              selectedGroup: pretg.attr("id")
            })
            parent.props.setVennState({data: defaultSend})
          }
          //console.log("Default selection", this.props.cancerName, this.defaultSelection);
        }
    }

    componentDidUpdate (prevProps){
        if(this.props !== prevProps && this.props.concordanceState.homeSignature !== prevProps.concordanceState.homeSignature)
        {
          var y_start = 0;
          var tempnode = document.getElementById(this.target_div);
          while (tempnode.firstChild) {
              tempnode.removeChild(tempnode.firstChild);
          }
          this.setState({
            data: this.props.concordanceState.signatures,
            homeSignature: this.props.concordanceState.homeSignature,
            originalName: this.props.concordanceState.originalName,
            cancerName: this.props.cancerName,
            type: this.props.concordanceState.type,
            annot: this.props.concordanceState.annot,
            selectedGroup: undefined
          })
          //var se = d3.select("#".concat(this.state.selectedGroup)).attr("opacity", 0.7);
        }
        else if(this.props !== prevProps)
        {
          var y_start = 0;
          var tempnode = document.getElementById(this.target_div);
          while (tempnode.firstChild) {
              tempnode.removeChild(tempnode.firstChild);
          }
          this.setState({
            data: this.props.concordanceState.signatures,
            homeSignature: this.props.concordanceState.homeSignature,
            originalName: this.props.concordanceState.originalName,
            cancerName: this.props.cancerName,
            type: this.props.concordanceState.type,
            annot: this.props.concordanceState.annot,
            selectedGroup: this.state.selectedGroup
          })
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
      //console.log("concordance graph state: ", this.state.data);

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
            this.drawBar(sorted_data[i], y_val, i);
            y_val = y_val + y_interval;
        }
        //var se = d3.select("#".concat(this.state.selectedGroup)).attr("opacity", 0.7);
        //plot chart
        if(this.state.selectedGroup == undefined)
        {
          /*const signature_name = sorted_data[0]["signature"];
          const concordance_value = sorted_data[0]["concordance"];
          const color = sorted_data[0]["color"];
          const jVal = sorted_data[0]["junctionOnly"];
          const j_cVal = sorted_data[0]["junctionAndDirection"];
          const totalC = sorted_data[0]["totalAmount"];

          var homeKey = S.homeSignature.name;
          homeKey = homeKey.replace('_TCGA', '');
          homeKey = homeKey.replace('psi_', '');
          homeKey = homeKey.replace('_', ' ');
          homeKey = homeKey.replace('_vs_others', '');
          if(homeKey.length > 25)
          {
              homeKey = homeKey.substring(0, 25);
              homeKey = homeKey.concat("...");
          }

          //make hollow rect
          var inputKey = signature_name;
          inputKey = inputKey.replace('_tcga', '');
          inputKey = inputKey.replace('hnscc', '');
          inputKey = inputKey.replace('psi_', '');
          inputKey = inputKey.replace('_', ' ');
          inputKey = inputKey.replace('_vs_others', '');
          if(inputKey.length > 30)
          {
              inputKey = inputKey.substring(0, 30);
              inputKey = inputKey.concat("...");
          }

          var cur_id = homeKey.concat(inputKey).concat(y_start.toString()).concat("_id");
          var pretg = d3.select(document.getElementById(cur_id));
          var dataSend = {};
          var toSendInputKey = pretg.attr("inputKey");
          toSendInputKey = utilityCleanSignatureName(toSendInputKey);
          dataSend.homeSignature = pretg.attr("homeKey");
          dataSend.comparedSignature = toSendInputKey;
          dataSend.homeCount = S.homeSignature.count;
          dataSend.comparedCount = totalC;
          dataSend.commonCount = j_cVal;
          dataSend.comparedOriginal = signature_name;
          dataSend.homeOriginal = S.homeSignature;
          dataSend.cancerName = S.cancerName.concat("_TCGA");
          dataSend.annot = S.annot;
          //console.log("concordance clicked...", homeKey, inputKey);
          //retrieveDataForVenn(parent.props, signature_name, S.homeSignature);
          parent.setState({
            selectedGroup: pretg.attr("id")
          })
          parent.props.setVennState({data: dataSend});*/
        }
      }
      else
      {
        const newDiv = document.createElement("h5");

        // and give it some content
        const newContent = document.createTextNode("Select a signature from the graph on the left.");

        // add the text node to the newly created div
        newDiv.appendChild(newContent);
        document.getElementById("concordanceDiv").appendChild(newDiv);
        /*var imgElem = document.createElement("img");
        imgElem.src = loadingGif;
        imgElem.width="200";
        imgElem.height="200";
        // add the text node to the newly created div
        document.getElementById("concordanceDiv").appendChild(imgElem);*/
      }
      return(
        null
      );
    }

  }

  export default SetConcordanceGraph;
