export const DEFAULT_SKETCH_SETTINGS = {
  // Master Controller
  sketchType: "conway", // 'conway' or 'globe'
  alpha: 255,           // Shared opacity

  // -- Conway Sketch Specifics --
  conwayGridSize: 32,
  conwayGap: 2,
  conwaySpeed: 1,
  conwayColor: "#000000",
  conwayMultiColor: false,
  conwaySmooth: true,
  conwayShapes: ['✿', '❁', '❀', '❃'],

  // -- Spatial Overlay Maps (Conway) --
  conwayMapType: "voronoi", // 'none', 'voronoi', 'treemap'
  voronoiGridSize: 6,
  conwayColorByRegion: true,
  conwayRegionColors: [
    "#c88437",
    "#24897d",
    "#6570a4",
    "#cd9fd0",
    "#aba469",
    "#8e67a8"
  ],
  treemapMinSize: 4,
  voronoiColor: "#e5a57b",

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
