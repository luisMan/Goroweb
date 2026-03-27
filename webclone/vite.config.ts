import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/api/admin": {
          target: env.MERCADO_PAGO_SERVER_URL || "http://localhost:8787",
          changeOrigin: true
        },
        "/api/mercado-pago": {
          target: env.MERCADO_PAGO_SERVER_URL || "http://localhost:8787",
          changeOrigin: true
        }
      }
    }
  };
});
