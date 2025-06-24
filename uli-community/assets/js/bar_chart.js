import * as d3 from "d3";

export function drawBarChart() {
  const container = document.querySelector("#bar-chart");
  if (!container || !container.dataset.bar) return;

  const data = JSON.parse(container.dataset.bar);
  if (!data || data.length === 0) return;

  d3.select("#bar-chart").select("svg").remove();

  // Get container dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Define margins relative to size
  const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 100,
  };

  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X Scale
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, width])
    .nice();

  // Y Scale
  const y = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, height])
    .padding(0.2);

  // Left axis (labels)
  svg.append("g")
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll("text")
    .style("font-size", `${Math.max(10, height * 0.03)}px`);

  // Bottom axis (values)
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .selectAll("text")
    .style("font-size", `${Math.max(10, height * 0.03)}px`);

  // Bars
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => y(d.label))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", d => x(d.count))
    .attr("fill", "#212121");

  // Value labels on bars
  svg.selectAll("text.bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.count) - 8)
    .attr("y", d => y(d.label) + y.bandwidth() / 2 + 5)
    .attr("text-anchor", "end")
    .style("font-size", `${Math.max(9, height * 0.025)}px`)
    .style("fill", "white")
    .text(d => d.count);
}
