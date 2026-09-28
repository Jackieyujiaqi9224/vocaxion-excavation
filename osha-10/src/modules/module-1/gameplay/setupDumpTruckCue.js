import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

const soundUrl = `${import.meta.env?.BASE_URL ?? "/"}Sound%20Effects/Dump%20Truck.mp3`;

export function setupDumpTruckCue(scene, {
    durationMs = 3000,
    audio = new Audio(soundUrl),
    now = () => performance.now(),
} = {}) {
    const truck = scene.getNodeByName("COL_Dump_Truck");
    if (!truck) throw new Error("Scenario 1 is missing COL_Dump_Truck");
    audio.preload = "auto";
    audio.volume = 0.65;
    const listeners = new Set();
    let active = false;
    let complete = false;
    let observer = null;
    let timer = null;
    let originalPosition = null;
    let camera = null;
    let cameraPosition = null;
    let beforeCameraObserver = null;
    let afterCameraObserver = null;

    const restoreCamera = () => {
        if (!cameraPosition) return;
        camera.position.copyFrom(cameraPosition);
        cameraPosition = null;
        camera.getViewMatrix(true);
        if (scene.activeCamera === camera) scene.updateTransformMatrix(true);
    };

    const stop = () => {
        clearTimeout(timer);
        timer = null;
        if (observer) scene.onBeforeRenderObservable.remove(observer);
        observer = null;
        restoreCamera();
        if (beforeCameraObserver) scene.onBeforeCameraRenderObservable.remove(beforeCameraObserver);
        if (afterCameraObserver) scene.onAfterCameraRenderObservable.remove(afterCameraObserver);
        beforeCameraObserver = null;
        afterCameraObserver = null;
        if (originalPosition) {
            truck.position.copyFrom(originalPosition);
            truck.computeWorldMatrix(true);
        }
        audio.pause();
        audio.currentTime = 0;
        active = false;
    };
    scene.onDisposeObservable.add(stop);

    return {
        activate() {
            if (active || complete) return;
            active = true;
            originalPosition = truck.position.clone();
            const startedAt = now();
            camera = scene.activeCamera;
            // Apply shake after the follow camera updates, and remove it after
            // rendering so its tracking never accumulates the vibration offset.
            beforeCameraObserver = scene.onBeforeCameraRenderObservable.add((renderCamera) => {
                if (renderCamera !== camera || !camera) return;
                restoreCamera();
                cameraPosition = camera.position.clone();
                const elapsed = (now() - startedAt) / 1000;
                camera.position.addInPlace(new Vector3(
                    Math.sin(elapsed * 70) * 0.025,
                    Math.sin(elapsed * 95) * 0.02,
                    0
                ));
                camera.getViewMatrix(true);
                scene.updateTransformMatrix(true);
            });
            afterCameraObserver = scene.onAfterCameraRenderObservable.add((renderCamera) => {
                if (renderCamera === camera) restoreCamera();
            });
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Continue the scene if the browser rejects audio playback.
            });
            observer = scene.onBeforeRenderObservable.add(() => {
                const elapsed = (now() - startedAt) / 1000;
                truck.position.copyFrom(originalPosition);
                truck.position.x += Math.sin(elapsed * 70) * 0.045;
                truck.position.y += Math.sin(elapsed * 95) * 0.025;
                truck.computeWorldMatrix(true);
            });
            timer = setTimeout(() => {
                stop();
                complete = true;
                listeners.forEach(listener => listener());
            }, durationMs);
        },
        deactivate: stop,
        isComplete: () => complete,
        isBlocking: () => active,
        onComplete(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}
