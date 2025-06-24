import * as d3 from "d3";

export function drawWeeklyLineChart() {
  const container = document.querySelector("#weekly-line-chart");
  if (!container || !container.dataset.weekly) return;

  const data = JSON.parse(container.dataset.weekly);
  if (!Array.isArray(data) || data.length === 0) return;

  d3.select(container).select("svg").remove();

  // Responsive dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const margin = { top: 30, right: 30, bottom: 80, left: 50 };
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Date formatting
  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatDate = d3.timeFormat("%-d %b %Y");

  data.forEach(d => {
    d.date = parseDate(d.week_start_date);
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

  // Draw line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#e58224")
    .attr("stroke-width", 3)
    .attr("d", line);

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .selectAll("text")
    .style("font-size", `${Math.max(9, height * 0.03)}px`)
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-40)");

  // Y Axis
  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6))
    .selectAll("text")
    .style("font-size", `${Math.max(9, height * 0.03)}px`);

  // Data points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.label))
    .attr("cy", d => yScale(d.count))
    .attr("r", Math.max(3, height * 0.015))
    .attr("fill", "#212121");
}
