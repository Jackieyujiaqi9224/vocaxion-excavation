import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector.js";

const EXCAVATOR = "COL_SM_Veh_Excavator";
const BUCKET = "COL_SM_Veh_Excavator_01_Bucket_02.001";
const TOOL = "Tool ";

const dialog = (title, description, actionLabel) => Object.freeze({
    elementId: "hazardDialog",
    closeButtonId: "closeHazardDialog",
    titleId: "hazardTitle",
    descriptionId: "hazardDescription",
    actionButtonId: "moveHazard",
    title,
    description,
    actionLabel,
});

export function createPostDeepeningHazardDefinitions(scene, trench) {
    const excavator = scene.getMeshByName(EXCAVATOR);
    const bucket = scene.getMeshByName(BUCKET);
    if (!excavator || !bucket || !scene.getMeshByName(TOOL)) {
        throw new Error("Scenario 1 is missing its tool or excavator hazard meshes");
    }
    excavator.computeWorldMatrix(true);
    bucket.computeWorldMatrix(true);
    const bucketCenter = bucket.getBoundingInfo().boundingBox.centerWorld;
    // Keep the tracks at their authored ground elevation and translate the
    // complete hierarchy until the raised bucket is over the active trench.
    const worldOffset = new Vector3(
        trench.center.x - bucketCenter.x,
        0,
        trench.center.z - bucketCenter.z
    );
    const parentInverse = excavator.parent
        ? excavator.parent.computeWorldMatrix(true).clone().invert()
        : Matrix.Identity();
    const offset = Vector3.TransformNormal(worldOffset, parentInverse);

    return Object.freeze([
        Object.freeze({
            id: "looseTool",
            meshNames: Object.freeze([TOOL]),
            highlightColor: Object.freeze([1, 0.55, 0.05]),
            cursorClass: "hazard-hover",
            initialMeshStates: Object.freeze([
                Object.freeze({ meshName: TOOL, enabled: false, isPickable: false }),
            ]),
            activationMeshStates: Object.freeze([
                Object.freeze({ meshName: TOOL, enabled: true, visibility: 1, isPickable: true }),
            ]),
            resolution: Object.freeze({
                selectedMeshState: Object.freeze({
                    enabled: false, visibility: 0, isPickable: false, checkCollisions: false,
                }),
            }),
            dialog: dialog(
                "Tool left in the work area",
                "This loose tool creates a tripping hazard. Put it away to clear the walking and working area.",
                "Put the tool away"
            ),
        }),
        Object.freeze({
            id: "overheadExcavator",
            meshNames: Object.freeze([EXCAVATOR]),
            includeDescendants: true,
            highlightColor: Object.freeze([1, 0.55, 0.05]),
            cursorClass: "hazard-hover",
            activationMeshStates: Object.freeze([
                Object.freeze({ meshName: EXCAVATOR, positionOffset: Object.freeze(offset.asArray()) }),
            ]),
            resolution: Object.freeze({
                selectedMeshState: Object.freeze({
                    positionOffset: Object.freeze(offset.negate().asArray()),
                }),
            }),
            dialog: dialog(
                "Excavator bucket over the trench",
                "The raised excavator bucket creates an overhead struck-by hazard. Keep workers clear and move the excavator and bucket away from the trench before entry.",
                "Move excavator away"
            ),
        }),
    ]);
}
