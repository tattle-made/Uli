export const createConwaySketch = (settingsRef, containerRef, interactionRef) => (p) => {
  let conwayGrid = [];
  let conwayNextGrid = [];
  let conwayAnimGrid = [];
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
      
      conwayGrid = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(0));
      conwayNextGrid = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(0));
      conwayAnimGrid = new Array(conwayCols).fill(0).map(() => new Float32Array(conwayRows));
      
      // Spawn complex seeds around the screen
      const spawnPattern = (pat, ox, oy) => {
        for (let pt of pat) {
          let cx = (ox + pt[0] + conwayCols) % conwayCols;
          let cy = (oy + pt[1] + conwayRows) % conwayRows;
          conwayGrid[cx][cy] = 1;
        }
      };

      const GOSPER_GUN = [
        [1, 5], [2, 5], [1, 6], [2, 6], [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9], [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6], [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6], [25, 1], [25, 2], [25, 6], [25, 7], [35, 3], [35, 4], [36, 3], [36, 4]
      ];
      const ACORN = [[1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]];

      // Balanced quadrant-based seeding
      const SYMBOLS = {
        GOSPER_GUN: [
          [1, 5], [2, 5], [1, 6], [2, 6], [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9], [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6], [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6], [25, 1], [25, 2], [25, 6], [25, 7], [35, 3], [35, 4], [36, 3], [36, 4]
        ],
        ACORN: [[1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]],
        FLOWER: [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]],
        GLIDER: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
        PULSAR_HUB: [[2, 0], [3, 0], [4, 0], [0, 2], [5, 2], [0, 3], [5, 3], [0, 4], [5, 4], [2, 5], [3, 5], [4, 5]], // One quadrant of a pulsar
        SHIP: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]]
      };

      const keys = Object.keys(SYMBOLS);

      // 1. Guaranteed Top-Left: Glider Gun
      spawnPattern(SYMBOLS.GOSPER_GUN, Math.floor(p.random(0, conwayCols * 0.15)), Math.floor(p.random(0, conwayRows * 0.15)));
      
      // 2. Guaranteed Mid-Right: Acorn
      spawnPattern(SYMBOLS.ACORN, Math.floor(p.random(conwayCols * 0.6, conwayCols * 0.8)), Math.floor(p.random(conwayRows * 0.3, conwayRows * 0.6)));
      
      // 3. Spawn 8-12 more random patterns from the library across the screen
      const numPatterns = Math.floor(p.random(8, 12));
      for (let i = 0; i < numPatterns; i++) {
          const randKey = keys[Math.floor(p.random(keys.length))];
          const pattern = SYMBOLS[randKey];
          // Skip Gosper Gun for random scatter to avoid overwhelming the screen
          if (randKey === 'GOSPER_GUN' && Math.random() > 0.2) continue;
          
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
        // Generate a slightly different semi-random flower/glider structure every click
        let dynamicPattern = [[0, 0]]; 
        const structureCandidates = [
            [0,-1], [-1,0], [1,0], [0,1],
            [-1,-1], [1,-1], [-1,1], [1,1],
            [0,-2], [0,2], [-2,0], [2,0]
        ];
        
        for (let pt of structureCandidates) {
            if (Math.random() > 0.45) {
                dynamicPattern.push(pt);
            }
        }
        
        for (let pt of dynamicPattern) {
            let cx = (mouseCol + pt[0] + conwayCols) % conwayCols;
            let cy = (mouseRow + pt[1] + conwayRows) % conwayRows;
            conwayGrid[cx][cy] = 1;
        }
      }
    }
    wasDraggingConway = iRef.isDragging;

    if (p.frameCount % 30 === 1 || !cachedPushEls) {
      cachedPushEls = document.querySelectorAll(".push-globe, .clear-sketch");
    }
    cachedPushEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      
      const isTight = el.classList.contains("clear-sketch-tight");
      const localLeft = r.left - containerRect.left;
      const localRight = r.right - containerRect.left;
      const localTop = r.top - containerRect.top;
      const localBottom = r.bottom - containerRect.top;
      
      const padding = isTight ? 8 : Math.max(20, s.pushRadius * 0.5); 
      
      let colStart = Math.max(0, Math.floor((localLeft - padding) / step));
      let colEnd = Math.min(conwayCols - 1, Math.floor((localRight + padding) / step));
      let rowStart = Math.max(0, Math.floor((localTop - padding) / step));
      let rowEnd = Math.min(conwayRows - 1, Math.floor((localBottom + padding) / step));
      
      for(let i=colStart; i<=colEnd; i++) {
        for(let j=rowStart; j<=rowEnd; j++) {
            conwayGrid[i][j] = 0;
        }
      }
    });

    // 1. Generate Overlay Structure (Sites & Ownership)
    let ownership = null;
    let sites = activeSites;
    
    if (s.conwayMapType !== 'none' || s.conwayColorByRegion) {
       let rawSites = [];
       let visited = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(false));
       
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
                const chunkSize = s.voronoiGridSize || 6;
                if (count > 0) {
                   // Subdivide large clusters into chunks, each gets its own centroid
                   let numChunks = Math.max(1, Math.ceil(count / chunkSize));
                   // Spread cells into evenly-sized chunks spatially
                   // Sort cells to get spatial locality in chunks
                   cells.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
                   let chunkLen = Math.ceil(count / numChunks);
                   for (let c = 0; c < numChunks; c++) {
                      let slice = cells.slice(c * chunkLen, (c + 1) * chunkLen);
                      if (slice.length === 0) continue;
                      let sx = slice.reduce((s, pt) => s + pt[0], 0) / slice.length;
                      let sy = slice.reduce((s, pt) => s + pt[1], 0) / slice.length;
                      rawSites.push({ x: sx, y: sy });
                   }
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
           ownership = new Array(conwayCols).fill(0).map(() => new Int32Array(conwayRows).fill(-1));
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
       }
    }

    // 2. Draw Automata Cells
    p.push();
    if (s.conwayMultiColor) p.colorMode(p.HSL, 360, 100, 100, 255);

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    
    const rC = parseInt(s.conwayColor.slice(1, 3), 16) || 0;
    const gC = parseInt(s.conwayColor.slice(3, 5), 16) || 0;
    const bC = parseInt(s.conwayColor.slice(5, 7), 16) || 0;
    
    const offX = (p.width - (conwayCols * step)) / 2;
    const offY = (p.height - (conwayRows * step)) / 2;

    let parsedRGBs = [];
    if (s.conwayColorByRegion) {
        parsedRGBs = (s.conwayRegionColors || []).map(c => ({
            r: parseInt(c.slice(1, 3), 16) || 0,
            g: parseInt(c.slice(3, 5), 16) || 0,
            b: parseInt(c.slice(5, 7), 16) || 0
        }));
        if (parsedRGBs.length === 0) parsedRGBs = [{r: rC, g: gC, b: bC}];
    }
    
    let parsedShapes = [];
    if (typeof s.conwayShapes === 'string') {
        parsedShapes = s.conwayShapes.split(',').map(ss => ss.trim()).filter(ss => ss.length > 0);
    } else if (Array.isArray(s.conwayShapes)) {
        parsedShapes = s.conwayShapes;
    }
    
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
              let hash = (ownerSite.seed || 0) % parsedRGBs.length;
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
                 let hashShape = ((ownerSite.seed || 0) + 7) % parsedShapes.length;
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
       if (cachedPushEls) {
             const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
             cachedPushEls.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return;
                const pad = 20;
                const l = r.left - containerRect.left - pad;
                const right = r.right - containerRect.left + pad;
                const top = r.top - containerRect.top - pad;
                const bottom = r.bottom - containerRect.top + pad;
                
                p.drawingContext.moveTo(l, top);
                p.drawingContext.lineTo(l, bottom);
                p.drawingContext.lineTo(right, bottom);
                p.drawingContext.lineTo(right, top);
                p.drawingContext.closePath();
             });
          }
          p.drawingContext.clip('nonzero');

          p.drawingContext.setLineDash([8, 8]); 
          
          const vColor = s.voronoiColor || '#666666';
          const vr = parseInt(vColor.slice(1, 3), 16) || 0;
          const vg = parseInt(vColor.slice(3, 5), 16) || 0;
          const vb = parseInt(vColor.slice(5, 7), 16) || 0;
          
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
          } else if (s.conwayMapType === 'treemap') {
             const drawKDTree = (pts, x0, y0, x1, y1) => {
                 if (pts.length === 0) return;
                 if (pts.length === 1) {
                     p.rect(x0 * step, y0 * step, (x1 - x0) * step, (y1 - y0) * step);
                     return;
                 }
                 if (x1 - x0 > y1 - y0) {
                     pts.sort((a,b) => a.x - b.x);
                     let mid = Math.floor(pts.length / 2);
                     let splitX = pts[mid].x;
                     if (splitX <= x0 || splitX >= x1) splitX = (x0 + x1) / 2;
                     drawKDTree(pts.slice(0, mid), x0, y0, splitX, y1);
                     drawKDTree(pts.slice(mid), splitX, y0, x1, y1);
                 } else {
                     pts.sort((a,b) => a.y - b.y);
                     let mid = Math.floor(pts.length / 2);
                     let splitY = pts[mid].y;
                     if (splitY <= y0 || splitY >= y1) splitY = (y0 + y1) / 2;
                     drawKDTree(pts.slice(0, mid), x0, y0, x1, splitY);
                     drawKDTree(pts.slice(mid), x0, splitY, x1, y1);
                 }
             };
             drawKDTree(sites, 0, 0, conwayCols, conwayRows);
          }

          // Draw the composite intersection boundary around DOM elements
          // By drawing padded rects with double stroke weight under the inverse clipping mask,
          // the portions of stroke falling *inside* overlapping regions or on the inner edge are clipped out!
          // This perfectly leaves only a 1.5px outer stitched contour around the boolean union of elements.
          if (cachedPushEls) {
             p.strokeWeight(3);
             const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
             cachedPushEls.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return;
                const pad = 20;
                const l = r.left - containerRect.left - pad;
                const right = r.right - containerRect.left + pad;
                const top = r.top - containerRect.top - pad;
                const bottom = r.bottom - containerRect.top + pad;
                p.rect(l, top, right - l, bottom - top);
             });
          }
          
          p.drawingContext.setLineDash([]); 
          p.drawingContext.restore();
          p.pop();
       }

    p.pop();
  };
};
