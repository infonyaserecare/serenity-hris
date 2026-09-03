import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The prototype is a single file at the project root (hris-app.jsx); this
// harness only exists to render it. Root stays here so hris-app.jsx resolves
// react / lucide-react / recharts from ./node_modules normally.
export default defineConfig({
  plugins: [react()],
  server: { port: 5177, open: false },
});
