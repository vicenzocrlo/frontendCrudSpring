import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React (porta 5173) e Spring Boot (porta 8080) são origens diferentes,
// e o navegador bloquearia as chamadas (CORS). O proxy resolve isso em desenvolvimento:
// toda requisição para "/usuarios" é repassada ao Spring Boot.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/usuarios": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
