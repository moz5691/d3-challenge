// @TODO: YOUR CODE HERE!

// if the SVG area isn't empty when the browser loads, remove it
// and replace it with a resized version of the chart
const svgArea = d3.select('body').select('svg');
if (!svgArea.empty()) {
  svgArea.remove();
}

const svgWidth = 800;
const svgHeight = 600;

const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;

// append svg and group
const svg = d3.select('#scatter')
  .append('svg')
  .attr('height', svgHeight)
  .attr('width', svgWidth);

const chartGroup = svg.append('g').attr(
  'transform', `translate(${margin.left}, ${margin.top})`);

// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh

d3.csv('assets/data/data.csv')
  .then(data => {
    data.forEach(d => {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
      d.smokes = +d.smokes;
      d.age = +d.age;
      console.log(d.poverty, d.healthcare);
    });

    const xScale =
      d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty) * 0.9, d3.max(data, d => d.poverty) * 1.1])
      .range([0, width])

    const yScale =
      d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare) * 1.1])
      .range([height, 0])

    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))

    chartGroup.append('g')
      .call(d3.axisLeft(yScale))

    chartGroup.append('text')
      .attr('transform', `translate(${width/2}, ${height + margin.bottom})`)
      .style('text-anchor', 'middle')
      .text('In Poverty(%)')

    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 1.5))
      .attr('dy', '1em')
      .text('Lack of Healthcare(%)')


    const toolTip = d3.select('#scatter')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style("background-color", "yellow")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")


    const toolTipMouseover = function (d) {
      toolTip.transition()
        .duration(200)
        .style('opacity', 0)
    }

    const toolTipMousemove = function (d) {
      toolTip
        .html(`<div> 
        <p>Proverty ${d.poverty}%</p>
        <p>Healthcare: ${d.healthcare}%</p>
        </div>
        `)
        .style("left", (d3.event.pageX - 40) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.event.pageY - 40) + "px")
        .style('opacity', .8)
    }

    const toolTipMouseleave = function (d) {
      toolTip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }


    const circlesGroup = chartGroup.selectAll('dot')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${xScale(d.poverty)}, ${yScale(d.healthcare)})`)


    circlesGroup.append('circle')
      .attr('r', '12')
      .attr('stroke', 'black')
      .attr('fill', 'teal')
      .on('mouseover', toolTipMouseover)
      .on('mousemove', toolTipMousemove)
      .on('mouseleave', toolTipMouseleave)

    circlesGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', 10)
      .attr('opacity', 1)
      .attr('fill', 'white')
      .attr('stroke-width', 1)
      .text(d => d.abbr)

  })
  .catch(err => console.log(err))