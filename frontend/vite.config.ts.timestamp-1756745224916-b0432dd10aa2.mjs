// vite.config.ts
import { defineConfig } from "file:///C:/Users/B/Videos/Projects/Keyboard%20Warrior/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/B/Videos/Projects/Keyboard%20Warrior/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\B\\Videos\\Projects\\Keyboard Warrior\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh in development only
      fastRefresh: true
    })
  ],
  server: {
    port: 3e3,
    host: true,
    cors: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  build: {
    target: "es2018",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: "terser",
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "ui-vendor": ["lucide-react", "react-hot-toast", "clsx"],
          "http-vendor": ["axios"]
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          let extType = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || "")) {
            extType = "images";
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || "")) {
            extType = "fonts";
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js"
      }
    },
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: process.env.NODE_ENV === "production",
        pure_funcs: process.env.NODE_ENV === "production" ? ["console.log"] : []
      },
      format: {
        comments: false
      }
    },
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,
    // Asset optimization
    assetsInlineLimit: 4096,
    // 4KB
    // Chunk size warnings
    chunkSizeWarningLimit: 1e3
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@components": resolve(__vite_injected_original_dirname, "./src/components"),
      "@pages": resolve(__vite_injected_original_dirname, "./src/pages"),
      "@services": resolve(__vite_injected_original_dirname, "./src/services"),
      "@utils": resolve(__vite_injected_original_dirname, "./src/utils"),
      "@types": resolve(__vite_injected_original_dirname, "./src/types"),
      "@styles": resolve(__vite_injected_original_dirname, "./src/styles")
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "lucide-react",
      "react-hot-toast",
      "clsx"
    ]
  },
  preview: {
    port: 4173,
    host: true,
    cors: true
  },
  // Environment variables prefix
  envPrefix: "VITE_"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCXFxcXFZpZGVvc1xcXFxQcm9qZWN0c1xcXFxLZXlib2FyZCBXYXJyaW9yXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCXFxcXFZpZGVvc1xcXFxQcm9qZWN0c1xcXFxLZXlib2FyZCBXYXJyaW9yXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9CL1ZpZGVvcy9Qcm9qZWN0cy9LZXlib2FyZCUyMFdhcnJpb3IvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBFbmFibGUgUmVhY3QgRmFzdCBSZWZyZXNoIGluIGRldmVsb3BtZW50IG9ubHlcbiAgICAgIGZhc3RSZWZyZXNoOiB0cnVlLFxuICAgIH0pXG4gIF0sXG4gIFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgY29yczogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjUwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDE4JyxcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIFxuICAgIC8vIE9wdGltaXplIGNodW5rIHNwbGl0dGluZyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gVmVuZG9yIGNodW5rc1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICdyb3V0ZXItdmVuZG9yJzogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsnbHVjaWRlLXJlYWN0JywgJ3JlYWN0LWhvdC10b2FzdCcsICdjbHN4J10sXG4gICAgICAgICAgJ2h0dHAtdmVuZG9yJzogWydheGlvcyddLFxuICAgICAgICB9LFxuICAgICAgICAvLyBPcHRpbWl6ZSBhc3NldCBmaWxlIG5hbWVzIGZvciBiZXR0ZXIgY2FjaGluZ1xuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZT8uc3BsaXQoJy4nKSB8fCBbXTtcbiAgICAgICAgICBsZXQgZXh0VHlwZSA9IGluZm9baW5mby5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAoL1xcLihwbmd8anBlP2d8Z2lmfHN2Z3x3ZWJwfGljbykkL2kudGVzdChhc3NldEluZm8ubmFtZSB8fCAnJykpIHtcbiAgICAgICAgICAgIGV4dFR5cGUgPSAnaW1hZ2VzJztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4od29mZjI/fGVvdHx0dGZ8b3RmKSQvaS50ZXN0KGFzc2V0SW5mby5uYW1lIHx8ICcnKSkge1xuICAgICAgICAgICAgZXh0VHlwZSA9ICdmb250cyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBgJHtleHRUeXBlfS9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJ1xuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIFRlcnNlciBvcHRpb25zIGZvciBiZXR0ZXIgbWluaWZpY2F0aW9uXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBwdXJlX2Z1bmNzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlLmxvZyddIDogW11cbiAgICAgIH0sXG4gICAgICBmb3JtYXQ6IHtcbiAgICAgICAgY29tbWVudHM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvLyBDU1Mgb3B0aW1pemF0aW9uXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIGNzc01pbmlmeTogdHJ1ZSxcbiAgICBcbiAgICAvLyBBc3NldCBvcHRpbWl6YXRpb25cbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy8gNEtCXG4gICAgXG4gICAgLy8gQ2h1bmsgc2l6ZSB3YXJuaW5nc1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMFxuICB9LFxuICBcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAY29tcG9uZW50cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgJ0BwYWdlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICdAc2VydmljZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3NlcnZpY2VzJyksXG4gICAgICAnQHV0aWxzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxuICAgICAgJ0B0eXBlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcbiAgICAgICdAc3R5bGVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdHlsZXMnKVxuICAgIH1cbiAgfSxcbiAgXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdheGlvcycsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICdyZWFjdC1ob3QtdG9hc3QnLFxuICAgICAgJ2Nsc3gnXG4gICAgXSxcbiAgfSxcbiAgXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgY29yczogdHJ1ZVxuICB9LFxuICBcbiAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzIHByZWZpeFxuICBlbnZQcmVmaXg6ICdWSVRFXydcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFYsU0FBUyxvQkFBb0I7QUFDM1gsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUZ4QixJ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
