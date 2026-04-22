import React, { useEffect, useRef, useState } from "react";
import { createConwaySketch } from "./sketches/conwaySketch";
// createGlobeSketch is archived for production deployment
// import { createGlobeSketch } from "./sketches/globeSketch";

import { DEFAULT_SKETCH_SETTINGS } from "./sketches/sketchConfig";

const BlueprintBackground = () => {
  const containerRef = useRef(null);

  // Debug UI State - Hidden by default in production
  const [showDebug, setShowDebug] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SKETCH_SETTINGS);

  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Shared interaction state
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

    // Dynamic import for p5 to handle Gatsby SSR
    const loadP5 = async () => {
      if (typeof navigator !== "undefined" && navigator.deviceMemory !== undefined) {
        // Do not load sketch if device memory is less than 6GB
        if (navigator.deviceMemory < 6) {
          console.log(`Device memory is ${navigator.deviceMemory}GB, skipping background sketch to save RAM.`);
          return;
        }
      }

      try {
        const p5Module = await import("p5");
        const p5 = p5Module.default;
        // Load optimized Conway sketch (Globe is archived for deployment)
        const sketch = createConwaySketch(settingsRef, containerRef, interactionRef);
        p5Instance = new p5(sketch, containerRef.current);
      } catch (err) {
        console.error("p5 failed to load:", err);
      }
    };
    loadP5();

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
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1, overflow: "hidden" }} />

      {/* Debug UI Toggle - Only accessible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
          <button onClick={() => setShowDebug(!showDebug)} style={{ background: '#333', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>
      )}

      {/* Debug Panel - Only accessible in development */}
      {process.env.NODE_ENV === 'development' && showDebug && (
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input type="checkbox" checked={settings.conwayMultiColor} onChange={(e) => setSettings({...settings, conwayMultiColor: e.target.checked})} />
              Multicolor Rainbow Mode
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input type="checkbox" checked={settings.conwaySmooth} onChange={(e) => setSettings({...settings, conwaySmooth: e.target.checked})} />
              Smooth Transitions
            </label>

            {/* Region Colors */}
            <div style={{ marginTop: '8px', padding: '8px', background: '#eaeaea', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={settings.conwayColorByRegion} onChange={(e) => setSettings({...settings, conwayColorByRegion: e.target.checked})} />
                Color Flowers By Region
              </label>
              {settings.conwayColorByRegion && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {settings.conwayRegionColors.map((c, i) => (
                    <input key={i} type="color" value={c} onChange={(e) => {
                      const newArr = [...settings.conwayRegionColors];
                      newArr[i] = e.target.value;
                      setSettings({...settings, conwayRegionColors: newArr});
                    }} style={{ width: '30px', height: '20px', padding: 0, cursor: 'pointer', border: '1px solid #ccc' }} />
                  ))}
                </div>
              )}
              <label style={{ display: 'block', marginTop: '12px' }}>Shapes (comma-separated):
                <input type="text" value={Array.isArray(settings.conwayShapes) ? settings.conwayShapes.join(',') : (settings.conwayShapes || '')} onChange={(e) => {
                  setSettings({...settings, conwayShapes: e.target.value});
                }} style={{ width: '100%', padding: '4px', boxSizing: 'border-box', marginTop: '4px' }} />
              </label>
            </div>

            {/* Overlay Map */}
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
                <>
                  <label style={{ display: 'block', marginTop: '4px' }}>Min Cluster Size: {settings.voronoiGridSize}
                    <input type="range" min="2" max="200" value={settings.voronoiGridSize} onChange={(e) => setSettings({...settings, voronoiGridSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <span style={{ fontSize: '10px', color: '#999' }}>Clusters smaller than this are absorbed into nearby regions</span>
                  </label>
                  <label style={{ display: 'block', marginTop: '6px' }}>Max Cells Per Region: {settings.voronoiMaxCells || 80}
                    <input type="range" min="10" max="400" value={settings.voronoiMaxCells || 80} onChange={(e) => setSettings({...settings, voronoiMaxCells: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <span style={{ fontSize: '10px', color: '#999' }}>Each region contains at most this many cells before splitting</span>
                  </label>
                </>
              )}
              {settings.conwayMapType === 'treemap' && (
                <label style={{ display: 'block', marginTop: '4px' }}>Treemap Min Threshold: {settings.treemapMinSize}
                  <input type="range" min="1" max="50" value={settings.treemapMinSize} onChange={(e) => setSettings({...settings, treemapMinSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
                </label>
              )}
              {settings.conwayMapType !== 'none' && (
                <label style={{ display: 'block', marginTop: '4px' }}>Stitch Color:
                  <input type="color" value={settings.voronoiColor} onChange={(e) => setSettings({...settings, voronoiColor: e.target.value})} style={{ width: '100%', height: '30px', cursor: 'pointer' }} />
                </label>
              )}
            </div>

            <p style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>Click the mouse to drop a flower.</p>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
              Globe sketch archived for production bundle optimization.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlueprintBackground;
