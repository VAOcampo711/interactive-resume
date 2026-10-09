import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/tests/**", "src/main.tsx", "src/setupTests.ts", "src/vite-env.d.ts", "src/types/**"],
            reporter: ["text", "html"],
            thresholds: {
                statements: 95,
                branches: 90,
                functions: 85,
                lines: 95
            }
        }
    }
})
