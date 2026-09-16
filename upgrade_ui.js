const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'frontend/src/components');

fs.readdir(componentsDir, (err, files) => {
  if (err) throw err;

  const moduleFiles = files.filter(f => f.endsWith('Modules.jsx') && f !== 'OrgModules.jsx');

  moduleFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add import for PremiumPlaceholder
    if (!content.includes('PremiumPlaceholder')) {
      // Find the first line after imports, or just append to the imports
      content = content.replace(/(import .* from '.*';\n)+/, match => {
        return match + "import { PremiumPlaceholder } from './SharedUI';\n";
      });
    }

    // 2. Replace the old placeholder function
    // We will use a regex to find the function signature and then manually slice the string by matching brackets
    const funcRegex = /function (\w+SubModulePlaceholder)\(\{ title \}\) \{/;
    const match = content.match(funcRegex);

    if (match) {
      const funcName = match[1];
      const startIndex = match.index;
      let openBrackets = 0;
      let endIndex = startIndex;
      let started = false;

      for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
          openBrackets++;
          started = true;
        } else if (content[i] === '}') {
          openBrackets--;
        }

        if (started && openBrackets === 0) {
          endIndex = i;
          break;
        }
      }

      const originalBlock = content.substring(startIndex, endIndex + 1);
      const newBlock = `function ${funcName}({ title }) {\n  return <PremiumPlaceholder title={title} />;\n}`;
      
      content = content.replace(originalBlock, newBlock);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Upgraded: ${file}`);
    } else {
        console.log(`Skipped (no placeholder found): ${file}`);
    }
  });
  
  console.log('Global UI Upgrade Complete!');
});
