import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './'  مهم جدا ليعمل المشروع داخل تطبيق الأندرويد وسطح المكتب
export default defineConfig({
  plugins: [react()],
  base: './',
})
