import React, { useState, useRef, useEffect } from 'react';
import {
  Ruler, Move, Plus, Trash2, CheckCircle2, AlertTriangle,
  ZoomIn, ZoomOut, RotateCcw, RotateCw, Layers, Eye, ShieldAlert,
  Tag, Sliders, Save, Sparkles, X, ChevronRight, Compass,
  DoorOpen, AppWindow
} from 'lucide-react';
import './FloorPlanReviewOverlay.css';

/**
 * FloorPlanReviewOverlay
 * =======================
 * Interactive Human-in-the-Loop verification tool.
 * Superimposes detected walls, doors, windows, and room polygons directly
 * over the original 2D architectural blueprint with live editing, scale calibration,
 * and topology validation.
 */
export default function FloorPlanReviewOverlay({
  imageUrl,
  buildingModel,
  onModelUpdate,
  onApproveAndGenerate3D,
  onCalibrateScale,
  externalSelectedId = null,
  onSelectElement = null
}) {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 700 });
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'add_wall' | 'calibrate' | 'delete'
  const [selectedElement, setSelectedElement] = useState(null); // { type: 'wall'|'door'|'window'|'room', id, data }
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [showConfidence, setShowConfidence] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showBlueprint, setShowBlueprint] = useState(true);
  
  // Pan & Zoom
  const [scale, setScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Calibration state
  const [calibPointA, setCalibPointA] = useState(null);
  const [calibPointB, setCalibPointB] = useState(null);
  const [showCalibModal, setShowCalibModal] = useState(false);
  const [calibRealDist, setCalibRealDist] = useState('3.0');
  const [calibUnit, setCalibUnit] = useState('m');

  // Wall drawing state
  const [wallStart, setWallStart] = useState(null);
  const [tempWallEnd, setTempWallEnd] = useState(null);

  // Background drawing image object
  const [bgImage, setBgImage] = useState(null);

  // Resize listener to make canvas fill container dynamically
  useEffect(() => {
    const updateSize = () => {
      if (canvasWrapperRef.current) {
        const cw = canvasWrapperRef.current.clientWidth || 1200;
        const ch = canvasWrapperRef.current.clientHeight || 700;
        if (cw > 300 && ch > 300) {
          setCanvasSize({ width: Math.floor(cw), height: Math.floor(ch) });
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setBgImage(img);
    };
  }, [imageUrl]);

  // Undo / Redo history
  const [history, setHistory] = useState([buildingModel]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = (newModel) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newModel);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    onModelUpdate(newModel);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onModelUpdate(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onModelUpdate(next);
    }
  };

  // Sync external 3D selection into 2D overlay
  useEffect(() => {
    if (!externalSelectedId) return;
    const f = buildingModel?.floors?.[0] || {};
    const wall = (f.walls || []).find(w => w.id === externalSelectedId);
    if (wall) { setSelectedElement({ type: 'wall', id: wall.id, data: wall }); return; }
    const door = (f.doors || []).find(d => d.id === externalSelectedId);
    if (door) { setSelectedElement({ type: 'door', id: door.id, data: door }); return; }
    const win = (f.windows || []).find(w => w.id === externalSelectedId);
    if (win) { setSelectedElement({ type: 'window', id: win.id, data: win }); return; }
    const room = (f.rooms || []).find(r => r.id === externalSelectedId);
    if (room) { setSelectedElement({ type: 'room', id: room.id, data: room }); return; }
  }, [externalSelectedId, buildingModel]);

  const selectAndNotify = (elem) => {
    setSelectedElement(elem);
    onSelectElement?.(elem);
  };

  const floor = buildingModel?.floors?.[0] || { walls: [], doors: [], windows: [], rooms: [] };
  const scalePxPerM = buildingModel?.scale_px_per_meter || 80.0;
  const validation = buildingModel?.validation || { is_valid: true, issues: [] };

  // Calculate canonical drawing dimensions (from model metadata or loaded image natural dimensions)
  const dimW = buildingModel?.metadata?.drawing_dimensions_px?.[0] || bgImage?.naturalWidth || bgImage?.width || 1000;
  const dimH = buildingModel?.metadata?.drawing_dimensions_px?.[1] || bgImage?.naturalHeight || bgImage?.height || 650;

  // Convert metric coordinates (centered around 0,0) to Canvas pixels with guaranteed zero-offset alignment
  const mToCanvas = (xm, zm, canvasW, canvasH) => {
    const cx = canvasW / 2;
    const cy = canvasH / 2;
    return {
      x: cx + xm * scalePxPerM,
      y: cy + zm * scalePxPerM
    };
  };

  // Convert Canvas pixels to metric coordinates
  const canvasToM = (px, py, canvasW, canvasH) => {
    const cx = canvasW / 2;
    const cy = canvasH / 2;
    return {
      x: Number(((px - cx) / scalePxPerM).toFixed(3)),
      z: Number(((py - cy) / scalePxPerM).toFixed(3))
    };
  };

  // Auto-fit blueprint image and vectors to canvas on mount, model update, or resize
  useEffect(() => {
    if (!bgImage || !canvasRef.current) return;
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;
    const fitScale = Math.min((cw * 0.90) / dimW, (ch * 0.90) / dimH, 1.0);
    if (fitScale > 0.05 && fitScale < 10) {
      setScale(fitScale);
      setPan({ x: 0, y: 0 });
    }
  }, [bgImage, buildingModel?.id, dimW, dimH, canvasSize.width, canvasSize.height]);

  const handleResetView = () => {
    if (canvasRef.current && dimW && dimH) {
      const cw = canvasRef.current.width;
      const ch = canvasRef.current.height;
      const fitScale = Math.min((cw * 0.90) / dimW, (ch * 0.90) / dimH, 1.0);
      setScale(fitScale > 0.05 ? fitScale : 1.0);
    } else {
      setScale(1.0);
    }
    setPan({ x: 0, y: 0 });
  };

  // ---------------------------------------------------------------------------
  // Canvas Rendering Loop
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Apply Pan & Zoom transformation
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // 1. Draw Original Architectural Blueprint
    if (bgImage && showBlueprint) {
      const dx = (w - dimW) / 2;
      const dy = (h - dimH) / 2;
      ctx.globalAlpha = 1.0;
      ctx.drawImage(bgImage, dx, dy, dimW, dimH);
    }

    ctx.globalAlpha = overlayOpacity;

    // 2. Draw Rooms (Polygons + Text Labels)
    (floor.rooms || []).forEach((room) => {
      if (!room.polygon || room.polygon.length < 3) return;
      ctx.beginPath();
      const first = mToCanvas(room.polygon[0].x, room.polygon[0].z, w, h);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < room.polygon.length; i++) {
        const pt = mToCanvas(room.polygon[i].x, room.polygon[i].z, w, h);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      const isSelected = selectedElement?.type === 'room' && selectedElement?.id === room.id;
      
      // Color fill
      if (isSelected) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
      } else if (showConfidence) {
        ctx.fillStyle = (room.confidence || 0.9) > 0.85 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.3)';
      } else {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.22)';
      }
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#06b6d4' : 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.stroke();

      // Room Center Label
      if (showLabels && room.polygon.length > 0) {
        const avgX = room.polygon.reduce((acc, p) => acc + p.x, 0) / room.polygon.length;
        const avgZ = room.polygon.reduce((acc, p) => acc + p.z, 0) / room.polygon.length;
        const center = mToCanvas(avgX, avgZ, w, h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.name || 'Room', center.x, center.y - 4);

        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${room.area?.toFixed(1) || '0'} m²`, center.x, center.y + 10);
      }
    });

    // 3. Draw Walls
    (floor.walls || []).forEach((wall) => {
      const p1 = mToCanvas(wall.start_point.x, wall.start_point.z, w, h);
      const p2 = mToCanvas(wall.end_point.x, wall.end_point.z, w, h);

      const isSelected = selectedElement?.type === 'wall' && selectedElement?.id === wall.id;
      const thickPx = Math.max(3, (wall.thickness || 0.20) * scalePxPerM);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineCap = 'square';
      ctx.lineWidth = thickPx;

      if (isSelected) {
        ctx.strokeStyle = '#06b6d4';
      } else if (showConfidence) {
        ctx.strokeStyle = (wall.confidence || 0.9) > 0.88 ? '#10b981' : '#f59e0b';
      } else {
        ctx.strokeStyle = wall.wall_type === 'exterior' ? '#0284c7' : '#64748b';
      }
      ctx.stroke();

      // Draw endpoint handles when selected or in edit mode
      if (isSelected || activeTool === 'select') {
        ctx.fillStyle = isSelected ? '#06b6d4' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 5, 0, Math.PI * 2);
        ctx.arc(p2.x, p2.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 4. Draw Doors & Swing Arcs
    (floor.doors || []).forEach((door) => {
      const pos = mToCanvas(door.position.x, door.position.z, w, h);
      const widthPx = (door.width || 0.90) * scalePxPerM;
      const isSelected = selectedElement?.type === 'door' && selectedElement?.id === door.id;

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(door.rotation || 0);

      // Door opening marker
      ctx.strokeStyle = isSelected ? '#06b6d4' : '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-widthPx / 2, 0);
      ctx.lineTo(widthPx / 2, 0);
      ctx.stroke();

      // Swing Arc
      ctx.strokeStyle = isSelected ? '#06b6d4' : 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(-widthPx / 2, 0, widthPx, 0, Math.PI / 2, false);
      ctx.stroke();
      ctx.setLineDash([]);

      // Door Leaf
      ctx.strokeStyle = isSelected ? '#06b6d4' : '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-widthPx / 2, 0);
      ctx.lineTo(-widthPx / 2, widthPx);
      ctx.stroke();

      ctx.restore();
    });

    // 5. Draw Windows (Double Glass Lines)
    (floor.windows || []).forEach((win) => {
      const pos = mToCanvas(win.position.x, win.position.z, w, h);
      const widthPx = (win.width || 1.20) * scalePxPerM;
      const isSelected = selectedElement?.type === 'window' && selectedElement?.id === win.id;

      ctx.strokeStyle = isSelected ? '#06b6d4' : '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pos.x - widthPx / 2, pos.y);
      ctx.lineTo(pos.x + widthPx / 2, pos.y);
      ctx.stroke();

      // Thin inner glass line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pos.x - widthPx / 2, pos.y);
      ctx.lineTo(pos.x + widthPx / 2, pos.y);
      ctx.stroke();
    });

    // 6. Draw temporary wall being drawn
    if (activeTool === 'add_wall' && wallStart && tempWallEnd) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(wallStart.x, wallStart.y);
      ctx.lineTo(tempWallEnd.x, tempWallEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 7. Draw Calibration Points & Distance Line
    if (calibPointA) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(calibPointA.x, calibPointA.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter';
      ctx.fillText('A', calibPointA.x + 8, calibPointA.y - 8);

      if (calibPointB) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(calibPointB.x, calibPointB.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('B', calibPointB.x + 8, calibPointB.y - 8);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(calibPointA.x, calibPointA.y);
        ctx.lineTo(calibPointB.x, calibPointB.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    ctx.restore();
  }, [
    floor, scalePxPerM, selectedElement, overlayOpacity, showConfidence,
    showLabels, showBlueprint, bgImage, pan, scale, wallStart, tempWallEnd,
    calibPointA, calibPointB
  ]);

  // ---------------------------------------------------------------------------
  // Canvas Mouse Interactions (Pan, Selection, Snapping, Drawing)
  // ---------------------------------------------------------------------------
  const getTransformedMouse = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    // Invert pan and scale
    return {
      x: (rawX - pan.x) / scale,
      y: (rawY - pan.y) / scale
    };
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 2 || e.altKey) {
      // Middle click, Right click, or Alt+Drag -> Pan
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const mouse = getTransformedMouse(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeTool === 'calibrate') {
      if (!calibPointA) {
        setCalibPointA(mouse);
      } else if (!calibPointB) {
        setCalibPointB(mouse);
        setShowCalibModal(true);
      }
      return;
    }

    if (activeTool === 'add_wall') {
      if (!wallStart) {
        setWallStart(mouse);
      } else {
        // Commit new wall
        const m1 = canvasToM(wallStart.x, wallStart.y, canvas.width, canvas.height);
        const m2 = canvasToM(mouse.x, mouse.y, canvas.width, canvas.height);
        const newWall = {
          id: `wall_user_${Date.now().toString(36)}`,
          start_point: { x: m1.x, z: m1.z },
          end_point: { x: m2.x, z: m2.z },
          thickness: 0.20,
          height: 3.0,
          wall_type: 'interior',
          material: 'AAC Concrete Block',
          confidence: 1.0,
          source: 'user_created',
          openings: []
        };
        const updatedWalls = [...(floor.walls || []), newWall];
        const updatedModel = {
          ...buildingModel,
          floors: [{ ...floor, walls: updatedWalls }]
        };
        pushHistory(updatedModel);
        setWallStart(null);
        setTempWallEnd(null);
      }
      return;
    }

    if (activeTool === 'add_door' || activeTool === 'add_window') {
      let nearestWall = null;
      let minDist = Infinity;
      let projPos = null;

      for (const w of floor.walls || []) {
        const p1 = mToCanvas(w.start_point.x, w.start_point.z, canvas.width, canvas.height);
        const p2 = mToCanvas(w.end_point.x, w.end_point.z, canvas.width, canvas.height);
        const dist = pointToSegmentDistance(mouse, p1, p2);
        if (dist < minDist) {
          minDist = dist;
          nearestWall = w;
          const abx = p2.x - p1.x;
          const aby = p2.y - p1.y;
          const magSq = abx * abx + aby * aby;
          const t = magSq === 0 ? 0 : Math.max(0.1, Math.min(0.9, ((mouse.x - p1.x) * abx + (mouse.y - p1.y) * aby) / magSq));
          projPos = { x: p1.x + t * abx, y: p1.y + t * aby };
        }
      }

      if (nearestWall && projPos) {
        const mPos = canvasToM(projPos.x, projPos.y, canvas.width, canvas.height);
        const dx = nearestWall.end_point.x - nearestWall.start_point.x;
        const dz = nearestWall.end_point.z - nearestWall.start_point.z;
        const angle = Math.atan2(dz, dx);

        if (activeTool === 'add_door') {
          const newDoor = {
            id: `door_user_${Date.now().toString(36)}`,
            position: { x: mPos.x, y: 0, z: mPos.z },
            width: 0.90,
            height: 2.10,
            rotation: angle,
            wall_id: nearestWall.id,
            door_type: 'single_hinged',
            swing_direction: 'left_in',
            confidence: 1.0,
            source: 'user_created'
          };
          const updatedModel = {
            ...buildingModel,
            floors: [{ ...floor, doors: [...(floor.doors || []), newDoor] }]
          };
          pushHistory(updatedModel);
          selectAndNotify({ type: 'door', id: newDoor.id, data: newDoor });
        } else {
          const newWin = {
            id: `win_user_${Date.now().toString(36)}`,
            position: { x: mPos.x, y: 0.9, z: mPos.z },
            width: 1.20,
            height: 1.20,
            sill_height: 0.90,
            wall_id: nearestWall.id,
            window_type: 'standard_casement',
            confidence: 1.0,
            source: 'user_created'
          };
          const updatedModel = {
            ...buildingModel,
            floors: [{ ...floor, windows: [...(floor.windows || []), newWin] }]
          };
          pushHistory(updatedModel);
          selectAndNotify({ type: 'window', id: newWin.id, data: newWin });
        }
        setActiveTool('select');
      }
      return;
    }

    if (activeTool === 'select' || activeTool === 'delete') {
      // Find clicked element
      let found = null;

      // Check walls
      for (const w of floor.walls || []) {
        const p1 = mToCanvas(w.start_point.x, w.start_point.z, canvas.width, canvas.height);
        const p2 = mToCanvas(w.end_point.x, w.end_point.z, canvas.width, canvas.height);
        const dist = pointToSegmentDistance(mouse, p1, p2);
        if (dist <= Math.max(8, (w.thickness * scalePxPerM) / 2)) {
          found = { type: 'wall', id: w.id, data: w };
          break;
        }
      }

      // Check doors
      if (!found) {
        for (const d of floor.doors || []) {
          const p = mToCanvas(d.position.x, d.position.z, canvas.width, canvas.height);
          const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
          if (dist <= 25) {
            found = { type: 'door', id: d.id, data: d };
            break;
          }
        }
      }

      // Check windows
      if (!found) {
        for (const win of floor.windows || []) {
          const p = mToCanvas(win.position.x, win.position.z, canvas.width, canvas.height);
          const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
          if (dist <= 25) {
            found = { type: 'window', id: win.id, data: win };
            break;
          }
        }
      }

      // Check rooms
      if (!found) {
        for (const r of floor.rooms || []) {
          if (r.polygon && r.polygon.length >= 3) {
            const pts = r.polygon.map(pt => mToCanvas(pt.x, pt.z, canvas.width, canvas.height));
            if (isPointInPolygon(mouse, pts)) {
              found = { type: 'room', id: r.id, data: r };
              break;
            }
          }
        }
      }

      if (activeTool === 'delete' && found) {
        handleDeleteElement(found);
      } else {
        selectAndNotify(found);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (activeTool === 'add_wall' && wallStart) {
      setTempWallEnd(getTransformedMouse(e));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setScale(prevScale => {
      const nextScale = Math.max(0.15, Math.min(8.0, prevScale * zoomFactor));
      const scaleChange = nextScale / prevScale;
      setPan(prevPan => ({
        x: mouseX - (mouseX - prevPan.x) * scaleChange,
        y: mouseY - (mouseY - prevPan.y) * scaleChange
      }));
      return nextScale;
    });
  };

  // Helper: Delete Element
  const handleDeleteElement = (elem) => {
    if (!elem) return;
    let updatedFloor = { ...floor };
    if (elem.type === 'wall') {
      updatedFloor.walls = floor.walls.filter(w => w.id !== elem.id);
    } else if (elem.type === 'door') {
      updatedFloor.doors = floor.doors.filter(d => d.id !== elem.id);
    } else if (elem.type === 'window') {
      updatedFloor.windows = floor.windows.filter(win => win.id !== elem.id);
    } else if (elem.type === 'room') {
      updatedFloor.rooms = floor.rooms.filter(r => r.id !== elem.id);
    }
    const updatedModel = {
      ...buildingModel,
      floors: [updatedFloor]
    };
    pushHistory(updatedModel);
    selectAndNotify(null);
  };

  // Helper: Update selected element properties
  const handleUpdateElementData = (field, value) => {
    if (!selectedElement) return;
    const updatedFloor = { ...floor };

    if (selectedElement.type === 'wall') {
      updatedFloor.walls = floor.walls.map(w => {
        if (w.id === selectedElement.id) {
          const updated = { ...w, [field]: value };
          setSelectedElement({ ...selectedElement, data: updated });
          return updated;
        }
        return w;
      });
    } else if (selectedElement.type === 'room') {
      updatedFloor.rooms = floor.rooms.map(r => {
        if (r.id === selectedElement.id) {
          const updated = { ...r, [field]: value };
          setSelectedElement({ ...selectedElement, data: updated });
          return updated;
        }
        return r;
      });
    } else if (selectedElement.type === 'door') {
      updatedFloor.doors = floor.doors.map(d => {
        if (d.id === selectedElement.id) {
          const updated = { ...d, [field]: value };
          setSelectedElement({ ...selectedElement, data: updated });
          return updated;
        }
        return d;
      });
    } else if (selectedElement.type === 'window') {
      updatedFloor.windows = floor.windows.map(win => {
        if (win.id === selectedElement.id) {
          const updated = { ...win, [field]: value };
          setSelectedElement({ ...selectedElement, data: updated });
          return updated;
        }
        return win;
      });
    }

    pushHistory({
      ...buildingModel,
      floors: [updatedFloor]
    });
  };

  // Apply Scale Calibration
  const submitScaleCalibration = () => {
    if (!calibPointA || !calibPointB) return;
    const distPx = Math.hypot(calibPointB.x - calibPointA.x, calibPointB.y - calibPointA.y);
    const realDistNum = parseFloat(calibRealDist);
    if (distPx > 5 && realDistNum > 0 && onCalibrateScale) {
      onCalibrateScale({
        point_a: [calibPointA.x, calibPointA.y],
        point_b: [calibPointB.x, calibPointB.y],
        real_distance: realDistNum,
        unit: calibUnit
      });
    }
    setShowCalibModal(false);
    setCalibPointA(null);
    setCalibPointB(null);
    setActiveTool('select');
  };

  return (
    <div className="floorplan-review-container">
      {/* ── DISCLAIMER BANNER ───────────────────────────────────────────── */}
      <div className="review-disclaimer-banner">
        <ShieldAlert size={16} color="#06b6d4" />
        <span>AI-Generated Blueprint Recognition: Please inspect, correct walls/openings, and calibrate scale before generating the authoritative 3D BIM model.</span>
      </div>

      {/* ── TOP CONTROL TOOLBAR ────────────────────────────────────────── */}
      <div className="review-top-toolbar">
        <div className="toolbar-left-group">
          <button
            className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
            onClick={() => { setActiveTool('select'); setWallStart(null); }}
            title="Select & Inspect Elements"
          >
            <Move size={16} /> Select
          </button>
          <button
            className={`tool-btn ${activeTool === 'add_wall' ? 'active' : ''}`}
            onClick={() => { setActiveTool('add_wall'); setWallStart(null); }}
            title="Draw New Wall"
          >
            <Plus size={16} /> Add Wall
          </button>
          <button
            className={`tool-btn ${activeTool === 'add_door' ? 'active' : ''}`}
            onClick={() => { setActiveTool('add_door'); setWallStart(null); }}
            title="Click near a wall to insert a Door"
          >
            <DoorOpen size={16} /> Add Door
          </button>
          <button
            className={`tool-btn ${activeTool === 'add_window' ? 'active' : ''}`}
            onClick={() => { setActiveTool('add_window'); setWallStart(null); }}
            title="Click near a wall to insert a Window"
          >
            <AppWindow size={16} /> Add Window
          </button>
          <button
            className={`tool-btn ${activeTool === 'calibrate' ? 'active' : ''}`}
            onClick={() => {
              setActiveTool('calibrate');
              setCalibPointA(null);
              setCalibPointB(null);
            }}
            title="Calibrate Scale (Point A to Point B)"
          >
            <Ruler size={16} /> Set Scale
          </button>
          <button
            className={`tool-btn danger ${activeTool === 'delete' ? 'active' : ''}`}
            onClick={() => setActiveTool('delete')}
            title="Click an Element to Delete"
          >
            <Trash2 size={16} /> Delete
          </button>

          <div className="toolbar-divider" />

          {/* Undo / Redo */}
          <button
            className="secondary-tool-btn"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo last change"
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="secondary-tool-btn"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo change"
          >
            <RotateCw size={15} />
          </button>
        </div>

        <div className="toolbar-center-group">
          <div className="slider-control">
            <span>Overlay Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            />
          </div>

          <button
            className={`tool-toggle-btn ${showBlueprint ? 'active' : ''}`}
            onClick={() => setShowBlueprint(!showBlueprint)}
            title="Toggle Original Blueprint"
          >
            <Layers size={15} /> Blueprint
          </button>
          <button
            className={`tool-toggle-btn ${showLabels ? 'active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle Room Labels"
          >
            <Tag size={15} /> Labels
          </button>
          <button
            className={`tool-toggle-btn ${showConfidence ? 'active' : ''}`}
            onClick={() => setShowConfidence(!showConfidence)}
            title="Toggle Confidence Heatmap"
          >
            <ShieldAlert size={15} /> Confidence
          </button>
        </div>

        <div className="toolbar-right-group">
          {validation?.issues?.length > 0 && (
            <div className="validation-pill" title={`${validation.issues.length} Topology Signals`}>
              <AlertTriangle size={15} color="#f59e0b" />
              <span>{validation.issues.length} Signals</span>
            </div>
          )}

          <button
            className="approve-3d-btn"
            onClick={() => onApproveAndGenerate3D && onApproveAndGenerate3D(buildingModel)}
          >
            <CheckCircle2 size={17} />
            <span>Approve & Generate 3D</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {/* ── MAIN INTERACTIVE CANVAS AREA ───────────────────────────────── */}
      <div className="canvas-wrapper" ref={canvasWrapperRef} onWheel={handleWheel}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="floorplan-overlay-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Floating Zoom & Pan Controls */}
        <div className="floating-canvas-controls">
          <button onClick={() => setScale(s => Math.min(8.0, s * 1.25))} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setScale(s => Math.max(0.15, s / 1.25))} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleResetView} title="Fit Blueprint to Screen">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Current Scale Tag */}
        <div className="floating-scale-badge">
          <Ruler size={13} />
          <span>Scale: {scalePxPerM.toFixed(1)} px/m</span>
        </div>

        {/* Calibration Prompt Overlay */}
        {activeTool === 'calibrate' && (
          <div className="calibration-banner">
            <Ruler size={16} />
            <span>
              {!calibPointA
                ? "Click Point A on a known architectural dimension line"
                : !calibPointB
                ? "Click Point B at the other end of the dimension line"
                : "Enter real-world length to calibrate"}
            </span>
            <button className="banner-close" onClick={() => setActiveTool('select')}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── ELEMENT PROPERTIES INSPECTOR DRAWER ────────────────────────── */}
      {selectedElement && (
        <div className="element-inspector-sidebar">
          <div className="inspector-header">
            <h4>{selectedElement.type.toUpperCase()} PROPERTIES</h4>
            <button onClick={() => setSelectedElement(null)}>
              <X size={16} />
            </button>
          </div>

          <div className="inspector-body">
            <div className="prop-row">
              <label>ID</label>
              <span className="mono-val">{selectedElement.id}</span>
            </div>

            <div className="prop-row">
              <label>AI Confidence</label>
              {(() => {
                const conf = selectedElement.data?.confidence ?? 0.95;
                const level = conf >= 0.90 ? 'high' : conf >= 0.70 ? 'medium' : 'low';
                return (
                  <div className={`confidence-pill ${level}`}>
                    <span className="conf-dot" />
                    <span>{(conf * 100).toFixed(0)}% {level.toUpperCase()}</span>
                  </div>
                );
              })()}
            </div>

            {selectedElement.type === 'wall' && (
              <>
                <div className="prop-row">
                  <label>Type</label>
                  <select
                    value={selectedElement.data.wall_type}
                    onChange={(e) => handleUpdateElementData('wall_type', e.target.value)}
                  >
                    <option value="exterior">Exterior Wall</option>
                    <option value="interior">Interior Partition</option>
                  </select>
                </div>
                <div className="prop-row">
                  <label>Thickness (m)</label>
                  <input
                    type="number"
                    step="0.02"
                    min="0.10"
                    max="0.80"
                    value={selectedElement.data.thickness}
                    onChange={(e) => handleUpdateElementData('thickness', parseFloat(e.target.value))}
                  />
                </div>
                <div className="prop-row">
                  <label>Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="6.0"
                    value={selectedElement.data.height}
                    onChange={(e) => handleUpdateElementData('height', parseFloat(e.target.value))}
                  />
                </div>
                <div className="prop-row">
                  <label>Material</label>
                  <select
                    value={selectedElement.data.material}
                    onChange={(e) => handleUpdateElementData('material', e.target.value)}
                  >
                    <option value="Reinforced Concrete">Reinforced Concrete</option>
                    <option value="AAC Concrete Block">AAC Concrete Block</option>
                    <option value="Drywall Stud Partition">Drywall Stud Partition</option>
                    <option value="Clay Brick Masonry">Clay Brick Masonry</option>
                  </select>
                </div>
              </>
            )}

            {selectedElement.type === 'room' && (
              <>
                <div className="prop-row">
                  <label>Room Name</label>
                  <input
                    type="text"
                    value={selectedElement.data.name}
                    onChange={(e) => handleUpdateElementData('name', e.target.value)}
                  />
                </div>
                <div className="prop-row">
                  <label>Room Type</label>
                  <select
                    value={selectedElement.data.room_type}
                    onChange={(e) => handleUpdateElementData('room_type', e.target.value)}
                  >
                    <option value="LIVING_ROOM">Living Room</option>
                    <option value="BEDROOM">Bedroom</option>
                    <option value="MASTER_BEDROOM">Master Bedroom</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="DINING">Dining</option>
                    <option value="BATHROOM">Bathroom</option>
                    <option value="BALCONY">Balcony / Terrace</option>
                    <option value="FOYER">Foyer / Entry</option>
                    <option value="CORRIDOR">Corridor</option>
                    <option value="OFFICE">Study / Office</option>
                    <option value="STORAGE">Storage / Utility</option>
                    <option value="GARAGE">Garage</option>
                  </select>
                </div>
                <div className="prop-row">
                  <label>Area</label>
                  <span className="metric-highlight">{selectedElement.data.area?.toFixed(2)} m²</span>
                </div>
                <div className="prop-row">
                  <label>Floor Finish</label>
                  <select
                    value={selectedElement.data.floor_finish || 'Vitrified Tile 600x600'}
                    onChange={(e) => handleUpdateElementData('floor_finish', e.target.value)}
                  >
                    <option value="Vitrified Tile 600x600">Vitrified Tile 600x600</option>
                    <option value="Hardwood Parquet">Hardwood Parquet</option>
                    <option value="Polished Concrete">Polished Concrete</option>
                    <option value="Anti-skid Ceramic">Anti-skid Ceramic (Bath)</option>
                  </select>
                </div>
              </>
            )}

            {selectedElement.type === 'door' && (
              <>
                <div className="prop-row">
                  <label>Width (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.6"
                    max="2.5"
                    value={selectedElement.data.width}
                    onChange={(e) => handleUpdateElementData('width', parseFloat(e.target.value))}
                  />
                </div>
                <div className="prop-row">
                  <label>Swing Direction</label>
                  <select
                    value={selectedElement.data.swing_direction || 'left_in'}
                    onChange={(e) => handleUpdateElementData('swing_direction', e.target.value)}
                  >
                    <option value="left_in">Left Inward</option>
                    <option value="right_in">Right Inward</option>
                    <option value="left_out">Left Outward</option>
                    <option value="right_out">Right Outward</option>
                  </select>
                </div>
              </>
            )}

            {selectedElement.type === 'window' && (
              <>
                <div className="prop-row">
                  <label>Width (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.6"
                    max="4.0"
                    value={selectedElement.data.width}
                    onChange={(e) => handleUpdateElementData('width', parseFloat(e.target.value))}
                  />
                </div>
                <div className="prop-row">
                  <label>Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.6"
                    max="3.0"
                    value={selectedElement.data.height}
                    onChange={(e) => handleUpdateElementData('height', parseFloat(e.target.value))}
                  />
                </div>
                <div className="prop-row">
                  <label>Sill Height (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.0"
                    max="2.0"
                    value={selectedElement.data.sill_height}
                    onChange={(e) => handleUpdateElementData('sill_height', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            <div className="inspector-actions">
              <button
                className="delete-element-btn"
                onClick={() => handleDeleteElement(selectedElement)}
              >
                <Trash2 size={15} /> Delete Element
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCALE CALIBRATION POPUP MODAL ──────────────────────────────── */}
      {showCalibModal && (
        <div className="calib-modal-backdrop">
          <div className="calib-modal-card">
            <h3>
              <Ruler size={18} color="#06b6d4" />
              <span>Set Real-World Dimension</span>
            </h3>
            <p>
              Specify the real-world distance between Point A and Point B to calibrate the exact architectural scale.
            </p>

            <div className="calib-inputs">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={calibRealDist}
                onChange={(e) => setCalibRealDist(e.target.value)}
                placeholder="e.g. 4.5"
                autoFocus
              />
              <select value={calibUnit} onChange={(e) => setCalibUnit(e.target.value)}>
                <option value="m">Meters (m)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>

            <div className="calib-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCalibModal(false);
                  setCalibPointA(null);
                  setCalibPointB(null);
                }}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitScaleCalibration}>
                <CheckCircle2 size={16} /> Apply Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Geometry Helpers
// -----------------------------------------------------------------------------
function pointToSegmentDistance(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const magSq = abx * abx + aby * aby;
  if (magSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / magSq));
  const projX = a.x + t * abx;
  const projY = a.y + t * aby;
  return Math.hypot(p.x - projX, p.y - projY);
}

function isPointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
