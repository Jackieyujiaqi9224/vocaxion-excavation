import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { createShieldPreview, SHIELD_SNAP_NODE_NAMES } from "../src/modules/module-1/world/createShieldPreview.js";

function fixture() {
    const engine = new NullEngine();
    const scene = new Scene(engine);
    const buffer = readFileSync(new URL("../public/models/Scenario1.glb", import.meta.url));
    const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
    const root = new TransformNode("export-root", scene);
    root.position.set(2, 7, -3);
    root.scaling.set(-1, 1, 1);
    for (const name of ["Shield A", "Shield B", ...SHIELD_SNAP_NODE_NAMES]) {
        const exported = gltf.nodes.find(node => node.name === name);
        assert.ok(exported, `Export is missing ${name}`);
        const mesh = CreateBox(name, { size: 1 }, scene);
        mesh.parent = root;
        mesh.position.copyFrom(Vector3.FromArray(exported.translation));
        mesh.scaling.copyFrom(Vector3.FromArray(exported.scale ?? [1, 1, 1]));
        mesh.rotationQuaternion = Quaternion.FromArray(exported.rotation ?? [0, 0, 0, 1]);
        const accessor = gltf.accessors[gltf.meshes[exported.mesh].primitives[0].attributes.POSITION];
        mesh.setBoundingInfo(new BoundingInfo(Vector3.FromArray(accessor.min), Vector3.FromArray(accessor.max)));
        mesh.computeWorldMatrix(true);
    }
    return { scene, dispose() { scene.dispose(); engine.dispose(); } };
}

test("shield previews preserve authored starting positions and hide all four exported snap meshes", () => {
    const { scene, dispose } = fixture();
    try {
        const small = scene.getMeshByName("Shield A");
        const large = scene.getMeshByName("Shield B");
        const startSmall = small.getAbsolutePosition().clone();
        const startLarge = large.getAbsolutePosition().clone();
        const preview = createShieldPreview(scene);
        for (const name of SHIELD_SNAP_NODE_NAMES) assert.equal(scene.getNodeByName(name).isEnabled(), false);
        assert.equal(small.isEnabled(), false);
        assert.equal(large.isEnabled(), false);
        preview.selectProtection("shielding");
        assert.equal(small.isEnabled(), true);
        assert.equal(small.behaviors[0].enabled, false);
        preview.selectSize("shielding", "shield-large");
        preview.startPlacement("shield-large");
        assert.equal(small.isEnabled(), false);
        assert.equal(large.isEnabled(), true);
        assert.equal(large.behaviors[0].enabled, false);
        preview.selectSize("shielding", "shield-small");
        assert.equal(small.isEnabled(), true);
        assert.equal(large.isEnabled(), false);
        assert.deepEqual(small.getAbsolutePosition().asArray(), startSmall.asArray());
        assert.deepEqual(large.getAbsolutePosition().asArray(), startLarge.asArray());
        preview.selectProtection("sloping");
        assert.equal(small.isEnabled(), false);
        assert.equal(large.isEnabled(), false);
        assert.equal(scene.meshes.length, 6);
    } finally { dispose(); }
});

test("shield edge distances use Position 01 as the 2 ft top / 0 ft bottom reference", () => {
    const { scene, dispose } = fixture();
    try {
        const shield = scene.getMeshByName("Shield A");
        const preview = createShieldPreview(scene);
        assert.equal(preview.getMeasurements(1.5), null);
        preview.selectProtection("shielding");
        assert.equal(preview.getMeasurements(1.5), null);
        preview.selectSize("shielding", "shield-large");
        preview.startPlacement("shield-large");
        assert.equal(preview.getMeasurements(1.5), null);
        preview.selectSize("shielding", "shield-small");
        assert.equal(preview.getMeasurements(1.5), null);
        preview.startPlacement("shield-small");
        const drag = shield.behaviors[0];
        const referenceY = scene.getNodeByName(SHIELD_SNAP_NODE_NAMES[0]).getAbsolutePosition().y;
        for (const name of SHIELD_SNAP_NODE_NAMES) {
            const point = scene.getNodeByName(name).getAbsolutePosition();
            drag.onDragStartObservable.notifyObservers({});
            drag.onDragObservable.notifyObservers({ delta: new Vector3(0, point.y - shield.getAbsolutePosition().y, 0) });
            drag.onDragEndObservable.notifyObservers({});
            const measurement = preview.getMeasurements(1.5);
            const offsetFeet = (point.y - referenceY) * 1.5;
            assert.ok(Math.abs(measurement.topFeet - (2 + offsetFeet)) < 0.00001);
            assert.ok(Math.abs(measurement.bottomFeet - offsetFeet) < 0.00001);
            assert.ok(Number.isFinite(measurement.bounds.min.y));
            assert.ok(measurement.bounds.max.y > measurement.bounds.min.y);
        }
        preview.finishPlacement();
        assert.equal(preview.getMeasurements(1.5), null);
        preview.selectProtection("sloping");
        assert.equal(preview.getMeasurements(1.5), null);
    } finally { dispose(); }
});

test("Small snaps to all four world positions after size submission; only the configured target passes", () => {
    const { scene, dispose } = fixture();
    try {
        const small = scene.getMeshByName("Shield A");
        const preview = createShieldPreview(scene);
        preview.selectProtection("shielding");
        preview.selectSize("shielding", "shield-small");
        const drag = small.behaviors[0];
        const start = small.getAbsolutePosition().clone();
        drag.onDragObservable.notifyObservers({ delta: new Vector3(0, -3, 0) });
        assert.deepEqual(small.getAbsolutePosition().asArray(), start.asArray());
        assert.ok(preview.validatePlacement("shielding", "shield-small"));
        preview.startPlacement("shield-small");
        assert.equal(drag.enabled, true);
        for (const name of SHIELD_SNAP_NODE_NAMES) {
            const target = scene.getNodeByName(name).getAbsolutePosition().clone();
            drag.onDragStartObservable.notifyObservers({});
            drag.onDragObservable.notifyObservers({ delta: new Vector3(8, target.y + 0.1 - small.getAbsolutePosition().y, 8) });
            drag.onDragEndObservable.notifyObservers({});
            assert.ok(Vector3.Distance(small.getAbsolutePosition(), target) < 0.00001, `${name}: snap world coordinates`);
            const error = preview.validatePlacement("shielding", "shield-small");
            if (name === "Shield_A_Pos_01") assert.equal(error, null);
            else assert.ok(error, `${name} must not complete the activity`);
        }
        preview.finishPlacement();
        assert.equal(drag.enabled, false);
        assert.equal(preview.validatePlacement("sloping", "slope-53"), null);
    } finally { dispose(); }
});
