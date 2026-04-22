export const createConwaySketch = (settingsRef, containerRef, interactionRef) => (p) => {
  // Cached parsed config values for memory optimization
  let cachedShapesStr = null;
  let cachedParsedShapes = [];
  let cachedRegionColorsStr = null;
  let cachedParsedRGBs = [];
  let cachedBaseColorStr = null;
  let cachedBaseColorRGB = {r:0, g:0, b:0};
  let cachedVoronoiColorStr = null;
  let cachedVoronoiColorRGB = {r:150, g:150, b:150};
  let conwayGrid = [];
  let conwayNextGrid = [];
  let conwayAnimGrid = [];
  let visitedGrid = [];
  let ownershipGrid = [];
  let conwayCols = 0;
  let conwayRows = 0;
  let lastConwayGridSize = -1;
  let wasDraggingConway = false;
  let cachedPushEls = null;
  let activeSites = [];

  p.setup = () => {
    const w = containerRef.current ? containerRef.current.clientWidth : p.windowWidth;
    const h = containerRef.current ? containerRef.current.clientHeight : p.windowHeight;
    const canvas = p.createCanvas(w, h);
    canvas.style("display", "block");
    p.noFill();
  };

  p.windowResized = () => {
    if (containerRef.current) {
      p.resizeCanvas(containerRef.current.clientWidth, containerRef.current.clientHeight);
    } else {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
    lastConwayGridSize = -1;
  };

  p.draw = () => {
    p.clear();
    const s = settingsRef.current;
    const iRef = interactionRef.current;
    
    const size = s.conwayGridSize;
    const gap = s.conwayGap;
    const step = size + gap;
    
    if (size !== lastConwayGridSize || conwayCols === 0) {
      conwayCols = Math.ceil(p.width / step) + 1;
      conwayRows = Math.ceil(p.height / step) + 1;
      
      conwayGrid = new Array(conwayCols).fill(0).map(() => new Uint8Array(conwayRows));
      conwayNextGrid = new Array(conwayCols).fill(0).map(() => new Uint8Array(conwayRows));
      conwayAnimGrid = new Array(conwayCols).fill(0).map(() => new Float32Array(conwayRows));
      visitedGrid = new Array(conwayCols).fill(0).map(() => new Uint8Array(conwayRows));
      ownershipGrid = new Array(conwayCols).fill(0).map(() => new Int32Array(conwayRows));
      
      // Spawn complex seeds around the screen
      const spawnPattern = (pat, ox, oy) => {
        for (let pt of pat) {
          let cx = (ox + pt[0] + conwayCols) % conwayCols;
          let cy = (oy + pt[1] + conwayRows) % conwayRows;
          conwayGrid[cx][cy] = 1;
        }
      };

      const SYMBOLS = {
        GOSPER_GUN: [
          [1, 5], [2, 5], [1, 6], [2, 6], [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9], [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6], [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6], [25, 1], [25, 2], [25, 6], [25, 7], [35, 3], [35, 4], [36, 3], [36, 4]
        ],
        ACORN: [[1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]],
        FLOWER: [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]],
        GLIDER: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
        PULSAR_HUB: [[2, 0], [3, 0], [4, 0], [0, 2], [5, 2], [0, 3], [5, 3], [0, 4], [5, 4], [2, 5], [3, 5], [4, 5]],
        SHIP: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]]
      };

      const keys = Object.keys(SYMBOLS);

      // 1. Guaranteed Top-Left: Glider Gun
      spawnPattern(SYMBOLS.GOSPER_GUN, Math.floor(p.random(0, conwayCols * 0.15)), Math.floor(p.random(0, conwayRows * 0.15)));
      
      // 2. Guaranteed Mid-Right: Acorn
      spawnPattern(SYMBOLS.ACORN, Math.floor(p.random(conwayCols * 0.6, conwayCols * 0.8)), Math.floor(p.random(conwayRows * 0.3, conwayRows * 0.6)));
      
      // 3. Spawn 15-20 more random patterns from the library across the screen
      const numPatterns = Math.floor(p.random(15, 20));
      for (let i = 0; i < numPatterns; i++) {
          const randKey = keys[Math.floor(p.random(keys.length))];
          const pattern = SYMBOLS[randKey];
          if (randKey === 'GOSPER_GUN' && Math.random() > 0.15) continue;
          
          let rx = Math.floor(p.random(conwayCols));
          let ry = Math.floor(p.random(conwayRows));
          spawnPattern(pattern, rx, ry);
      }
      
      lastConwayGridSize = size;
    }
    
    if (p.frameCount % Math.max(1, Math.floor(60 / s.conwaySpeed)) === 0) {
      for (let i = 0; i < conwayCols; i++) {
        for (let j = 0; j < conwayRows; j++) {
          let state = conwayGrid[i][j];
          let sum = 0;
          let neighbors = [ [-1,-1], [0,-1], [1,-1], [-1,0], [1,0], [-1,1], [0,1], [1,1] ];
          for (let n = 0; n < neighbors.length; n++) {
            let x = (i + neighbors[n][0] + conwayCols) % conwayCols;
            let y = (j + neighbors[n][1] + conwayRows) % conwayRows;
            sum += conwayGrid[x][y];
          }
          if (state === 0 && sum === 3) conwayNextGrid[i][j] = 1;
          else if (state === 1 && (sum < 2 || sum > 3)) conwayNextGrid[i][j] = 0;
          else conwayNextGrid[i][j] = state;
        }
      }
      let temp = conwayGrid;
      conwayGrid = conwayNextGrid;
      conwayNextGrid = temp;
    }
    
    const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
    const localMouseX = iRef.mx - containerRect.left;
    const localMouseY = iRef.my - containerRect.top;

    let mouseCol = Math.floor(localMouseX / step);
    let mouseRow = Math.floor(localMouseY / step);
    
    if (iRef.isDragging && !wasDraggingConway) {
      if (mouseCol >= 0 && mouseCol < conwayCols && mouseRow >= 0 && mouseRow < conwayRows) {
        // Spawn a large 8x8 semi-random grid around the click point
        for (let dx = -4; dx < 4; dx++) {
          for (let dy = -4; dy < 4; dy++) {
            if (Math.random() > 0.6) {
              let cx = (mouseCol + dx + conwayCols) % conwayCols;
              let cy = (mouseRow + dy + conwayRows) % conwayRows;
              conwayGrid[cx][cy] = 1;
            }
          }
        }
      }
    }
    wasDraggingConway = iRef.isDragging;

    if (p.frameCount % 30 === 1 || !cachedPushEls) {
      cachedPushEls = document.querySelectorAll(".push-globe, .clear-sketch");
    }
    // Compute union bbox of all .clear-sketch elements → treated as one cleared navbar zone
    let navUnion = null;
    cachedPushEls.forEach((el) => {
      if (!el.classList.contains("clear-sketch")) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const lx = r.left - containerRect.left;
      const rx = r.right  - containerRect.left;
      const ty = r.top    - containerRect.top;
      const by = r.bottom - containerRect.top;
      if (!navUnion) { navUnion = { l: lx, r: rx, t: ty, b: by }; }
      else {
        navUnion.l = Math.min(navUnion.l, lx);
        navUnion.r = Math.max(navUnion.r, rx);
        navUnion.t = Math.min(navUnion.t, ty);
        navUnion.b = Math.max(navUnion.b, by);
      }
    });
    if (navUnion) {
      // Clear the full-width strip from top of canvas to bottom of navbar + padding.
      const pad = 14;
      const rowEnd = Math.min(conwayRows - 1, Math.ceil((navUnion.b + pad) / step));
      for (let i = 0; i < conwayCols; i++) {
        for (let j = 0; j <= rowEnd; j++) {
          conwayGrid[i][j] = 0;
          conwayAnimGrid[i][j] = 0;
        }
      }
    }

    // Clear cells individually behind each .push-globe content element
    cachedPushEls.forEach((el) => {
      if (!el.classList.contains("push-globe")) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const pad = 18;
      const lx = r.left  - containerRect.left;
      const rx = r.right - containerRect.left;
      const ty = r.top   - containerRect.top;
      const by = r.bottom- containerRect.top;
      let colStart = Math.max(0, Math.floor((lx - pad) / step));
      let colEnd   = Math.min(conwayCols - 1, Math.ceil((rx + pad) / step));
      let rowStart = Math.max(0, Math.floor((ty - pad) / step));
      let rowEnd   = Math.min(conwayRows - 1, Math.ceil((by + pad) / step));
      for (let i = colStart; i <= colEnd; i++) {
        for (let j = rowStart; j <= rowEnd; j++) {
          conwayGrid[i][j] = 0;
          conwayAnimGrid[i][j] = 0;
        }
      }
    });

    // 1. Generate Overlay Structure (Sites & Ownership)
    let ownership = null;
    let sites = activeSites;
    
    if (s.conwayMapType !== 'none' || s.conwayColorByRegion) {
       let rawSites = [];
       for (let i = 0; i < conwayCols; i++) visitedGrid[i].fill(0);
       let visited = visitedGrid;
       
       for (let i = 0; i < conwayCols; i++) {
         for (let j = 0; j < conwayRows; j++) {
           if (conwayGrid[i][j] === 1 && !visited[i][j]) {
             let stack = [[i, j]];
             visited[i][j] = true;
             let cells = [];
             
             while (stack.length > 0) {
               let pt = stack.pop();
               let cx = pt[0], cy = pt[1];
               cells.push([cx, cy]);
               
               let neighbors = [ [-1,-1], [0,-1], [1,-1], [-1,0], [1,0], [-1,1], [0,1], [1,1] ];
               for (let n of neighbors) {
                 let nx = cx + n[0];
                 let ny = cy + n[1];
                 if (nx >= 0 && nx < conwayCols && ny >= 0 && ny < conwayRows) {
                    if (conwayGrid[nx][ny] === 1 && !visited[nx][ny]) {
                       visited[nx][ny] = true;
                       stack.push([nx, ny]);
                    }
                 }
               }
             }
             
             const count = cells.length;
             
             if (s.conwayMapType === 'voronoi' || s.conwayColorByRegion) {
                // voronoiGridSize = min cells per region before a new Voronoi site is created.
                // Recursive spatial bisection splits the cluster along its longer axis,
                // guaranteeing sub-region centroids are always spatially spread apart.
                const minCellsPerRegion = s.voronoiGridSize || 16;
                
                // voronoiGridSize = min cluster size to create a site (smaller clusters absorbed by nearest region)
                // voronoiMaxCells  = max cells per sub-region leaf (bisect stops here, creates one site)
                const maxCellsPerRegion = s.voronoiMaxCells || 80;

                if (count >= minCellsPerRegion) {
                  const bisect = (pts) => {
                    if (pts.length === 0) return;
                    if (pts.length <= maxCellsPerRegion) {
                      // Leaf chunk: small enough, emit one centroid
                      let sx = 0, sy = 0;
                      for (let pt of pts) { sx += pt[0]; sy += pt[1]; }
                      rawSites.push({ x: sx / pts.length, y: sy / pts.length });
                      return;
                    }
                    let minX = pts[0][0], maxX = pts[0][0], minY = pts[0][1], maxY = pts[0][1];
                    for (let pt of pts) {
                      if (pt[0] < minX) minX = pt[0]; if (pt[0] > maxX) maxX = pt[0];
                      if (pt[1] < minY) minY = pt[1]; if (pt[1] > maxY) maxY = pt[1];
                    }
                    if (maxX - minX >= maxY - minY) {
                      pts.sort((a, b) => a[0] - b[0]);
                    } else {
                      pts.sort((a, b) => a[1] - b[1]);
                    }
                    const mid = Math.floor(pts.length / 2);
                    bisect(pts.slice(0, mid));
                    bisect(pts.slice(mid));
                  };
                  bisect(cells);
                }
                
             } else if (s.conwayMapType === 'treemap') {
                if (count >= (s.treemapMinSize || 4)) {
                   let sx = cells.reduce((s, pt) => s + pt[0], 0) / count;
                   let sy = cells.reduce((s, pt) => s + pt[1], 0) / count;
                   rawSites.push({ x: sx, y: sy });
                }
             }
           }
         }
       }

       if (cachedPushEls) {
          const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
          cachedPushEls.forEach((el) => {
             const r = el.getBoundingClientRect();
             if (r.width === 0 || r.height === 0) return;
             const localLeft = r.left - containerRect.left;
             const localRight = r.right - containerRect.left;
             const localTop = r.top - containerRect.top;
             const localBottom = r.bottom - containerRect.top;
             let cx = (localLeft + localRight) / 2 / step;
             let cy = (localTop + localBottom) / 2 / step;
             rawSites.push({ x: cx, y: cy });
          });
       }

       for (let i = 0; i < activeSites.length; i++) {
          activeSites[i].matched = false;
       }
       for (let ns of rawSites) {
           let minDist = Infinity;
           let match = null;
           for (let a of activeSites) {
               if (a.matched) continue;
               let dx = a.tx - ns.x;
               let dy = a.ty - ns.y;
               let d = dx*dx + dy*dy;
               if (d < minDist) {
                   minDist = d;
                   match = a;
               }
           }
           if (match && minDist < 100) { 
               match.tx = ns.x;
               match.ty = ns.y;
               match.matched = true;
           } else {
               activeSites.push({ 
                   x: ns.x, y: ns.y, 
                   tx: ns.x, ty: ns.y, 
                   seed: Math.floor(Math.random() * 1000000), 
                   matched: true 
               });
           }
       }
       
       for (let i = activeSites.length - 1; i >= 0; i--) {
           let a = activeSites[i];
           if (!a.matched) {
               activeSites.splice(i, 1);
           } else {
               a.x += (a.tx - a.x) * 0.3;
               a.y += (a.ty - a.y) * 0.3;
           }
       }
       
       sites = activeSites;
       
       if (sites.length > 0) {
           for (let i = 0; i < conwayCols; i++) ownershipGrid[i].fill(-1);
           ownership = ownershipGrid;
           for (let i = 0; i < conwayCols; i++) {
             for (let j = 0; j < conwayRows; j++) {
                let minDist = Infinity;
                let closestSite = -1;
                for (let sx = 0; sx < sites.length; sx++) {
                   let dx = i - sites[sx].x;
                   let dy = j - sites[sx].y;
                   let dSq = dx*dx + dy*dy;
                   if (dSq < minDist) {
                      minDist = dSq;
                      closestSite = sx;
                   }
                }
                ownership[i][j] = closestSite;
             }
           }

           // Graph-color sites so adjacent Voronoi regions always differ in color AND shape.
           const numPalette = Math.max(1, (s.conwayRegionColors || []).length);
           const numShapePalette = Math.max(1,
             (typeof s.conwayShapes === 'string'
               ? s.conwayShapes.split(',').filter(x => x.trim()).length
               : (s.conwayShapes || []).length)
           );
           // Build adjacency sets by scanning ownership boundaries
           const adjSets = Array.from({ length: sites.length }, () => new Set());
           for (let i = 0; i < conwayCols; i++) {
             for (let j = 0; j < conwayRows; j++) {
               const a = ownership[i][j];
               if (a < 0) continue;
               if (i + 1 < conwayCols) { const b = ownership[i+1][j]; if (b >= 0 && b !== a) { adjSets[a].add(b); adjSets[b].add(a); } }
               if (j + 1 < conwayRows) { const b = ownership[i][j+1]; if (b >= 0 && b !== a) { adjSets[a].add(b); adjSets[b].add(a); } }
             }
           }
           // Greedy color + shape assignment — no two adjacent sites share the same index
           for (let si = 0; si < sites.length; si++) {
             const usedColors = new Set();
             const usedShapes = new Set();
             for (const nb of adjSets[si]) {
               if (sites[nb]._colorIdx >= 0) usedColors.add(sites[nb]._colorIdx);
               if (sites[nb]._shapeIdx >= 0) usedShapes.add(sites[nb]._shapeIdx);
             }
             // Assign color: prefer the site's own hash, but find the first available to avoid neighbor collision
             let ci = -1;
             let colorOffset = si % numPalette;
             for (let c = 0; c < numPalette; c++) { 
                let checkIdx = (colorOffset + c) % numPalette;
                if (!usedColors.has(checkIdx)) { ci = checkIdx; break; } 
             }
             sites[si]._colorIdx = ci >= 0 ? ci : colorOffset;
             // Assign shape: prefer a hash offset from color, but avoid neighbor collision
             let shi = -1;
             let shapeOffset = (sites[si]._colorIdx + si) % numShapePalette;
             for (let c = 0; c < numShapePalette; c++) {
               const idx = (shapeOffset + c) % numShapePalette;
               if (!usedShapes.has(idx)) { shi = idx; break; }
             }
             sites[si]._shapeIdx = shi >= 0 ? shi : shapeOffset;
           }
        }    }


    // Helper to compute union polygons of axis-aligned rectangles
    const getUnionPolygons = (rects) => {
        let segments = [];
        for (let i = 0; i < rects.length; i++) {
            let r = rects[i];
            let edges = [
                { x1: r.l, y1: r.t, x2: r.r, y2: r.t },
                { x1: r.r, y1: r.t, x2: r.r, y2: r.b },
                { x1: r.r, y1: r.b, x2: r.l, y2: r.b },
                { x1: r.l, y1: r.b, x2: r.l, y2: r.t }
            ];
            for (let edge of edges) {
                let activeParts = [edge];
                for (let j = 0; j < rects.length; j++) {
                    if (i === j) continue;
                    let o = rects[j];
                    let nextParts = [];
                    for (let part of activeParts) {
                        if (part.y1 === part.y2) {
                            let y = part.y1;
                            if (y > o.t && y < o.b) {
                                let eMin = Math.min(part.x1, part.x2), eMax = Math.max(part.x1, part.x2);
                                if (eMax <= o.l || eMin >= o.r) nextParts.push(part);
                                else {
                                    let dir = part.x1 < part.x2 ? 1 : -1;
                                    let ivs = [];
                                    if (eMin < o.l) ivs.push([eMin, Math.min(eMax, o.l)]);
                                    if (eMax > o.r) ivs.push([Math.max(eMin, o.r), eMax]);
                                    for (let iv of ivs) {
                                        if (dir === 1) nextParts.push({ x1: iv[0], y1: y, x2: iv[1], y2: y });
                                        else nextParts.push({ x1: iv[1], y1: y, x2: iv[0], y2: y });
                                    }
                                }
                            } else nextParts.push(part);
                        } else {
                            let x = part.x1;
                            if (x > o.l && x < o.r) {
                                let eMin = Math.min(part.y1, part.y2), eMax = Math.max(part.y1, part.y2);
                                if (eMax <= o.t || eMin >= o.b) nextParts.push(part);
                                else {
                                    let dir = part.y1 < part.y2 ? 1 : -1;
                                    let ivs = [];
                                    if (eMin < o.t) ivs.push([eMin, Math.min(eMax, o.t)]);
                                    if (eMax > o.b) ivs.push([Math.max(eMin, o.b), eMax]);
                                    for (let iv of ivs) {
                                        if (dir === 1) nextParts.push({ x1: x, y1: iv[0], x2: x, y2: iv[1] });
                                        else nextParts.push({ x1: x, y1: iv[1], x2: x, y2: iv[0] });
                                    }
                                }
                            } else nextParts.push(part);
                        }
                    }
                    activeParts = nextParts;
                }
                segments.push(...activeParts);
            }
        }
        let polygons = [];
        let visited = new Set();
        const eps = 0.5;
        const match = (p1, p2) => Math.abs(p1.x - p2.x) < eps && Math.abs(p1.y - p2.y) < eps;
        for (let i = 0; i < segments.length; i++) {
            if (visited.has(i)) continue;
            let poly = [];
            let cur = segments[i];
            visited.add(i);
            poly.push({ x: cur.x1, y: cur.y1 });
            poly.push({ x: cur.x2, y: cur.y2 });
            while (true) {
                let nextIdx = -1;
                for (let j = 0; j < segments.length; j++) {
                    if (!visited.has(j) && match({x: cur.x2, y: cur.y2}, {x: segments[j].x1, y: segments[j].y1})) {
                        nextIdx = j; break;
                    }
                }
                if (nextIdx !== -1) {
                    visited.add(nextIdx);
                    cur = segments[nextIdx];
                    poly.push({ x: cur.x2, y: cur.y2 });
                } else break;
            }
            polygons.push(poly);
        }
        return polygons;
    };

    // 2. Draw Automata Cells
    p.push();
    if (s.conwayMultiColor) p.colorMode(p.HSL, 360, 100, 100, 255);

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    
    if (s.conwayColor !== cachedBaseColorStr) {
        cachedBaseColorStr = s.conwayColor;
        cachedBaseColorRGB = {
            r: parseInt((s.conwayColor || '#000000').slice(1, 3), 16) || 0,
            g: parseInt((s.conwayColor || '#000000').slice(3, 5), 16) || 0,
            b: parseInt((s.conwayColor || '#000000').slice(5, 7), 16) || 0
        };
    }
    const rC = cachedBaseColorRGB.r;
    const gC = cachedBaseColorRGB.g;
    const bC = cachedBaseColorRGB.b;
    
    const offX = (p.width - (conwayCols * step)) / 2;
    const offY = (p.height - (conwayRows * step)) / 2;

    const jStrNames = (s.conwayRegionColors || []).join(',');
    if (jStrNames !== cachedRegionColorsStr) {
        cachedRegionColorsStr = jStrNames;
        cachedParsedRGBs = (s.conwayRegionColors || []).map(c => ({
            r: parseInt((c||"#00").slice(1, 3), 16) || 0,
            g: parseInt((c||"#00").slice(3, 5), 16) || 0,
            b: parseInt((c||"#00").slice(5, 7), 16) || 0
        }));
    }
    let parsedRGBs = cachedParsedRGBs;
    if (s.conwayColorByRegion && parsedRGBs.length === 0) parsedRGBs = [cachedBaseColorRGB];
    
    // Cache shapes
    if (typeof s.conwayShapes === 'string') {
        if (s.conwayShapes !== cachedShapesStr) {
            cachedShapesStr = s.conwayShapes;
            cachedParsedShapes = s.conwayShapes.split(',').map(ss => ss.trim()).filter(ss => ss.length > 0);
        }
    } else if (Array.isArray(s.conwayShapes)) {
        cachedParsedShapes = s.conwayShapes;
    }
    let parsedShapes = cachedParsedShapes;
    
    for (let i = 0; i < conwayCols; i++) {
      for (let j = 0; j < conwayRows; j++) {
        
        if (s.conwaySmooth) {
          conwayAnimGrid[i][j] += (conwayGrid[i][j] - conwayAnimGrid[i][j]) * 0.3;
        } else {
          conwayAnimGrid[i][j] = conwayGrid[i][j];
        }
        
        let animVal = conwayAnimGrid[i][j];
        
        if (animVal > 0.01) {
          if (s.conwayColorByRegion && ownership && ownership[i][j] >= 0) {
              let ownerSite = sites[ownership[i][j]];
              // Use graph-colored index (guaranteed different from all adjacent regions)
              let hash = (ownerSite._colorIdx >= 0 ? ownerSite._colorIdx : (ownerSite.seed || 0)) % parsedRGBs.length;
              let c = parsedRGBs[hash];
              p.fill(c.r, c.g, c.b, animVal * s.alpha);
          } else if (s.conwayMultiColor) {
              let hue = (i * 12 + j * 6 + p.frameCount * 0.5) % 360;
              p.fill(hue, 80, 65, animVal * s.alpha);
          } else {
              p.fill(rC, gC, bC, animVal * s.alpha);
          }
          
          if (s.conwaySmooth && animVal < 0.99) {
            p.textSize(size * 1.5 * (0.2 + animVal * 0.8));
          } else {
            p.textSize(size * 1.5);
          }
          
          let shape = '✿';
          if (parsedShapes.length > 0) {
              if (s.conwayColorByRegion && ownership && ownership[i][j] >= 0) {
                 let ownerSite = sites[ownership[i][j]];
                 // Use graph-colored shape index (guaranteed different from all adjacent regions)
                 let hashShape = (ownerSite._shapeIdx >= 0 ? ownerSite._shapeIdx : ((ownerSite.seed || 0) + 7)) % parsedShapes.length;
                 shape = parsedShapes[hashShape];
              } else {
                 let hashShape = (i * 37 + j * 17) % parsedShapes.length;
                 shape = parsedShapes[hashShape];
              }
          }
          
          p.text(shape, i * step + size/2 + offX, j * step + size/2 + offY);
        }
      }
    }

    // 3. Draw Boundaries
    if (s.conwayMapType !== 'none' && sites.length > 0) {
       p.push();
       
       p.drawingContext.save();
       p.drawingContext.beginPath();
       p.drawingContext.rect(0, 0, p.width, p.height);
        // Clip out the full-width navbar strip from boundary drawing
        if (navUnion) {
          p.drawingContext.rect(0, 0, p.width, navUnion.b + 14);
        }
        // Compute union polygons of .push-globe elements for precise clipping
        if (cachedPushEls) {
          const cRectClip = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
          let pgRects = [];
          cachedPushEls.forEach((el) => {
            if (!el.classList.contains("push-globe")) return;
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              const pad = 18;
              pgRects.push({
                l: r.left - cRectClip.left - pad,
                r: r.right - cRectClip.left + pad,
                t: r.top - cRectClip.top - pad,
                b: r.bottom - cRectClip.top + pad
              });
            }
          });
          const polys = getUnionPolygons(pgRects);
          for (let poly of polys) {
             if (poly.length === 0) continue;
             p.drawingContext.moveTo(poly[0].x, poly[0].y);
             for (let i=1; i<poly.length; i++) {
                p.drawingContext.lineTo(poly[i].x, poly[i].y);
             }
             p.drawingContext.closePath();
          }
        }
        // Using nonzero so overlapping holes or polys don't invert!
        // Wait: The outer rect is clockwise. For nonzero to create holes,
        // the inner polygons must be drawn counter-clockwise!
        // getUnionPolygons creates paths in normal order.
        // If they are clockwise, we need them CCW.
        // Actually, 'evenodd' works PERFECTLY for single union polygons since they have no self-intersections!
        p.drawingContext.clip('evenodd');

          p.drawingContext.setLineDash([8, 8]); 
          
          if (s.voronoiColor !== cachedVoronoiColorStr) {
             cachedVoronoiColorStr = s.voronoiColor;
             cachedVoronoiColorRGB = {
                r: parseInt((s.voronoiColor || '#666666').slice(1, 3), 16) || 150,
                g: parseInt((s.voronoiColor || '#666666').slice(3, 5), 16) || 150,
                b: parseInt((s.voronoiColor || '#666666').slice(5, 7), 16) || 150
             };
          }
          const vr = cachedVoronoiColorRGB.r;
          const vg = cachedVoronoiColorRGB.g;
          const vb = cachedVoronoiColorRGB.b;
          
          p.stroke(vr, vg, vb, 150); 
          p.strokeWeight(1.5);
          p.noFill();

          if (s.conwayMapType === 'voronoi' && sites.length > 1) {
             for (let i = 0; i < conwayCols; i++) {
               for (let j = 0; j < conwayRows; j++) {
                  let myOwner = ownership[i][j];
                  if (i < conwayCols - 1 && ownership[i+1][j] !== myOwner) {
                     p.line(i * step + step + offX, j * step + offY, i * step + step + offX, j * step + step + offY);
                  }
                  if (j < conwayRows - 1 && ownership[i][j+1] !== myOwner) {
                     p.line(i * step + offX, j * step + step + offY, i * step + step + offX, j * step + step + offY);
                  }
               }
             }
          }


          
          p.drawingContext.setLineDash([]); 
          p.drawingContext.restore();
          p.pop();
       }

    // 4. Stitch borders: one horizontal line at navbar bottom + individual rects for content elements
    {
          if (s.voronoiColor !== cachedVoronoiColorStr) {
             cachedVoronoiColorStr = s.voronoiColor;
             cachedVoronoiColorRGB = {
                r: parseInt((s.voronoiColor || '#666666').slice(1, 3), 16) || 150,
                g: parseInt((s.voronoiColor || '#666666').slice(3, 5), 16) || 150,
                b: parseInt((s.voronoiColor || '#666666').slice(5, 7), 16) || 150
             };
          }
          const vr = cachedVoronoiColorRGB.r;
          const vg = cachedVoronoiColorRGB.g;
          const vb = cachedVoronoiColorRGB.b;
       
       p.push();
       p.noFill();
       p.stroke(vr, vg, vb, 200);
       p.strokeWeight(1.5);
       p.drawingContext.setLineDash([8, 8]);

       // Single horizontal stitch line at the bottom of the navbar
       if (navUnion) {
         p.line(0, navUnion.b + 10, p.width, navUnion.b + 10);
       }

       // Draw a continuous dashed union polygon around .push-globe elements
       const cRect2 = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
       let pgRectsStitch = [];
       cachedPushEls.forEach((el) => {
         if (!el.classList.contains("push-globe")) return;
         const r = el.getBoundingClientRect();
         if (r.width > 0 && r.height > 0) {
           const pad = 14;
           pgRectsStitch.push({
             l: r.left - cRect2.left - pad,
             r: r.right - cRect2.left + pad,
             t: r.top - cRect2.top - pad,
             b: r.bottom - cRect2.top + pad
           });
         }
       });
       
       p.strokeJoin(p.ROUND);
       const objPolys = getUnionPolygons(pgRectsStitch);
       for (let poly of objPolys) {
          if (poly.length <= 1) continue;
          p.beginShape();
          for (let pt of poly) {
              p.vertex(pt.x, pt.y);
          }
          p.endShape(p.CLOSE);
       }

       p.drawingContext.setLineDash([]);
       p.pop();
    }

    p.pop();
  };
};
