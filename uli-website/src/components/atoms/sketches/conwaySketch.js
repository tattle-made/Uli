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
      conwayCols = Math.floor(p.width / step);
      conwayRows = Math.floor(p.height / step);
      
      conwayGrid = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(0));
      conwayNextGrid = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(0));
      conwayAnimGrid = new Array(conwayCols).fill(0).map(() => new Float32Array(conwayRows));
      
      // Spawn two starting flowers (left and right)
      let leftCol = Math.floor(conwayCols * 0.25);
      let rightCol = Math.floor(conwayCols * 0.75);
      let midRow = Math.floor(conwayRows * 0.5);
      let flowerPattern = [[0,-1], [-1,0], [0,0], [1,0], [0,1]];
      
      for(let pt of flowerPattern) {
        let lcx = (leftCol + pt[0] + conwayCols) % conwayCols;
        let lcy = (midRow + pt[1] + conwayRows) % conwayRows;
        conwayGrid[lcx][lcy] = 1;
        
        let rcx = (rightCol + pt[0] + conwayCols) % conwayCols;
        let rcy = (midRow + pt[1] + conwayRows) % conwayRows;
        conwayGrid[rcx][rcy] = 1;
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
        let flowerPattern = [[0,-1], [-1,0], [0,0], [1,0], [0,1]];
        for(let pt of flowerPattern) {
            let cx = (mouseCol + pt[0] + conwayCols) % conwayCols;
            let cy = (mouseRow + pt[1] + conwayRows) % conwayRows;
            conwayGrid[cx][cy] = 1;
        }
      }
    }
    wasDraggingConway = iRef.isDragging;

    if (p.frameCount % 30 === 1 || !cachedPushEls) {
      cachedPushEls = document.querySelectorAll(".push-globe");
    }
    cachedPushEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      
      const localLeft = r.left - containerRect.left;
      const localRight = r.right - containerRect.left;
      const localTop = r.top - containerRect.top;
      const localBottom = r.bottom - containerRect.top;
      
      const padding = Math.max(30, s.pushRadius * 0.5); 
      
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

    p.push();
    if (s.conwayMultiColor) p.colorMode(p.HSL, 360, 100, 100, 255);

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    
    const rC = parseInt(s.conwayColor.slice(1, 3), 16) || 0;
    const gC = parseInt(s.conwayColor.slice(3, 5), 16) || 0;
    const bC = parseInt(s.conwayColor.slice(5, 7), 16) || 0;
    
    for (let i = 0; i < conwayCols; i++) {
      for (let j = 0; j < conwayRows; j++) {
        
        if (s.conwaySmooth) {
          conwayAnimGrid[i][j] += (conwayGrid[i][j] - conwayAnimGrid[i][j]) * 0.15;
        } else {
          conwayAnimGrid[i][j] = conwayGrid[i][j];
        }
        
        let animVal = conwayAnimGrid[i][j];
        
        if (animVal > 0.01) {
          if (s.conwayMultiColor) {
            let hue = (i * 12 + j * 6 + p.frameCount * 0.5) % 360;
            p.fill(hue, 80, 65, animVal * s.alpha);
          } else {
            p.fill(rC, gC, bC, animVal * s.alpha);
          }
          
          if (s.conwaySmooth && animVal < 0.99) {
            p.textSize(size * 1.5 * (0.5 + animVal * 0.5));
          } else {
            p.textSize(size * 1.5);
          }
          
          p.text('✿', i * step + size/2, j * step + size/2);
        }
      }
    }

    // 1. Find Overlay Graph Sites
    if (s.conwayMapType !== 'none') {
       let rawSites = [];
       let visited = new Array(conwayCols).fill(0).map(() => new Array(conwayRows).fill(false));
       
       for (let i = 0; i < conwayCols; i++) {
         for (let j = 0; j < conwayRows; j++) {
           if (conwayGrid[i][j] === 1 && !visited[i][j]) {
             let stack = [[i, j]];
             visited[i][j] = true;
             let count = 0;
             let sumX = 0;
             let sumY = 0;
             
             while (stack.length > 0) {
               let pt = stack.pop();
               let cx = pt[0], cy = pt[1];
               count++;
               sumX += cx;
               sumY += cy;
               
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
             
             if (s.conwayMapType === 'voronoi') {
                if (count > 0 && count <= (s.voronoiGridSize || 9)) { 
                   rawSites.push({ x: sumX / count, y: sumY / count });
                }
             } else if (s.conwayMapType === 'treemap') {
                if (count >= (s.treemapMinSize || 4)) {
                   rawSites.push({ x: sumX / count, y: sumY / count });
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
               activeSites.push({ x: ns.x, y: ns.y, tx: ns.x, ty: ns.y, matched: true });
           }
       }
       
       for (let i = activeSites.length - 1; i >= 0; i--) {
           let a = activeSites[i];
           if (!a.matched) {
               activeSites.splice(i, 1);
           } else {
               a.x += (a.tx - a.x) * 0.15;
               a.y += (a.ty - a.y) * 0.15;
           }
       }
       
       let sites = activeSites;

       // 2. Map ownership and draw boundary
       if (sites.length > 0) {
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
             let ownership = new Array(conwayCols).fill(0).map(() => new Int32Array(conwayRows));
             for (let i = 0; i < conwayCols; i++) {
               for (let j = 0; j < conwayRows; j++) {
                  let minDist = Infinity;
                  let closestSite = -1;
                  for (let s = 0; s < sites.length; s++) {
                     let dx = i - sites[s].x;
                     let dy = j - sites[s].y;
                     let dSq = dx*dx + dy*dy;
                     if (dSq < minDist) {
                        minDist = dSq;
                        closestSite = s;
                     }
                  }
                  ownership[i][j] = closestSite;
               }
             }
             for (let i = 0; i < conwayCols; i++) {
               for (let j = 0; j < conwayRows; j++) {
                  let myOwner = ownership[i][j];
                  if (i < conwayCols - 1 && ownership[i+1][j] !== myOwner) {
                     p.line(i * step + step, j * step, i * step + step, j * step + step);
                  }
                  if (j < conwayRows - 1 && ownership[i][j+1] !== myOwner) {
                     p.line(i * step, j * step + step, i * step + step, j * step + step);
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
          
          p.drawingContext.setLineDash([]); 
          p.drawingContext.restore();
          p.pop();
       }
    }

    p.pop();
  };
};
