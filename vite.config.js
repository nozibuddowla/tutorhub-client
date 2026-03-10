import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      // Babel fast refresh only in dev, no overhead in prod
      babel: {
        plugins: [
          // Remove prop-types in production (saves ~5–10 KB)
          ...(process.env.NODE_ENV === "production"
            ? [
                [
                  "babel-plugin-transform-react-remove-prop-types",
                  { removeImport: true },
                ],
              ]
            : []),
        ],
      },
    }),
    tailwindcss(),
  ],

  build: {
    // Target modern browsers — smaller, faster output
    target: "es2020",

    // Warn if any single chunk exceeds 400 KB
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        // ── Manual chunk splitting ──────────────────────────────────────────
        // Each vendor chunk loads only when its pages are visited
        manualChunks: {
          // React core — always needed
          "vendor-react": ["react", "react-dom", "react-router"],

          // Firebase — only loaded when auth is needed
          "vendor-firebase": ["firebase/app", "firebase/auth"],

          // Stripe — only on payment page
          "vendor-stripe": ["@stripe/stripe-js", "@stripe/react-stripe-js"],

          // Charts — only on Reports page
          "vendor-charts": ["recharts"],

          // Axios + toast — small but used everywhere
          "vendor-utils": ["axios", "react-toastify"],

          // Socket.io client — only in messages
          "vendor-socket": ["socket.io-client"],
        },

        // Hashed filenames for long-term cache busting
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // Generate source maps for production debugging (optional — remove if deploy is slow)
    sourcemap: false,

    // Minify with esbuild (default, very fast)
    minify: "esbuild",
  },

  // ── Dev server ──────────────────────────────────────────────────────────────
  server: {
    port: 5173,
    // Pre-bundle deps for faster cold start
    warmup: {
      clientFiles: ["./src/main.jsx", "./src/Router/router.jsx"],
    },
  },

  // ── Dependency pre-bundling ─────────────────────────────────────────────────
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
    // Socket.io has CJS/ESM issues — exclude from pre-bundle
    exclude: ["socket.io-client"],
  },
});
