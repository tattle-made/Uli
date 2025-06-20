import * as d3 from "d3";

export function drawWeeklyLineChart() {
  const container = document.querySelector("#weekly-line-chart");
  const data = JSON.parse(container.dataset.weekly);

  if (!data || data.length === 0) return;
  d3.select("#weekly-line-chart").select("svg").remove();

  const margin = { top: 30, right: 30, bottom: 80, left: 50 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#weekly-line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Format dates from ISO strings to readable format like '4 Jun 2025'
  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatDate = d3.timeFormat("%-d %b %Y");

  data.forEach(d => {
    d.date = parseDate(d.week_start_date); // must be YYYY-MM-DD
    d.label = formatDate(d.date);
  });

  const xScale = d3.scalePoint()
    .domain(data.map(d => d.label))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height, 0]);

  const line = d3.line()
    .x(d => xScale(d.label))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#e58224")
    .attr("stroke-width", 3)
    .attr("d", line);

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-40)");

  // Y Axis
  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6));

  // Points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.label))
    .attr("cy", d => yScale(d.count))
    .attr("r", 4)
    .attr("fill", "#212121");
}
