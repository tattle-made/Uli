export const DEFAULT_SKETCH_SETTINGS = {
  sketchType: 'conway',
  alpha: 255,
  
  // Conway Settings
  conwayGridSize: 10,
  conwayGap: 0,
  conwaySpeed: 1,
  conwayColor: "#000000",
  conwayMultiColor: false,
  conwaySmooth: false,
  conwayShapes: "✜,⨳,╬,⣿,❖,⧻",
  conwayMapType: "voronoi",
  voronoiGridSize: 10,
  voronoiMaxCells: 30,
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

  // ASCII Globe Settings (Archived/Legacy)
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
