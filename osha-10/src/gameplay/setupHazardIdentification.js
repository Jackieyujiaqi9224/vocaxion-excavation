import {
    Color3,
    HighlightLayer,
    PointerEventTypes,
} from "@babylonjs/core";
import { playCorrectAnswerSound } from "../audio/gameFeedbackSounds.js";

const HAZARD_MESH_NAMES = [
    "COL_Hazard_Pile_2_DELETEHAZARD",
    "COL_Hazard_Pile_DELETEHAZARD",
];
const HAZARD_MOVE_DISTANCE_X = 10;
const HIGHLIGHT_COLOR = new Color3(1, 0.55, 0.05);

function moveHazard(mesh) {
    mesh.position.x += HAZARD_MOVE_DISTANCE_X;
    mesh.computeWorldMatrix(true);
}

export function setupHazardIdentification({
    scene,
    canvas,
    isUnavailable,
}) {
    const dialog = document.getElementById("hazardDialog");
    const moveButton = document.getElementById("moveHazard");
    const closeButton = document.getElementById("closeHazardDialog");
    const hazardMeshes = HAZARD_MESH_NAMES.map((name) => {
        const mesh = scene.getMeshByName(name);
        if (!mesh) throw new Error(`Excavation scene is missing ${name}`);
        mesh.isPickable = true;
        return mesh;
    });

    const highlightLayer = new HighlightLayer("hazardHighlight", scene);
    highlightLayer.innerGlow = false;

    let hoveredMesh = null;
    let selectedMesh = null;
    const resolvedMeshes = new Set();
    const identifiedMeshes = new Set();

    const canHover = (mesh) =>
        !isUnavailable() &&
        !dialog.open &&
        !resolvedMeshes.has(mesh);

    const clearHighlight = () => {
        if (!hoveredMesh) return;
        highlightLayer.removeMesh(hoveredMesh);
        hoveredMesh = null;
        canvas.classList.remove("hazard-hover");
    };

    const setHoveredMesh = (mesh) => {
        if (mesh === hoveredMesh) return;
        clearHighlight();

        if (mesh && canHover(mesh)) {
            hoveredMesh = mesh;
            highlightLayer.addMesh(mesh, HIGHLIGHT_COLOR);
            canvas.classList.add("hazard-hover");
        }
    };

    const closeDialog = () => {
        if (dialog.open) dialog.close();
        selectedMesh = null;
    };

    scene.onPointerObservable.add((pointerInfo) => {
        // Pick only against hazards so nearby terrain or overlapping scene meshes
        // cannot intercept the hover/click intended for the pile.
        const hazardPick = scene.pick(
            scene.pointerX,
            scene.pointerY,
            (mesh) => hazardMeshes.includes(mesh)
        );
        const hazardMesh = hazardPick?.hit ? hazardPick.pickedMesh : null;

        if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
            setHoveredMesh(hazardMesh);
        }

        if (
            pointerInfo.type === PointerEventTypes.POINTERPICK &&
            hazardMesh &&
            canHover(hazardMesh)
        ) {
            if (!identifiedMeshes.has(hazardMesh)) {
                identifiedMeshes.add(hazardMesh);
                playCorrectAnswerSound();
            }
            selectedMesh = hazardMesh;
            clearHighlight();
            dialog.showModal();
            moveButton.focus();
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        if (hoveredMesh && !canHover(hoveredMesh)) clearHighlight();
    });

    moveButton.addEventListener("click", () => {
        if (!selectedMesh) return;

        moveHazard(selectedMesh);
        resolvedMeshes.add(selectedMesh);
        closeDialog();
    });
    closeButton.addEventListener("click", closeDialog);
    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog();
    });
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog();
    });

    return {
        isOpen: () => dialog.open,
        unresolvedCount: () => hazardMeshes.length - resolvedMeshes.size,
        getUnresolvedMeshes: () =>
            hazardMeshes.filter((mesh) => !resolvedMeshes.has(mesh)),
    };
}
