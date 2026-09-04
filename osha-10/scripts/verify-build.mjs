import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    publicAssetsByModule,
    sharedPublicAssets,
} from "../build/moduleAssets.js";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distRoot = join(projectRoot, "dist");

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(path) : [path];
    }));
    return nested.flat();
}

async function requireNonemptyFile(path, label) {
    const details = await stat(path);
    if (!details.isFile() || details.size === 0) {
        throw new Error(`${label} is missing or empty`);
    }
    return details.size;
}

for (const [moduleId, moduleAssets] of Object.entries(publicAssetsByModule)) {
    const moduleRoot = join(distRoot, moduleId);
    const htmlPath = join(moduleRoot, "index.html");
    const html = await readFile(htmlPath, "utf8");
    const linkedPaths = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
        .map(([, path]) => path)
        .filter((path) => !/^(?:data:|https?:)/.test(path))
        .map((path) => decodeURIComponent(path.replace(/^\.\//, "")));

    for (const path of linkedPaths) {
        await requireNonemptyFile(
            join(moduleRoot, path),
            `${moduleId} HTML dependency ${path}`
        );
    }
    for (const assetPath of new Set([...sharedPublicAssets, ...moduleAssets])) {
        await requireNonemptyFile(
            join(moduleRoot, assetPath),
            `${moduleId} public asset ${assetPath}`
        );
    }

    const outputFiles = await collectFiles(moduleRoot);
    const sourceMaps = outputFiles.filter((path) => path.endsWith(".map"));
    if (sourceMaps.length) {
        throw new Error(`${moduleId} unexpectedly contains production source maps`);
    }

    const javascriptFiles = outputFiles.filter((path) => path.endsWith(".js"));
    const javascript = (await Promise.all(
        javascriptFiles.map((path) => readFile(path, "utf8"))
    )).join("\n");
    if (javascript.includes("@babylonjs/inspector")) {
        throw new Error(`${moduleId} includes the development-only inspector`);
    }

    const totalBytes = (await Promise.all(
        outputFiles.map((path) => stat(path))
    )).reduce((total, details) => total + details.size, 0);
    console.log(`${moduleId}: ${(totalBytes / 1_000_000).toFixed(1)} MB`);
}

console.log("All six production module outputs are complete and self-contained.");
