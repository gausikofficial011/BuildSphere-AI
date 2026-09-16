const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles('src');

const replacements = [
  // Layouts
  { pattern: /className=["']([a-z\-]+)-layout(\s+cinematic-bg)?["']/g, replace: 'className="dashboard-layout cinematic-bg"' },
  { pattern: /className=["']([a-z\-]+)-sidebar["']/g, replace: 'className="dashboard-sidebar"' },
  { pattern: /className=["']([a-z\-]+)-main["']/g, replace: 'className="dashboard-main"' },
  { pattern: /className=["']([a-z\-]+)-header["']/g, replace: 'className="dashboard-header"' },
  { pattern: /className=["']([a-z\-]+)-brand["']/g, replace: 'className="dashboard-brand"' },
  { pattern: /className=["']([a-z\-]+)-brand-text["']/g, replace: 'className="dashboard-brand-text"' },
  { pattern: /className=["']([a-z\-]+)-logo["']/g, replace: 'className="dashboard-logo"' },
  { pattern: /className=["']([a-z\-]+)-nav["']/g, replace: 'className="dashboard-nav"' },
  { pattern: /className=["']([a-z\-]+)-nav-item(\s+active)?["']/g, replace: 'className="nav-item$2"' },
  { pattern: /className=["']([a-z\-]+)-header-left["']/g, replace: 'className="header-left"' },
  { pattern: /className=["']([a-z\-]+)-header-right["']/g, replace: 'className="header-right"' },
  { pattern: /className=["']([a-z\-]+)-user-profile["']/g, replace: 'className="user-profile"' },
  { pattern: /className=["']([a-z\-]+)-user-info["']/g, replace: 'className="user-info"' },
  { pattern: /className=["']([a-z\-]+)-user-avatar["']/g, replace: 'className="avatar"' },
  { pattern: /className=["']([a-z\-]+)-search["']/g, replace: 'className="search-bar"' },
  { pattern: /className=["']([a-z\-]+)-icon-btn["']/g, replace: 'className="icon-btn"' },
  { pattern: /className=["']([a-z\-]+)-badge["']/g, replace: 'className="badge"' },
  
  // Dashboard Content
  { pattern: /className=["']([a-z\-]+)-dashboard["']/g, replace: 'className="dashboard-content"' },
  { pattern: /className=["']([a-z\-]+)-greeting-banner["']/g, replace: 'className="page-header"' },
  { pattern: /className=["']([a-z\-]+)-greeting["']/g, replace: 'className="page-title"' },
  { pattern: /className=["']([a-z\-]+)-kpi-grid["']/g, replace: 'className="stats-grid"' },
  { pattern: /className=["']([a-z\-]+)-grid-row-[0-9]["']/g, replace: 'className="dashboard-row grid-cols-4"' },
  
  // Widgets / Cards
  { pattern: /className=["']([a-z\-]+)-widget["']/g, replace: 'className="dashboard-card"' },
  { pattern: /className=["']([a-z\-]+)-widget-header["']/g, replace: 'className="card-header"' },
  { pattern: /className=["']([a-z\-]+)-widget-action["']/g, replace: 'className="card-action"' },
  { pattern: /className=["']([a-z\-]+)-chart-container["']/g, replace: 'className="chart-container"' },
  { pattern: /className=["']([a-z\-]+)-kpi-card["']/g, replace: 'className="stat-card"' },
  { pattern: /className=["']([a-z\-]+)-kpi-header["']/g, replace: 'className="stat-header"' },
  { pattern: /className=["']([a-z\-]+)-kpi-icon["']/g, replace: 'className="stat-icon"' },
  { pattern: /className=["']([a-z\-]+)-kpi-title["']/g, replace: 'className="stat-title"' },
  { pattern: /className=["']([a-z\-]+)-kpi-val["']/g, replace: 'className="stat-val"' },
  { pattern: /className=["']([a-z\-]+)-kpi-sub["']/g, replace: 'className="stat-sub"' },

  // Modules
  { pattern: /className=["']module-card["']/g, replace: 'className="dashboard-card"' },
  { pattern: /className=["']module-header["']/g, replace: 'className="card-header"' },
  { pattern: /className=["']module-grid["']/g, replace: 'className="dashboard-row grid-cols-4"' },
  
  // Remove local CSS imports (e.g. import './Architect.css';)
  { pattern: /import\s+['"]\.\/[A-Za-z0-9]+\.css['"];?\n?/g, replace: '' }
];

let changedFilesCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replacements.forEach(({pattern, replace}) => {
    content = content.replace(pattern, replace);
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFilesCount++;
    console.log('Refactored:', file);
  }
});

console.log('Total files refactored:', changedFilesCount);
