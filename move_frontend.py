import os
import shutil
import json

root_dir = r"c:\BuildSphere AI Version 3.0"
frontend_dir = os.path.join(root_dir, "frontend")

if not os.path.exists(frontend_dir):
    os.makedirs(frontend_dir)

items_to_move = [
    "dist",
    "index.html",
    "node_modules",
    "package-lock.json",
    "package.json",
    "public",
    "src",
    "vite.config.js",
    ".gitignore",
    ".oxlintrc.json"
]

for item in items_to_move:
    src_path = os.path.join(root_dir, item)
    dst_path = os.path.join(frontend_dir, item)
    if os.path.exists(src_path):
        print(f"Moving {item} to frontend/")
        shutil.move(src_path, dst_path)

# 1. Create a root package.json for workspace management
root_package_json = {
  "name": "buildsphere-workspace",
  "version": "1.0.0",
  "private": True,
  "scripts": {
    "install:all": "cd frontend && npm install && cd ../backend && pip install -r requirements.txt",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:frontend": "cd frontend && npm run dev",
    "start:backend": "cd backend && uvicorn app.main:app --reload"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
with open(os.path.join(root_dir, "package.json"), "w") as f:
    json.dump(root_package_json, f, indent=2)

# 2. Update frontend/vite.config.js to include a proxy for development
vite_config_path = os.path.join(frontend_dir, "vite.config.js")
if os.path.exists(vite_config_path):
    vite_content = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
"""
    with open(vite_config_path, "w") as f:
        f.write(vite_content)

# 3. Update client.js to use an environment variable with fallback
client_js_path = os.path.join(frontend_dir, "src", "api", "client.js")
if os.path.exists(client_js_path):
    with open(client_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace(
        "const API_BASE_URL = 'http://localhost:8000';", 
        "const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';"
    )
    with open(client_js_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Done organizing frontend files and setting up workspace arrangements!")
