import os
import re

directory = r'c:\BuildSphere AI Version 3.0\frontend\src\components'

pattern = re.compile(
    r'export function (\w+)\(\) \{\s*return <div><(\w+)Header title="([^"]+)" description="([^"]+)"(?:\s+actionText="[^"]+")? /><(\w+)Tabs tabs=\{\[([^\]]+)\]\} activeTab="([^"]+)" onChange=\{\(\)=>\{\}\} /><(\w+)Placeholder title="[^"]+" /></div>;\s*\}'
)

def replace_func(match):
    func_name = match.group(1)
    header_name = match.group(2)
    title = match.group(3)
    desc = match.group(4)
    tabs_name = match.group(5)
    tabs_list = match.group(6)
    default_tab = match.group(7)
    placeholder_name = match.group(8)

    return f'''export function {func_name}() {{
  const [activeTab, setActiveTab] = useState("{default_tab}");
  return (
    <div>
      <{header_name}Header title="{title}" description="{desc}" />
      <{tabs_name}Tabs tabs={{[{tabs_list}]}} activeTab={{activeTab}} onChange={{setActiveTab}} />
      <{placeholder_name}Placeholder title={{activeTab}} />
    </div>
  );
}}'''

updated_count = 0
for filename in os.listdir(directory):
    if filename.endswith('Modules.jsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = pattern.sub(replace_func, content)

        if new_content != content:
            updated_count += 1
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

print(f"Updated interactive tab state across {updated_count} files!")
