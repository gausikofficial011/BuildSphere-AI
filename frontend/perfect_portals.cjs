const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = getFiles(pagesDir);

let filesChanged = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // 1. Unify KPI Card Container Classes
  content = content.replace(/className=\{`[a-zA-Z0-9_-]+-kpi-card/g, 'className={`stat-card');
  content = content.replace(/className="[a-zA-Z0-9_-]+-kpi-card"/g, 'className="stat-card"');
  
  // 2. Unify KPI Subtitle & Trend Classes
  content = content.replace(/[a-zA-Z0-9_-]+-kpi-sub/g, 'stat-sub');
  
  // 3. Unify Navigation Badges (Pills)
  content = content.replace(/[a-zA-Z0-9_-]+-nav-badge/g, 'nav-badge');

  // 4. Unify Sidebar Category Headers
  content = content.replace(/className="[a-zA-Z0-9_-]+-sidebar-section"/g, 'className="nav-group-header"');
  
  // 5. Unify User Online Status Indicators
  content = content.replace(/[a-zA-Z0-9_-]+-user-status/g, 'user-status-badge');
  
  // 6. Unify Header Actions Container
  content = content.replace(/[a-zA-Z0-9_-]+-header-actions/g, 'header-actions');

  // 7. Ensure cinematic-bg is present on dashboard-layout
  content = content.replace(/className="([a-zA-Z0-9_-]+-)?layout(\s+cinematic-bg)?"/g, 'className="dashboard-layout cinematic-bg"');
  content = content.replace(/className="dashboard-layout"(?!\s+cinematic-bg)/g, 'className="dashboard-layout cinematic-bg"');
  content = content.replace(/className="dashboard-layout cinematic-bg cinematic-bg"/g, 'className="dashboard-layout cinematic-bg"');

  // 8. Legacy nav item and sidebar fixes
  content = content.replace(/<nav\s+className="dashboard-sidebar">/g, '<aside className="dashboard-sidebar">');
  if (content.includes('<aside className="dashboard-sidebar">') && content.includes('</nav>')) {
     content = content.replace(/<\/nav>/g, '</aside>');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
    console.log(`✨ Refactored & Perfected: ${path.basename(file)}`);
  }
}

console.log(`\n🎉 Successfully upgraded and refactored ${filesChanged} user portal dashboards!`);
