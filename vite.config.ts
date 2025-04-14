import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import path from "path";
//import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'http://inventory.mciassist.com'
});
