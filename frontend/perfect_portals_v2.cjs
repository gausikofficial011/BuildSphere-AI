const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const sharedUIPath = path.join(__dirname, 'src', 'components', 'SharedUI.jsx');

let totalModified = 0;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix all KPI / Stat Card function definitions across all dashboards
  // Match function NameKPI({ ... }) { return ( <div ... stat-card ... ); }
  content = content.replace(/function\s+([A-Za-z0-9_-]+KPI)\s*\([^\)]*\)\s*\{[\s\S]*?return\s*\([\s\S]*?stat-card[\s\S]*?<\/\s*div\s*>\s*\);\s*\}/g, (match, funcName) => {
    return `function ${funcName}({ title, value, sub, icon, color, subColor = "pos" }) {
  return (
    <div className={\`stat-card color-\${color}\`}>
      <div className={\`stat-icon \${color}\`}>
        {icon}
      </div>
      <div className="stat-details">
        <h6 className="stat-title">{title}</h6>
        <h3 className="stat-val">{value}</h3>
        <span className={\`stat-sub \${subColor}\`}>{sub}</span>
      </div>
    </div>
  );
}`;
  });

  // 2. Fix Top-Right User Profile Badge box in Navbar (header-right / header-user-badge)
  // Replace <div className="dashboard-header"> when it encloses the pravatar avatar or user text
  content = content.replace(/<div\s+className=["']dashboard-header["'](\s+style=\{[^}]+\})?>(\s*<img[^>]+pravatar\.cc)/g, '<div className="header-user-badge"$1>$2');
  content = content.replace(/<div\s+className=["']dashboard-header["']>(\s*<img[^>]+src=["']https:\/\/i\.pravatar\.cc)/g, '<div className="header-user-badge">$1');

  // 3. Fix ALL bogus card headers that were mistakenly converted to dashboard-header
  // Because top navigation bar is ALWAYS <header className="dashboard-header"> (using `<header>` tag),
  // any `<div className="dashboard-header">` in cards/charts/tables MUST be `<div className="card-header">`.
  content = content.replace(/(<div\s+[^>]*?className=)["']dashboard-header["']/g, '$1"card-header"');

  // 4. Clean up Light-Theme color bleeding on dark cinematic glassmorphism UI
  content = content.replace(/color:\s*['"]#0f172a['"]/g, "color: '#f8fafc'");
  content = content.replace(/color:\s*['"]#1e293b['"]/g, "color: '#e2e8f0'");
  content = content.replace(/color:\s*['"]#334155['"]/g, "color: '#cbd5e1'");
  content = content.replace(/color:\s*['"]#475569['"]/g, "color: '#cbd5e1'");

  // Replace hardcoded bright white backgrounds in toolbars/date chips with dark glass chips
  content = content.replace(/backgroundColor:\s*['"]white['"]/g, "backgroundColor: 'rgba(255, 255, 255, 0.05)'");
  content = content.replace(/background:\s*['"]white['"]/g, "background: 'rgba(255, 255, 255, 0.05)'");
  content = content.replace(/border:\s*['"]1px solid #e2e8f0['"]/g, "border: '1px solid rgba(255, 255, 255, 0.15)'");
  content = content.replace(/border:\s*['"]1px solid #cbd5e1['"]/g, "border: '1px solid rgba(255, 255, 255, 0.15)'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalModified++;
    console.log(`Updated and perfected layout in: ${path.basename(filePath)}`);
  }
}

// Process all files in src/pages/
if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
  for (const f of files) {
    processFile(path.join(pagesDir, f));
  }
}

// Process SharedUI component
processFile(sharedUIPath);

console.log(`\nSuccessfully perfected ${totalModified} files to world-class website design alignment!`);
