import * as d3 from "d3";

// Circle-packing layout: pack() computes exact, non-overlapping positions in
// one pass (no physics to tune), so clusters and their words nest naturally.
//
// Labels are counter-scaled against the zoom transform (via their own
// `scale(1/k)`) so their on-screen pixel size stays constant instead of
// growing/shrinking with the circles. Whether a word is shown is decided
// each zoom tick by comparing its (constant) pixel width against its
// circle's current on-screen diameter — so words hidden at the overview
// reliably become readable once you've zoomed in far enough to fit them,
// instead of the fit ratio being invariant to zoom (the old bug).
const LEAF_FONT_PX = 11;
const CLUSTER_FONT_PX = 12;

export function drawClusterPack() {
  const container = document.querySelector("#cluster-bubbles");
  if (!container || !container.dataset.clusters) return;

  const clusters = JSON.parse(container.dataset.clusters);
  if (!clusters || clusters.length === 0) return;

  d3.select("#cluster-bubbles").select("svg").remove();

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 700;

  const data = {
    name: "root",
    children: clusters.map(c => ({
      name: c.cluster,
      children: c.words.map(word => ({ name: word, value: 1 })),
    })),
  };

  const root = d3.hierarchy(data).sum(d => d.value);
  d3.pack()
    .size([width, height])
    .padding(d => (d.depth === 0 ? 20 : 4))(root);

  const color = d3.scaleOrdinal(d3.schemeTableau10).domain(clusters.map(c => c.cluster));

  const svg = d3.select("#cluster-bubbles")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("cursor", "grab");

  const g = svg.append("g");

  const clusterG = g.selectAll("g.cluster")
    .data(root.children || [])
    .enter()
    .append("g")
    .attr("class", "cluster")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  clusterG.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => color(d.data.name))
    .attr("fill-opacity", 0.06)
    .attr("stroke", d => color(d.data.name))
    .attr("stroke-width", 1.5);

  // Centered inside the cluster's own circle, small and dim, so it reads as
  // context rather than competing with the word bubbles.
  const clusterLabel = clusterG.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.32em")
    .style("font-size", `${CLUSTER_FONT_PX}px`)
    .style("font-weight", "700")
    .style("fill", d => color(d.data.name))
    .style("opacity", 0.4)
    .style("pointer-events", "none")
    .text(d => (d.data.name === "unclustered" ? "Unclustered" : `#${d.data.name}`));

  const leaf = g.selectAll("g.leaf")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "leaf")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  leaf.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => color(d.parent.data.name))
    .attr("fill-opacity", 0.85)
    .attr("stroke", "white")
    .attr("stroke-width", 1);

  leaf.append("title").text(d => `${d.data.name} (cluster ${d.parent.data.name})`);

  const leafLabel = leaf.append("text")
    .attr("text-anchor", "middle")
    .style("font-size", `${LEAF_FONT_PX}px`)
    .style("fill", "#1f2937")
    .style("pointer-events", "none");

  // Multi-word labels wrap one word per line, centered vertically, instead
  // of being hidden just because the full phrase is too wide for one line.
  // Measure the widest line's constant pixel width once; used every zoom
  // tick to decide whether it currently fits inside its on-screen circle.
  const LINE_HEIGHT_EM = 1.05;
  leafLabel.each(function (d) {
    const words = d.data.name.split(/\s+/).filter(Boolean);
    const textEl = d3.select(this);
    const startDy = -((words.length - 1) / 2) * LINE_HEIGHT_EM;

    words.forEach((word, i) => {
      textEl.append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? `${startDy}em` : `${LINE_HEIGHT_EM}em`)
        .text(word);
    });

    d.textWidthPx = d3.max(this.querySelectorAll("tspan"), tspan => tspan.getComputedTextLength());
    d.textHeightPx = words.length * LINE_HEIGHT_EM * LEAF_FONT_PX;
  });

  // A label is allowed to overflow its own bubble a bit rather than being
  // hidden outright — otherwise a long word in a small bubble can end up
  // with nothing shown at any zoom level, which reads as broken rather than
  // as "zoom in more". 1.6 means up to ~30% overflow past each edge.
  const OVERFLOW_ALLOWANCE = 1.6;

  const zoom = d3.zoom()
    .scaleExtent([0.5, 24])
    .on("zoom", event => {
      const { transform } = event;
      g.attr("transform", transform);
      const k = transform.k;
      const inv = 1 / k;

      clusterLabel.attr("transform", `scale(${inv})`);

      leafLabel
        .attr("transform", `scale(${inv})`)
        .style("display", d => {
          const diameter = 2 * d.r * k * OVERFLOW_ALLOWANCE;
          return d.textWidthPx <= diameter && d.textHeightPx <= diameter ? null : "none";
        });
    })
    .on("start", () => svg.style("cursor", "grabbing"))
    .on("end", () => svg.style("cursor", "grab"));

  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  const resetButton = document.getElementById("cluster-bubbles-reset");
  if (resetButton) {
    resetButton.onclick = () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
  }
}
