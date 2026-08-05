import { defineConfig } from "vite";

export default defineConfig({
    // Relative paths so BASE_URL assets work when hosted from a subpath or file share.
    base: "./",

    server: {
        port: 5173,
        open: false,
        strictPort: true,
    },

    preview: {
        port: 4173,
        open: false,
        strictPort: true,
    },

    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "esnext",
        minify: "esbuild",
        sourcemap: true,
        // Babylon bundles are large; avoid noisy chunk warnings.
        chunkSizeWarningLimit: 4000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules/@babylonjs/")) {
                        return "babylon";
                    }
                },
            },
        },
    },

    optimizeDeps: {
        include: ["@babylonjs/core", "@babylonjs/loaders"],
    },

    assetsInclude: ["**/*.glb", "**/*.gltf"],
});
