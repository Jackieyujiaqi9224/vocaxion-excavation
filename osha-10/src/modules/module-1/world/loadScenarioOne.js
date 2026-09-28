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
    "Large1",
    "Small1",
    "34 slope",
    "COL_Large_Base",
    "Shield A",
    "COL_Slope_Base",
    "Shield B",
    "Scaffold_Ladder",
    "Scaffold_Ladder_Slope",
    "Tool ",
    "Dressed",
]);
const SMALL_TRENCH_LENGTH = 20;
// The large trench extends to approximately world X=20.3. Place the
// movable cone row beyond that end, preserving its authored height and span.
const LARGE_TRENCH_CONE_WORLD_X = 22;
const smallTrenchNodeNames = Object.freeze({
    base: "COL_Small_Base",
    depthTop: "y1_01",
    measurementCross: "yx cross_01",
    widthLeft: "x1_01",
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
    const largeBase = scene.getMeshByName("COL_Large_Base");
    const slopeBase = scene.getMeshByName("COL_Slope_Base");
    const movableCone = scene.getMeshByName("COL_SM_Prop_Cone_Movable");
    const depthTop = scene.getTransformNodeByName(
        smallTrenchNodeNames.depthTop
    );
    const measurementCross = scene.getTransformNodeByName(
        smallTrenchNodeNames.measurementCross
    );
    const widthLeft = scene.getTransformNodeByName(
        smallTrenchNodeNames.widthLeft
    );
    if (!smallBase || !largeBase || !depthTop || !measurementCross || !widthLeft) {
        throw new Error("Scenario 1 is missing the small trench setup nodes");
    }
    if (!movableCone) {
        throw new Error("Scenario 1 is missing COL_SM_Prop_Cone_Movable");
    }
    largeBase.checkCollisions = false;
    if (!slopeBase) {
        throw new Error("Scenario 1 is missing COL_Slope_Base");
    }
    slopeBase.checkCollisions = false;

    const slopeTrench = () => {
        largeBase.setEnabled(false);
        largeBase.visibility = 0;
        largeBase.isPickable = false;
        largeBase.checkCollisions = false;
        slopeBase.setEnabled(true);
        slopeBase.visibility = 1;
        slopeBase.isPickable = true;
        slopeBase.checkCollisions = true;
        slopeBase.computeWorldMatrix(true);
    };

    const deepenTrench = () => {
        smallBase.setEnabled(false);
        smallBase.visibility = 0;
        smallBase.isPickable = false;
        smallBase.checkCollisions = false;
        largeBase.setEnabled(true);
        largeBase.visibility = 1;
        largeBase.isPickable = true;
        largeBase.checkCollisions = true;
        largeBase.computeWorldMatrix(true);
        movableCone.computeWorldMatrix(true);
        const conePosition = movableCone.getAbsolutePosition().clone();
        conePosition.x = LARGE_TRENCH_CONE_WORLD_X;
        movableCone.setAbsolutePosition(conePosition);
        movableCone.computeWorldMatrix(true);
    };
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
        deepenTrench,
        slopeTrench,
    });
}
