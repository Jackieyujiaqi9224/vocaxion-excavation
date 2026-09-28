import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo.js";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { createPostDeepeningHazardDefinitions } from "../src/modules/module-1/gameplay/postDeepeningHazards.js";

test("post-comic hazards use exported objects and move the whole excavator over the trench and back", () => {
    const engine = new NullEngine();
    const scene = new Scene(engine);
    try {
        const buffer = readFileSync(new URL("../public/models/Scenario1.glb", import.meta.url));
        const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
        const root = new Mesh("__root__", scene);
        root.rotationQuaternion = new Quaternion(0, 1, 0, 0);
        root.scaling.set(1, 1, -1);
        const nodes = gltf.nodes.map((node) => {
            const mesh = new Mesh(node.name, scene);
            mesh.parent = root;
            mesh.position.copyFromFloats(...(node.translation ?? [0, 0, 0]));
            mesh.rotationQuaternion = Quaternion.FromArray(node.rotation ?? [0, 0, 0, 1]);
            mesh.scaling.copyFromFloats(...(node.scale ?? [1, 1, 1]));
            if (node.mesh !== undefined) {
                const bounds = gltf.accessors[gltf.meshes[node.mesh].primitives[0].attributes.POSITION];
                mesh.setBoundingInfo(new BoundingInfo(Vector3.FromArray(bounds.min), Vector3.FromArray(bounds.max)));
            }
            return mesh;
        });
        gltf.nodes.forEach((node, i) => node.children?.forEach((child) => { nodes[child].parent = nodes[i]; }));
        const trench = { center: new Vector3(-13, 2, -1) };
        const [tool, hazard] = createPostDeepeningHazardDefinitions(scene, trench);
        assert.equal(tool.initialMeshStates[0].enabled, false);
        assert.equal(tool.activationMeshStates[0].enabled, true);
        assert.equal(tool.resolution.selectedMeshState.enabled, false);
        const excavator = scene.getMeshByName(hazard.meshNames[0]);
        const bucket = scene.getMeshByName("COL_SM_Veh_Excavator_01_Bucket_02.001");
        const originalPosition = excavator.position.clone();
        const originalBucket = bucket.getBoundingInfo().boundingBox.centerWorld.clone();
        excavator.position.addInPlace(Vector3.FromArray(hazard.activationMeshStates[0].positionOffset));
        excavator.computeWorldMatrix(true);
        bucket.computeWorldMatrix(true);
        const moved = bucket.getBoundingInfo().boundingBox.centerWorld;
        assert.ok(Math.abs(moved.x - trench.center.x) < 0.0001);
        assert.ok(Math.abs(moved.z - trench.center.z) < 0.0001);
        assert.ok(Math.abs(moved.y - originalBucket.y) < 0.0001);
        assert.ok(moved.y > 4.4, "bucket should be raised above the authored ground surface");
        excavator.position.addInPlace(Vector3.FromArray(hazard.resolution.selectedMeshState.positionOffset));
        excavator.computeWorldMatrix(true);
        bucket.computeWorldMatrix(true);
        assert.ok(Vector3.Distance(excavator.position, originalPosition) < 0.0001);
        assert.ok(Vector3.Distance(bucket.getBoundingInfo().boundingBox.centerWorld, originalBucket) < 0.0001);
    } finally {
        scene.dispose();
        engine.dispose();
    }
});
