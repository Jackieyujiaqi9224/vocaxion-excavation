import assert from "node:assert/strict";
import test from "node:test";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Ray } from "@babylonjs/core/Culling/ray.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { createHazardHitArea } from "../src/shared/gameplay/createHazardHitArea.js";

test("invisible cable hit area catches nearby clicks and follows the cable lifecycle", () => {
    const engine = new NullEngine();
    const scene = new Scene(engine);
    try {
        const cable = CreateBox("Bad Cable", { width: 0.16, height: 3.5, depth: 0.34 }, scene);
        const shell = createHazardHitArea(cable, 0.35);
        shell.isPickable = true;
        cable.computeWorldMatrix(true);
        shell.computeWorldMatrix(true);
        const ray = new Ray(new Vector3(0.3, 0, -4), new Vector3(0, 0, 1));
        assert.equal(scene.pickWithRay(ray, mesh => mesh === cable).hit, false);
        assert.equal(scene.pickWithRay(ray, mesh => mesh === shell).hit, true);
        assert.equal(shell.visibility, 0);
        assert.equal(shell.checkCollisions, false);
        cable.position.x = 5;
        cable.computeWorldMatrix(true);
        shell.computeWorldMatrix(true);
        assert.equal(scene.pickWithRay(ray, mesh => mesh === shell).hit, false);
        cable.setEnabled(false);
        assert.equal(shell.isEnabled(), false);
    } finally {
        scene.dispose();
        engine.dispose();
    }
});
