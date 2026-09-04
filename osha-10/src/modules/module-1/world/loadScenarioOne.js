import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import "../../../shared/assets/registerGltfLoader.js";

const scenarioUrl = `${import.meta.env.BASE_URL}models/Scenario1.glb`;
const COLLIDER_PREFIX = "COL_";
const invisibleColliderPrefixes = Object.freeze([
    "COL_Trench_Barrier",
    "COL_Siteborder",
    "COL_Slope_Base",
    "COL_Large_Base",
]);
const initiallyHiddenNodeNames = Object.freeze([
    "Shield A",
    "Shield B",
    "Scaffold_Ladder",
    "Tool ",
    "Dressed",
]);
const SMALL_TRENCH_LENGTH = 20;
const smallTrenchNodeNames = Object.freeze({
    base: "COL_Small_Base",
    depthTop: "y1_01.001",
    measurementCross: "yx cross_01.001",
    widthLeft: "x1_01.001",
});

const isInvisibleCollider = (name) =>
    invisibleColliderPrefixes.some((prefix) => name.startsWith(prefix));

export async function loadScenarioOne(scene) {
    const result = await ImportMeshAsync(scenarioUrl, scene);

    result.meshes.forEach((mesh) => {
        if (mesh.getTotalVertices() === 0) return;

        mesh.checkCollisions = mesh.name.startsWith(COLLIDER_PREFIX);
        if (isInvisibleCollider(mesh.name)) {
            mesh.visibility = 0;
            mesh.isPickable = false;
        }
    });

    const initiallyHiddenNodes = new Map();
    initiallyHiddenNodeNames.forEach((name) => {
        const node = scene.getNodeByName(name);
        if (!node) {
            throw new Error(`Scenario 1 is missing initially hidden node ${name}`);
        }
        node.setEnabled(false);
        initiallyHiddenNodes.set(name, node);
    });

    const smallBase = scene.getMeshByName(smallTrenchNodeNames.base);
    const depthTop = scene.getTransformNodeByName(
        smallTrenchNodeNames.depthTop
    );
    const measurementCross = scene.getTransformNodeByName(
        smallTrenchNodeNames.measurementCross
    );
    const widthLeft = scene.getTransformNodeByName(
        smallTrenchNodeNames.widthLeft
    );
    if (!smallBase || !depthTop || !measurementCross || !widthLeft) {
        throw new Error("Scenario 1 is missing the small trench setup nodes");
    }
    [depthTop, measurementCross, widthLeft].forEach((node) =>
        node.computeWorldMatrix(true)
    );
    const crossPosition = measurementCross.getAbsolutePosition();
    const topPosition = depthTop.getAbsolutePosition();
    const widthPosition = widthLeft.getAbsolutePosition();
    const centerX = -13;
    const minimum = new Vector3(
        centerX - SMALL_TRENCH_LENGTH / 2,
        Math.min(crossPosition.y, topPosition.y),
        Math.min(crossPosition.z, widthPosition.z)
    );
    const maximum = new Vector3(
        centerX + SMALL_TRENCH_LENGTH / 2,
        Math.max(crossPosition.y, topPosition.y),
        Math.max(crossPosition.z, widthPosition.z)
    );
    const trench = Object.freeze({
        node: smallBase,
        meshes: Object.freeze([smallBase]),
        center: minimum.add(maximum).scale(0.5),
        minimum,
        maximum,
        width: maximum.x - minimum.x,
        depth: maximum.z - minimum.z,
    });

    return Object.freeze({
        meshes: result.meshes,
        transformNodes: result.transformNodes,
        animationGroups: result.animationGroups,
        initiallyHiddenNodes,
        trench,
    });
}
