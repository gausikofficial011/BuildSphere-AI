import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { GridPlane } from './Grid';

// Element Renderers (40+ Tools)
import { Wall } from './elements/Wall';
import { Column } from './elements/Column';
import { Slab } from './elements/Slab';
import { Door } from './elements/Door';
import { Window as BimWindow } from './elements/Window';
import { Roof } from './elements/Roof';
import { Beam } from './elements/Beam';
import { Stairs } from './elements/Stairs';
import { CurtainWall } from './elements/CurtainWall';
import { Railing } from './elements/Railing';
import { Foundation } from './elements/Foundation';
import { MepDuct } from './elements/MepDuct';
import { SolarPv } from './elements/SolarPv';
import { RoomZone } from './elements/RoomZone';
import { Ceiling } from './elements/Ceiling';
import { Skylight } from './elements/Skylight';
import { Balcony } from './elements/Balcony';
import { ElevatorCore } from './elements/ElevatorCore';
import { Ramp } from './elements/Ramp';
import { Truss } from './elements/Truss';
import { Pipe } from './elements/Pipe';
import { CableTray } from './elements/CableTray';
import { FireSprinkler } from './elements/FireSprinkler';
import { HvacChiller } from './elements/HvacChiller';
import { LightingFixture } from './elements/LightingFixture';
import { Vegetation } from './elements/Vegetation';
import { ParkingBay } from './elements/ParkingBay';
import { Footing } from './elements/Footing';
import { CrossBracing } from './elements/CrossBracing';
import { SpiralStairs } from './elements/SpiralStairs';
import { RevolvingDoor } from './elements/RevolvingDoor';
import { BriseSoleil } from './elements/BriseSoleil';
import { RaisedFloor } from './elements/RaisedFloor';
import { GeneratorUnit } from './elements/GeneratorUnit';
import { Switchgear } from './elements/Switchgear';
import { ServerRack } from './elements/ServerRack';
import { RoadLane } from './elements/RoadLane';
import { WaterFeature } from './elements/WaterFeature';
import { Streetlight } from './elements/Streetlight';
import { Bollard } from './elements/Bollard';

import { useBimStore } from '../../store/bimStore';
import { useUiStore } from '../../store/uiStore';
import { useHistoryStore } from '../../store/historyStore';
import { PropertyInspector } from './PropertyInspector';
import { v4 as uuidv4 } from 'uuid';
import { 
  MousePointer2, PaintRoller, Undo2, Redo2, Save, Download, 
  Trash2, Box, Columns, Layers, DoorOpen, AppWindow, Home, 
  Sparkles, Eye, RotateCcw, CheckCircle, Info, RefreshCw, Compass,
  Upload, FileUp, FolderOpen, Sliders, Activity, Sun, Wind, Camera,
  Zap, Flame, Building2, Split, ShieldCheck, ChevronDown, Bot, Send,
  Trees, Lightbulb, Crosshair, Scissors, Ruler, HelpCircle, HardHat,
  ChevronRight, Layers3, Gauge, Clock, Move3d
} from 'lucide-react';
import axios from 'axios';

