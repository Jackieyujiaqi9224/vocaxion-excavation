import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { trenchPlacementConfig } from "../src/modules/module-1/config/trenchPlacementConfig.js";
import { secondTrenchPlacementConfig } from "../src/modules/module-1/config/secondTrenchPlacementConfig.js";

const buffer = readFileSync(new URL("../public/models/Scenario1.glb", import.meta.url));
const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));

test("both Module 1 planners reference distinct camera and measurement markers in the export", () => {
    for (const key of ["cameraPosition", "depthTop", "measurementCross", "widthLeft"]) {
        assert.notEqual(trenchPlacementConfig.sceneNodes[key], secondTrenchPlacementConfig.sceneNodes[key]);
        for (const config of [trenchPlacementConfig, secondTrenchPlacementConfig]) {
            const matches = gltf.nodes.filter(node => node.name === config.sceneNodes[key]);
            assert.equal(matches.length, 1, `${config.id}: missing or duplicate ${key}`);
            assert.equal(matches[0].mesh, undefined, `${key} must load as a transform node`);
        }
    }
    for (const config of [trenchPlacementConfig, secondTrenchPlacementConfig]) {
        const top = gltf.nodes.find(node => node.name === config.sceneNodes.depthTop);
        const cross = gltf.nodes.find(node => node.name === config.sceneNodes.measurementCross);
        const left = gltf.nodes.find(node => node.name === config.sceneNodes.widthLeft);
        assert.notEqual(top.translation[1], cross.translation[1], "depth guide needs a vertical span");
        assert.notEqual(left.translation[2], cross.translation[2], "width guide needs a horizontal span");
    }
});
