import path from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Content-Security-Policy del sitio publicado. GitHub Pages no permite
// headers personalizados, así que va como <meta> en el HTML.
// 'unsafe-inline' en style-src es necesario: framer-motion y embla animan
// vía atributos style inline.
// Los dominios de Spotify en script-src son para la iFrame API (autoplay
// al abrir una obra con música): open.spotify.com sirve el loader y este
// inyecta el script real desde embed-cdn.spotifycdn.com.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://open.spotify.com https://embed-cdn.spotifycdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://open.spotify.com https://suno.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

// Solo en build: en dev Vite inyecta scripts inline (react-refresh)
// que esta política bloquearía.
const injectCsp: Plugin = {
  name: "inject-csp",
  apply: "build",
  transformIndexHtml: (html) => ({
    html,
    tags: [
      {
        tag: "meta",
        attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
        injectTo: "head-prepend",
      },
    ],
  }),
};

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), injectCsp],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
