import * as d3 from "d3";

// Exported function
export function drawPieChart() {
    // Dummy data for pie chart
    const data = [
        { label: "RED", value: 40 },
        { label: "Blue", value: 25 },
        { label: "Yellow", value: 35 },
        { label: "Pink", value: 20 },
        { label: "Green", value: 60 },
        { label: "Black", value: 70 },
        { label: "Purple", value: 90 },
        { label: "Orange", value: 120 }
    ];

    // Size and radius
    const width = 600;
    const height = 600;
    const radius = width / 2;

    // Create SVG container
    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(["#ff9999", "#99ccff", "#ffff99", "#ffb6c1", "#b2d8b2", "#d9d9d9", "#d1b3ff", "#ffd699"]);

    // Create pie layout and arcs
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Draw pie chart slices
    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    // Add labels to slices
    svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .text(d => d.data.label)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px");
}
