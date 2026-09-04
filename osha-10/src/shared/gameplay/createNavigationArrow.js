import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";

export function createNavigationArrow(scene, player) {
    const root = new TransformNode("hazardNavigationArrow", scene);
    const targetMarker = new TransformNode("hazardTargetMarker", scene);
    const material = new PBRMaterial("navigationArrowMaterial", scene);
    material.albedoColor.set(1, 0.68, 0.05);
    material.emissiveColor.set(0.35, 0.18, 0.01);
    material.metallic = 0.05;
    material.roughness = 0.85;

    const shaft = CreateBox(
        "navigationArrowShaft",
        { width: 0.28, height: 0.18, depth: 1.15 },
        scene
    );
    shaft.position.z = 0.05;
    shaft.material = material;
    shaft.parent = root;

    const head = CreateCylinder(
        "navigationArrowHead",
        { diameterTop: 0, diameterBottom: 0.72, height: 0.8, tessellation: 32 },
        scene
    );
    head.rotation.x = Math.PI / 2;
    head.position.z = 0.95;
    head.material = material;
    head.parent = root;

    const markerShaft = CreateBox(
        "hazardTargetMarkerShaft",
        { width: 0.3, height: 1.1, depth: 0.3 },
        scene
    );
    markerShaft.position.y = 0.85;
    markerShaft.material = material;
    markerShaft.parent = targetMarker;

    // A cylinder points along Y. With a zero bottom diameter, its tip points down.
    const markerHead = CreateCylinder(
        "hazardTargetMarkerHead",
        { diameterTop: 0.9, diameterBottom: 0, height: 0.8, tessellation: 32 },
        scene
    );
    markerHead.material = material;
    markerHead.parent = targetMarker;

    let targetMesh = null;

    const update = () => {
        if (!targetMesh) return;

        targetMesh.computeWorldMatrix(true);
        const bounds = targetMesh.getBoundingInfo();
        const target = bounds.boundingSphere.centerWorld;
        root.position.copyFrom(player.position);
        root.position.y += 2.5 + Math.sin(performance.now() * 0.004) * 0.12;
        root.rotation.y = Math.atan2(
            target.x - player.position.x,
            target.z - player.position.z
        );

        targetMarker.position.set(
            target.x,
            bounds.boundingBox.maximumWorld.y +
                2.2 +
                Math.sin(performance.now() * 0.005) * 0.18,
            target.z
        );
    };

    root.setEnabled(false);
    targetMarker.setEnabled(false);

    return {
        root,
        update,
        setEnabled: (enabled) => {
            root.setEnabled(enabled);
            targetMarker.setEnabled(enabled);
        },
        setTarget: (mesh) => {
            targetMesh = mesh;
        },
    };
}
