import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    publicAssetsByModule,
    sharedPublicAssets,
} from "../build/moduleAssets.js";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const supportedGltfExtensions = new Set([
    "KHR_materials_anisotropy",
    "KHR_materials_clearcoat",
    "KHR_materials_ior",
    "KHR_materials_specular",
]);

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(path) : [path];
    }));
    return nested.flat();
}

async function validateSourceImports() {
    const sourceFiles = (await collectFiles(join(projectRoot, "src")))
        .filter((path) => extname(path) === ".js");
    const violations = [];
    for (const path of sourceFiles) {
        const source = await readFile(path, "utf8");
        if (/from\s+["']@babylonjs\/core["']/.test(source)) {
            violations.push(`${path}: imports the Babylon core barrel`);
        }
        if (/import\s+["']@babylonjs\/loaders\/glTF["']/.test(source)) {
            violations.push(`${path}: imports the full glTF loader barrel`);
        }
    }
    if (violations.length) throw new Error(violations.join("\n"));
}

function parseGlbJson(buffer, path) {
    if (buffer.length < 20 || buffer.toString("ascii", 0, 4) !== "glTF") {
        throw new Error(`${path} is not a valid binary glTF file`);
    }
    if (buffer.readUInt32LE(4) !== 2) {
        throw new Error(`${path} must use the glTF 2.0 container format`);
    }
    const jsonLength = buffer.readUInt32LE(12);
    if (buffer.toString("ascii", 16, 20) !== "JSON") {
        throw new Error(`${path} is missing its JSON chunk`);
    }
    return JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength));
}

async function validateAssets() {
    const moduleIds = Object.keys(publicAssetsByModule);
    if (moduleIds.length !== 6) {
        throw new Error(`Expected six module asset manifests, found ${moduleIds.length}`);
    }

    const assetPaths = new Set([
        ...sharedPublicAssets,
        ...Object.values(publicAssetsByModule).flat(),
    ]);
    for (const assetPath of assetPaths) {
        const path = join(projectRoot, "public", assetPath);
        const details = await stat(path);
        if (!details.isFile() || details.size === 0) {
            throw new Error(`Required asset is missing or empty: ${assetPath}`);
        }
        if (extname(path).toLowerCase() !== ".glb") continue;

        const gltf = parseGlbJson(await readFile(path), assetPath);
        if (gltf.asset?.version !== "2.0") {
            throw new Error(`${assetPath} declares unsupported glTF ${gltf.asset?.version}`);
        }
        const unsupported = (gltf.extensionsUsed ?? []).filter(
            (extension) => !supportedGltfExtensions.has(extension)
        );
        if (unsupported.length) {
            throw new Error(
                `${assetPath} needs unregistered glTF extensions: ${unsupported.join(", ")}`
            );
        }
    }
}

await validateSourceImports();
await validateAssets();
console.log("Project source imports and module asset manifests are valid.");