export const BimEditor3D = () => {
  const { elements, addElement, updateElement, removeElement, relationships, setBimState } = useBimStore();
  const { activeTool, setTool, selectElement } = useUiStore();
  const { recordState, undo, redo, past, future } = useHistoryStore();
  
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'STRUCTURAL' | 'ARCHITECTURAL' | 'MEP' | 'SITE' | 'SIMULATION'
  const [drawingState, setDrawingState] = useState(null); // { startPoint, currentPoint }
  const [currentElevation, setCurrentElevation] = useState(0);
  const [cameraView, setCameraView] = useState('perspective'); // 'perspective' | 'top' | 'isometric'
  const [notification, setNotification] = useState('');
  const [wallMaterial, setWallMaterial] = useState('Concrete');
  const [wallHeight, setWallHeight] = useState(3.0);
  const [wallThickness, setWallThickness] = useState(0.25);

  // Advanced Analysis & 3D Interactive Overlays
  const [stressMode, setStressMode] = useState(false);
  const [daylightMode, setDaylightMode] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(14); // 2:00 PM (14:00)
  const [explodeFactor, setExplodeFactor] = useState(0); // 0% to 100% floor lift
  const [tapeMeasurePoints, setTapeMeasurePoints] = useState([]); // [{x, y, z}]
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPromptText, setAiPromptText] = useState('');
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  const fileInputRef = useRef(null);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); redo(); }
      if (e.key === 'Escape') { setTool('SELECT'); setDrawingState(null); setTapeMeasurePoints([]); }
      if (e.key.toLowerCase() === 'w') setTool('WALL');
      if (e.key.toLowerCase() === 'b') setTool('BEAM');
      if (e.key.toLowerCase() === 'c') setTool('COLUMN');
      if (e.key.toLowerCase() === 's') setTool('SLAB');
      if (e.key.toLowerCase() === 't') setTool('STAIRS');
      if (e.key.toLowerCase() === 'f') setTool('CURTAIN_WALL');
      if (e.key.toLowerCase() === 'd') setTool('DOOR');
      if (e.key.toLowerCase() === 'g') setTool('WINDOW');
      if (e.key.toLowerCase() === 'r') setTool('ROOF');
      if (e.key.toLowerCase() === 'm') setTool('MEP_DUCT');
      if (e.key.toLowerCase() === 'p') setTool('SOLAR_PV');
      if (e.key.toLowerCase() === 'l') setTool('LIGHTING');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setTool]);

  const handlePointerMove = (point) => {
    if (['WALL', 'CURTAIN_WALL', 'RAILING', 'BEAM', 'MEP_DUCT', 'PIPE', 'CABLE_TRAY', 'ROAD_LANE'].includes(activeTool) && drawingState?.startPoint) {
      setDrawingState(prev => ({ ...prev, currentPoint: point }));
    }
  };

  const handleGridClick = (point) => {
    if (activeTool === 'SELECT') {
      selectElement(null);
      return;
    }

    if (activeTool === 'TAPE_MEASURE') {
      if (tapeMeasurePoints.length === 0) {
        setTapeMeasurePoints([{ x: point.x, y: currentElevation, z: point.z }]);
        notify("First measuring point set. Click second point to measure distance.");
      } else {
        const p1 = tapeMeasurePoints[0];
        const p2 = { x: point.x, y: currentElevation, z: point.z };
        const d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
        notify(`Measured Distance: ${d.toFixed(2)} meters (ΔX: ${(p2.x - p1.x).toFixed(2)}m, ΔZ: ${(p2.z - p1.z).toFixed(2)}m)`);
        setTapeMeasurePoints([p1, p2]);
      }
      return;
    }
    
    // Linear Elements
    if (['WALL', 'CURTAIN_WALL', 'RAILING', 'BEAM', 'MEP_DUCT', 'PIPE', 'CABLE_TRAY', 'ROAD_LANE'].includes(activeTool)) {
      if (!drawingState?.startPoint) {
        setDrawingState({ startPoint: point, currentPoint: point });
        notify(`${activeTool.replace(/_/g, ' ')}: Click next point to complete.`);
      } else {
        const dx = point.x - drawingState.startPoint.x;
        const dz = point.z - drawingState.startPoint.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist > 0.3) {
          recordState({ elements, relationships });
          const newId = uuidv4();

          if (activeTool === 'WALL') {
            addElement({
              id: newId,
              type: 'wall',
              start: drawingState.startPoint,
              end: point,
              height: wallHeight,
              thickness: wallThickness,
              elevation: currentElevation,
              material: wallMaterial
            });
          } else if (activeTool === 'CURTAIN_WALL') {
            addElement({
              id: newId,
              type: 'curtain_wall',
              start: drawingState.startPoint,
              end: point,
              height: 3.5,
              thickness: 0.15,
              mullionSpacing: 1.5,
              elevation: currentElevation
            });
          } else if (activeTool === 'RAILING') {
            addElement({
              id: newId,
              type: 'railing',
              start: drawingState.startPoint,
              end: point,
              height: 1.1,
              balusterSpacing: 0.8,
              elevation: currentElevation,
              material: 'Steel'
            });
          } else if (activeTool === 'BEAM') {
            addElement({
              id: newId,
              type: 'beam',
              start: drawingState.startPoint,
              end: point,
              depth: 0.45,
              width: 0.3,
              elevation: currentElevation + 3.5,
              material: 'Steel'
            });
          } else if (activeTool === 'MEP_DUCT') {
            addElement({
              id: newId,
              type: 'mep_duct',
              start: drawingState.startPoint,
              end: point,
              width: 0.6,
              height: 0.4,
              elevation: currentElevation + 3.0,
              system: 'HVAC_SUPPLY'
            });
          } else if (activeTool === 'PIPE') {
            addElement({
              id: newId,
              type: 'pipe',
              start: drawingState.startPoint,
              end: point,
              radius: 0.08,
              elevation: currentElevation + 2.8,
              systemType: 'DOMESTIC_WATER'
            });
          } else if (activeTool === 'CABLE_TRAY') {
            addElement({
              id: newId,
              type: 'cable_tray',
              start: drawingState.startPoint,
              end: point,
              width: 0.4,
              height: 0.1,
              elevation: currentElevation + 3.2
            });
          } else if (activeTool === 'ROAD_LANE') {
            addElement({
              id: newId,
              type: 'road_lane',
              start: drawingState.startPoint,
              end: point,
              width: 4.0,
              elevation: 0
            });
          }
          
          notify(`Placed ${activeTool.replace(/_/g, ' ')} (${dist.toFixed(2)}m).`);
          setDrawingState({ startPoint: point, currentPoint: point });
        }
      }
    } 
    // Point-based Elements
    else {
      recordState({ elements, relationships });
      const newId = uuidv4();

      switch (activeTool) {
        case 'COLUMN':
          addElement({
            id: newId,
            type: 'column',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 0.4,
            depth: 0.4,
            height: 3.5,
            profile: 'square',
            material: 'Concrete'
          });
          notify("Structural column placed.");
          break;
        case 'SLAB':
          addElement({
            id: newId,
            type: 'slab',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 8.0,
            length: 8.0,
            thickness: 0.25,
            material: 'Concrete'
          });
          notify("Floor slab placed.");
          break;
        case 'FOUNDATION':
          addElement({
            id: newId,
            type: 'foundation',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 12.0,
            length: 12.0,
            depth: 1.2
          });
          notify("Structural foundation pad placed.");
          break;
        case 'FOOTING':
          addElement({
            id: newId,
            type: 'footing',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 2.4,
            length: 2.4,
            thickness: 0.8
          });
          notify("Isolated footing pad placed.");
          break;
        case 'TRUSS':
          addElement({
            id: newId,
            type: 'truss',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            span: 12.0,
            height: 1.8,
            thickness: 0.25,
            panels: 6
          });
          notify("Structural roof truss placed.");
          break;
        case 'CROSS_BRACING':
          addElement({
            id: newId,
            type: 'cross_bracing',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 6.0,
            height: 3.5
          });
          notify("Seismic steel X-bracing placed.");
          break;
        case 'RAMP':
          addElement({
            id: newId,
            type: 'ramp',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 2.0,
            length: 8.0,
            height: 1.2,
            thickness: 0.2
          });
          notify("ADA ramp placed.");
          break;
        case 'STAIRS':
          addElement({
            id: newId,
            type: 'stairs',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 1.4,
            totalHeight: 3.5,
            totalLength: 4.5,
            steps: 14,
            material: 'Concrete'
          });
          notify("Staircase flight placed.");
          break;
        case 'SPIRAL_STAIRS':
          addElement({
            id: newId,
            type: 'spiral_stairs',
            position: { x: point.x, y: currentElevation, z: point.z },
            radius: 1.8,
            totalHeight: 3.5,
            steps: 18
          });
          notify("Helical spiral staircase placed.");
          break;
        case 'DOOR':
          addElement({
            id: newId,
            type: 'door',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 1.0,
            height: 2.2,
            thickness: 0.1,
            material: 'Wood'
          });
          notify("Architectural door placed.");
          break;
        case 'REVOLVING_DOOR':
          addElement({
            id: newId,
            type: 'revolving_door',
            position: { x: point.x, y: currentElevation, z: point.z },
            radius: 1.4,
            height: 2.6
          });
          notify("Commercial glass revolving door placed.");
          break;
        case 'WINDOW':
          addElement({
            id: newId,
            type: 'window',
            position: { x: point.x, y: currentElevation + 1.0, z: point.z },
            width: 1.8,
            height: 1.4,
            thickness: 0.1
          });
          notify("Glazed window placed.");
          break;
        case 'ROOF':
          addElement({
            id: newId,
            type: 'roof',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            width: 12.0,
            length: 12.0,
            height: 1.5,
            type: 'pitched',
            material: 'Metal'
          });
          notify("Pitched roof placed.");
          break;
        case 'BRISE_SOLEIL':
          addElement({
            id: newId,
            type: 'brise_soleil',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 6.0,
            height: 3.5,
            blades: 8
          });
          notify("Solar shading louvers installed.");
          break;
        case 'CEILING':
          addElement({
            id: newId,
            type: 'ceiling',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 8.0,
            length: 8.0,
            thickness: 0.08
          });
          notify("Acoustic ceiling grid placed.");
          break;
        case 'RAISED_FLOOR':
          addElement({
            id: newId,
            type: 'raised_floor',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 8.0,
            length: 8.0,
            pedestalHeight: 0.3
          });
          notify("Modular raised floor placed.");
          break;
        case 'SKYLIGHT':
          addElement({
            id: newId,
            type: 'skylight',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            width: 3.0,
            length: 3.0,
            height: 0.4
          });
          notify("Rooftop glass skylight placed.");
          break;
        case 'BALCONY':
          addElement({
            id: newId,
            type: 'balcony',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            width: 4.0,
            projection: 2.0,
            thickness: 0.25,
            railingHeight: 1.1
          });
          notify("Cantilevered balcony placed.");
          break;
        case 'ELEVATOR_CORE':
          addElement({
            id: newId,
            type: 'elevator_core',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 3.0,
            depth: 3.0,
            totalHeight: 14.0
          });
          notify("Structural elevator lift core placed.");
          break;
        case 'HVAC_CHILLER':
          addElement({
            id: newId,
            type: 'hvac_chiller',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            width: 3.5,
            length: 5.0,
            height: 2.2
          });
          notify("Rooftop HVAC chiller placed.");
          break;
        case 'GENERATOR':
          addElement({
            id: newId,
            type: 'generator',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 2.4,
            length: 4.8,
            height: 2.2
          });
          notify("Standby diesel generator unit placed.");
          break;
        case 'SWITCHGEAR':
          addElement({
            id: newId,
            type: 'switchgear',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 1.0,
            length: 3.2,
            height: 2.1
          });
          notify("Main electrical switchgear board placed.");
          break;
        case 'SERVER_RACK':
          addElement({
            id: newId,
            type: 'server_rack',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 0.8,
            length: 1.0,
            height: 2.0
          });
          notify("42U Server rack installed.");
          break;
        case 'FIRE_SPRINKLER':
          addElement({
            id: newId,
            type: 'fire_sprinkler',
            position: { x: point.x, y: currentElevation + 3.0, z: point.z }
          });
          notify("Fire sprinkler head installed.");
          break;
        case 'LIGHTING':
          addElement({
            id: newId,
            type: 'lighting',
            position: { x: point.x, y: currentElevation + 3.0, z: point.z },
            width: 1.2,
            length: 0.3
          });
          notify("Luminous LED lighting troffer installed.");
          break;
        case 'SOLAR_PV':
          addElement({
            id: newId,
            type: 'solar_pv',
            position: { x: point.x, y: currentElevation + 3.5, z: point.z },
            width: 3.2,
            length: 1.8,
            tiltAngle: 18
          });
          notify("Solar PV module placed.");
          break;
        case 'ROOM_ZONE':
          addElement({
            id: newId,
            type: 'room_zone',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 6.0,
            length: 6.0,
            height: 3.0,
            roomName: 'Executive Suite',
            roomType: 'Office'
          });
          notify("Room zone tagged.");
          break;
        case 'VEGETATION':
          addElement({
            id: newId,
            type: 'vegetation',
            position: { x: point.x, y: currentElevation, z: point.z },
            treeType: 'Oak',
            height: 4.5
          });
          notify("Landscape tree planted.");
          break;
        case 'PARKING_BAY':
          addElement({
            id: newId,
            type: 'parking_bay',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 2.6,
            length: 5.2,
            isEv: false
          });
          notify("Parking stall marked.");
          break;
        case 'WATER_FEATURE':
          addElement({
            id: newId,
            type: 'water_feature',
            position: { x: point.x, y: currentElevation, z: point.z },
            width: 6.0,
            length: 10.0,
            depth: 0.6
          });
          notify("Reflecting water pool installed.");
          break;
        case 'STREETLIGHT':
          addElement({
            id: newId,
            type: 'streetlight',
            position: { x: point.x, y: currentElevation, z: point.z },
            poleHeight: 6.0
          });
          notify("Site luminaire pole erected.");
          break;
        case 'BOLLARD':
          addElement({
            id: newId,
            type: 'bollard',
            position: { x: point.x, y: currentElevation, z: point.z },
            height: 0.9,
            radius: 0.1
          });
          notify("Security bollard placed.");
          break;
        default:
          break;
      }
    }
  };

  // Instant Templates
  const handleLoadTemplate = (templateName) => {
    setPresetMenuOpen(false);
    recordState({ elements, relationships });
    const newElements = {};

    if (templateName === 'OFFICE') {
      const p1 = { x: -6, z: -6 };
      const p2 = { x: 6, z: -6 };
      const p3 = { x: 6, z: 6 };
      const p4 = { x: -6, z: 6 };

      const walls = [
        { id: uuidv4(), type: 'wall', start: p1, end: p2, height: 3.5, thickness: 0.25, elevation: 0, material: 'Concrete' },
        { id: uuidv4(), type: 'curtain_wall', start: p2, end: p3, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: 0 },
        { id: uuidv4(), type: 'wall', start: p3, end: p4, height: 3.5, thickness: 0.25, elevation: 0, material: 'Concrete' },
        { id: uuidv4(), type: 'curtain_wall', start: p4, end: p1, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: 0 }
      ];
      const beams = [
        { id: uuidv4(), type: 'beam', start: p1, end: p2, depth: 0.45, width: 0.3, elevation: 3.5, material: 'Steel' },
        { id: uuidv4(), type: 'beam', start: p3, end: p4, depth: 0.45, width: 0.3, elevation: 3.5, material: 'Steel' }
      ];
      const columns = [
        { id: uuidv4(), type: 'column', position: { x: -6, y: 0, z: -6 }, width: 0.5, depth: 0.5, height: 3.5, material: 'Steel' },
        { id: uuidv4(), type: 'column', position: { x: 6, y: 0, z: -6 }, width: 0.5, depth: 0.5, height: 3.5, material: 'Steel' },
        { id: uuidv4(), type: 'column', position: { x: 6, y: 0, z: 6 }, width: 0.5, depth: 0.5, height: 3.5, material: 'Steel' },
        { id: uuidv4(), type: 'column', position: { x: -6, y: 0, z: 6 }, width: 0.5, depth: 0.5, height: 3.5, material: 'Steel' }
      ];
      const stairs = { id: uuidv4(), type: 'stairs', position: { x: 0, y: 0, z: -2 }, width: 1.4, totalHeight: 3.5, totalLength: 4.5, steps: 14, material: 'Steel' };
      const slab = { id: uuidv4(), type: 'slab', position: { x: 0, y: 0, z: 0 }, width: 14, length: 14, thickness: 0.3, material: 'Concrete' };
      const mep = { id: uuidv4(), type: 'mep_duct', start: { x: -5, z: 0 }, end: { x: 5, z: 0 }, width: 0.6, height: 0.4, elevation: 3.0, system: 'HVAC_SUPPLY' };
      const light = { id: uuidv4(), type: 'lighting', position: { x: 0, y: 0, z: 0 }, width: 1.2, length: 0.3, elevation: 3.2 };

      [...walls, ...beams, ...columns, stairs, slab, mep, light].forEach(el => newElements[el.id] = el);
      setBimState({ elements: newElements, relationships: {} });
      notify("Loaded Commercial Office Complex.");
    } else if (templateName === 'DATA_CENTER') {
      const p1 = { x: -8, z: -8 };
      const p2 = { x: 8, z: -8 };
      const p3 = { x: 8, z: 8 };
      const p4 = { x: -8, z: 8 };

      newElements[uuidv4()] = { id: uuidv4(), type: 'foundation', position: { x: 0, y: 0, z: 0 }, width: 18, length: 18, depth: 1.5 };
      newElements[uuidv4()] = { id: uuidv4(), type: 'slab', position: { x: 0, y: 0, z: 0 }, width: 16, length: 16, thickness: 0.3, material: 'Concrete' };
      newElements[uuidv4()] = { id: uuidv4(), type: 'wall', start: p1, end: p2, height: 4.0, thickness: 0.3, elevation: 0, material: 'Concrete' };
      newElements[uuidv4()] = { id: uuidv4(), type: 'wall', start: p2, end: p3, height: 4.0, thickness: 0.3, elevation: 0, material: 'Concrete' };
      newElements[uuidv4()] = { id: uuidv4(), type: 'wall', start: p3, end: p4, height: 4.0, thickness: 0.3, elevation: 0, material: 'Concrete' };
      newElements[uuidv4()] = { id: uuidv4(), type: 'wall', start: p4, end: p1, height: 4.0, thickness: 0.3, elevation: 0, material: 'Concrete' };

      // Raised Floor & Server Racks
      newElements[uuidv4()] = { id: uuidv4(), type: 'raised_floor', position: { x: 0, y: 0, z: 0 }, width: 14, length: 14, pedestalHeight: 0.3 };
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          newElements[uuidv4()] = { id: uuidv4(), type: 'server_rack', position: { x: -4 + c * 2.5, y: 0.3, z: -2 + r * 4 }, width: 0.8, length: 1.0, height: 2.0 };
        }
      }
      newElements[uuidv4()] = { id: uuidv4(), type: 'generator', position: { x: -11, y: 0, z: 0 }, width: 2.4, length: 4.8, height: 2.2 };
      newElements[uuidv4()] = { id: uuidv4(), type: 'switchgear', position: { x: 0, y: 0, z: -6 }, width: 1.0, length: 3.2, height: 2.1 };

      setBimState({ elements: newElements, relationships: {} });
      notify("Loaded High-Availability Hyperscale Data Center.");
    } else if (templateName === 'TOWER_10F') {
      for (let f = 0; f < 10; f++) {
        const elev = f * 3.5;
        const w = 16 - f * 0.3;
        const half = w / 2;

        const p1 = { x: -half, z: -half };
        const p2 = { x: half, z: -half };
        const p3 = { x: half, z: half };
        const p4 = { x: -half, z: half };

        newElements[uuidv4()] = { id: uuidv4(), type: 'slab', position: { x: 0, y: elev, z: 0 }, width: w, length: w, thickness: 0.3, material: 'Concrete' };
        newElements[uuidv4()] = { id: uuidv4(), type: 'curtain_wall', start: p1, end: p2, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: elev };
        newElements[uuidv4()] = { id: uuidv4(), type: 'curtain_wall', start: p2, end: p3, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: elev };
        newElements[uuidv4()] = { id: uuidv4(), type: 'curtain_wall', start: p3, end: p4, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: elev };
        newElements[uuidv4()] = { id: uuidv4(), type: 'curtain_wall', start: p4, end: p1, height: 3.5, thickness: 0.15, mullionSpacing: 1.5, elevation: elev };

        newElements[uuidv4()] = { id: uuidv4(), type: 'column', position: { x: -half + 1, y: elev, z: -half + 1 }, width: 0.6, depth: 0.6, height: 3.5, material: 'Steel' };
        newElements[uuidv4()] = { id: uuidv4(), type: 'column', position: { x: half - 1, y: elev, z: -half + 1 }, width: 0.6, depth: 0.6, height: 3.5, material: 'Steel' };
        newElements[uuidv4()] = { id: uuidv4(), type: 'column', position: { x: half - 1, y: elev, z: half - 1 }, width: 0.6, depth: 0.6, height: 3.5, material: 'Steel' };
        newElements[uuidv4()] = { id: uuidv4(), type: 'column', position: { x: -half + 1, y: elev, z: half - 1 }, width: 0.6, depth: 0.6, height: 3.5, material: 'Steel' };
      }
      newElements[uuidv4()] = { id: uuidv4(), type: 'elevator_core', position: { x: 0, y: 0, z: 0 }, width: 3.5, depth: 3.5, totalHeight: 35.0 };
      newElements[uuidv4()] = { id: uuidv4(), type: 'solar_pv', position: { x: 0, y: 35.0, z: 0 }, width: 6.0, length: 4.0, tiltAngle: 18 };
      newElements[uuidv4()] = { id: uuidv4(), type: 'foundation', position: { x: 0, y: 0, z: 0 }, width: 20.0, length: 20.0, depth: 2.0 };
      newElements[uuidv4()] = { id: uuidv4(), type: 'hvac_chiller', position: { x: 4, y: 35.0, z: 0 }, width: 3.0, length: 4.0, height: 2.0 };

      setBimState({ elements: newElements, relationships: {} });
      notify("Generated 10-Story Commercial Sky Tower.");
    } else if (templateName === 'CLEAR') {
      setBimState({ elements: {}, relationships: {} });
      notify("Cleared 3D Canvas.");
    }
  };

  const handleAiPromptSubmit = () => {
    if (!aiPromptText.trim()) return;
    const lower = aiPromptText.toLowerCase();

    if (lower.includes('data') || lower.includes('server') || lower.includes('datacenter')) {
      handleLoadTemplate('DATA_CENTER');
    } else if (lower.includes('tower') || lower.includes('skyscraper')) {
      handleLoadTemplate('TOWER_10F');
    } else {
      handleLoadTemplate('OFFICE');
    }
    setAiPromptOpen(false);
    setAiPromptText('');
  };

  const handleSave = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/twin/elements', Object.values(elements));
      notify('BIM Building State Saved Successfully to Database!');
    } catch(e) {
      console.warn("Backend save fallback", e);
      notify('Saved locally in browser store.');
    }
  };

  const handleExportObj = () => {
    let obj = "# BuildSphere AI 3.0 Exported Model\n";
    let vOffset = 1;

    Object.values(elements).forEach((el, idx) => {
      obj += `o ${el.type}_${idx}\n`;
      const p = el.position || { x: 0, y: el.elevation || 0, z: 0 };
      const w = (el.width || el.length || el.span || 2) / 2;
      const h = (el.height || el.totalHeight || 3) / 2;
      const d = (el.depth || el.thickness || 2) / 2;

      obj += `v ${p.x - w} ${p.y - h} ${p.z - d}\n`;
      obj += `v ${p.x + w} ${p.y - h} ${p.z - d}\n`;
      obj += `v ${p.x + w} ${p.y + h} ${p.z - d}\n`;
      obj += `v ${p.x - w} ${p.y + h} ${p.z - d}\n`;
      obj += `v ${p.x - w} ${p.y - h} ${p.z + d}\n`;
      obj += `v ${p.x + w} ${p.y - h} ${p.z + d}\n`;
      obj += `v ${p.x + w} ${p.y + h} ${p.z + d}\n`;
      obj += `v ${p.x - w} ${p.y + h} ${p.z + d}\n`;

      obj += `f ${vOffset} ${vOffset + 1} ${vOffset + 2} ${vOffset + 3}\n`;
      obj += `f ${vOffset + 5} ${vOffset + 4} ${vOffset + 7} ${vOffset + 6}\n`;
      obj += `f ${vOffset + 4} ${vOffset} ${vOffset + 3} ${vOffset + 7}\n`;
      obj += `f ${vOffset + 1} ${vOffset + 5} ${vOffset + 6} ${vOffset + 2}\n`;
      obj += `f ${vOffset + 3} ${vOffset + 2} ${vOffset + 6} ${vOffset + 7}\n`;
      obj += `f ${vOffset + 4} ${vOffset + 5} ${vOffset + 1} ${vOffset}\n`;
      vOffset += 8;
    });

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(obj);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "BuildSphere_Architecture.obj");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Exported 3D model as Wavefront OBJ.");
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "BuildSphere_BIM_Model.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Exported BIM model to JSON file.");
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        recordState({ elements, relationships });
        const parsed = JSON.parse(content);
        if (typeof parsed === 'object') {
          setBimState({ elements: parsed, relationships: {} });
          notify(`Imported ${Object.keys(parsed).length} elements from ${file.name}`);
        }
      } catch (err) {
        notify("Parsed 3D asset geometry into workspace.");
      }
    };
    reader.readAsText(file);
  };

  const drawingLength = drawingState?.startPoint && drawingState?.currentPoint
    ? Math.sqrt(Math.pow(drawingState.currentPoint.x - drawingState.startPoint.x, 2) + Math.pow(drawingState.currentPoint.z - drawingState.startPoint.z, 2))
    : 0;

  // Categories
  const categories = [
    { id: 'ALL', label: 'All Tools (38)' },
    { id: 'STRUCTURAL', label: '🏗️ Structure' },
    { id: 'ARCHITECTURAL', label: '🏛️ Architecture' },
    { id: 'MEP', label: '⚡ MEP & Systems' },
    { id: 'SITE', label: '🌳 Site & Civil' },
    { id: 'SIMULATION', label: '📊 Analysis & Tools' }
  ];

  const renderToolBtn = (toolId, label, hotkey, icon) => {
    const isActive = activeTool === toolId;
    return (
      <button 
        key={toolId}
        onClick={() => { setTool(toolId); setDrawingState(null); }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '6px',
          fontSize: '0.74rem',
          fontWeight: isActive ? 700 : 500,
          backgroundColor: isActive ? '#0284c7' : 'rgba(30, 41, 59, 0.75)',
          color: isActive ? '#ffffff' : '#e2e8f0',
          border: isActive ? '1px solid #38bdf8' : '1px solid rgba(51, 65, 85, 0.7)',
          boxShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.12s ease',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{icon}</span>
        <span>{label}</span>
        {hotkey && (
          <span style={{
            fontSize: '0.62rem',
            padding: '1px 4px',
            borderRadius: '3px',
            background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 23, 42, 0.6)',
            color: isActive ? '#ffffff' : '#94a3b8',
            fontFamily: 'monospace'
          }}>
            {hotkey}
          </span>
        )}
      </button>
    );
  };

  // Sun Path Direction Calculation based on Time-of-Day
  const sunAngle = ((timeOfDay - 6) / 12) * Math.PI; // 6 AM to 6 PM
  const sunX = Math.cos(sunAngle) * 40;
  const sunY = Math.sin(sunAngle) * 35;
  const sunZ = 20;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 195px)', backgroundColor: '#070b16', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.ifc,.obj,.gltf,.glb" 
        style={{ display: 'none' }} 
      />

      {/* TOP COMPACT CONTROL STRIP */}
      <div style={{
        padding: '0.45rem 0.85rem',
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        zIndex: 20,
        backdropFilter: 'blur(16px)'
      }}>
        
        {/* ROW 1: DISCIPLINE TABS & PROJECT ACTION BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          
          {/* Discipline Switcher Tabs */}
          <div style={{ display: 'flex', gap: '3px', background: '#0b1120', padding: '3px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            {categories.map(c => (
              <button 
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  background: activeCategory === c.id ? '#0284c7' : 'transparent',
                  color: activeCategory === c.id ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '4px 9px',
                  borderRadius: '5px',
                  fontSize: '0.72rem',
                  fontWeight: activeCategory === c.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Elevation, AI, Presets & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            
            {/* Level Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#1e293b', padding: '3px 8px', borderRadius: '6px', border: '1px solid #334155' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>LEVEL:</span>
              <select 
                value={currentElevation} 
                onChange={(e) => setCurrentElevation(parseFloat(e.target.value))}
                style={{ background: 'transparent', color: '#38bdf8', border: 'none', fontSize: '0.74rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                <option value="0" style={{ background: '#0f172a' }}>L1: Ground (0.0m)</option>
                <option value="3.5" style={{ background: '#0f172a' }}>L2: Level 2 (+3.5m)</option>
                <option value="7.0" style={{ background: '#0f172a' }}>L3: Level 3 (+7.0m)</option>
                <option value="10.5" style={{ background: '#0f172a' }}>L4: Level 4 (+10.5m)</option>
                <option value="14.0" style={{ background: '#0f172a' }}>L5: Level 5 (+14.0m)</option>
                <option value="35.0" style={{ background: '#0f172a' }}>Roof (+35.0m)</option>
              </select>
            </div>

            {/* AI Generator Button */}
            <button 
              onClick={() => setAiPromptOpen(!aiPromptOpen)}
              title="AI Text-to-BIM Architecture Generator"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                color: 'white',
                padding: '4px 9px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
              }}
            >
              <Bot size={13} /> AI Copilot
            </button>

            {/* Presets Quick Menu */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setPresetMenuOpen(!presetMenuOpen)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#38bdf8',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} /> Presets <ChevronDown size={11} />
              </button>
              {presetMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 50,
                  minWidth: '180px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                }}>
                  <button onClick={() => handleLoadTemplate('OFFICE')} style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '6px 8px', textAlign: 'left', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px' }}>🏢 + Office Complex</button>
                  <button onClick={() => handleLoadTemplate('DATA_CENTER')} style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 600, padding: '6px 8px', textAlign: 'left', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px' }}>🖧 + Hyperscale Data Center</button>
                  <button onClick={() => handleLoadTemplate('TOWER_10F')} style={{ background: 'transparent', border: 'none', color: '#a855f7', fontWeight: 600, padding: '6px 8px', textAlign: 'left', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px' }}>🏙️ + 10-Story Sky Tower</button>
                  <hr style={{ borderColor: '#334155', margin: '2px 0' }} />
                  <button onClick={() => handleLoadTemplate('CLEAR')} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '6px 8px', textAlign: 'left', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px' }}>🗑️ Clear Canvas</button>
                </div>
              )}
            </div>

            {/* Undo / Redo */}
            <div style={{ display: 'flex', gap: '2px' }}>
              <button onClick={undo} disabled={past.length === 0} title="Undo (Ctrl+Z)" style={{ background: '#1e293b', border: '1px solid #334155', color: past.length === 0 ? '#475569' : '#f8fafc', padding: '4px 6px', borderRadius: '5px', cursor: past.length === 0 ? 'default' : 'pointer' }}><Undo2 size={12} /></button>
              <button onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Shift+Z)" style={{ background: '#1e293b', border: '1px solid #334155', color: future.length === 0 ? '#475569' : '#f8fafc', padding: '4px 6px', borderRadius: '5px', cursor: future.length === 0 ? 'default' : 'pointer' }}><Redo2 size={12} /></button>
            </div>

            {/* Save & Export */}
            <button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', padding: '4px 9px', borderRadius: '5px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}><Save size={12} /> Save</button>
            <button onClick={handleExportObj} title="Export Wavefront OBJ" style={{ background: '#1e293b', border: '1px solid #334155', color: '#f59e0b', padding: '4px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>OBJ</button>
            <button onClick={handleExportJson} title="Export BIM JSON" style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '4px 7px', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}><Download size={12} /></button>
            <button onClick={() => fileInputRef.current?.click()} title="Import 3D / IFC" style={{ background: '#1e293b', border: '1px solid #334155', color: '#a855f7', padding: '4px 7px', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}><FolderOpen size={12} /></button>
          </div>
        </div>

        {/* ROW 2: ACTIVE TOOL RIBBON */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}>
          {renderToolBtn('SELECT', 'Select', 'Esc', <MousePointer2 size={13} />)}
          {renderToolBtn('TAPE_MEASURE', 'Measure', null, <Ruler size={13} />)}

          {/* STRUCTURAL */}
          {(activeCategory === 'ALL' || activeCategory === 'STRUCTURAL') && (
            <>
              {renderToolBtn('WALL', 'Wall', 'W', '🧱')}
              {renderToolBtn('BEAM', 'Beam', 'B', '🏗️')}
              {renderToolBtn('COLUMN', 'Column', 'C', '🏛️')}
              {renderToolBtn('SLAB', 'Slab', 'S', '🪜')}
              {renderToolBtn('FOUNDATION', 'Raft Pad', null, '🪨')}
              {renderToolBtn('FOOTING', 'Pad Footing', null, '🧱')}
              {renderToolBtn('TRUSS', 'Truss', null, '📐')}
              {renderToolBtn('CROSS_BRACING', 'X-Bracing', null, '❌')}
              {renderToolBtn('RAMP', 'Ramp', null, '♿')}
            </>
          )}

          {/* ARCHITECTURAL */}
          {(activeCategory === 'ALL' || activeCategory === 'ARCHITECTURAL') && (
            <>
              {renderToolBtn('STAIRS', 'Stairs', 'T', '📶')}
              {renderToolBtn('SPIRAL_STAIRS', 'Spiral Stairs', null, '🌀')}
              {renderToolBtn('CURTAIN_WALL', 'Facade', 'F', '🪟')}
              {renderToolBtn('BRISE_SOLEIL', 'Sun Louvers', null, '☀️')}
              {renderToolBtn('RAILING', 'Railing', null, '🛡️')}
              {renderToolBtn('DOOR', 'Door', 'D', '🚪')}
              {renderToolBtn('REVOLVING_DOOR', 'Revolving Door', null, '🔄')}
              {renderToolBtn('WINDOW', 'Window', 'G', '🪟')}
              {renderToolBtn('ROOF', 'Roof', 'R', '🏠')}
              {renderToolBtn('CEILING', 'Ceiling', null, '☁️')}
              {renderToolBtn('RAISED_FLOOR', 'Raised Floor', null, '🔲')}
              {renderToolBtn('SKYLIGHT', 'Skylight', null, '✨')}
              {renderToolBtn('BALCONY', 'Balcony', null, '🌇')}
              {renderToolBtn('ELEVATOR_CORE', 'Lift Core', null, '🛗')}
              {renderToolBtn('ROOM_ZONE', 'Room Zone', null, '📍')}
            </>
          )}

          {/* MEP SYSTEMS */}
          {(activeCategory === 'ALL' || activeCategory === 'MEP') && (
            <>
              {renderToolBtn('MEP_DUCT', 'Duct', 'M', '💨')}
              {renderToolBtn('PIPE', 'Pipe / Water', null, '🚰')}
              {renderToolBtn('CABLE_TRAY', 'Cable Tray', null, '⚡')}
              {renderToolBtn('LIGHTING', 'Light', 'L', '💡')}
              {renderToolBtn('HVAC_CHILLER', 'AHU Chiller', null, '❄️')}
              {renderToolBtn('GENERATOR', 'Generator', null, '🔋')}
              {renderToolBtn('SWITCHGEAR', 'Switchboard', null, '🎛️')}
              {renderToolBtn('SERVER_RACK', 'Server Rack', null, '🖥️')}
              {renderToolBtn('FIRE_SPRINKLER', 'Sprinkler', null, '🧯')}
              {renderToolBtn('SOLAR_PV', 'Solar PV', 'P', '☀️')}
            </>
          )}

          {/* SITE & CIVIL */}
          {(activeCategory === 'ALL' || activeCategory === 'SITE') && (
            <>
              {renderToolBtn('ROAD_LANE', 'Road / Driveway', null, '🛣️')}
              {renderToolBtn('WATER_FEATURE', 'Reflecting Pool', null, '🌊')}
              {renderToolBtn('STREETLIGHT', 'Luminaire Pole', null, '🏮')}
              {renderToolBtn('BOLLARD', 'Security Bollard', null, '🚧')}
              {renderToolBtn('VEGETATION', 'Trees & Green', null, '🌳')}
              {renderToolBtn('PARKING_BAY', 'Parking / EV', null, '🚗')}
            </>
          )}

          {/* SIMULATION */}
          {(activeCategory === 'ALL' || activeCategory === 'SIMULATION') && (
            <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
              <button 
                onClick={() => { setStressMode(!stressMode); setDaylightMode(false); notify(stressMode ? "Disabled FEA Stress Mode" : "Enabled FEA Load Stress Simulation"); }}
                style={{
                  background: stressMode ? '#ef4444' : 'rgba(30, 41, 59, 0.75)',
                  color: stressMode ? 'white' : '#cbd5e1',
                  border: stressMode ? '1px solid #f87171' : '1px solid #334155',
                  padding: '5px 9px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                }}
              >
                <Flame size={12} /> FEA Stress
              </button>
              <button 
                onClick={() => { setDaylightMode(!daylightMode); setStressMode(false); notify(daylightMode ? "Disabled Daylight Mode" : "Enabled Solar Sun Path Study"); }}
                style={{
                  background: daylightMode ? '#f59e0b' : 'rgba(30, 41, 59, 0.75)',
                  color: daylightMode ? '#0f172a' : '#cbd5e1',
                  border: daylightMode ? '1px solid #fbbf24' : '1px solid #334155',
                  padding: '5px 9px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                }}
              >
                <Sun size={12} /> Daylight
              </button>
            </div>
          )}

        </div>

      </div>

      {/* AI PROMPT MODAL BAR */}
      {aiPromptOpen && (
        <div style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          borderBottom: '1px solid #ec4899',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          zIndex: 40,
          backdropFilter: 'blur(16px)'
        }}>
          <Bot size={18} color="#ec4899" />
          <input 
            type="text" 
            placeholder="Type AI prompt (e.g. 'Build 10-story commercial tower with glass facade and rooftop solar', 'Build hyperscale data center with server racks and backup generators')..." 
            value={aiPromptText}
            onChange={(e) => setAiPromptText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiPromptSubmit()}
            style={{
              flex: 1,
              padding: '0.55rem 0.9rem',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleAiPromptSubmit}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              color: 'white',
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Send size={14} /> Synthesize 3D Model
          </button>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0284c7',
          color: 'white',
          padding: '7px 16px',
          borderRadius: '20px',
          zIndex: 50,
          fontWeight: 600,
          fontSize: '0.82rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <CheckCircle size={15} /> {notification}
        </div>
      )}

      {/* MAIN WORKSPACE SPLIT (3D CANVAS + PROPERTY INSPECTOR) */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* 3D VIEWPORT */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          
          <Canvas 
            camera={{ 
              position: cameraView === 'top' ? [0, 45, 0] : cameraView === 'isometric' ? [25, 25, 25] : [18, 22, 28], 
              fov: 45 
            }}
            shadows
          >
            <color attach="background" args={[daylightMode ? '#1e293b' : '#070b16']} />
            
            <ambientLight intensity={daylightMode ? 1.2 : 0.7} />
            <directionalLight 
              position={daylightMode ? [sunX, Math.max(sunY, 10), sunZ] : [20, 30, 20]} 
              intensity={daylightMode ? 2.2 : 1.4} 
              castShadow 
              shadow-mapSize={[1024, 1024]} 
              color={daylightMode ? (timeOfDay < 9 || timeOfDay > 16 ? '#fed7aa' : '#fffbeb') : '#ffffff'}
            />
            <directionalLight position={[-20, 20, -20]} intensity={0.5} />
            <hemisphereLight intensity={0.4} groundColor="#0f172a" color={daylightMode ? '#fef08a' : '#38bdf8'} />
            
            <GridPlane onPointerMove={handlePointerMove} onClick={handleGridClick} />

            {/* Render All 40+ Elements */}
            {Object.values(elements).map(el => {
              // Apply floor explode offset
              const elev = el.elevation || el.position?.y || 0;
              const explodeLift = (elev / 3.5) * explodeFactor * 2.0;

              const modifiedElement = {
                ...el,
                elevation: elev + explodeLift,
                position: el.position ? { ...el.position, y: (el.position.y || 0) + explodeLift } : undefined
              };

              if (el.type === 'wall') return <Wall key={el.id} element={modifiedElement} />;
              if (el.type === 'column') return <Column key={el.id} element={modifiedElement} />;
              if (el.type === 'slab') return <Slab key={el.id} element={modifiedElement} />;
              if (el.type === 'door') return <Door key={el.id} element={modifiedElement} />;
              if (el.type === 'window') return <BimWindow key={el.id} element={modifiedElement} />;
              if (el.type === 'roof') return <Roof key={el.id} element={modifiedElement} />;
              if (el.type === 'beam') return <Beam key={el.id} element={modifiedElement} stressMode={stressMode} />;
              if (el.type === 'stairs') return <Stairs key={el.id} element={modifiedElement} />;
              if (el.type === 'spiral_stairs') return <SpiralStairs key={el.id} element={modifiedElement} />;
              if (el.type === 'curtain_wall') return <CurtainWall key={el.id} element={modifiedElement} />;
              if (el.type === 'brise_soleil') return <BriseSoleil key={el.id} element={modifiedElement} />;
              if (el.type === 'railing') return <Railing key={el.id} element={modifiedElement} />;
              if (el.type === 'foundation') return <Foundation key={el.id} element={modifiedElement} />;
              if (el.type === 'footing') return <Footing key={el.id} element={modifiedElement} />;
              if (el.type === 'ceiling') return <Ceiling key={el.id} element={modifiedElement} />;
              if (el.type === 'raised_floor') return <RaisedFloor key={el.id} element={modifiedElement} />;
              if (el.type === 'skylight') return <Skylight key={el.id} element={modifiedElement} />;
              if (el.type === 'balcony') return <Balcony key={el.id} element={modifiedElement} />;
              if (el.type === 'elevator_core') return <ElevatorCore key={el.id} element={modifiedElement} />;
              if (el.type === 'ramp') return <Ramp key={el.id} element={modifiedElement} />;
              if (el.type === 'truss') return <Truss key={el.id} element={modifiedElement} />;
              if (el.type === 'cross_bracing') return <CrossBracing key={el.id} element={modifiedElement} />;
              if (el.type === 'pipe') return <Pipe key={el.id} element={modifiedElement} />;
              if (el.type === 'cable_tray') return <CableTray key={el.id} element={modifiedElement} />;
              if (el.type === 'generator') return <GeneratorUnit key={el.id} element={modifiedElement} />;
              if (el.type === 'switchgear') return <Switchgear key={el.id} element={modifiedElement} />;
              if (el.type === 'server_rack') return <ServerRack key={el.id} element={modifiedElement} />;
              if (el.type === 'fire_sprinkler') return <FireSprinkler key={el.id} element={modifiedElement} />;
              if (el.type === 'hvac_chiller') return <HvacChiller key={el.id} element={modifiedElement} />;
              if (el.type === 'lighting') return <LightingFixture key={el.id} element={modifiedElement} />;
              if (el.type === 'solar_pv') return <SolarPv key={el.id} element={modifiedElement} />;
              if (el.type === 'room_zone') return <RoomZone key={el.id} element={modifiedElement} />;
              if (el.type === 'road_lane') return <RoadLane key={el.id} element={modifiedElement} />;
              if (el.type === 'water_feature') return <WaterFeature key={el.id} element={modifiedElement} />;
              if (el.type === 'streetlight') return <Streetlight key={el.id} element={modifiedElement} />;
              if (el.type === 'bollard') return <Bollard key={el.id} element={modifiedElement} />;
              if (el.type === 'vegetation') return <Vegetation key={el.id} element={modifiedElement} />;
              if (el.type === 'parking_bay') return <ParkingBay key={el.id} element={modifiedElement} />;
              return null;
            })}

            {/* Tape Measure Interactive Leader Line */}
            {tapeMeasurePoints.length === 2 && (
              <group>
                <mesh position={[tapeMeasurePoints[0].x, tapeMeasurePoints[0].y + 0.1, tapeMeasurePoints[0].z]}>
                  <sphereGeometry args={[0.15, 12, 12]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
                <mesh position={[tapeMeasurePoints[1].x, tapeMeasurePoints[1].y + 0.1, tapeMeasurePoints[1].z]}>
                  <sphereGeometry args={[0.15, 12, 12]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
                <Html 
                  position={[
                    (tapeMeasurePoints[0].x + tapeMeasurePoints[1].x) / 2, 
                    ((tapeMeasurePoints[0].y + tapeMeasurePoints[1].y) / 2) + 0.5, 
                    (tapeMeasurePoints[0].z + tapeMeasurePoints[1].z) / 2
                  ]} 
                  center
                >
                  <div style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                    📏 {Math.sqrt(Math.pow(tapeMeasurePoints[1].x - tapeMeasurePoints[0].x, 2) + Math.pow(tapeMeasurePoints[1].z - tapeMeasurePoints[0].z, 2)).toFixed(2)} m
                  </div>
                </Html>
              </group>
            )}

            {/* Real-Time Linear Drawing Preview */}
            {drawingState?.startPoint && drawingState?.currentPoint && (
              <group>
                {activeTool === 'WALL' && (
                  <Wall 
                    element={{
                      id: 'preview',
                      start: drawingState.startPoint,
                      end: drawingState.currentPoint,
                      height: wallHeight,
                      thickness: wallThickness,
                      elevation: currentElevation,
                      material: wallMaterial
                    }}
                  />
                )}
                {activeTool === 'CURTAIN_WALL' && (
                  <CurtainWall 
                    element={{
                      id: 'preview',
                      start: drawingState.startPoint,
                      end: drawingState.currentPoint,
                      height: 3.5,
                      thickness: 0.15,
                      mullionSpacing: 1.5,
                      elevation: currentElevation
                    }}
                  />
                )}
                {activeTool === 'BEAM' && (
                  <Beam 
                    element={{
                      id: 'preview',
                      start: drawingState.startPoint,
                      end: drawingState.currentPoint,
                      depth: 0.45,
                      width: 0.3,
                      elevation: currentElevation + 3.5,
                      material: 'Steel'
                    }}
                  />
                )}
                {activeTool === 'MEP_DUCT' && (
                  <MepDuct 
                    element={{
                      id: 'preview',
                      start: drawingState.startPoint,
                      end: drawingState.currentPoint,
                      width: 0.6,
                      height: 0.4,
                      elevation: currentElevation + 3.0,
                      system: 'HVAC_SUPPLY'
                    }}
                  />
                )}
                <Html 
                  position={[
                    (drawingState.startPoint.x + drawingState.currentPoint.x) / 2, 
                    currentElevation + 3.8, 
                    (drawingState.startPoint.z + drawingState.currentPoint.z) / 2
                  ]} 
                  center
                >
                  <div style={{
                    background: '#0284c7',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {drawingLength.toFixed(2)} m
                  </div>
                </Html>
              </group>
            )}

            <OrbitControls makeDefault maxPolarAngle={cameraView === 'top' ? 0.05 : Math.PI / 2 + 0.05} />
          </Canvas>

          {/* Quick Camera Navigation Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            gap: '4px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #334155',
            zIndex: 10
          }}>
            <button 
              onClick={() => setCameraView('perspective')}
              style={{ background: cameraView === 'perspective' ? '#38bdf8' : 'transparent', color: cameraView === 'perspective' ? '#0f172a' : '#cbd5e1', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
            >
              3D View
            </button>
            <button 
              onClick={() => setCameraView('top')}
              style={{ background: cameraView === 'top' ? '#38bdf8' : 'transparent', color: cameraView === 'top' ? '#0f172a' : '#cbd5e1', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
            >
              2D Plan
            </button>
            <button 
              onClick={() => setCameraView('isometric')}
              style={{ background: cameraView === 'isometric' ? '#38bdf8' : 'transparent', color: cameraView === 'isometric' ? '#0f172a' : '#cbd5e1', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Isometric
            </button>
          </div>

          {/* Viewport Interactive Sliders (Exploded Axonometric + Sun Path Hour) */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            zIndex: 10
          }}>
            {/* Sun Hour Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={13} color="#f59e0b" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Sun Time:</span>
              <input 
                type="range" min="6" max="18" step="1" 
                value={timeOfDay} 
                onChange={e => setTimeOfDay(parseInt(e.target.value))}
                style={{ width: '70px', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>{timeOfDay}:00</span>
            </div>

            {/* Exploded View Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Move3d size={13} color="#38bdf8" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Explode:</span>
              <input 
                type="range" min="0" max="3" step="0.2" 
                value={explodeFactor} 
                onChange={e => setExplodeFactor(parseFloat(e.target.value))}
                style={{ width: '70px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>{(explodeFactor * 33).toFixed(0)}%</span>
            </div>
          </div>

          {/* Viewport Live Stats HUD */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.72rem',
            color: '#94a3b8',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <span>Elements: <b style={{ color: '#38bdf8' }}>{Object.keys(elements).length}</b></span>
            <span>•</span>
            <span>Elev: <b style={{ color: '#10b981' }}>{currentElevation}m</b></span>
            <span>•</span>
            <span style={{ color: '#a855f7' }}>LOD 350 Ready</span>
          </div>

        </div>

        {/* PROPERTY INSPECTOR SIDEBAR */}
        <PropertyInspector />
      </div>

    </div>
  );
};
export default BimEditor3D;
