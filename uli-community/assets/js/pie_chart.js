import * as d3 from "d3";

export function drawPieChart() {
  const container = document.querySelector("#pie-chart");
  if (!container || !container.dataset.severity) return;

  let data = JSON.parse(container.dataset.severity);

  // Filter out invalid/empty labels
  data = data.filter(d => d.label && d.label.trim() !== "");
  if (!data || data.length === 0) return;

  d3.select("#pie-chart").select("svg").remove();

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const size = Math.min(containerWidth, containerHeight);
  const radius = size / 2;

  const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${size} ${size}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${size / 2}, ${size / 2})`);

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
    .attr("fill", d => color(d.data.label) || "#cccccc")
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  svg.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", `${Math.max(10, radius * 0.08)}px`)
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
        .style("font-size", `${Math.max(8, radius * 0.07)}px`)
        .style("fill", "#555")
        .text(`(${d.data.count})`);
    });
}
