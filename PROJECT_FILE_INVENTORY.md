# BuildSphere AI: Complete Project File Inventory

**Discovery Date**: August 20, 2026

---

## 📁 1. Frontend Subsystem (`frontend/src/`)

### A. Pages & Master Portals (`frontend/src/pages/` — 34 files)
1. `SuperAdmin.jsx` & `SuperAdmin.css` — Master Super Admin Command Center HUD
2. `Landing.jsx` & `Landing.css` — Enterprise Cyberpunk Sci-Fi Landing Portal
3. `SignIn.jsx` & `SignIn.css` — Cyber Role Matrix Authentication Portal
4. `Login.jsx` & `Login.css` — Direct Enterprise Login
5. `SignUp.jsx` & `SignUp.css` — Organization Onboarding
6. `BimManager.jsx` — BIM Manager Portal (`/bimmanager`)
7. `GisEngineer.jsx` — GIS & Spatial Survey Portal (`/gisengineer`)
8. `DigitalTwinEngineer.jsx` — Digital Twin Systems Portal (`/digitaltwinengineer`)
9. `IotEngineer.jsx` — Industrial IoT & Edge Sensor Portal (`/iotengineer`)
10. `Architect.jsx` — Architectural Design Portal (`/architect`)
11. `CivilEngineer.jsx` — Civil Engineering Portal (`/civilengineer`)
12. `StructuralEngineer.jsx` — Structural Engineering Portal (`/structuralengineer`)
13. `MepEngineer.jsx` — MEP Systems Portal (`/mepengineer`)
14. `QuantitySurveyor.jsx` — 5D Quantity Surveying Portal (`/quantitysurveyor`)
15. `CostEngineer.jsx` — EVM Cost Engineering Portal (`/costengineer`)
16. `ProcurementManager.jsx` — SCM & Procurement Portal (`/procurementmanager`)
17. `ContractorManager.jsx` — General Contractor Portal (`/contractormanager`)
18. `SubcontractorDashboard.jsx` — Trade Subcontractor Portal (`/subcontractor`)
19. `VendorDashboard.jsx` — Vendor Partner Portal (`/vendor`)
20. `ClientDashboard.jsx` — Executive Client Portal (`/client`)
21. `ConsultantDashboard.jsx` — Engineering Consultant Portal (`/consultant`)
22. `ProjectViewerDashboard.jsx` — Project Viewer Portal (`/projectviewer`)
23. `ComplianceDashboard.jsx` — Statutory Compliance Portal (`/compliance`)
24. `InspectorDashboard.jsx` — QA/QC Inspector Portal (`/inspector`)
25. `OrgOwner.jsx` — Organization Owner Portal (`/orgowner`)
26. `ProjectManager.jsx` — Master Project Management Portal (`/projectmanager`)
27. `PlanningEngineer.jsx` — Planning & CPM Scheduling Portal (`/planningengineer`)
28. `SiteEngineer.jsx` — Site Execution & WIR Portal (`/siteengineer`)
29. `ConstructionManager.jsx` — Construction Management Portal (`/constructionmanager`)

### B. Core Layout & Reusable Component Engines (`frontend/src/components/` — 50 files)
1. `CyberPortalLayout.jsx` — Universal Cyberpunk Sci-Fi HUD Architecture with real-time operations.
2. `SharedUI.jsx` — Enterprise Data Management, StatCards, and Filter Toolbars.
3. `DigitalTwinEngine.jsx` — 3D Bi-Directional Digital Twin with Real-Time Telemetry.
4. `CivilThreeDViewer.jsx` & `ThreeDViewer.jsx` & `Global3DViewer.jsx` — 3D WebGL Model Viewers.
5. `SpatialOS.jsx` & `SpatialOS.css` — Multi-layered GIS and Spatial Mapping.
6. `RevitDynamoBuilder.jsx` — Visual Node Graph & Revit/Dynamo Workflow Interface.
7. `GoogleDocsReportGenerator.jsx` — Automated Statutory & Client Reporting Suite.
8. `TaskManager.jsx` — Kanban & Backlog Project Task System.
9. `IssueTracker.jsx` — RFI, NCR, Snag, and Risk Logging System.
10. `DailyLogForm.jsx` — Mobile Site DPR & Workforce Tracking.
11. `DocumentCenter.jsx` — CDE Engineering File & Revision Manager.
12. `NotificationsPanel.jsx` — Real-Time Alert Stream.
13. `ProjectKPIDashboard.jsx` — S-Curve & EVM Variance Visualizer.
14. `AdminModules.jsx`, `BimModules.jsx`, `CivilModules.jsx`, `ArchitectModules.jsx`, `CostModules.jsx`, `ProcurementModules.jsx`, `ContractorModules.jsx`, `TwinModules.jsx`, `GisModules.jsx`, `IotModules.jsx`, `MepModules.jsx`, `StructuralModules.jsx`, `QsModules.jsx`, `SiteModules.jsx`, `PlanningModules.jsx`, `ProjectModules.jsx`, `ClientModules.jsx`, `ConsultantModules.jsx`, `ComplianceModules.jsx`, `InspectorModules.jsx`, `OrgModules.jsx`, `SubcontractorModules.jsx`, `VendorModules.jsx`, `ProjectViewerModules.jsx`, `ConstructionModules.jsx`.

