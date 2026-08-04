import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        // Keep the diagnostic build readable while isolating a Chromium-only
        // failure that occurs after Vite's production transform.
        minify: false,
        sourcemap: true,
    },
});
