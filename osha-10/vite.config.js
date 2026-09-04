import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import {
    publicAssetsByModule,
    sharedPublicAssets,
} from "./build/moduleAssets.js";

const DEFAULT_MODULE_ID = "module-2";
const moduleEntries = Object.freeze({
    "module-1": "./src/modules/module-1/module.js",
    "module-2": "./src/modules/module-2/module.js",
    "module-3": "./src/modules/module-3/module.js",
    "module-4": "./src/modules/module-4/module.js",
    "module-5": "./src/modules/module-5/module.js",
    "module-6": "./src/modules/module-6/module.js",
});

function emitModulePublicAssets(moduleId) {
    const assetPaths = new Set([
        ...sharedPublicAssets,
        ...publicAssetsByModule[moduleId],
    ]);

    return {
        name: "emit-module-public-assets",
        apply: "build",
        buildStart() {
            assetPaths.forEach((assetPath) => {
                this.emitFile({
                    type: "asset",
                    fileName: assetPath,
                    source: readFileSync(
                        fileURLToPath(
                            new URL(`./public/${assetPath}`, import.meta.url)
                        )
                    ),
                });
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    const isDefaultViteMode = mode === "development" || mode === "production";
    if (!isDefaultViteMode && !moduleEntries[mode]) {
        throw new Error(
            `Unknown game module mode "${mode}". Expected module-1 through module-6.`
        );
    }
    const moduleId = isDefaultViteMode ? DEFAULT_MODULE_ID : mode;
    const moduleEntry = fileURLToPath(
        new URL(moduleEntries[moduleId], import.meta.url)
    );

    return {
        // Relative paths keep every dist/module-N folder independently deployable.
        base: "./",

        // Each module has a different dependency graph. Keeping their dev caches
        // separate prevents one module from invalidating another module's
        // optimized dependency URLs while a browser tab is still using them.
        cacheDir: `node_modules/.vite/${moduleId}`,

        plugins: [emitModulePublicAssets(moduleId)],

        resolve: {
            alias: {
                "@game-module": moduleEntry,
            },
        },

        define: {
            __GAME_MODULE_ID__: JSON.stringify(moduleId),
        },

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
            outDir: `dist/${moduleId}`,
            emptyOutDir: true,
            minify: "oxc",
            sourcemap: false,
            copyPublicDir: false,
            // The active 3D modules legitimately include Babylon's runtime.
            // Keep this low enough to catch meaningful bundle regressions.
            chunkSizeWarningLimit: 1600,
        },

        optimizeDeps: {
            // Babylon loads PBR/background shader modules on demand. Serving its
            // ESM directly avoids Vite invalidating those lazy shader URLs with
            // "504 Outdated Optimize Dep" after a GLB has already loaded.
            exclude: ["@babylonjs/core", "@babylonjs/loaders"],
        },

        assetsInclude: ["**/*.glb", "**/*.gltf"],
    };
});
