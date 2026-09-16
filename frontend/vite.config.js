import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Proxy all /api/* calls directly to the FastAPI backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      },
      // Direct backend API endpoints with SPA bypass safety
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/projects': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass(req) {
          if (req.url.startsWith('/projectmanager') || req.url.startsWith('/projectviewer') || req.url.startsWith('/procurement')) {
            return req.url;
          }
        }
      },
      '/tasks': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/issues': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/documents': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/notifications': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/daily-logs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/twin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass(req) {
          if (req.url.startsWith('/digitaltwinengineer')) {
            return req.url;
          }
        }
      },
      '/bim': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass(req) {
          if (req.url.startsWith('/bimmanager')) {
            return req.url;
          }
        }
      },
      '/spatial': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/google-docs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
