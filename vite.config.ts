import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isProd ? "/mas-case-demo/" : "/",
  plugins: [react()],
  build: { outDir: "docs" },
});
