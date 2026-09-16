const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'frontend', 'src', 'pages');

const files = fs.readdirSync(srcPath).filter(f => f.endsWith('.jsx'));
const undefinedIcons = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(srcPath, file), 'utf-8');
  
  // Find all <IconName usage
  const tags = content.match(/<([A-Z][a-zA-Z0-9]*)(?:>|\s)/g);
  if (tags) {
    const usedTags = [...new Set(tags.map(t => t.replace(/[<\s>]/g, '')))];
    const missing = [];
    usedTags.forEach(tag => {
      // Simple heuristic: is it imported or defined?
      const isImported1 = new RegExp(`import\\s+.*?\\b${tag}\\b.*?from`).test(content);
      const isImported2 = new RegExp(`import\\s+{.*?\\b${tag}\\b.*?}`).test(content);
      // Recharts icons have 'as' e.g. PieChart as PieChartIcon
      const isImported3 = new RegExp(`as\\s+${tag}\\b`).test(content);
      const isDefined = new RegExp(`function\\s+${tag}\\b`).test(content) ||
                        new RegExp(`const\\s+${tag}\\b`).test(content) ||
                        new RegExp(`class\\s+${tag}\\b`).test(content);
      
      if (!isImported1 && !isImported2 && !isImported3 && !isDefined && tag !== 'Fragment') {
        missing.push(tag);
      }
    });
    if (missing.length > 0) {
      undefinedIcons[file] = missing;
    }
  }
});
fs.writeFileSync('undefined_results.json', JSON.stringify(undefinedIcons, null, 2));
console.log('done');
