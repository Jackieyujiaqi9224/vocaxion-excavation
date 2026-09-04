import { FollowCamera, TransformNode, Vector3 } from "@babylonjs/core";

export function createThirdPersonCamera(scene, targetMesh) {
    // The proxy follows both position and heading, keeping the camera behind the
    // player while allowing the FollowCamera to smooth viewpoint rotation.
    const cameraTarget = new TransformNode("cameraTarget", scene);
    cameraTarget.position.copyFrom(targetMesh.position);

    const camera = new FollowCamera("followCamera", new Vector3(0, 4, -8), scene);
    camera.lockedTarget = cameraTarget;
    camera.radius = 8;
    camera.heightOffset = 3.2;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 10;
    camera.inputs.clear();

    return { camera, cameraTarget };
}
