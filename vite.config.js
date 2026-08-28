import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wallet-connect-test/',
  test: {
    environment: 'jsdom',
    // CI runners are sometimes much slower than a local machine, and the
    // default timeout is too tight for that. Give tests more room so a
    // slow runner doesn't fail a test that is actually fine.
    testTimeout: 15000,
    hookTimeout: 15000,
  },
})
