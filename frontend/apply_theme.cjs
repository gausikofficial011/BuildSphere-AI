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
  let originalContent = content;
  
  // 1. Sidebar element
  content = content.replace(/<nav\s+className="dashboard-sidebar">/g, '<aside className="dashboard-sidebar">');
  if (content.includes('<aside className="dashboard-sidebar">')) {
     content = content.replace(/<\/nav>/g, '</aside>');
  }

  // 2. Sidebar sections to unified nav-group-header
  // This matches className="se-sidebar-section", className="arch-sidebar-section", etc.
  content = content.replace(/className="[a-zA-Z0-9_-]+-sidebar-section"/g, 'className="nav-group-header"');

  // 3. Unify KPI elements internal classes
  // Match se-kpi-icon, arch-kpi-icon, bim-kpi-icon etc.
  content = content.replace(/[a-zA-Z0-9_-]+-kpi-icon/g, 'stat-icon');
  content = content.replace(/[a-zA-Z0-9_-]+-kpi-trend/g, 'trend');

  // 4. Ensure cinematic-bg is present on dashboard-layout
  if (content.includes('className="dashboard-layout"') && !content.includes('cinematic-bg')) {
     content = content.replace(/className="dashboard-layout"/g, 'className="dashboard-layout cinematic-bg"');
  }

  // 5. Replace legacy nav item classes
  content = content.replace(/className=\{`[a-zA-Z0-9_-]+-nav-item/g, 'className={`nav-item');
  content = content.replace(/className="[a-zA-Z0-9_-]+-nav-item"/g, 'className="nav-item"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
    console.log(`Updated ${path.basename(file)}`);
  }
}

console.log(`\nSuccessfully applied SuperAdmin theme structural updates to ${filesChanged} JSX files.`);
