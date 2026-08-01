import {
    Color3,
    HighlightLayer,
    PointerEventTypes,
} from "@babylonjs/core";
import { playCorrectAnswerSound } from "../audio/gameFeedbackSounds.js";

const CORRECT_CONE_NAME = "COL_Correct_Cone_FIXHAZARD";
const INCORRECT_CONE_NAME = "COL_Incorrect_Cone_FIXHAZARD";
const HIGHLIGHT_COLOR = new Color3(1, 0.55, 0.05);

export function setupConeHazard({ scene, canvas, isUnavailable }) {
    const correctCone = scene.getMeshByName(CORRECT_CONE_NAME);
    const incorrectCone = scene.getMeshByName(INCORRECT_CONE_NAME);

    if (!correctCone) {
        throw new Error(`Excavation scene is missing ${CORRECT_CONE_NAME}`);
    }
    if (!incorrectCone) {
        throw new Error(`Excavation scene is missing ${INCORRECT_CONE_NAME}`);
    }

    const dialog = document.getElementById("coneHazardDialog");
    const fixButton = document.getElementById("fixConeHazard");
    const closeButton = document.getElementById("closeConeHazardDialog");
    const highlightLayer = new HighlightLayer("coneHazardHighlight", scene);
    highlightLayer.innerGlow = false;

    let isHovered = false;
    let isResolved = false;
    let isIdentified = false;

    // Only the fallen cone exists in the scene until the hazard is resolved.
    correctCone.setEnabled(false);
    correctCone.visibility = 0;
    correctCone.isPickable = false;
    correctCone.checkCollisions = false;
    incorrectCone.setEnabled(true);
    incorrectCone.visibility = 1;
    incorrectCone.isPickable = true;

    const canInteract = () =>
        !isResolved && !isUnavailable() && !dialog.open;

    const clearHighlight = () => {
        if (!isHovered) return;
        highlightLayer.removeMesh(incorrectCone);
        canvas.classList.remove("cone-hazard-hover");
        isHovered = false;
    };

    const setHighlighted = (highlighted) => {
        if (!highlighted || !canInteract()) {
            clearHighlight();
            return;
        }
        if (isHovered) return;

        highlightLayer.addMesh(incorrectCone, HIGHLIGHT_COLOR);
        canvas.classList.add("cone-hazard-hover");
        isHovered = true;
    };

    const pickFallenCone = () => scene.pick(
        scene.pointerX,
        scene.pointerY,
        (mesh) => mesh === incorrectCone
    );

    const closeDialog = () => {
        if (dialog.open) dialog.close();
    };

    scene.onPointerObservable.add((pointerInfo) => {
        const conePick = pickFallenCone();
        const pickedCone = conePick?.hit && conePick.pickedMesh === incorrectCone;

        if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
            setHighlighted(pickedCone);
        }

        if (
            pointerInfo.type === PointerEventTypes.POINTERPICK &&
            pickedCone &&
            canInteract()
        ) {
            if (!isIdentified) {
                isIdentified = true;
                playCorrectAnswerSound();
            }
            clearHighlight();
            dialog.showModal();
            fixButton.focus();
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        if (isHovered && !canInteract()) clearHighlight();
    });

    fixButton.addEventListener("click", () => {
        isResolved = true;
        clearHighlight();

        incorrectCone.isPickable = false;
        incorrectCone.checkCollisions = false;
        incorrectCone.setEnabled(false);

        correctCone.setEnabled(true);
        correctCone.visibility = 1;
        correctCone.isPickable = false;
        correctCone.checkCollisions = true;
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
        isResolved: () => isResolved,
        getUnresolvedMeshes: () => isResolved ? [] : [incorrectCone],
    };
}
