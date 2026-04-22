export const DEFAULT_SKETCH_SETTINGS = {
  // Master Controller
  sketchType: "conway", // 'conway' or 'globe'
  alpha: 255,           // Shared opacity

  // -- Conway Sketch Specifics --
  conwayGridSize: 23,
  conwayGap: 1,
  conwaySpeed: 1,
  conwayColor: "#000000",
  conwayMultiColor: false,
  conwaySmooth: false,
  conwayShapes: "✜,⨳,╬,⣿,❖",

  // -- Spatial Overlay Maps (Conway) --
  conwayMapType: "voronoi", // 'none', 'voronoi', 'treemap'
  voronoiGridSize: 16,
  conwayColorByRegion: true,
  conwayRegionColors: [
    "#a6763f",
    "#24897d",
    "#6570a4",
    "#c6acc9",
    "#aba469",
    "#9c6872"
  ],
  treemapMinSize: 4,
  voronoiColor: "#ffb685",

  // -- Globe Sketch Specifics --
  globeSize: 800,
  textSize: 9,
  density: ".:-=+*#%@",
  baseRotSpeed: 0.002,
  tiltX: -0.49,
  tiltY: -3.14,
  pushRadius: 0,
  pushForce: 46,
  resolution: 35,
  textColor: "#000000",
  hoverRadius: 136,
  hoverChar: "█▉▊▋▌▍▎▏",
  hoverColor: "#FF0000",
  dragSensitivity: 0.005,
  scrollSensitivity: 0.002,
  hoverForce: 15,
  renderWords: false
};
