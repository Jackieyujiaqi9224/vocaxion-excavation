export function setupInspectorShortcut(scene) {
    let inspectorPromise;

    window.addEventListener("keydown", async (event) => {
        if (event.code !== "KeyI" || event.repeat) return;

        // Loading the inspector also registers scene.debugLayer. With focused
        // Babylon imports it does not exist until this development-only import.
        inspectorPromise ??= import("@babylonjs/inspector");
        await inspectorPromise;

        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            // The inspector is several megabytes and is only needed on demand.
            // Keep it out of the initial gameplay bundle.
            await scene.debugLayer.show();
        }
    });
}
