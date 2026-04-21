export const createGlobeSketch = (settingsRef, containerRef, interactionRef) => (p) => {
  let cachedGeometry = [];
  let lastRes = -1;
  let lastGlobeSize = -1;
  let lastHoverChar = null;

  let cachedPushEls = null;
  let repellorsCache = [];
  let numRepellorsCache = 0;

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
  };

  p.draw = () => {
    p.clear();
    const s = settingsRef.current;
    const iRef = interactionRef.current;

    p.stroke(0, 0, 0, 50);
    p.strokeWeight(1);
    
    p.push();
    const globeSize = s.globeSize; 
    const res = s.resolution; 

    if (res !== lastRes || globeSize !== lastGlobeSize || s.hoverChar !== lastHoverChar) {
       cachedGeometry = [];
       let chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
       let hChars = s.hoverChar || chars;

       for (let lat = 0; lat < Math.PI; lat += Math.PI / res) {
         for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / res) {
            let i = cachedGeometry.length;
            let n = (i * 12345) % 1000;
            let len = 3 + (n % 3);
            let normalWord = '';
            let hoverWord = '';
            
            for(let w=0; w<len; w++) {
                normalWord += chars[(n + w*7) % chars.length];
                hoverWord += hChars[(n + w*7) % hChars.length];
            }

            cachedGeometry.push({
              x: globeSize * Math.sin(lat) * Math.cos(lon),
              y: globeSize * Math.sin(lat) * Math.sin(lon),
              z: globeSize * Math.cos(lat),
              baseWord: normalWord,
              hoverWord: hoverWord
            });
         }
       }
       lastRes = res;
       lastGlobeSize = globeSize;
       lastHoverChar = s.hoverChar;
    }

    const posX = p.width / 2;
    const posY = p.height / 2.2; 

    p.translate(posX, posY);
    p.textFont('monospace');
    p.textSize(s.textSize); 
    p.textAlign(p.CENTER, p.CENTER);
    
    const alphaHex = Math.floor(s.alpha).toString(16).padStart(2, '0');
    const baseFill = s.textColor + alphaHex;
    const hoverFill = s.hoverColor + alphaHex;

    p.fill(baseFill); 
    p.noStroke();

    const density = s.density || ' ';
    
    iRef.userRotX += (iRef.targetUserRotX - iRef.userRotX) * 0.1;
    iRef.userRotY += (iRef.targetUserRotY - iRef.userRotY) * 0.1;

    const rotSpin = p.frameCount * s.baseRotSpeed + iRef.userRotY;
    const rotTiltX = s.tiltX + Math.sin(p.frameCount * 0.001) * 0.1 + iRef.userRotX;
    const rotTiltY = s.tiltY + Math.cos(p.frameCount * 0.0012) * 0.1;
    
    const cosSpin = Math.cos(rotSpin);
    const sinSpin = Math.sin(rotSpin);
    const cosTx = Math.cos(rotTiltX);
    const sinTx = Math.sin(rotTiltX);
    const cosTy = Math.cos(rotTiltY);
    const sinTy = Math.sin(rotTiltY);

    const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
    const localMouseX = iRef.mx - containerRect.left;
    const localMouseY = iRef.my - containerRect.top;
    const relMouseX = localMouseX - posX;
    const relMouseY = localMouseY - posY;

    if (p.frameCount % 30 === 1 || !cachedPushEls) {
       cachedPushEls = document.querySelectorAll(".push-globe");
    }
    
    let repIndex = 0;
    cachedPushEls.forEach((el) => {
       const r = el.getBoundingClientRect();
       if (r.width === 0 || r.height === 0) return; 

       const localLeft = r.left - containerRect.left;
       const localRight = r.right - containerRect.left;
       const localTop = r.top - containerRect.top;
       const localBottom = r.bottom - containerRect.top;
       
       const width = localRight - localLeft;
       const height = localBottom - localTop;
       const cy = localTop + height / 2 - posY;
       
       const repRadius = Math.max(height * 2.5, s.pushRadius * 0.8);
       const repRadiusSq = repRadius * repRadius;
       const repForce = s.pushForce * 1.5; 
       
       const numRepellors = Math.max(1, Math.ceil(width / (repRadius * 0.6)));
       const step = width / numRepellors;
       
       for (let i = 0; i < numRepellors; i++) {
          let rx = localLeft + step/2 + i * step - posX;
          if (repIndex < repellorsCache.length) {
             const rc = repellorsCache[repIndex];
             rc.x = rx; rc.y = cy; rc.radiusSq = repRadiusSq; rc.radius = repRadius; rc.force = repForce;
          } else {
             repellorsCache.push({ x: rx, y: cy, radiusSq: repRadiusSq, radius: repRadius, force: repForce });
          }
          repIndex++;
       }
    });
    numRepellorsCache = repIndex;

    for (let i = 0; i < cachedGeometry.length; i++) {
        let pt = cachedGeometry[i];
        let x = pt.x, y = pt.y, z = pt.z;

        let x1 = x * cosSpin - y * sinSpin;
        let y1 = x * sinSpin + y * cosSpin;
        let z1 = z;

        let x2 = x1;
        let y2 = y1 * cosTx - z1 * sinTx;
        let z2 = y1 * sinTx + z1 * cosTx;

        let x3 = x2 * cosTy + z2 * sinTy;
        let y3 = y2;
        let z3 = -x2 * sinTy + z2 * cosTy;

        if (z3 < -30) continue;

        let drawX = x3;
        let drawY = y3;

        let isHovered = false;

        for (let j = 0; j < numRepellorsCache; j++) {
            const rep = repellorsCache[j];
            let dxRep = drawX - rep.x;
            let dyRep = drawY - rep.y;
            let dSq = dxRep * dxRep + dyRep * dyRep;

            if (dSq < rep.radiusSq && dSq > 0) {
               let d = Math.sqrt(dSq);
               let pushMag = Math.pow((rep.radius - d) / rep.radius, 2) * rep.force;
               let forceRatio = pushMag / d;
               drawX += dxRep * forceRatio;
               drawY += dyRep * forceRatio;
            }
        }

        let dxMouse = drawX - relMouseX;
        let dyMouse = drawY - relMouseY;
        let mouseDSq = dxMouse * dxMouse + dyMouse * dyMouse;
        isHovered = mouseDSq < (s.hoverRadius * s.hoverRadius);
        
        if (isHovered && mouseDSq > 0 && s.hoverForce > 0) {
           let d = Math.sqrt(mouseDSq);
           let pushMag = Math.pow((s.hoverRadius - d) / s.hoverRadius, 2) * s.hoverForce;
           let forceRatio = pushMag / d;
           drawX += dxMouse * forceRatio;
           drawY += dyMouse * forceRatio;
        }
        
        if (density.length > 0) {
          let isHoverColorActive = isHovered && s.hoverColor;
          if (isHoverColorActive) {
            p.fill(hoverFill);
          }

          if (s.renderWords) {
             p.text(isHovered ? pt.hoverWord : pt.baseWord, drawX, drawY);
          } else {
             let char;
             if (isHovered && s.hoverChar) {
                char = s.hoverChar;
             } else {
                const dIndex = Math.floor(p.map(z3, -globeSize, globeSize, 0, density.length - 1));
                char = density[p.constrain(dIndex, 0, density.length - 1)];
             }
             p.text(char, drawX, drawY);
          }

          if (isHoverColorActive) {
            p.fill(baseFill);
          }
        }
    }
    p.pop();
  };
};
