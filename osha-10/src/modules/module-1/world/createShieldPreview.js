import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

export const SHIELD_SNAP_NODE_NAMES = Object.freeze([
    "Shield_A_Pos_01", "Shield_A_Pos_02", "Shield_A_Pos_03", "Shield_A_Pos_04",
]);

export function createShieldPreview(scene, {
    correctSnapNodeName = "Shield_A_Pos_01",
} = {}) {
    const small = scene.getMeshByName("Shield A");
    const large = scene.getMeshByName("Shield B");
    if (!small || !large) throw new Error("Scenario 1 needs Shield A and Shield B");

    const snapPoints = SHIELD_SNAP_NODE_NAMES.map((name) => {
        const node = scene.getNodeByName(name);
        if (!node) throw new Error(`Scenario 1 is missing shield snapping point ${name}`);
        node.computeWorldMatrix(true);
        const position = node.getAbsolutePosition().clone();
        node.setEnabled(false);
        return { name, position };
    });
    if (!SHIELD_SNAP_NODE_NAMES.includes(correctSnapNodeName)) {
        throw new Error(`Unknown correct shield snapping point ${correctSnapNodeName}`);
    }
    const minimumY = Math.min(...snapPoints.map(point => point.position.y));
    const maximumY = Math.max(...snapPoints.map(point => point.position.y));
    small.computeWorldMatrix(true);
    const smallBounds = small.getHierarchyBoundingVectors(true);
    const referenceOffset = snapPoints[0].position.y - small.getAbsolutePosition().y;
    const referenceTop = smallBounds.max.y + referenceOffset;
    const referenceBottom = smallBounds.min.y + referenceOffset;
    let activeSize = null;
    const states = new Map([["small", small], ["large", large]].map(([size, mesh]) => {
        mesh.computeWorldMatrix(true);
        const target = mesh.getAbsolutePosition().clone();
        const state = { mesh, target, snapName: null };
        const drag = new PointerDragBehavior({ dragAxis: Vector3.Up() });
        drag.useObjectOrientationForDragging = false;
        drag.moveAttached = false;
        drag.onDragStartObservable.add(() => {
            if (drag.enabled) state.snapName = null;
        });
        drag.onDragObservable.add(({ delta }) => {
            if (!drag.enabled) return;
            const y = Math.max(minimumY, Math.min(Math.max(maximumY, target.y),
                mesh.getAbsolutePosition().y + delta.y));
            mesh.setAbsolutePosition(new Vector3(target.x, y, target.z));
            mesh.computeWorldMatrix(true);
        });
        drag.onDragEndObservable.add(() => {
            if (!drag.enabled) return;
            const y = mesh.getAbsolutePosition().y;
            const nearest = snapPoints.reduce((best, point) =>
                Math.abs(point.position.y - y) < Math.abs(best.position.y - y) ? point : best
            );
            mesh.setAbsolutePosition(nearest.position);
            mesh.computeWorldMatrix(true);
            state.snapName = nearest.name;
        });
        mesh.addBehavior(drag);
        state.drag = drag;
        return [size, state];
    }));

    const reset = (state) => {
        state.snapName = null;
        state.mesh.setAbsolutePosition(state.target);
        state.mesh.computeWorldMatrix(true);
    };
    states.forEach(reset);

    const show = (size) => {
        if (size && size !== activeSize) reset(states.get(size));
        activeSize = size;
        small.setEnabled(size === "small");
        large.setEnabled(size === "large");
        states.forEach((state, key) => {
            state.drag.enabled = false;
            state.mesh.isPickable = key === size;
        });
    };
    show(null);
    return {
        getMeasurements(feetPerWorldUnit) {
            if (!activeSize || !states.get(activeSize).drag.enabled) return null;
            const mesh = states.get(activeSize).mesh;
            mesh.computeWorldMatrix(true);
            const bounds = mesh.getHierarchyBoundingVectors(true);
            return {
                bounds,
                topFeet: 2 + (bounds.max.y - referenceTop) * feetPerWorldUnit,
                bottomFeet: (bounds.min.y - referenceBottom) * feetPerWorldUnit,
            };
        },
        selectProtection(protectionId) {
            show(protectionId === "shielding" ? "small" : null);
        },
        selectSize(protectionId, configurationId) {
            if (protectionId !== "shielding") return;
            if (configurationId === "shield-small") show("small");
            if (configurationId === "shield-large") show("large");
        },
        startPlacement(configurationId) {
            if (configurationId !== "shield-small" || activeSize !== "small") return;
            states.get("small").drag.enabled = true;
        },
        validatePlacement(protectionId, configurationId) {
            if (protectionId !== "shielding") return null;
            const size = configurationId === "shield-large" ? "large" : "small";
            if (size !== "small" || activeSize !== size || !states.get(size).snapName) {
                return "Drag the small shield to a snapping position before submitting.";
            }
            return states.get(size).snapName === correctSnapNodeName
                ? null
                : "This shield position is not correct. Move the shield to another snapping position and try again.";
        },
        finishPlacement() {
            states.forEach((state) => { state.drag.enabled = false; });
        },
    };
}
