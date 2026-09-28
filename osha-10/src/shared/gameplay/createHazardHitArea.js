import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";

export function createHazardHitArea(mesh, padding) {
    const bounds = mesh.getBoundingInfo().boundingBox;
    const size = bounds.maximum.subtract(bounds.minimum);
    const hitArea = CreateBox(`${mesh.name}-hit-area`, {
        width: size.x + padding * 2,
        height: size.y + padding * 2,
        depth: size.z + padding * 2,
    }, mesh.getScene());
    hitArea.parent = mesh;
    hitArea.position.copyFrom(bounds.minimum.add(bounds.maximum).scale(0.5));
    hitArea.visibility = 0;
    hitArea.isPickable = false;
    hitArea.checkCollisions = false;
    return hitArea;
}
