import * as d3 from "d3";

export function drawBarChart() {
  const container = document.querySelector("#bar-chart");
  const data = JSON.parse(container.dataset.bar);

  if (!data || data.length === 0) return;
  d3.select("#bar-chart").select("svg").remove();

  const margin = { top: 20, right: 30, bottom: 50, left: 120 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, width])
    .nice();

  const y = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, height])
    .padding(0.2);

  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => y(d.label))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", d => x(d.count))
    .attr("fill", "#252653");

  svg.selectAll("text.bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.count) - 5)
    .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .style("fill", "white")
    .text(d => d.count);
}
