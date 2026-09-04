import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { Scene } from "@babylonjs/core/scene.js";

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
