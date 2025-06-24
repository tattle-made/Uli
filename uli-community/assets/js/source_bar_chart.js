import * as d3 from "d3";

export function drawSourceBarChart() {
  const container = document.querySelector("#source-bar-chart");
  if (!container || !container.dataset.source) return;

  const data = JSON.parse(container.dataset.source);
  if (!Array.isArray(data) || data.length === 0) return;

  d3.select(container).select("svg").remove();

  // Responsive dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 60,
  };

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

  // Scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.source))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height, 0]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", `${Math.max(10, height * 0.04)}px`)
    .style("text-anchor", "middle");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", `${Math.max(10, height * 0.04)}px`);

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.source))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", "#de8821");

  // Labels on top of bars
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => x(d.source) + x.bandwidth() / 2)
    .attr("y", d => y(d.count) - 6)
    .attr("text-anchor", "middle")
    .style("font-size", `${Math.max(9, height * 0.03)}px`)
    .style("fill", "#333")
    .text(d => d.count);
}
