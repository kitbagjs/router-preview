import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          environment: 'happy-dom',
          include: ['src/**/*.browser.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['src/**/*.spec.ts'],
          exclude: ['src/**/*.browser.spec.ts'],
          typecheck: {
            enabled: true,
            checker: 'vue-tsc',
            ignoreSourceErrors: true,
            tsconfig: './tsconfig.json',
            include: ['src/**/*.spec-d.ts'],
          },
        },
      },
    ],
  },
})
