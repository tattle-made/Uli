export const DEFAULT_SKETCH_SETTINGS = {
  sketchType: 'conway',
  alpha: 255,
  
  // Conway Settings
  conwayGridSize: 12,
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
    "#ecbe88",
    "#24897d",
    "#5c6bb7",
    "#cd80d6",
    "#948a33",
    "#e97c92"
  ],
  treemapMinSize: 4,
  voronoiColor: "#ffb685"
};
