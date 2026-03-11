import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: "es2020",
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-firebase": ["firebase/app", "firebase/auth"],
          "vendor-stripe": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          "vendor-charts": ["recharts"],
          "vendor-utils": ["axios", "react-toastify"],
          "vendor-socket": ["socket.io-client"],
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },

  server: { port: 5173 },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "axios",
      "react-toastify",
      "firebase/app",
      "firebase/auth",
    ],
    exclude: ["socket.io-client"],
  },
});
