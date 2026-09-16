const { execSync } = require('child_process');
try {
  console.log('Running build...');
  const out = execSync('npm run build', { 
    cwd: 'c:/BuildSphere AI Version 3.0/frontend', 
    stdio: 'pipe' 
  });
  console.log('BUILD SUCCESS:');
  console.log(out.toString());
} catch(e) {
  console.log('BUILD FAILED:');
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.log(e.stderr.toString());
}
