import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: [
      'react-transition-group',
      '@bem-react/classname',
      '@bem-react/classnames',
      '@reatom/core',
      '@reatom/npm-react',
      '@consta/uikit',
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})