import { createPlayer } from "./createPlayer.js";
import { createThirdPersonCamera } from "./createThirdPersonCamera.js";
import { setupInput } from "./setupInput.js";

export async function createPlayableRuntime(scene, options = {}) {
    const player = await createPlayer(scene, options);
    const { camera, cameraTarget } = createThirdPersonCamera(scene, player);
    scene.activeCamera = camera;
    const input = setupInput(scene);
    return { player, camera, cameraTarget, input };
}
