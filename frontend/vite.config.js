import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/UDOMap/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/classrooms/*'],
      manifest: {
        name: 'UDOMap - Campus UDO Anzoátegui',
        short_name: 'UDOMap',
        description: 'Navegación peatonal, horarios y espacios de la UDO Núcleo de Anzoátegui',
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/UDOMap/',
        start_url: '/UDOMap/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})