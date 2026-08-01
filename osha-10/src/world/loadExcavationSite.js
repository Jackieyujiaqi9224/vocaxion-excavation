import "@babylonjs/loaders/glTF";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";

const excavationSceneUrl = new URL("../../models/ExcavationScene.glb", import.meta.url).href;
const TRENCH_COLLIDER_NAME = "COL_Trench_Barrier_WORKSITE";
const TRENCH_WORKSITE_NAME = "Excavation_Trench";
export const BIG_SHIELD_NAME = "Big_Shield";
export const BIG_SHIELD_POSITION_1_NAME = "Big_Shield_Pos_01";
export const BIG_SHIELD_POSITION_2_NAME = "Big_Shield_Pos_02";
export const BIG_SHIELD_POSITION_3_NAME = "Big_Shield_Pos_03";
export const SMALL_SHIELD_NAME = "Small_Shield";

const SHIELD_NAMES = [
    BIG_SHIELD_NAME,
    BIG_SHIELD_POSITION_1_NAME,
    BIG_SHIELD_POSITION_2_NAME,
    BIG_SHIELD_POSITION_3_NAME,
    SMALL_SHIELD_NAME,
];

function setShieldEnabled(shield, enabled) {
    shield.setEnabled(enabled);
    shield.getChildMeshes(false).forEach((mesh) => {
        mesh.visibility = enabled ? 1 : 0;
        mesh.isPickable = enabled;
        mesh.checkCollisions = enabled;
    });
}

export async function loadExcavationSite(scene) {
    const result = await ImportMeshAsync(excavationSceneUrl, scene);

    result.meshes.forEach((mesh) => {
        if (mesh.getTotalVertices() > 0) mesh.checkCollisions = true;
    });

    const shieldTemplates = new Map();
    SHIELD_NAMES.forEach((name) => {
        const shield = scene.getTransformNodeByName(name);
        if (!shield) {
            throw new Error(`Excavation scene is missing shield ${name}`);
        }

        setShieldEnabled(shield, false);
        shieldTemplates.set(name, shield);
    });

    const bigShieldSnapYPositions = Object.freeze(Object.fromEntries([
        BIG_SHIELD_POSITION_1_NAME,
        BIG_SHIELD_POSITION_2_NAME,
        BIG_SHIELD_POSITION_3_NAME,
    ].map((name) => {
        const template = shieldTemplates.get(name);
        const bounds = template.getHierarchyBoundingVectors(true);
        const centerY = bounds.min.y + (bounds.max.y - bounds.min.y) * 0.5;
        return [name, centerY];
    })));

    const shieldPrefabs = {
        bigShieldSnapYPositions,
        instantiate(name, instanceName = `${name}_Instance`) {
            const template = shieldTemplates.get(name);
            if (!template) throw new Error(`Unknown shield prefab ${name}`);

            const instance = template.clone(
                instanceName,
                template.parent,
                false
            );
            setShieldEnabled(instance, true);
            return instance;
        },
    };

    const oldTrenchCollider = scene.getMeshByName(TRENCH_COLLIDER_NAME);
    if (!oldTrenchCollider) {
        throw new Error(`Excavation scene is missing ${TRENCH_COLLIDER_NAME}`);
    }

    const trenchNode = scene.getTransformNodeByName(TRENCH_WORKSITE_NAME);
    if (!trenchNode) {
        throw new Error(`Excavation scene is missing ${TRENCH_WORKSITE_NAME}`);
    }

    // Trench_WorkSite is the authored hierarchy for the actual excavation.
    // Remove the old placeholder barrier and derive gameplay bounds from its children.
    oldTrenchCollider.dispose();
    const trenchMeshes = trenchNode.getChildMeshes(false);
    const bounds = trenchNode.getHierarchyBoundingVectors(true);
    const size = bounds.max.subtract(bounds.min);
    const center = bounds.min.add(size.scale(0.5));

    return {
        node: trenchNode,
        meshes: trenchMeshes,
        center,
        minimum: bounds.min,
        maximum: bounds.max,
        width: size.x,
        depth: size.z,
        shieldPrefabs,
    };
}
