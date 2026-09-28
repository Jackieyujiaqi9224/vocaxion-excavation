import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera.js";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { syncCameraToMarker } from "../src/shared/scene/syncCameraToMarker.js";
import { trenchPlacementConfig } from "../src/modules/module-1/config/trenchPlacementConfig.js";

const near = (actual, expected) => {
    assert.ok(Vector3.Distance(actual, expected) < 0.00001,
        `${actual.toString()} should match ${expected.toString()}`);
};

test("Blender Empty camera axes preserve world position, viewing direction, and up", () => {
    const engine = new NullEngine();
    const scene = new Scene(engine);
    try {
        // Match Babylon's glTF conversion root in its default left-handed scene.
        const root = new TransformNode("__root__", scene);
        root.rotationQuaternion = new Quaternion(0, 1, 0, 0);
        root.scaling.set(1, 1, -1);
        const marker = new TransformNode("marker", scene);
        marker.parent = root;
        const camera = new UniversalCamera("camera", Vector3.Zero(), scene);
        camera.fov = 0.8;

        // An unrotated Blender Empty has a camera looking down Blender -Z,
        // which becomes world -Y, with Blender +Y becoming world -Z.
        marker.position.set(3, 4, 5);
        syncCameraToMarker(camera, marker, trenchPlacementConfig.sceneNodes);
        near(camera.position, new Vector3(-3, 4, 5));
        near(camera.getTarget().subtract(camera.position).normalize(), new Vector3(0, -1, 0));
        near(camera.upVector, new Vector3(0, 0, -1));

        // Exercise the actual exported marker, including its authored rotation.
        const buffer = readFileSync(new URL("../public/models/Scenario1.glb", import.meta.url));
        const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
        const node = gltf.nodes.find(({ name }) => name === "Camera Position_1");
        marker.position.copyFromFloats(...node.translation);
        marker.rotationQuaternion = Quaternion.FromArray(node.rotation);
        syncCameraToMarker(camera, marker, trenchPlacementConfig.sceneNodes);
        near(camera.position, new Vector3(-17, 2, -0.8));
        near(camera.getTarget().subtract(camera.position).normalize(), new Vector3(1, 0, 0));
        near(camera.upVector, Vector3.Up());
        assert.equal(camera.fov, 0.8);
    } finally {
        scene.dispose();
        engine.dispose();
    }
});
