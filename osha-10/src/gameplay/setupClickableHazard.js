import {
    Color3,
    HighlightLayer,
    PointerEventTypes,
} from "@babylonjs/core";
import { playCorrectAnswerSound } from "../audio/gameFeedbackSounds.js";

function getRequiredElement(id, hazardId) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Hazard ${hazardId} is missing interface element #${id}`);
    }
    return element;
}

function getRequiredMesh(scene, name) {
    const mesh = scene.getMeshByName(name);
    if (!mesh) throw new Error(`Excavation scene is missing ${name}`);
    return mesh;
}

function applyMeshState(mesh, state) {
    if (state.positionOffset) {
        mesh.position.addInPlaceFromFloats(...state.positionOffset);
    }
    if (state.enabled !== undefined) mesh.setEnabled(state.enabled);
    if (state.visibility !== undefined) mesh.visibility = state.visibility;
    if (state.isPickable !== undefined) mesh.isPickable = state.isPickable;
    if (state.checkCollisions !== undefined) {
        mesh.checkCollisions = state.checkCollisions;
    }
    mesh.computeWorldMatrix(true);
}

export function setupClickableHazard({
    scene,
    canvas,
    definition,
    isUnavailable,
}) {
    const hazardMeshes = definition.meshNames.map((name) => {
        const mesh = getRequiredMesh(scene, name);
        mesh.isPickable = true;
        return mesh;
    });
    const configuredMeshes = new Map();
    const meshStateDefinitions = [
        ...(definition.initialMeshStates ?? []),
        ...(definition.activationMeshStates ?? []),
        ...(definition.resolution?.meshStates ?? []),
    ];
    meshStateDefinitions.forEach(({ meshName }) => {
        if (!configuredMeshes.has(meshName)) {
            configuredMeshes.set(meshName, getRequiredMesh(scene, meshName));
        }
    });
    definition.initialMeshStates?.forEach((state) => {
        applyMeshState(configuredMeshes.get(state.meshName), state);
    });

    const dialogDefinition = definition.dialog;
    const dialog = getRequiredElement(
        dialogDefinition.elementId,
        definition.id
    );
    const closeButton = getRequiredElement(
        dialogDefinition.closeButtonId,
        definition.id
    );
    const title = getRequiredElement(dialogDefinition.titleId, definition.id);
    const description = getRequiredElement(
        dialogDefinition.descriptionId,
        definition.id
    );
    const actionButton = getRequiredElement(
        dialogDefinition.actionButtonId,
        definition.id
    );

    title.textContent = dialogDefinition.title;
    description.textContent = dialogDefinition.description;
    actionButton.textContent = dialogDefinition.actionLabel;

    const highlightLayer = new HighlightLayer(
        `${definition.id}Highlight`,
        scene
    );
    highlightLayer.innerGlow = false;
    const highlightColor = new Color3(...definition.highlightColor);

    let hoveredMesh = null;
    let selectedMesh = null;
    let isActive = false;
    let completionNotified = false;
    const resolvedMeshes = new Set();
    const identifiedMeshes = new Set();
    const completionListeners = new Set();

    hazardMeshes.forEach((mesh) => {
        mesh.isPickable = false;
    });

    const canInteract = (mesh) =>
        isActive &&
        Boolean(mesh) &&
        !resolvedMeshes.has(mesh) &&
        !dialog.open &&
        !isUnavailable();

    const clearHighlight = () => {
        if (!hoveredMesh) return;
        highlightLayer.removeMesh(hoveredMesh);
        hoveredMesh = null;
        canvas.classList.remove(definition.cursorClass);
    };

    const setHighlightedMesh = (mesh) => {
        if (mesh === hoveredMesh) return;
        clearHighlight();

        if (canInteract(mesh)) {
            hoveredMesh = mesh;
            highlightLayer.addMesh(mesh, highlightColor);
            canvas.classList.add(definition.cursorClass);
        }
    };

    const closeDialog = () => {
        if (dialog.open) dialog.close();
        selectedMesh = null;
    };

    scene.onPointerObservable.add((pointerInfo) => {
        const hazardPick = scene.pick(
            scene.pointerX,
            scene.pointerY,
            (mesh) =>
                hazardMeshes.includes(mesh) && !resolvedMeshes.has(mesh)
        );
        const hazardMesh = hazardPick?.hit ? hazardPick.pickedMesh : null;

        if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
            setHighlightedMesh(hazardMesh);
        }

        if (
            pointerInfo.type === PointerEventTypes.POINTERPICK &&
            canInteract(hazardMesh)
        ) {
            if (!identifiedMeshes.has(hazardMesh)) {
                identifiedMeshes.add(hazardMesh);
                playCorrectAnswerSound();
            }
            selectedMesh = hazardMesh;
            clearHighlight();
            dialog.showModal();
            actionButton.focus();
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        if (hoveredMesh && !canInteract(hoveredMesh)) clearHighlight();
    });

    actionButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (!selectedMesh) return;

        const resolvedMesh = selectedMesh;
        const resolution = definition.resolution;
        if (resolution?.selectedMeshState) {
            applyMeshState(resolvedMesh, resolution.selectedMeshState);
        }
        resolution?.meshStates?.forEach((state) => {
            applyMeshState(configuredMeshes.get(state.meshName), state);
        });
        resolvedMeshes.add(resolvedMesh);
        closeDialog();

        if (
            !completionNotified &&
            resolvedMeshes.size === hazardMeshes.length
        ) {
            completionNotified = true;
            completionListeners.forEach((listener) => listener());
        }
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
        activate() {
            if (resolvedMeshes.size === hazardMeshes.length) return;
            isActive = true;
            definition.activationMeshStates?.forEach((state) => {
                applyMeshState(configuredMeshes.get(state.meshName), state);
            });
            hazardMeshes.forEach((mesh) => {
                if (!resolvedMeshes.has(mesh)) mesh.isPickable = true;
            });
        },
        deactivate() {
            isActive = false;
            clearHighlight();
            hazardMeshes.forEach((mesh) => {
                mesh.isPickable = false;
            });
            closeDialog();
        },
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        isActive: () => isActive,
        isOpen: () => dialog.open,
        isComplete: () => resolvedMeshes.size === hazardMeshes.length,
        unresolvedCount: () => hazardMeshes.length - resolvedMeshes.size,
        getUnresolvedMeshes: () => isActive
            ? hazardMeshes.filter((mesh) => !resolvedMeshes.has(mesh))
            : [],
    };
}
