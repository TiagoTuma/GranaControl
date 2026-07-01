import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base = "/NOME-DO-REPO/" para GitHub Pages. Seu repo é "GranaControl".
// Se um dia publicar no Vercel/Netlify, troque para base: "/".
export default defineConfig({
  plugins: [react()],
  base: "/GranaControl/",
});
