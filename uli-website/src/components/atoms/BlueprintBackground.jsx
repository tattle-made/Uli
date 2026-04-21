import React, { useEffect, useRef, useState } from "react";
import { createConwaySketch } from "./sketches/conwaySketch";
import { createGlobeSketch } from "./sketches/globeSketch";

import { DEFAULT_SKETCH_SETTINGS } from "./sketches/sketchConfig";

const BlueprintBackground = () => {
  const containerRef = useRef(null);

  // Debug UI State
  const [showDebug, setShowDebug] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SKETCH_SETTINGS);

  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const interactionRef = useRef({ mx: -1000, my: -1000, isDragging: false, targetUserRotX: 0, targetUserRotY: 0, userRotX: 0, userRotY: 0 });

  useEffect(() => {
    let p5Instance;
    let lastClientX = 0;
    let lastClientY = 0;

    if (typeof window !== "undefined" && interactionRef.current.mx === -1000) {
      interactionRef.current.mx = window.innerWidth / 2;
      interactionRef.current.my = window.innerHeight / 2;
    }

    const handleMouseMove = (e) => {
      interactionRef.current.mx = e.clientX;
      interactionRef.current.my = e.clientY;
      if (interactionRef.current.isDragging) {
        const deltaX = e.clientX - lastClientX;
        const deltaY = e.clientY - lastClientY;
        interactionRef.current.targetUserRotY += deltaX * settingsRef.current.dragSensitivity;
        interactionRef.current.targetUserRotX += deltaY * settingsRef.current.dragSensitivity;
        lastClientX = e.clientX;
        lastClientY = e.clientY;
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        interactionRef.current.mx = e.touches[0].clientX;
        interactionRef.current.my = e.touches[0].clientY;
        if (interactionRef.current.isDragging) {
          const deltaX = interactionRef.current.mx - lastClientX;
          const deltaY = interactionRef.current.my - lastClientY;
          interactionRef.current.targetUserRotY += deltaX * settingsRef.current.dragSensitivity;
          interactionRef.current.targetUserRotX += deltaY * settingsRef.current.dragSensitivity;
          lastClientX = interactionRef.current.mx;
          lastClientY = interactionRef.current.my;
        }
      }
    };

    const handleMouseDown = (e) => {
      interactionRef.current.isDragging = true;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      if (typeof document !== "undefined") {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      }
    };

    const handleMouseUp = () => {
      interactionRef.current.isDragging = false;
      if (typeof document !== "undefined") {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        interactionRef.current.isDragging = true;
        lastClientX = e.touches[0].clientX;
        lastClientY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      interactionRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      // Use logical OR with some factor to support trackpads natively or big wheel scrolls reasonably
      interactionRef.current.targetUserRotY -= e.deltaX * settingsRef.current.scrollSensitivity;
      interactionRef.current.targetUserRotX -= e.deltaY * settingsRef.current.scrollSensitivity;
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Dynamic import to avoid SSR issues with p5
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      let sketch;
      if (settingsRef.current.sketchType == 'conway') {
         sketch = createConwaySketch(settingsRef, containerRef, interactionRef);
      } else {
         sketch = createGlobeSketch(settingsRef, containerRef, interactionRef);
      }

      p5Instance = new p5(sketch, containerRef.current);
    });

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("wheel", handleWheel);
      }
      if (p5Instance) p5Instance.remove();
    };
  }, [settings.sketchType]);

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
        <div style={{ position: 'fixed', bottom: 60, right: 20, background: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, width: '320px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>Blueprint Settings</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(settings, null, 2))}
                style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', background: '#ececec', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                Copy JSON
              </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#e0e0e0', padding: '10px', borderRadius: '6px', marginBottom: '4px' }}>
             <strong style={{ fontSize: '14px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Active Sketch</strong>
             <select value={settings.sketchType} onChange={(e) => setSettings({...settings, sketchType: e.target.value})} style={{ width: '100%', padding: '4px' }}>
                <option value="globe">ASCII Globe</option>
                <option value="conway">Conway's Game of Life</option>
             </select>
          </div>

          {settings.sketchType === 'globe' ? (
             <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f5f5f5', padding: '10px', borderRadius: '6px' }}>
                   <strong style={{ fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>1. Appearance</strong>
                   <label>Globe Size: {settings.globeSize}
                     <input type="range" min="50" max="800" value={settings.globeSize} onChange={(e) => setSettings({...settings, globeSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                   <label>Grid Density (Resolution): {settings.resolution}
                     <input type="range" min="6" max="150" value={settings.resolution} onChange={(e) => setSettings({...settings, resolution: parseInt(e.target.value)})} style={{ width: '100%' }} />
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
                   <label>Base Text Color:
                     <input type="color" value={settings.textColor} onChange={(e) => setSettings({...settings, textColor: e.target.value})} style={{ width: '100%', height: '30px', cursor: 'pointer' }} />
                   </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f5f5f5', padding: '10px', borderRadius: '6px' }}>
                   <strong style={{ fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>2. Interaction & Hover</strong>
                   <label>Hover Radius: {settings.hoverRadius}
                     <input type="range" min="0" max="400" value={settings.hoverRadius} onChange={(e) => setSettings({...settings, hoverRadius: parseInt(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                   <label>Hover Char:
                     <input type="text" value={settings.hoverChar} onChange={(e) => setSettings({...settings, hoverChar: e.target.value})} style={{ width: '100%', padding: '4px' }} />
                   </label>
                   <label>Hover Force: {settings.hoverForce}
                     <input type="range" min="0" max="100" value={settings.hoverForce} onChange={(e) => setSettings({...settings, hoverForce: parseInt(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                   <label>Hover Color:
                     <input type="color" value={settings.hoverColor} onChange={(e) => setSettings({...settings, hoverColor: e.target.value})} style={{ width: '100%', height: '30px', cursor: 'pointer' }} />
                   </label>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                     <input type="checkbox" checked={settings.renderWords} onChange={(e) => setSettings({...settings, renderWords: e.target.checked})} />
                     Render Random Words
                   </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f5f5f5', padding: '10px', borderRadius: '6px' }}>
                   <strong style={{ fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>3. Physics & Input</strong>
                   <label>Drag Sensitivity: {settings.dragSensitivity}
                     <input type="range" min="0" max="0.02" step="0.001" value={settings.dragSensitivity} onChange={(e) => setSettings({...settings, dragSensitivity: parseFloat(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                   <label>Scroll Sensitivity: {settings.scrollSensitivity}
                     <input type="range" min="0" max="0.01" step="0.0005" value={settings.scrollSensitivity} onChange={(e) => setSettings({...settings, scrollSensitivity: parseFloat(e.target.value)})} style={{ width: '100%' }} />
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
                   <label>DOM Push Radius: {settings.pushRadius}
                     <input type="range" min="0" max="400" value={settings.pushRadius} onChange={(e) => setSettings({...settings, pushRadius: parseInt(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                   <label>DOM Push Force: {settings.pushForce}
                     <input type="range" min="0" max="300" value={settings.pushForce} onChange={(e) => setSettings({...settings, pushForce: parseInt(e.target.value)})} style={{ width: '100%' }} />
                   </label>
                </div>
             </>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f5f5f5', padding: '10px', borderRadius: '6px' }}>
               <strong style={{ fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Conway Settings</strong>
               <label>Grid Size (px): {settings.conwayGridSize}
                 <input type="range" min="3" max="50" value={settings.conwayGridSize} onChange={(e) => setSettings({...settings, conwayGridSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
               </label>
               <label>Gap Size (px): {settings.conwayGap}
                 <input type="range" min="0" max="15" value={settings.conwayGap} onChange={(e) => setSettings({...settings, conwayGap: parseInt(e.target.value)})} style={{ width: '100%' }} />
               </label>
               <label>Speed (Generations/sec): {settings.conwaySpeed}
                 <input type="range" min="1" max="60" value={settings.conwaySpeed} onChange={(e) => setSettings({...settings, conwaySpeed: parseInt(e.target.value)})} style={{ width: '100%' }} />
               </label>
               <label>Cell Color:
                 <input type="color" value={settings.conwayColor} onChange={(e) => setSettings({...settings, conwayColor: e.target.value})} style={{ width: '100%', height: '30px', cursor: 'pointer' }} />
               </label>
               <label>Alpha (Opacity): {settings.alpha}
                 <input type="range" min="0" max="255" value={settings.alpha} onChange={(e) => setSettings({...settings, alpha: parseInt(e.target.value)})} style={{ width: '100%' }} />
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                 <input type="checkbox" checked={settings.conwayMultiColor} onChange={(e) => setSettings({...settings, conwayMultiColor: e.target.checked})} />
                 Multicolor Rainbow Mode
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                 <input type="checkbox" checked={settings.conwaySmooth} onChange={(e) => setSettings({...settings, conwaySmooth: e.target.checked})} />
                 Smooth Fade Transitions
               </label>
               <div style={{ marginTop: '8px', padding: '8px', background: '#ececec', borderRadius: '4px' }}>
                 <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Overlay Map</strong>
                 <label style={{ display: 'block', marginBottom: '4px' }}>Map Type:
                   <select value={settings.conwayMapType} onChange={(e) => setSettings({...settings, conwayMapType: e.target.value})} style={{ width: '100%', padding: '2px', marginTop: '2px' }}>
                      <option value="none">None</option>
                      <option value="voronoi">Voronoi Mesh</option>
                      <option value="treemap">Treemap (K-D)</option>
                   </select>
                 </label>
                 {settings.conwayMapType === 'voronoi' && (
                    <label style={{ display: 'block' }}>Voronoi Max Items: {settings.voronoiGridSize}
                      <input type="range" min="2" max="100" value={settings.voronoiGridSize} onChange={(e) => setSettings({...settings, voronoiGridSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    </label>
                 )}
                 {settings.conwayMapType === 'treemap' && (
                    <label style={{ display: 'block' }}>Treemap Min Threshold: {settings.treemapMinSize}
                      <input type="range" min="1" max="50" value={settings.treemapMinSize} onChange={(e) => setSettings({...settings, treemapMinSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    </label>
                 )}
                 {settings.conwayMapType !== 'none' && (
                    <label style={{ display: 'block', marginTop: '4px' }}>Stitch Color:
                      <input type="color" value={settings.voronoiColor} onChange={(e) => setSettings({...settings, voronoiColor: e.target.value})} style={{ width: '100%', height: '30px', cursor: 'pointer' }} />
                    </label>
                 )}
               </div>
               <p style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>Click the mouse to drop a flower into the grid.</p>
             </div>
          )}
        </div>
      )}
    </>
  );
};

export default BlueprintBackground;
