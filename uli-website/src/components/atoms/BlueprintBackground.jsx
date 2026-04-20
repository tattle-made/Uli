import React, { useEffect, useRef, useState } from "react";

const BlueprintBackground = () => {
  const containerRef = useRef(null);

  // Debug UI State
  const [showDebug, setShowDebug] = useState(false);
  const [settings, setSettings] = useState({
    globeSize: 751,
    textSize: 16,
    density: '.:-=+*#%@',
    alpha: 255,
    baseRotSpeed: 0.001,
    tiltX: 1.73,
    tiltY: 0,
    pushRadius: 0,
    pushForce: 164,
    resolution: 35,
    textColor: '#f08953',
    hoverRadius: 80,
    hoverChar: '█▉▊▋▌▍▎▏'
  });

  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    let p5Instance;
    let mx = -1000;
    let my = -1000;

    if (typeof window !== "undefined") {
      mx = window.innerWidth / 2;
      my = window.innerHeight / 2;
    }

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mx = e.touches[0].clientX;
        my = e.touches[0].clientY;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    // Dynamic import to avoid SSR issues with p5
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (p) => {
        let canvas;
        let cachedGeometry = [];
        let lastRes = -1;
        let lastGlobeSize = -1;

        p.setup = () => {
          // Canvas will just be the size of the container
          const w = containerRef.current ? containerRef.current.clientWidth : p.windowWidth;
          const h = containerRef.current ? containerRef.current.clientHeight : p.windowHeight;
          canvas = p.createCanvas(w, h);
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
          p.stroke(0, 0, 0, 50);
          p.strokeWeight(1);

          // --- ASCII GLOBE ANIMATION ---
          const s = settingsRef.current;
          
          p.push();
          const globeSize = s.globeSize; 
          const res = s.resolution; 

          if (res !== lastRes || globeSize !== lastGlobeSize) {
             cachedGeometry = [];
             for (let lat = 0; lat < Math.PI; lat += Math.PI / res) {
               for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / res) {
                  cachedGeometry.push({
                    x: globeSize * Math.sin(lat) * Math.cos(lon),
                    y: globeSize * Math.sin(lat) * Math.sin(lon),
                    z: globeSize * Math.cos(lat)
                  });
               }
             }
             lastRes = res;
             lastGlobeSize = globeSize;
          }

          const posX = p.width / 2;
          const posY = p.height / 2.2; 

          p.translate(posX, posY);
          p.textFont('monospace');
          p.textSize(s.textSize); 
          p.textAlign(p.CENTER, p.CENTER);
          
          p.fill(p.color(s.textColor + Math.floor(s.alpha).toString(16).padStart(2, '0'))); 
          p.noStroke();

          const density = s.density || ' ';
          
          const rotSpin = p.frameCount * s.baseRotSpeed;
          const rotTiltX = s.tiltX + Math.sin(p.frameCount * 0.001) * 0.1;
          const rotTiltY = s.tiltY + Math.cos(p.frameCount * 0.0012) * 0.1;
          
          const cosSpin = Math.cos(rotSpin);
          const sinSpin = Math.sin(rotSpin);
          const cosTx = Math.cos(rotTiltX);
          const sinTx = Math.sin(rotTiltX);
          const cosTy = Math.cos(rotTiltY);
          const sinTy = Math.sin(rotTiltY);

          // Fetch the container's viewport-relative position to correct for scrolling
          const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };

          // Mouse position relative to center of globe, adjusted for container scroll offset
          const localMouseX = mx - containerRect.left;
          const localMouseY = my - containerRect.top;
          const relMouseX = localMouseX - posX;
          const relMouseY = localMouseY - posY;
          // Setup unified point repellors array
          const repellors = [];

          // DOM Repellors (form smooth pill shapes by creating a line of point repellors)
          const pushEls = document.querySelectorAll(".push-globe");
          pushEls.forEach((el) => {
             const r = el.getBoundingClientRect();
             const localLeft = r.left - containerRect.left;
             const localRight = r.right - containerRect.left;
             const localTop = r.top - containerRect.top;
             const localBottom = r.bottom - containerRect.top;
             
             const width = localRight - localLeft;
             const height = localBottom - localTop;
             
             const cy = localTop + height / 2 - posY;
             
             // Base radius on element height, but make sure it pushes characters far enough
             const repRadius = Math.max(height * 2.5, s.pushRadius * 0.8);
             const repRadiusSq = repRadius * repRadius;
             const repForce = s.pushForce * 1.5; // Slightly stronger than mouse for clarity
             
             // Chain repellors horizontally if the text element is wide
             const numRepellors = Math.max(1, Math.ceil(width / (repRadius * 0.6)));
             const step = width / numRepellors;
             
             for (let i = 0; i < numRepellors; i++) {
                let rx = localLeft + step/2 + i * step - posX;
                repellors.push({ 
                   x: rx, 
                   y: cy, 
                   radiusSq: repRadiusSq, 
                   radius: repRadius, 
                   force: repForce 
                });
             }
          });

          for (let i = 0; i < cachedGeometry.length; i++) {
              let pt = cachedGeometry[i];
              let x = pt.x, y = pt.y, z = pt.z;

              // Spin around poles (Z axis)
              let x1 = x * cosSpin - y * sinSpin;
              let y1 = x * sinSpin + y * cosSpin;
              let z1 = z;

              // Tilt along X axis
              let y2 = y1 * cosTx - z1 * sinTx;
              let z2 = y1 * sinTx + z1 * cosTx;
              let x2 = x1;

              // Tilt along Y axis
              let x3 = x2 * cosTy - z2 * sinTy;
              let z3 = x2 * sinTy + z2 * cosTy;
              let y3 = y2;
              
              if (z3 < -30) continue; // Early culling for pure backface characters

              // Projection (simple orthographic)
              let drawX = x3;
              let drawY = y3;

              // Apply all Repellors
              for (let j = 0; j < repellors.length; j++) {
                  const rep = repellors[j];
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

              // Check Mouse Hover Effect
              let dxMouse = drawX - relMouseX;
              let dyMouse = drawY - relMouseY;
              let isHovered = (dxMouse * dxMouse + dyMouse * dyMouse) < (s.hoverRadius * s.hoverRadius);
              
              // Use Z for "lighting" density
              if (density.length > 0) {
                let char;
                if (isHovered && s.hoverChar) {
                   char = s.hoverChar;
                } else {
                   const dIndex = Math.floor(p.map(z3, -globeSize, globeSize, 0, density.length - 1));
                   char = density[p.constrain(dIndex, 0, density.length - 1)];
                }
                p.text(char, drawX, drawY);
              }
          }
          p.pop();
        };
      };

      p5Instance = new p5(sketch, containerRef.current);
    });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      }
      if (p5Instance) p5Instance.remove();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1, overflow: "hidden" }} />
      
      {/* Debug UI Toggle */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <button onClick={() => setShowDebug(!showDebug)} style={{ background: '#333', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div style={{ position: "fixed", bottom: 60, right: 20, background: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, width: '300px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontFamily: 'monospace' }}>
          <h3 style={{ margin: 0, paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Globe Settings</h3>
          
          <label>Globe Size: {settings.globeSize}
            <input type="range" min="50" max="800" value={settings.globeSize} onChange={(e) => setSettings({...settings, globeSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Text Size: {settings.textSize}
            <input type="range" min="4" max="30" value={settings.textSize} onChange={(e) => setSettings({...settings, textSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Density Chars:
            <input type="text" value={settings.density} onChange={(e) => setSettings({...settings, density: e.target.value})} style={{ width: '100%', padding: '4px' }} />
          </label>

          <label>Alpha (Opacity): {settings.alpha}
            <input type="range" min="0" max="255" value={settings.alpha} onChange={(e) => setSettings({...settings, alpha: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Rotation Speed: {settings.baseRotSpeed}
            <input type="range" min="0" max="0.05" step="0.001" value={settings.baseRotSpeed} onChange={(e) => setSettings({...settings, baseRotSpeed: parseFloat(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Axis Tilt X: {settings.tiltX}
            <input type="range" min="-3.14" max="3.14" step="0.01" value={settings.tiltX} onChange={(e) => setSettings({...settings, tiltX: parseFloat(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Axis Tilt Y: {settings.tiltY}
            <input type="range" min="-3.14" max="3.14" step="0.01" value={settings.tiltY} onChange={(e) => setSettings({...settings, tiltY: parseFloat(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Push Radius: {settings.pushRadius}
            <input type="range" min="0" max="400" value={settings.pushRadius} onChange={(e) => setSettings({...settings, pushRadius: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Push Force: {settings.pushForce}
            <input type="range" min="0" max="300" value={settings.pushForce} onChange={(e) => setSettings({...settings, pushForce: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Hover Radius: {settings.hoverRadius}
            <input type="range" min="0" max="400" value={settings.hoverRadius} onChange={(e) => setSettings({...settings, hoverRadius: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Hover Char:
            <input type="text" value={settings.hoverChar} onChange={(e) => setSettings({...settings, hoverChar: e.target.value})} style={{ width: '100%', padding: '4px' }} />
          </label>

          <label>Grid Density (Resolution): {settings.resolution}
            <input type="range" min="6" max="150" value={settings.resolution} onChange={(e) => setSettings({...settings, resolution: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </label>

          <label>Text Color:
            <input type="color" value={settings.textColor} onChange={(e) => setSettings({...settings, textColor: e.target.value})} style={{ width: '100%', height: '30px' }} />
          </label>
        </div>
      )}
    </>
  );
};

export default BlueprintBackground;
