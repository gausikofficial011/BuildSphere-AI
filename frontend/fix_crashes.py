import os
import re

directory = r'c:\BuildSphere AI Version 3.0\frontend\src\components'

for filename in os.listdir(directory):
    if filename.endswith('Modules.jsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Fix lucide-react import to include Plus if not present
        if 'Plus' not in content.split("from 'lucide-react'")[0]:
            # Add Plus to lucide-react import
            content = re.sub(r"import\s*\{([^}]+)\}\s*from\s*'lucide-react';", lambda m: f"import {{{m.group(1).strip()}, Plus}} from 'lucide-react';", content)

        # 2. Fix ModuleHeader function signature and JSX
        content = re.sub(
            r'export function (\w+)ModuleHeader\(\{ title, description, actionText = [^\}]+ \}\) \{[\s\S]*?    </div>\n  \);\n\}',
            r'''export function \1ModuleHeader({ title, description, actionText = "Action" }) {
  return (
    <div className="page-header" style={{ marginBottom: '2rem' }}>
      <div className="page-title">
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{title}</h1>
        <p style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>{description}</p>
      </div>
      <div className="header-actions">
        <button className="export-btn">
          <Plus size={16} /> {actionText}
        </button>
      </div>
    </div>
  );
}''',
            content
        )

        # 3. Fix Tabs component styling (active tab text color was turned transparent!)
        content = re.sub(
            r'color:\s*activeTab\s*===\s*t\s*\?\s*[\'"][^\'"]+[\'"]\s*:\s*[\'"][^\'"]+[\'"]',
            "color: activeTab === t ? '#ffffff' : '#94a3b8'",
            content
        )

        # 4. Clean up any accidental transparent text colors on h2 / h1 / p
        content = content.replace("color: 'rgba(255, 255, 255, 0.05)'", "color: '#ffffff'")

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("All module files fixed successfully!")
