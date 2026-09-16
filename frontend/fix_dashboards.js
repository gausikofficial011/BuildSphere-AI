const fs = require('fs');
const path = require('path');

const lucideIcons = new Set([
  'Building2', 'Users', 'ShieldCheck', 'CreditCard', 'DollarSign', 'Brain', 
  'Box', 'Map', 'Wifi', 'Settings', 'Database', 'Server', 'Clock', 
  'Menu', 'Search', 'Bell', 'Mail', 'Globe', 'Sun', 'ChevronDown', 'Download',
  'Activity', 'ArrowUp', 'Zap', 'HardHat', 'CheckCircle2', 'AlertTriangle', 'Layers',
  'Cpu', 'HardDrive', 'Network', 'FileText', 'Bot', 'Compass', 'Share2', 'Workflow', 'Folder', 'Camera', 'BarChart',
  'Calculator', 'Receipt', 'Scale', 'TrendingUp', 'TrendingDown', 
  'Briefcase', 'BarChart4', 'PieChartIcon', 
  'MoreVertical', 'Calendar', 'FileSignature', 'AlertCircle', 'Upload', 
  'FileDigit', 'ShieldAlert',
  'ClipboardList', 'ArrowRight', 'BookOpen', 
  'FileCheck2', 'ScrollText', 'Wallet', 
  'Truck', 'Package', 'ShoppingCart', 'UserCheck', 'Factory', 'Gavel', 'LayoutGrid', 'CloudRain',
  'FolderOpen', 'RefreshCw', 'PenTool', 'Wrench', 'List', 'PhoneCall', 'Link2', 'MonitorPlay',
  'MessageSquare', 'Lightbulb', 'RotateCw', 'Maximize', 'Play', 'Plus', 'X', 'ArrowLeft', 'ArrowDown', 'LogOut',
  'FileVideo', 'Video', 'Mic', 'Headphones', 'VideoOff', 'MicOff', 'Eye', 'EyeOff', 'Lock', 'Unlock',
  'Edit', 'Trash', 'Trash2', 'Save', 'Check', 'AlertOctagon', 'Info', 'HelpCircle', 'Home', 'User',
  'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ArrowRightCircle', 'ArrowLeftCircle'
]);

const rechartsComponents = new Set([
  'LineChart', 'Line', 'BarChart', 'Bar', 'PieChart', 'Pie', 'Cell', 'ResponsiveContainer', 
  'XAxis', 'YAxis', 'Tooltip', 'CartesianGrid', 'Legend', 'ComposedChart', 'Area', 'AreaChart'
]);

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

const files = [
  ...getFiles(path.join(__dirname, 'src', 'pages')),
  ...getFiles(path.join(__dirname, 'src', 'components'))
];

let filesChanged = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  const usedLucide = new Set();
  const usedRecharts = new Set();
  
  // Find matches of <Component or icon={<Component
  const regex = /(?:<|icon=\{<)([A-Z][a-zA-Z0-9]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const comp = match[1];
    if (lucideIcons.has(comp)) usedLucide.add(comp);
    if (rechartsComponents.has(comp)) usedRecharts.add(comp);
  }

  // Handle PieChart as PieChartIcon alias specifically for Lucide
  if (content.includes('PieChartIcon')) {
    usedLucide.add('PieChart as PieChartIcon');
  }

  if (usedLucide.size > 0) {
    // Also grab any imports that were already there but not in our big list, just in case
    const existingImportMatch = content.match(/import\s*\{([^}]*)\}\s*from\s*'lucide-react';/);
    if (existingImportMatch) {
      const existing = existingImportMatch[1].split(',').map(s => s.trim()).filter(s => s);
      for (const e of existing) {
         if (!e.includes(' as ')) {
            usedLucide.add(e);
         }
      }
    }
    const sortedLucide = Array.from(usedLucide).sort();
    const importStr = `import {\n  ${sortedLucide.join(', ')}\n} from 'lucide-react';`;
    if (existingImportMatch) {
      content = content.replace(existingImportMatch[0], importStr);
    } else {
      // Find the last import statement and add it after
      content = content.replace(/(import.*?;?\n)+/, `$&${importStr}\n`);
    }
  }

  if (usedRecharts.size > 0) {
    const existingImportMatch = content.match(/import\s*\{([^}]*)\}\s*from\s*'recharts';/);
    if (existingImportMatch) {
      const existing = existingImportMatch[1].split(',').map(s => s.trim()).filter(s => s);
      for (const e of existing) {
         usedRecharts.add(e);
      }
    }
    const sortedRecharts = Array.from(usedRecharts).sort();
    const importStr = `import {\n  ${sortedRecharts.join(', ')}\n} from 'recharts';`;
    if (existingImportMatch) {
      content = content.replace(existingImportMatch[0], importStr);
    } else {
      content = content.replace(/(import.*?;?\n)+/, `$&${importStr}\n`);
    }
  }

  // Remove the hacky quick fix comments and inline functions
  content = content.replace(/\/\/\s*Quick fix for missing icons\n/gi, '');
  content = content.replace(/function MessageSquare\(\{size\}\) \{ return <svg.*?; \}\n?/gi, '');
  content = content.replace(/function Lightbulb\(\{size\}\) \{ return <svg.*?; \}\n?/gi, '');
  content = content.replace(/function RotateCw\(\{size\}\) \{ return <svg.*?; \}\n?/gi, '');
  content = content.replace(/function Maximize\(\{size\}\) \{ return <svg.*?; \}\n?/gi, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
  }
}

console.log(`Successfully fixed imports in ${filesChanged} out of ${files.length} JSX files.`);
