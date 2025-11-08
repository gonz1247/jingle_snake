import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: `${process.env.JINGLE_SNAKE_HOST}`,
    port: parseInt(process.env.JINGLE_SNAKE_PORT),
    proxy: {
      "/auth": {
        target: `${process.env.SERVER_TARGET}`,
      },
    },
  },
});
