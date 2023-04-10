import * as d3 from 'd3';


class SetVennDiagram extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        input: null,
      };
    }

    componentDidMount() { 
        createVennDiagram();
    }

    render()
    {
      return(
        null
      );
    }
}

function createVennDiagram() {
    const r1 = 70;
    const r2 = 70;
    const width = 267;
    const height = 300;

    // Set the dimensions and margins of the diagram
  
    // Create the SVG container
    const svg = d3.select('#overlapDiv')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    svg.append("text")
      .attr("x", 133)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", 18.5)
      .style("opacity", 1.0)
      .attr("fill", "black")
      .text("Overlapping Events");
    
    // Create the circle
    svg.append('circle')
        .attr('cx', 85)
        .attr('cy', 135)
        .attr('r', r1)
        .attr('fill', "blue")
        .attr('opacity', 0.5);

    // Create the circle
    svg.append('circle')
        .attr('cx', 172)
        .attr('cy', 135)
        .attr('r', r2)
        .attr('fill', "#d3ce3c")
        .attr('opacity', 0.5);

}
  
// Call the function with the body selector and data
export default SetVennDiagram;