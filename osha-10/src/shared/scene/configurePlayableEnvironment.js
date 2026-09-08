import { PhotoDome } from "@babylonjs/core/Helpers/photoDome.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

const DEFAULT_SKYBOX_URL = `${import.meta.env.BASE_URL}2D%20Assets/Skybox.jpg`;

export function configurePlayableEnvironment(
    scene,
    { skyboxUrl = DEFAULT_SKYBOX_URL } = {}
) {
    scene.clearColor = new Color4(0.12, 0.12, 0.14, 1);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.6, 0);

    const sky = new PhotoDome(
        "panoramicSky",
        skyboxUrl,
        {
            resolution: 32,
            size: 1000,
            useDirectMapping: false,
        },
        scene
    );
    sky.imageMode = PhotoDome.MODE_MONOSCOPIC;
    sky.position.y = 100;
    sky.mesh.isPickable = false;
    sky.mesh.infiniteDistance = true;

    new HemisphericLight("hemisphericLight", Vector3.Up(), scene);
    const sun = new DirectionalLight(
        "sun",
        new Vector3(-0.3, -1, -0.2),
        scene
    );
    sun.position = new Vector3(30, 50, 20);
    sun.intensity = 0.8;
}
