import os
import re

directory = r'c:\BuildSphere AI Version 3.0\frontend\src\components'

header_pattern = re.compile(r'export function (\w+)ModuleHeader\(\{ title, description, actionText = [^\}]+ \}\) \{[\s\S]*?    </div>\n  \);\n\}')

header_replacement = r'''export function \1ModuleHeader({ title, description, actionText = "Action" }) {
  return (
    <div className="page-header" style={{ marginBottom: '2rem' }}>
      <div className="page-title">
        <h1 style={{fontSize: '2rem', margin: '0 0 0.25rem 0'}}>{title}</h1>
        <p style={{fontSize: '1rem', margin: 0, color: '#94a3b8'}}>{description}</p>
      </div>
      <div className="header-actions">
        <button className="export-btn">
          <Plus size={16} /> {actionText}
        </button>
      </div>
    </div>
  );
}'''

count = 0
for filename in os.listdir(directory):
    if filename.endswith('Modules.jsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = header_pattern.sub(header_replacement, content)
        
        # Color replaces for Light Mode -> Dark Mode
        new_content = new_content.replace("'#ffffff'", "'rgba(255, 255, 255, 0.02)'")
        new_content = new_content.replace("'#f8fafc'", "'rgba(255, 255, 255, 0.05)'")
        new_content = new_content.replace("'#e2e8f0'", "'rgba(255, 255, 255, 0.1)'")
        new_content = new_content.replace("'#0f172a'", "'#ffffff'")
        new_content = new_content.replace("'#1e293b'", "'#e2e8f0'")
        new_content = new_content.replace("'#475569'", "'#cbd5e1'")
        new_content = new_content.replace("'#0b1120'", "'rgba(0, 0, 0, 0.2)'")
        new_content = new_content.replace("'#111827'", "'rgba(0, 0, 0, 0.4)'")
        new_content = new_content.replace("'#1f2937'", "'rgba(255, 255, 255, 0.1)'")
        new_content = new_content.replace("'#020617'", "'rgba(0, 0, 0, 0.6)'")
        
        if new_content != content:
            count += 1
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

print(f'Updated {count} files.')
