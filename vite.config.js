import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB (default is 500 kB)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          "vendor-react": ["react", "react-dom"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-pdf": ["jspdf", "jspdf-autotable"],
          "vendor-icons": ["@phosphor-icons/react", "@mui/icons-material"],
        },
      },
    },
  },
});
