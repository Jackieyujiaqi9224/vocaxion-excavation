import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";

export function createNavigationArrow(scene, player) {
    const root = new TransformNode("hazardNavigationArrow", scene);
    const targetMarker = new TransformNode("hazardTargetMarker", scene);
    const material = new PBRMaterial("navigationArrowMaterial", scene);
    material.albedoColor.set(1, 0.68, 0.05);
    material.emissiveColor.set(0.35, 0.18, 0.01);
    material.metallic = 0.05;
    material.roughness = 0.85;
    material.backFaceCulling = false;

    const createTriangle = (name, positions, thicknessAxis, thickness) => {
        const mesh = new Mesh(name, scene);
        const data = new VertexData();
        const halfThickness = thickness / 2;
        data.positions = [-1, 1].flatMap((side) =>
            positions.map((value, index) =>
                value + side * halfThickness * thicknessAxis[index % 3]
            )
        );
        data.indices = [
            0, 1, 2, 3, 5, 4,
            0, 3, 4, 0, 4, 1,
            1, 4, 5, 1, 5, 2,
            2, 5, 3, 2, 3, 0,
        ];
        data.normals = [];
        VertexData.ComputeNormals(data.positions, data.indices, data.normals);
        data.applyToMesh(mesh);
        mesh.convertToFlatShadedMesh();
        mesh.material = material;
        return mesh;
    };

    const shaft = CreateBox(
        "navigationArrowShaft",
        { width: 0.28, height: 0.18, depth: 1.15 },
        scene
    );
    shaft.position.z = 0.05;
    shaft.material = material;
    shaft.parent = root;

    const head = createTriangle(
        "navigationArrowHead",
        [-0.36, 0, -0.4, 0.36, 0, -0.4, 0, 0, 0.4],
        [0, 1, 0],
        0.18
    );
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

    const markerHead = createTriangle(
        "hazardTargetMarkerHead",
        [-0.45, 0.4, 0, 0.45, 0.4, 0, 0, -0.4, 0],
        [0, 0, 1],
        0.3
    );
    // Keep the flat downward tip facing the camera as the player moves.
    markerHead.billboardMode = Mesh.BILLBOARDMODE_Y;
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
