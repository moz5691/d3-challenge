import {labels} from './labels.js';

const svgArea = d3.select('body').select('svg');
if (!svgArea.empty()) {
  svgArea.remove();
}

const svgWidth = 900;
const svgHeight = 600;

const margin = {
  top: 40,
  right: 40,
  bottom: 90,
  left: 100
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

let chosenXAxis = 'poverty';
let chosenYAxis = 'healthcare';

// xSCale
const xScale =
    function(data, chosenXAxis) {
  return d3.scaleLinear()
      .domain([
        d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width])
}

// yScale
const yScale =
    function(data, chosenYAxis) {
  return d3.scaleLinear()
      .domain([0, d3.max(data, d => d[chosenYAxis]) * 1.1])
      .range([height, 0])
}

const renderXAxis =
    function(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition().duration(500).call(bottomAxis)
  return xAxis;
}

const renderYAxis =
    function(newYScale, yAxis) {
  const leftAxis = d3.axisLeft(newYScale);
  yAxis.transition().duration(500).call(leftAxis)

  return yAxis;
}

const renderCircle =
    function(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
      .duration(500)
      .attr('cx', d => newXScale(d[chosenXAxis]))
      .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

const renderText =
    function(textsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  textsGroup.transition()
      .duration(500)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

  return textsGroup;
}

const labelsGroup = chartGroup.append('g').attr(
    'transform', `translate(${width / 2}, ${height + 20})`);


labelsGroup.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('transform', d => d.xAxis ? 'rotate(0)' : 'rotate(-90)')
    .attr('x', d => d.xAxis ? 0 : (margin.left) * 2.5)
    .attr('y', (d, i) => d.xAxis ? 20 * (i + 1) : (0 - (height - 20 * (6 - i))))
    .attr('value', d => d.value)
    .attr('xAxis', d => d.xAxis)
    .attr('class', d => d.value)
    .text(d => d.label)
    .classed('inactive', d => d.inactive)
    .classed('active', d => d.active)


const chooseXLabel =
    function(chosenLabel) {
  const xLabels = ['.poverty', '.age', '.income'];
  xLabels.forEach(label => {
    d3.select(label).classed('inactive', true).classed('active', false);
  })
  d3.select(`.${chosenLabel}`)
      .classed('inactive', false)
      .classed('active', true);
}

const chooseYLabel =
    function(chosenLabel) {
  const yLabels = ['.obesity', '.smokes', '.healthcare'];
  yLabels.forEach(label => {
    d3.select(label).classed('inactive', true).classed('active', false);
  })
  d3.select(`.${chosenLabel}`)
      .classed('inactive', false)
      .classed('active', true);
}

    d3.csv('assets/data/data.csv')
        .then(data => {
          data.forEach(d => {
            d.poverty = +d.poverty;
            d.age = +d.age;
            d.income = +d.income;
            d.healthcare = +d.healthcare;
            d.smokes = +d.smokes;
            d.obesity = +d.obesity;
          });


          let x = xScale(data, chosenXAxis);
          let y = yScale(data, chosenYAxis);

          let xAxis = chartGroup.append('g')
                          .attr('transform', `translate(0, ${height})`)
                          .call(d3.axisBottom(x))

          let yAxis = chartGroup.append('g').call(d3.axisLeft(y))

          const toolTip =
              d3.select('#scatter').append('div').attr('class', 'tooltip')

          const toolTipMouseOver =
              function(d) {
            const xUnit = chosenXAxis === 'poverty' ? '%' : '';
            toolTip
                .html(`${d.state} <br/>
                      ${chosenXAxis}: ${d[chosenXAxis]}${xUnit}<br/>
                      ${chosenYAxis}: ${d[chosenYAxis]}%
                `)
                .style('left', (d3.event.pageX - 40) + 'px')
                .style('top', (d3.event.pageY - 40) + 'px')
                .style('opacity', .8)
          }

          const toolTipMouseOut =
              function(d) {
            toolTip.transition().duration(200).style('opacity', 0)
          }

          let circlesGroup = chartGroup.selectAll('circle.data')
                                 .data(data)
                                 .join('circle')
                                 .classed('data', true)
                                 .attr('cx', d => x(d[chosenXAxis]))
                                 .attr('cy', d => y(d[chosenYAxis]))
                                 .attr('r', '15')
                                 .attr('stroke', 'black')
                                 .attr('fill', 'teal')
                                 .on('mouseover', toolTipMouseOver)
                                 .on('mouseout', toolTipMouseOut)

          //  https://stackoverflow.com/questions/19182775/d3-data-skipping-the-first-row-of-data
          let textsGroup = chartGroup.selectAll('text.abbr')
                               .data(data)
                               .enter()
                               .append('text')
                               .classed('abbr', true)
                               .attr('x', d => x(d[chosenXAxis]))
                               .attr('y', d => y(d[chosenYAxis]))
                               .attr('text-anchor', 'middle')
                               .attr('alignment-baseline', 'middle')
                               .style('font-size', 10)
                               .attr('opacity', 1)
                               .attr('fill', 'yellow')
                               .attr('stroke-width', 1)
                               .text(d => d.abbr)


          labelsGroup.selectAll('text').on('click', function() {
            const value = d3.select(this).attr('value');
            const isXAxis = d3.select(this).attr('xAxis');
            if (isXAxis === 'true') {
              chosenXAxis = value;
              x = xScale(data, chosenXAxis)
              xAxis = renderXAxis(x, xAxis)
              chooseXLabel(chosenXAxis);
            } else {
              chosenYAxis = value;
              y = yScale(data, chosenYAxis)
              yAxis = renderYAxis(y, yAxis)
              chooseYLabel(chosenYAxis);
            }

            circlesGroup =
                renderCircle(circlesGroup, x, y, chosenXAxis, chosenYAxis)
            textsGroup = renderText(textsGroup, x, y, chosenXAxis, chosenYAxis)
          })
        })
        .catch(err => console.log(err))
    // }