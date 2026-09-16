import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalProfileMenu from './components/GlobalProfileMenu';
import Global3DViewer from './components/Global3DViewer';
import SpatialOS from './components/SpatialOS';
import Ai2DTo3DStudio from './components/Ai2DTo3DStudio';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SuperAdmin from './pages/SuperAdmin';
import OrgOwner from './pages/OrgOwner';
import ProjectManager from './pages/ProjectManager';
import PlanningEngineer from './pages/PlanningEngineer';
import SiteEngineer from './pages/SiteEngineer';
import ConstructionManager from './pages/ConstructionManager';
import Architect from './pages/Architect';
import CivilEngineer from './pages/CivilEngineer';
import StructuralEngineer from './pages/StructuralEngineer';
import MepEngineer from './pages/MepEngineer';
import BimManager from './pages/BimManager';
import GisEngineer from './pages/GisEngineer';
import DigitalTwinEngineer from './pages/DigitalTwinEngineer';
import IotEngineer from './pages/IotEngineer';
import QuantitySurveyor from './pages/QuantitySurveyor';
import CostEngineer from './pages/CostEngineer';
import ProcurementManager from './pages/ProcurementManager';
import ContractorManager from './pages/ContractorManager';
import SubcontractorDashboard from './pages/SubcontractorDashboard';
import VendorDashboard from './pages/VendorDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';
import ProjectViewerDashboard from './pages/ProjectViewerDashboard';
import ComplianceDashboard from './pages/ComplianceDashboard';
import InspectorDashboard from './pages/InspectorDashboard';
import Technician from './pages/Technician';
import Login from './pages/Login';

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Support for both Ctrl+K and Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <GlobalProfileMenu />
      <Global3DViewer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/os" element={<SpatialOS />} />
        <Route path="/2dto3d" element={<Ai2DTo3DStudio />} />
        <Route path="/ai-2d-to-3d" element={<Ai2DTo3DStudio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/orgowner" element={<OrgOwner />} />
        <Route path="/projectmanager" element={<ProjectManager />} />
        <Route path="/planningengineer" element={<PlanningEngineer />} />
        <Route path="/siteengineer" element={<SiteEngineer />} />
        <Route path="/constructionmanager" element={<ConstructionManager />} />
        <Route path="/architect" element={<Architect />} />
        <Route path="/civilengineer" element={<CivilEngineer />} />
        <Route path="/structuralengineer" element={<StructuralEngineer />} />
        <Route path="/mepengineer" element={<MepEngineer />} />
        <Route path="/bimmanager" element={<BimManager />} />
        <Route path="/gisengineer" element={<GisEngineer />} />
        <Route path="/digitaltwinengineer" element={<DigitalTwinEngineer />} />
        <Route path="/iotengineer" element={<IotEngineer />} />
        <Route path="/quantitysurveyor" element={<QuantitySurveyor />} />
        <Route path="/costengineer" element={<CostEngineer />} />
        <Route path="/procurement" element={<ProcurementManager />} />
        <Route path="/contractor" element={<ContractorManager />} />
        <Route path="/subcontractor" element={<SubcontractorDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/consultant" element={<ConsultantDashboard />} />
        <Route path="/viewer" element={<ProjectViewerDashboard />} />
        <Route path="/compliance" element={<ComplianceDashboard />} />
        <Route path="/inspector" element={<InspectorDashboard />} />
        <Route path="/technician" element={<Technician />} />
      </Routes>
    </Router>
  );
}

export default App;
