import { Matrix, Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector.js";

export function syncCameraToMarker(camera, marker, {
    cameraForwardAxis = [0, 0, 1],
    cameraUpAxis = [0, 1, 0],
} = {}) {
    marker.computeWorldMatrix(true);
    camera.position.copyFrom(marker.getAbsolutePosition());
    // Transform the full basis so parent transforms and glTF's reflected
    // handedness-conversion root are preserved.
    const forward = marker.getDirection(Vector3.FromArray(cameraForwardAxis)).normalize();
    const up = marker.getDirection(Vector3.FromArray(cameraUpAxis)).normalize();
    const target = camera.position.add(forward);
    const view = camera.getScene().useRightHandedSystem
        ? Matrix.LookAtRH(camera.position, target, up)
        : Matrix.LookAtLH(camera.position, target, up);
    // setTarget() assumes world-up, clears roll, and nudges the position for
    // some directions. Set the full orientation directly instead.
    camera.rotationQuaternion = Quaternion.FromRotationMatrix(view.invert());
    camera.updateUpVectorFromRotation = true;
    camera.getViewMatrix(true);
}
