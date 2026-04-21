export const DEFAULT_SKETCH_SETTINGS = {
  // Master Controller
  sketchType: 'conway', // 'conway' or 'globe'
  alpha: 255,           // Shared opacity
  
  // -- Conway Sketch Specifics --
  conwayGridSize: 15,
  conwayGap: 2,
  conwaySpeed: 25,
  conwayColor: '#1a1a1a',
  conwayMultiColor: false,
  conwaySmooth: true,
  
  // -- Spatial Overlay Maps (Conway) --
  conwayMapType: 'voronoi', // 'none', 'voronoi', 'treemap'
  voronoiGridSize: 9,
  treemapMinSize: 4,
  voronoiColor: '#666666',

  // -- Globe Sketch Specifics --
  globeSize: 800,
  textSize: 9,
  density: '.:-=+*#%@',
  baseRotSpeed: 0.002,
  tiltX: -0.49,
  tiltY: -3.14,
  pushRadius: 0,
  pushForce: 46,
  resolution: 35,
  textColor: '#000000',
  hoverRadius: 136,
  hoverChar: '█▉▊▋▌▍▎▏',
  hoverColor: '#FF0000',
  dragSensitivity: 0.005,
  scrollSensitivity: 0.002,
  hoverForce: 15,
  renderWords: false,
};
