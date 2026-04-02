import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Plain `vite` does not run Netlify Functions. Proxy to `netlify functions:serve`
// (default http://127.0.0.1:9999) while using http://localhost:5173.
const netlifyFunctionsTarget =
  process.env.NETLIFY_FUNCTIONS_SERVE_URL || 'http://127.0.0.1:9999'

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.PNG'],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: netlifyFunctionsTarget,
        changeOrigin: true
      }
    }
  }
})
