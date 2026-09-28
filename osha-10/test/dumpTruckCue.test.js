import assert from "node:assert/strict";
import test from "node:test";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { setupDumpTruckCue } from "../src/modules/module-1/gameplay/setupDumpTruckCue.js";

test("truck cue plays once, vibrates, restores position, and completes after three seconds", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const engine = new NullEngine();
    const scene = new Scene(engine);
    try {
        const truck = new Mesh("COL_Dump_Truck", scene);
        truck.position.set(17, 4, 11);
        const original = truck.position.clone();
        const camera = new FreeCamera("camera", new Vector3(0, 4, -8), scene);
        scene.activeCamera = camera;
        const originalCamera = camera.position.clone();
        let time = 0;
        let plays = 0;
        let pauses = 0;
        let completions = 0;
        const audio = { currentTime: 0, play: () => { plays++; return Promise.resolve(); }, pause: () => { pauses++; } };
        const cue = setupDumpTruckCue(scene, { audio, now: () => time });
        cue.onComplete(() => { completions++; });
        cue.activate();
        cue.activate();
        assert.equal(plays, 1);
        assert.equal(cue.isBlocking(), true);
        time = 100;
        scene.onBeforeRenderObservable.notifyObservers(scene);
        assert.notDeepEqual(truck.position.asArray(), original.asArray());
        scene.onBeforeCameraRenderObservable.notifyObservers(camera);
        assert.notDeepEqual(camera.position.asArray(), originalCamera.asArray());
        scene.onAfterCameraRenderObservable.notifyObservers(camera);
        assert.deepEqual(camera.position.asArray(), originalCamera.asArray());
        // Completion must also restore the camera if it occurs between hooks.
        scene.onBeforeCameraRenderObservable.notifyObservers(camera);
        t.mock.timers.tick(2999);
        assert.equal(completions, 0);
        t.mock.timers.tick(1);
        assert.equal(completions, 1);
        assert.equal(pauses, 1);
        assert.equal(cue.isComplete(), true);
        assert.equal(cue.isBlocking(), false);
        assert.deepEqual(truck.position.asArray(), original.asArray());
        assert.deepEqual(camera.position.asArray(), originalCamera.asArray());
        time = 5000;
        scene.onBeforeRenderObservable.notifyObservers(scene);
        scene.onBeforeCameraRenderObservable.notifyObservers(camera);
        assert.deepEqual(camera.position.asArray(), originalCamera.asArray());
        assert.deepEqual(truck.position.asArray(), original.asArray());
        cue.activate();
        assert.equal(plays, 1);
    } finally {
        scene.dispose();
        engine.dispose();
    }
});
