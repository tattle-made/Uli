import * as d3 from "d3";

export function drawPieChart() {
  const container = document.querySelector("#pie-chart");
  if (!container || !container.dataset.severity) return;

  let data = JSON.parse(container.dataset.severity);

  // Filter out invalid/empty labels
  data = data.filter(d => d.label && d.label.trim() !== "");

  if (!data || data.length === 0) return;

  d3.select("#pie-chart").select("svg").remove();

  const width = 450;
  const height = 450;
  const radius = width / 2;

  const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Color mapping based on severity level
  const color = d3.scaleOrdinal()
    .domain(["low", "medium", "high"])
    .range(["#f2a24a", "#e58224", "#de8821"]); 

  const pie = d3.pie().value(d => d.count);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label) || "#cccccc") // fallback color
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  svg.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .each(function (d) {
      const text = d3.select(this);
      text.append("tspan")
        .attr("x", 0)
        .attr("dy", "0em")
        .text(d.data.label);

      text.append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .style("font-size", "12px")
        .style("fill", "#555")
        .text(`(${d.data.count})`);
    });
}
