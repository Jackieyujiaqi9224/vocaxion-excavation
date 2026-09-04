import {
    Color4,
    FreeCamera,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";

export function createPlaceholderScene({ engine, metadata }) {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.055, 0.075, 0.09, 1);

    const camera = new FreeCamera(
        `${metadata.id}-placeholder-camera`,
        new Vector3(0, 2, -8),
        scene
    );
    camera.setTarget(Vector3.Zero());
    scene.activeCamera = camera;

    const light = new HemisphericLight(
        `${metadata.id}-placeholder-light`,
        Vector3.Up(),
        scene
    );
    light.intensity = 0.8;

    const notice = document.getElementById("modulePlaceholder");
    if (notice) {
        notice.hidden = false;
    }

    return scene;
}
