import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import manusRuntime from "vite-plugin-manus-runtime"

export default defineConfig({
  plugins: [react(), manusRuntime()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  server: {
    middlewareMode: true,
  },
})
