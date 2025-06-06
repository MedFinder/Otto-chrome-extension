import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./manifest.json",
          dest: ".",
        },
        {
          src: "./src/styles/inject.css", // <-- Add this
          dest: ".", // puts it in `dist/`
        },
      ],
    }),
  ],
  esbuild: {
    legalComments: 'none', // <- This is the correct place
  },
  build: {
    minify: "esbuild",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        main: resolve(__dirname, "src/main.jsx"),
        inject: resolve(__dirname, "src/inject.js"),
        background: resolve(__dirname, "src/background.js"),
      },

      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: false,
        manualChunks: undefined,
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
