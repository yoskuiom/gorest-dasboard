import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: [
      'compute-scroll-into-view',
      'react-transition-group',
      '@bem-react/classname',
      '@bem-react/classnames',
      '@reatom/core',
      '@reatom/npm-react',
      '@consta/uikit',
      'react-is',
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})