/**
 * BuildSphere AI: Dedicated Portal Domain Datasets Engine
 * Provides distinct, realistic, domain-tailored datasets for every tool, tab, and submodule across all 25 role portals.
 */

export function getDomainDatasetsForTitle(title = '', description = '') {
  const t = (title || '').toLowerCase();

  // =========================================================================
  // 1. ARCHITECTURAL 3D MODELING & DESIGN (WALL, DOOR, WINDOW, ROOF, FLOOR, STAIR)
  // =========================================================================
  if (t.includes('wall tool') || (t.includes('wall') && !t.includes('retaining') && !t.includes('shear'))) {
    return [
      { id: 1, name: 'Curtain Wall - Double Glazed Low-E 250mm', category: 'Exterior Facade', progress: 95, status: 'Active', value: '3.8m Height', updated: '5 mins ago', specs: 'U-Value: 1.4 W/m²K, STC: 45dB, Thermal Break Frame' },
      { id: 2, name: 'Acoustic Drywall Partition 150mm', category: 'Interior Partition', progress: 100, status: 'Completed', value: '3.0m Height', updated: '15 mins ago', specs: 'STC: 52dB, Glasswool 50mm, 2-Hr Fire Rated (BS 476)' },
      { id: 3, name: 'Autoclaved Aerated Concrete (AAC) 200mm', category: 'External Infill', progress: 85, status: 'Active', value: '3.6m Height', updated: '30 mins ago', specs: 'Density: 650 kg/m³, Thermal Conductivity: 0.16 W/mK' },
      { id: 4, name: 'Reinforced Concrete Core Wall 300mm', category: 'Core Structural', progress: 90, status: 'Active', value: '4.2m Height', updated: '1 hour ago', specs: 'Concrete: M40, Rebar: Fe500D 20T@150 T&B Mesh' },
      { id: 5, name: 'Fire-Resistant Shaft Wall 200mm', category: 'Service Core', progress: 100, status: 'Completed', value: '4.0m Height', updated: '2 hours ago', specs: 'Fire Rating: 4 Hours, Core Board 25mm Gypsum' }
    ];
  }

  if (t.includes('door tool') || t.includes('door')) {
    return [
      { id: 1, name: 'Single-Flush Solid Core Timber Door (900x2100mm)', category: 'Interior Doors', progress: 95, status: 'Active', value: '900 x 2100mm', updated: '3 mins ago', specs: 'Fire Rating: 60-min, SS304 Lever Handle, Heavy Duty Hinges' },
      { id: 2, name: 'Double-Egress Steel Fire Exit Door (1800x2100mm)', category: 'Emergency Egress', progress: 100, status: 'Completed', value: '1800 x 2100mm', updated: '10 mins ago', specs: 'Fire Rating: 120-min (UL Listed), Panic Crash Bar, Smoke Gasket' },
      { id: 3, name: 'Automatic 3-Wing Glass Revolving Door (2400mm Dia)', category: 'Entrance Foyer', progress: 85, status: 'Active', value: '2400mm Dia', updated: '25 mins ago', specs: 'Motion Radar, Speed: 3 RPM, Emergency Collapsible Wings' },
      { id: 4, name: 'Acoustic Sliding Pocket Door (1200x2400mm)', category: 'Meeting Rooms', progress: 78, status: 'In Progress', value: '1200 x 2400mm', updated: '1 hour ago', specs: 'STC: 44dB Drop Seal, Soft-Close Damper, Frosted 10mm Glass' },
      { id: 5, name: 'Heavy-Duty Motorized Rolling Shutter (4000x4500mm)', category: 'Loading Bay', progress: 90, status: 'Active', value: '4000 x 4500mm', updated: '2 hours ago', specs: 'Motor: 3-Phase 1.5kW, WindLock Class 3, Chain Override' }
    ];
  }

  if (t.includes('window tool') || t.includes('window')) {
    return [
      { id: 1, name: 'Fixed Low-E High-Performance DGU (1500x1200mm)', category: 'External Glazing', progress: 92, status: 'Active', value: '1500 x 1200mm', updated: '8 mins ago', specs: 'U-Value: 1.35 W/m²K, SHGC: 0.28, VLT: 62%, Argon Gas' },
      { id: 2, name: 'Top-Hung Friction Stay Casement Window (1200x1500mm)', category: 'Natural Vent', progress: 88, status: 'Active', value: '1200 x 1500mm', updated: '20 mins ago', specs: 'EPDM Gaskets, Air Infiltration: <0.08 CFM/ft², Multi-Lock' },
      { id: 3, name: 'Motorized Smoke Exhaust Louver Window (1800x1200mm)', category: 'Life Safety', progress: 100, status: 'Completed', value: '1800 x 1200mm', updated: '1 hour ago', specs: 'Actuator: 24V DC 300mm Stroke, BMS Linked Auto-Open' },
      { id: 4, name: 'Acoustic Glazed Ribbon Clerestory (6000x900mm)', category: 'Daylighting', progress: 80, status: 'In Progress', value: '6000 x 900mm', updated: '3 hours ago', specs: 'STC: 42dB, Ceramic Frit 40% Glare Reduction' }
    ];
  }

  if (t.includes('roof tool') || t.includes('roof')) {
    return [
      { id: 1, name: 'Inverted Insulated Warm Roof System', category: 'Flat Roofing', progress: 90, status: 'Active', value: '1,450 m²', updated: '12 mins ago', specs: 'Waterproofing: EPDM 1.5mm, XPS Insulation: 75mm, Slope: 1:50' },
      { id: 2, name: 'Extensive Green Vegetative Eco-Roof', category: 'Sustainability', progress: 75, status: 'In Progress', value: '650 m²', updated: '40 mins ago', specs: 'Sedum Mat, Drainage & Water Storage Cell 30mm, Filter Mat' },
      { id: 3, name: 'Standing Seam Aluminum Metal Roof', category: 'Canopy & Feature', progress: 100, status: 'Completed', value: '820 m²', updated: '2 hours ago', specs: 'Grade: Al 3004, PVDF Coated 3-Coat, Concealed Clip Fixing' }
    ];
  }

  if (t.includes('floor tool') || (t.includes('floor') && !t.includes('plan')) || t.includes('slab')) {
    return [
      { id: 1, name: 'Post-Tensioned Flat Floor Slab 200mm', category: 'Superstructure', progress: 94, status: 'Active', value: '250 m²', updated: '10 mins ago', specs: 'Tendons: 12.7mm Unbonded Mono-Strand, Drop Panels: 300mm, M40' },
      { id: 2, name: 'Precast Prestressed Hollow Core Plank 250mm', category: 'Fast-Track Slab', progress: 100, status: 'Completed', value: '450 m²', updated: '30 mins ago', specs: 'Span: 9.0m, Structural Screed: 65mm M30 with Welded Mesh' },
      { id: 3, name: 'Heavy-Duty Raised Access Flooring 150mm', category: 'Data Center', progress: 85, status: 'In Progress', value: '180 m²', updated: '1 hour ago', specs: 'Point Load: 4.5 kN, Tile: High Pressure Laminate Antistatic' }
    ];
  }

  if (t.includes('stair tool') || t.includes('stair')) {
    return [
      { id: 1, name: 'Doglegged Monolithic RCC Staircase', category: 'Fire Escape', progress: 100, status: 'Completed', value: '1.5m Width', updated: '20 mins ago', specs: 'Tread: 300mm, Riser: 150mm, NBC 2024 Compliant, Waist: 175mm' },
      { id: 2, name: 'Structural Steel Open-Riser Architectural Stair', category: 'Lobby Feature', progress: 82, status: 'Active', value: '2.0m Width', updated: '45 mins ago', specs: 'Stringers: Built-Up Box Section S355JR, Glass Balustrade 15mm' },
      { id: 3, name: 'Precast Concrete Emergency Stair Flight', category: 'Core Circulation', progress: 90, status: 'Active', value: '1.2m Width', updated: '2 hours ago', specs: 'Landing: Integrated, Non-Slip Grooved Nosing, M40 Grade' }
    ];
  }

  if (t.includes('parametric families') || t.includes('family library') || t.includes('bim properties')) {
    return [
      { id: 1, name: 'Parametric Motorized Solar Louver Assembly', category: 'Dynamic Shading', progress: 95, status: 'Active', value: 'LOD 350 Family', updated: '15 mins ago', specs: 'Angle Parameter: 0°-90°, Sun Tracking Formula, Revit RFA' },
      { id: 2, name: 'Modular Structural Glazing Spider Bracket', category: 'Facade Hardware', progress: 100, status: 'Completed', value: '4-Way Articulated', updated: '45 mins ago', specs: 'Material: Cast SS316, Load Rating: 6.5 kN Shear, M16 Bolt' },
      { id: 3, name: 'Parametric Coffered Ceiling Grid Panel', category: 'Interior Acoustic', progress: 88, status: 'Active', value: '1200x1200mm Mod', updated: '2 hours ago', specs: 'Recess Depth: 200mm, Diffuser Opening: 600x600, NRC: 0.85' }
    ];
  }

  // =========================================================================
  // 2. FLOOR PLANS & SPACE PLANNING
  // =========================================================================
  if (t.includes('residential') || t.includes('floor plan') || t.includes('layouts')) {
    return [
      { id: 1, name: 'Type A - 3BHK Luxury Residential Layout', category: 'Unit Master', progress: 98, status: 'Active', value: '185 m² Carpet', updated: '10 mins ago', specs: 'Bedrooms: 3, Balconies: 2, Vastu Compliant, RERA Ratio: 0.82' },
      { id: 2, name: 'Type B - 2BHK Compact Smart Living Layout', category: 'Unit Standard', progress: 100, status: 'Completed', value: '98 m² Carpet', updated: '25 mins ago', specs: 'Bedrooms: 2, Modular Kitchen, Cross Ventilation: 100%' },
      { id: 3, name: 'Type P - Penthouse Duplex Terrace Suite', category: 'Executive Top', progress: 90, status: 'Active', value: '420 m² Built-Up', updated: '1 hour ago', specs: 'Private Plunge Pool, Double Height Living, 360° Deck' }
    ];
  }

  if (t.includes('commercial') || t.includes('space allocation') || t.includes('space planning') || t.includes('occupancy')) {
    return [
      { id: 1, name: 'Open Plan Collaborative Workstation Core', category: 'Workplace Zone', progress: 94, status: 'Active', value: '140 Desks / 650 m²', updated: '15 mins ago', specs: 'Density: 4.6 m²/person, Acoustic Pods: 8, Linear Power Trunking' },
      { id: 2, name: 'Executive Boardroom & Video Conference Hall', category: 'Meeting Spaces', progress: 100, status: 'Completed', value: '28 Seats / 95 m²', updated: '30 mins ago', specs: 'Dual 98" Displays, Beamforming Mic Arrays, STC 54 Partition' },
      { id: 3, name: 'Tier III Server Data Hall & UPS Battery Room', category: 'Mission Critical', progress: 92, status: 'Active', value: '24 Racks / 120 m²', updated: '2 hours ago', specs: 'In-Row Precision Cooling, FM200 Fire Gas, Raised Floor 300mm' }
    ];
  }

  // =========================================================================
  // 3. FACADE & MATERIAL LIBRARIES
  // =========================================================================
  if (t.includes('facade') || t.includes('curtain wall') || t.includes('cladding') || t.includes('glass systems')) {
    return [
      { id: 1, name: 'Unitized DGU Curtain Wall Panel (1500x3800mm)', category: 'Glazing System', progress: 88, status: 'Active', value: '6,200 m²', updated: '15 mins ago', specs: 'Outer: 8mm Low-E, Gap: 12mm Argon, Inner: 6mm Clear, Wind: 2.4 kPa' },
      { id: 2, name: 'Perforated Anodized Aluminum Rain-Screen (3mm)', category: 'Feature Cladding', progress: 74, status: 'In Progress', value: '2,400 m²', updated: '40 mins ago', specs: 'Alloy: 5052-H32, Anodized 25 Microns Natural Silver, Open: 32%' },
      { id: 3, name: 'Terracotta Baguette Sun Louver Blades (50x150mm)', category: 'Solar Shading', progress: 95, status: 'Active', value: '1,100 pcs', updated: '1 hour ago', specs: 'Natural Clay Extruded, Stainless Steel Internal Core Rod' }
    ];
  }

  if (t.includes('concrete') || t.includes('material library') || t.includes('materials')) {
    return [
      { id: 1, name: 'Design Mix M40 Self-Compacting Concrete (SCC)', category: 'Ready-Mix Concrete', progress: 92, status: 'Active', value: '2,450 cum', updated: '10 mins ago', specs: 'Slump Flow: 650mm, 28d Strength: 46.2 MPa, Flyash: 25%' },
      { id: 2, name: 'Design Mix M50 High-Strength Core Concrete', category: 'High-Rise Columns', progress: 85, status: 'Active', value: '1,200 cum', updated: '30 mins ago', specs: 'Micro-Silica: 7.5%, Water-Binder Ratio: 0.30, 28d Strength: 58.4 MPa' },
      { id: 3, name: 'M15 Lean Concrete Blinding (PCC 100mm)', category: 'Substructure Base', progress: 100, status: 'Completed', value: '650 cum', updated: '2 hours ago', specs: 'Nominal Mix 1:2:4, 28d Strength: 18.5 MPa' }
    ];
  }

  if (t.includes('steel')) {
    return [
      { id: 1, name: 'Tata Tiscon 550D High-Ductility TMT Rebar', category: 'Reinforcement', progress: 90, status: 'Active', value: '380 MT', updated: '15 mins ago', specs: 'Yield: 550 MPa, UTS: 610 MPa, Elongation: 16%, Fe 500D IS 1786' },
      { id: 2, name: 'Structural Steel Hot Rolled Sections (ISMB / ISMC)', category: 'Structural Steel', progress: 100, status: 'Completed', value: '145 MT', updated: '1 hour ago', specs: 'Grade: IS 2062 E250/E350, Ultrasonic Tested Level 1' }
    ];
  }

  // =========================================================================
  // 4. CODE COMPLIANCE, NBC, LEED & SUSTAINABILITY
  // =========================================================================
  if (t.includes('compliance') || t.includes('nbc') || t.includes('fire safety') || t.includes('code')) {
    return [
      { id: 1, name: 'NBC 2024 Clause 4.4: Maximum Fire Travel Distance', category: 'Life Safety Egress', progress: 100, status: 'Completed', value: '24.5m Actual (< 30m)', updated: '10 mins ago', specs: 'Two Independent Staircases, Direct Ground Exit Access' },
      { id: 2, name: 'NBC Part 3: Minimum Fire Corridor Width', category: 'Egress Capacity', progress: 100, status: 'Completed', value: '1.8m Actual (≥ 1.5m)', updated: '30 mins ago', specs: 'Wheelchair Turning Radius: 1.5m Cleared, Handrail Protrusion < 100mm' },
      { id: 3, name: 'RERA & Master Plan FAR Utilization Ratio', category: 'Zoning & FAR', progress: 96, status: 'Active', value: '3.42 / 3.50 Max', updated: '1 hour ago', specs: 'Gross Floor Area: 42,500 m², Ground Coverage: 36.5% (Max 40%)' }
    ];
  }

  if (t.includes('sustainability') || t.includes('leed') || t.includes('igbc') || t.includes('carbon')) {
    return [
      { id: 1, name: 'LEED v4.1 Platinum Certification Scorecard', category: 'Green Rating', progress: 94, status: 'Active', value: '86 Points Tracked', updated: '15 mins ago', specs: 'Energy & Atmosphere: 32/33, Water Efficiency: 11/11, Materials: 12/13' },
      { id: 2, name: 'Whole Building Life Cycle Embodied Carbon (EC3)', category: 'Embodied Carbon', progress: 88, status: 'Active', value: '312 kg CO₂e/m²', updated: '45 mins ago', specs: 'Baseline Reduction: 28.5%, Low-Carbon Concrete & Recycled Steel' },
      { id: 3, name: 'Rainwater Harvesting & Recharge Pit Matrix', category: 'Water Balance', progress: 100, status: 'Completed', value: '120 kL Sump + 4 Pits', updated: '2 hours ago', specs: '100% Roof Runoff Captured, Dual-Media Sand Filtration' }
    ];
  }

  // =========================================================================
  // 5. CLASH DETECTION & MODEL FEDERATION
  // =========================================================================
  if (t.includes('clash') || t.includes('coordination') || t.includes('federation')) {
    return [
      { id: 1, name: 'Clash #104: Main HVAC Duct vs Structural Transfer Beam B-12', category: 'Hard Clash (P1)', progress: 90, status: 'In Progress', value: '45mm Penetration', updated: '5 mins ago', specs: 'Resolution: Sleeve Box 600x300 Cast-in-Beam Approved by SE' },
      { id: 2, name: 'Clash #108: Chilled Water 200mm Pipe vs Cable Tray Riser', category: 'Clearance Clash (P2)', progress: 100, status: 'Completed', value: '60mm Clearance', updated: '20 mins ago', specs: 'Resolution: Tray Rerouted 150mm East on Level 2 Corridor' },
      { id: 3, name: 'Clash #115: Sprinkler Pipe Drop vs Ceiling Bulkhead Gypsum', category: 'Soft Clash (P3)', progress: 100, status: 'Completed', value: 'No Clearance', updated: '1 hour ago', specs: 'Resolution: Flexible Sprinkler Hose Dropper Spec Updated' }
    ];
  }

  // =========================================================================
  // 6. STRUCTURAL & CIVIL: COLUMNS, BEAMS, FOUNDATIONS, GRADING
  // =========================================================================
  if (t.includes('column') || t.includes('beam') || t.includes('framing') || t.includes('load combinations')) {
    return [
      { id: 1, name: 'Primary Ground Column C1 (600x600mm M40)', category: 'RC Column', progress: 96, status: 'Active', value: '4,850 kN Capacity', updated: '10 mins ago', specs: 'Pu: 4850 kN, Longitudinal: 8-25T Fe500D, Ties: 8T@150mm c/c' },
      { id: 2, name: 'Transfer Plate Column C-TR5 (800x800mm M50)', category: 'Heavy Column', progress: 88, status: 'Active', value: '8,200 kN Capacity', updated: '25 mins ago', specs: 'Pu: 8200 kN, Rebar: 16-32T Fe550D, Ductile Detailing: IS 13920' },
      { id: 3, name: 'Floor Primary Girder B101 (300x600mm M35)', category: 'Framing Beam', progress: 92, status: 'Active', value: '6.0m Span', updated: '1 hour ago', specs: 'Mu: 240 kNm, Top: 3-20T, Bottom: 4-20T, Shear: 2L-8T@120mm' }
    ];
  }

  if (t.includes('foundation') || t.includes('footing') || t.includes('raft') || t.includes('pile') || t.includes('substructure')) {
    return [
      { id: 1, name: 'Heavy Reinforced Concrete Raft Mat (1200mm Thk)', category: 'Mat Foundation', progress: 100, status: 'Completed', value: '1,850 m²', updated: '15 mins ago', specs: 'Concrete: M40, Rebar: 20T@150 T&B Mesh, Safe Bearing Cap: 250 kN/m²' },
      { id: 2, name: 'Bored Cast-in-Situ RC Pile P-800 (800mm Dia x 28m)', category: 'Deep Foundation', progress: 92, status: 'Active', value: '72 Piles', updated: '45 mins ago', specs: 'Capacity: 3,200 kN, Socket: 3.5m in Basalt Rock, Integrity Test: 100% Pass' },
      { id: 3, name: 'Isolated Pad Footing F-01 (2500x2500x750mm)', category: 'Shallow Footing', progress: 100, status: 'Completed', value: '18 Nos', updated: '2 hours ago', specs: 'SBC: 220 kN/m², Concrete: M35, Clear Cover: 50mm' }
    ];
  }

  if (t.includes('cut/fill') || t.includes('grading') || t.includes('earthwork') || t.includes('pavement')) {
    return [
      { id: 1, name: 'Site Earthwork Mass Cut & Fill Excavation', category: 'Bulk Earthwork', progress: 88, status: 'Active', value: '18,500 m³ Cut', updated: '20 mins ago', specs: 'Fill: 17,950 m³, Net Import: +550 m³ (Near-Zero Waste), Slope: 1:100' },
      { id: 2, name: 'Heavy-Duty Pavement Quality Concrete (PQC 280mm)', category: 'Roadways', progress: 95, status: 'Active', value: '3,800 m²', updated: '45 mins ago', specs: 'DLC Subbase: 150mm, GSB: 200mm, Dowel Bars: 32mm @ 300 c/c' }
    ];
  }

  // =========================================================================
  // 7. MEP: HVAC, CHILLER, DUCTWORK, PIPING, ELECTRICAL, FIRE
  // =========================================================================
  if (t.includes('hvac') || t.includes('chiller') || t.includes('duct') || t.includes('cooling')) {
    return [
      { id: 1, name: 'Water-Cooled Centrifugal Chiller (500 TR VFD)', category: 'Central Plant', progress: 96, status: 'Active', value: '500 TR / 270 kW', updated: '10 mins ago', specs: 'IKW/TR: 0.54, Refrigerant: R-134a, Chilled Water: 6.7°C, Flow: 1200 GPM' },
      { id: 2, name: 'Supply Air Main Duct (1200x500mm Galvanized GI)', category: 'Air Distribution', progress: 90, status: 'Active', value: '6,500 CFM', updated: '20 mins ago', specs: 'Velocity: 1,100 FPM, Static Drop: 0.08 in.wg/100ft, Insulation: 25mm' },
      { id: 3, name: 'Air Handling Unit AHU-FL1-01 (12,000 CFM Double Skin)', category: 'Air Handling', progress: 85, status: 'In Progress', value: '12,000 CFM', updated: '1 hour ago', specs: 'Fan: EC Plug Fan VFD, Coil: 6-Row DX, Filters: MERV 13 + Pre-filter' }
    ];
  }

  if (t.includes('electrical') || t.includes('switchgear') || t.includes('panel') || t.includes('transformer') || t.includes('power')) {
    return [
      { id: 1, name: 'Main LT Distribution Switchboard (2500A 4P 50kA)', category: 'Power Distribution', progress: 95, status: 'Active', value: '415V 50kA Form 4b', updated: '15 mins ago', specs: 'ACB: 2500A Microprocessor Trip, Busbar: Electrolytic Copper, IP54' },
      { id: 2, name: '11kV / 415V 2000 kVA Oil-Cooled Step-Down Transformer', category: 'Substation', progress: 100, status: 'Completed', value: '2000 kVA', updated: '30 mins ago', specs: 'Vector: Dyn11, Impedance: 5.5%, Off-Circuit Tap Changer ±5%' },
      { id: 3, name: 'Sandwich Copper Busduct Riser (1600A 3P+N+E)', category: 'Vertical Power', progress: 90, status: 'Active', value: '120m Height', updated: '2 hours ago', specs: 'Insulation: Mylar Class F, Tap-Off Boxes: 250A per floor' }
    ];
  }

  if (t.includes('plumbing') || t.includes('piping') || t.includes('fire') || t.includes('water')) {
    return [
      { id: 1, name: 'Chilled Water Supply/Return Header (200mm MS Sch 40)', category: 'Hydronic Piping', progress: 92, status: 'Active', value: '1,200 GPM', updated: '15 mins ago', specs: 'Pressure: 16 Bar Test, Insulation: 50mm Nitrile Rubber Closed Cell' },
      { id: 2, name: 'Automatic Wet Sprinkler Network (Red Bulb 68°C)', category: 'Fire Suppression', progress: 98, status: 'Active', value: '450 Sprinklers', updated: '40 mins ago', specs: 'K-Factor: 80, Coverage: 12 m²/head, Pressure: 3.5 Bar at Remote Point' },
      { id: 3, name: 'Hydro-Pneumatic Domestic Water Booster System', category: 'Water Supply', progress: 100, status: 'Completed', value: '450 LPM @ 6 Bar', updated: '1 hour ago', specs: 'Pumps: 2 Working + 1 Standby Grundfos, VFD Control Panel' }
    ];
  }

  // =========================================================================
  // 8. DIGITAL TWIN & IOT SENSORS
  // =========================================================================
  if (t.includes('twin') || t.includes('iot') || t.includes('sensor') || t.includes('telemetry')) {
    return [
      { id: 1, name: 'Chiller Bearing Triaxial Vibration Node (SN-VIB-8821)', category: 'Condition Monitoring', progress: 99, status: 'Active', value: '0.82 mm/s RMS', updated: 'Just now', specs: 'Sampling: 1000 Hz, Temp: 48.6°C, Health: Optimal (ISO 10816)' },
      { id: 2, name: 'Main Feeder Modbus Smart Power Meter (SN-PWR-104)', category: 'Energy Sub-meter', progress: 100, status: 'Active', value: '412.5 kW', updated: 'Just now', specs: 'Power Factor: 0.98, Daily Energy: 5,840 kWh, Harmonics THD: 1.8%' },
      { id: 3, name: 'Open Office IAQ Multi-Sensor (SN-IAQ-402)', category: 'Indoor Environment', progress: 98, status: 'Active', value: '540 ppm CO₂', updated: 'Just now', specs: 'PM2.5: 12.4 ug/m³, Temp: 23.2°C, RH: 52%, ASHRAE 62.1: Pass' }
    ];
  }

  // =========================================================================
  // 9. COST, BOQ & QUANTITY TAKE-OFF (QTO)
  // =========================================================================
  if (t.includes('cost') || t.includes('boq') || t.includes('quantity') || t.includes('takeoff') || t.includes('budget')) {
    return [
      { id: 1, name: 'Item 03.01: M40 Design Mix Pumpable Concrete', category: 'Concrete Works', progress: 85, status: 'Active', value: '₹ 1.67 Cr', updated: '15 mins ago', specs: 'Qty: 2,450 cum, Rate: ₹6,850/cum, IS 1200 Part 2 Measurement' },
      { id: 2, name: 'Item 03.02: TMT Rebar Fe500D Cutting & Bending', category: 'Reinforcement Steel', progress: 90, status: 'Active', value: '₹ 2.45 Cr', updated: '30 mins ago', specs: 'Qty: 380 MT, Rate: ₹64,500/MT, Wastage Allowed: 2.5%, Actual: 1.2%' },
      { id: 3, name: 'Item 08.01: Unitized Double Glazed Curtain Wall', category: 'Facade Glazing', progress: 65, status: 'In Progress', value: '₹ 6.94 Cr', updated: '1 hour ago', specs: 'Qty: 6,200 sqm, Rate: ₹11,200/sqm, Approval: Code A' }
    ];
  }

  // =========================================================================
  // 10. CPM SCHEDULE & PROJECT CONTROLS
  // =========================================================================
  if (t.includes('schedule') || t.includes('planning') || t.includes('cpm') || t.includes('gantt') || t.includes('activity')) {
    return [
      { id: 1, name: 'WBS 1.02.04: Raft Excavation & Foundation Concreting', category: 'Substructure Milestone', progress: 100, status: 'Completed', value: '45 Days Duration', updated: '20 mins ago', specs: 'Start: 15-Jan-2024, Finish: 24-Mar-2024, Critical Path: Yes, Float: 0d' },
      { id: 2, name: 'WBS 2.01.08: Levels 1 to 5 Concrete Frame Casting', category: 'Superstructure Activity', progress: 92, status: 'Active', value: '120 Days Duration', updated: '35 mins ago', specs: 'Start: 28-Mar-2024, Critical Path: Yes, SPI: 0.98, Variance: +4 Days' },
      { id: 3, name: 'WBS 3.04.01: Unitized Curtain Wall Glazing Installation', category: 'Envelope Milestone', progress: 42, status: 'In Progress', value: '90 Days Duration', updated: '1 hour ago', specs: 'Start: 01-Jun-2024, Float: 2 Days, SPI: 1.02, Ahead of Schedule' }
    ];
  }

  // =========================================================================
  // 11. PROCUREMENT, VENDOR & SUPPLY CHAIN
  // =========================================================================
  if (t.includes('procurement') || t.includes('vendor') || t.includes('purchase') || t.includes('supply')) {
    return [
      { id: 1, name: 'PO-2024-9120: Tata Tiscon 550D TMT Rebar (120 MT)', category: 'Steel Supply', progress: 70, status: 'In Progress', value: '₹ 77.4 Lakh', updated: '15 mins ago', specs: 'Vendor: Tata Steel Ltd, Lead Time: 5 Days, Delivery Status: IN_TRANSIT' },
      { id: 2, name: 'PO-2024-8840: UltraTech Bulk OPC 53 Cement (300 MT)', category: 'Cement Bulk', progress: 100, status: 'Completed', value: '₹ 21.6 Lakh', updated: '1 hour ago', specs: 'Vendor: UltraTech Cement, Quality Test: 58.4 MPa, Status: DELIVERED' },
      { id: 3, name: 'PO-2024-7411: Saint-Gobain Low-E DGU Glass Panels', category: 'Facade Material', progress: 55, status: 'Active', value: '₹ 1.85 Cr', updated: '3 hours ago', specs: 'Vendor: Saint-Gobain Glass, Factory Inspection: Approved' }
    ];
  }

  // =========================================================================
  // 12. QA/QC INSPECTOR & SITE SAFETY (WIR / NCR)
  // =========================================================================
  if (t.includes('inspector') || t.includes('quality') || t.includes('inspection') || t.includes('wir') || t.includes('ncr')) {
    return [
      { id: 1, name: 'Test #401: 28-Day Concrete Cube Compressive Strength', category: 'Concrete Quality (IS 516)', progress: 100, status: 'Completed', value: '46.2 MPa (Target 40)', updated: '10 mins ago', specs: 'Result: 115.5% of Target, NABL Lab Certified, Pass Code A' },
      { id: 2, name: 'WIR-STR-092: Level 2 Column Rebar Pre-Pour Inspection', category: 'Work Inspection Request', progress: 100, status: 'Completed', value: 'Approved Code A', updated: '30 mins ago', specs: 'Cover: 40mm Verified via Covermeter, Lap: 50d Staggered, Chairs: 100%' },
      { id: 3, name: 'NCR-FAC-014: Spandrel Panel Silicone Sealant Adhesion', category: 'Non-Conformance Report', progress: 85, status: 'Active', value: 'Rectified & Re-inspected', updated: '2 hours ago', specs: 'Peel Test: 100% Cohesive Failure, Retest Approved by Consultant' }
    ];
  }

  if (t.includes('safety') || t.includes('hse') || t.includes('hazard') || t.includes('ptw')) {
    return [
      { id: 1, name: 'Zone 4 Camera Stream: AI PPE Compliance Scan', category: 'HSE Real-Time Scan', progress: 100, status: 'Completed', value: '100% Score', updated: 'Just now', specs: 'Workers: 24, Helmets: 24/24, High-Vis: 24/24, Harnesses: 100% Anchored' },
      { id: 2, name: 'PTW-2024-512: Hot Work & Working-at-Height Permit', category: 'Permit to Work', progress: 95, status: 'Active', value: 'Valid till 18:00', updated: '20 mins ago', specs: 'Fire Watcher Deployed, Gas Test: 0.0% LEL, Fall Arrestor Rigged' },
      { id: 3, name: 'Quarterly Fire Hydrant & Extinguisher Inspection', category: 'Life Safety Audit', progress: 100, status: 'Completed', value: 'All 48 Units Valid', updated: '3 hours ago', specs: 'Hydro Test: 25 Bar Passed, Pressure Gauges: Green Zone' }
    ];
  }

  // =========================================================================
  // 13. FACILITY MANAGEMENT & CLIENT ASSETS
  // =========================================================================
  if (t.includes('facility') || t.includes('asset') || t.includes('client') || t.includes('maintenance')) {
    return [
      { id: 1, name: 'Passenger Elevator Bank A (Schindler 24 Pax 3.5 m/s)', category: 'Vertical Transport', progress: 98, status: 'Active', value: 'Health Score: 98/100', updated: '15 mins ago', specs: 'Serial: SCH-8819, Next Service: 15-Nov-2026, Operating Hours: 4,200 hrs' },
      { id: 2, name: '1500 kVA Silent Acoustic Diesel Generator Set (Cummins)', category: 'Emergency Power', progress: 100, status: 'Completed', value: 'Ready Standby', updated: '45 mins ago', specs: 'Battery: 24.8V, ATS: Ready Auto, Fuel: 2,100 L (84%), Last Test: Pass' },
      { id: 3, name: 'Primary Chilled Water Pump #1 (1200 GPM @ 32m Head)', category: 'Hydronic Plant', progress: 92, status: 'Active', value: 'Optimal VFD Run', updated: '2 hours ago', specs: 'Motor: 37 kW IE3, Mechanical Seal: Dual Cartridge, Flow: 1,180 GPM' }
    ];
  }

  // =========================================================================
  // 14. GIS, SPATIAL & SITE TOPOGRAPHY
  // =========================================================================
  if (t.includes('gis') || t.includes('spatial') || t.includes('topography') || t.includes('survey') || t.includes('terrain')) {
    return [
      { id: 1, name: 'Cadastral Boundary Parcel Plot A (WGS 84 UTM 43N)', category: 'Land Boundary', progress: 100, status: 'Completed', value: '42,500 m² Area', updated: '20 mins ago', specs: 'Permissible FAR: 3.5, Ground Coverage: 40%, Front Setback: 12.0m' },
      { id: 2, name: 'TIN Elevation Mesh & Earthwork Cut/Fill Model', category: 'Topographic Grading', progress: 90, status: 'Active', value: '18,500 m³ Cut', updated: '40 mins ago', specs: 'Fill: 17,950 m³, Net Import: +550 m³ (Near-Zero Waste), Slope: 1:100' },
      { id: 3, name: 'Underground 3D Utility Corridor Geospatial Buffer', category: 'Utility Network', progress: 95, status: 'Active', value: '4.5km Network', updated: '1 hour ago', specs: 'GPR Surveyed: Water, Gas, 11kV Power, Fiber Optic, Clash-Free' }
    ];
  }

  // =========================================================================
  // DEFAULT DYNAMIC SPECIALIZED DOMAIN DATASET
  // =========================================================================
  return [
    { id: 1, name: `${title} - Operational Unit Alpha`, category: `${title} Core`, progress: 94, status: 'Active', value: 'Phase 1 Active', updated: '10 mins ago', specs: `Standard: ISO 19650, Compliance: 100%, Dimension: Optimized` },
    { id: 2, name: `${title} - Engineering System Beta`, category: `${title} Systems`, progress: 88, status: 'Active', value: 'Phase 2 Running', updated: '30 mins ago', specs: `Tolerance: ±2mm, Material: Certified, Specification: Standard` },
    { id: 3, name: `${title} - Quality Verification Gamma`, category: `${title} Audit`, progress: 100, status: 'Completed', value: 'Code A Approved', updated: '1 hour ago', specs: `Tested: NABL Accredited, Result: 100% Pass, Status: Verified` },
    { id: 4, name: `${title} - AI Anomaly & Risk Scan Delta`, category: `${title} AI Control`, progress: 78, status: 'In Progress', value: 'AI Real-Time Scan', updated: '2 hours ago', specs: `Risk Index: Low (0.02), Predicted Uptime: 99.8%, Latency: 18ms` }
  ];
}