### C. 3D BIM Parametric Engine & Stores (`frontend/src/engine/` & `frontend/src/store/`)
- `engine/geometry.js` — Parametric building geometry generation (Walls, Slabs, Beams, Columns).
- `engine/snapping.js` — Grid snapping, angular constraints, and precision collision rules.
- `store/bimStore.js` — Zustand 3D BIM state management.
- `store/historyStore.js` — Undo / Redo command pattern for AEC edits.
- `store/uiStore.js` — Selection, layer visibility, and tool mode state.

---

## 📁 2. Backend Subsystem (`backend/app/`)

### A. Core Engine & API Routers (`backend/app/routers/` — 21 files)
1. `auth.py` — JWT authentication, user registration, and login.
2. `projects.py` — Project CRUD, budget allocation, and health scores.
3. `bim.py` & `ingestion.py` — BIM model ingestion, extraction reports, and hierarchy.
4. `twin.py` — Digital twin asset telemetry and sensor mapping.
5. `spatial.py` — GIS spatial polygons and terrain queries.
6. `tasks.py` — Task lifecycle management.
7. `issues.py` — RFI / NCR / Snag lifecycle.
8. `daily_logs.py` — Daily progress records & workforce logs.
9. `documents.py` — CDE document registry and versioning.
10. `notifications.py` — Alert broadcasting.
11. `copilot.py` — Phase 6 AI Engineering Copilot query engine.
12. `ml.py` — Phase 18 ML model training & element classification inference.
13. `execution.py` — Revit execution adapter gateway.
14. `planning.py` — Autonomous generative design generator.
15. `platform.py` — Multi-tenant isolation & RBAC authorization.
16. `realworld.py` — Industrial IoT & Site Camera Computer Vision ingestion.
17. `search.py` — Universal search engine across all entity domains.
18. `google_docs.py` — Automated document generator.
19. `os.py` — BCF issue normalization & webhook dispatcher.

### B. Specialized AEC AI & Domain Subsystems
- `agents/` — Master Agent Orchestrator + 18 Specialized Domain Agents.
- `ml_engine/` — End-to-end dataset preprocessing, baseline classifier, and model registry.
- `copilot/` — Rule-based and generative prompt orchestrators.
- `digital_twin/` — Real-time telemetry, asset mapping, and anomaly engine.
- `optimization/` & `decision_intelligence/` — Pareto multi-objective optimization solvers.
- `knowledge/` — Unified AEC Knowledge Graph builder.
- `lifecycle/` — Digital Thread tracking across 11 lifecycle phases.
- `platform/` — Tenant isolation, RBAC matrix, and audit trails.
- `realworld/` — Computer vision defect detection & IoT telemetry adapters.
- `city_scale/`, `regional_scale/`, `global_scale/` — Macro spatial simulations.
- `database.py`, `models.py`, `schemas.py` — SQLAlchemy ORM and Pydantic validation schemas.

---

## 📁 3. Verification & Test Suite (`backend/tests/` — 32 test suites)
- `test_city.py`, `test_city_scale.py`, `test_cityscale.py`, `test_copilot.py`, `test_decision_intelligence.py`, `test_delivery.py`, `test_dynamo.py`, `test_execution.py`, `test_factory.py`, `test_global_scale.py`, `test_intelligence.py`, `test_knowledge.py`, `test_leakage.py`, `test_lifecycle.py`, `test_loop.py`, `test_master_integration.py`, `test_ml_pipeline.py`, `test_neural_os.py`, `test_operations.py`, `test_os.py`, `test_pipeline.py`, `test_planning.py`, `test_platform.py`, `test_reality.py`, `test_regional_scale.py`, `test_robotics.py`, `test_site_intelligence.py`, `test_spatial_computing.py`, `test_superintelligence.py`, `test_virtual_lab.py`, `test_world_model.py`.
- **Test Results**: 62 tests collected, 62 passed (100% pass rate).
