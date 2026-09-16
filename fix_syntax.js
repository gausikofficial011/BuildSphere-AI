const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'frontend/src/components');

fs.readdir(componentsDir, (err, files) => {
  if (err) throw err;

  const moduleFiles = files.filter(f => f.endsWith('Modules.jsx'));

  moduleFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const regex = /(function [A-Za-z]+SubModulePlaceholder\(\{ title \}\) \{\n  return <PremiumPlaceholder title=\{title\} \/>;\n)\}\) \{\n  return \([\s\S]*?\n  \);\n\}/g;

    const newContent = content.replace(regex, '$1}');

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed syntax in ${file}`);
    }
  });
});
