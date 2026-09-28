import "@babylonjs/core/Culling/ray.js";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents.js";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer.js";
import "@babylonjs/core/Layers/effectLayerSceneComponent.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { playCorrectAnswerSound } from "../audio/gameFeedbackSounds.js";
import { createHazardIdentificationUi } from "./hazard-identification/createHazardIdentificationUi.js";
import { createHazardHitArea } from "./createHazardHitArea.js";

function getRequiredElement(id, hazardId) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Hazard ${hazardId} is missing interface element #${id}`);
    }
    return element;
}

function getRequiredMesh(scene, name) {
    const mesh = scene.getMeshByName(name);
    if (!mesh) throw new Error(`Scene is missing ${name}`);
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
    uiConfig,
    scoring,
    isUnavailable,
}) {
    createHazardIdentificationUi({ config: uiConfig, dialogDefinition: definition.dialog });
    const hazardMeshes = definition.meshNames.map((name) => {
        const mesh = getRequiredMesh(scene, name);
        mesh.isPickable = true;
        return mesh;
    });
    // Treat a multipart object as one hazard regardless of which part is hit.
    const hazardRootByMesh = new Map();
    hazardMeshes.forEach((root) => {
        const parts = definition.includeDescendants ? [root, ...root.getChildMeshes()] : [root];
        parts.forEach((mesh) => hazardRootByMesh.set(mesh, root));
    });
    const hitAreas = new Set();
    if (definition.hitAreaPadding > 0) {
        hazardMeshes.forEach((root) => {
            const hitArea = createHazardHitArea(root, definition.hitAreaPadding);
            hitAreas.add(hitArea);
            hazardRootByMesh.set(hitArea, root);
        });
    }
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

    const renderDialogContent = () => {
        title.textContent = dialogDefinition.title;
        description.textContent = dialogDefinition.description;
        actionButton.textContent = dialogDefinition.actionLabel;
    };
    renderDialogContent();

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

    hazardRootByMesh.forEach((_root, mesh) => {
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
        hazardRootByMesh.forEach((root, mesh) => {
            if (root === hoveredMesh && !hitAreas.has(mesh)) highlightLayer.removeMesh(mesh);
        });
        hoveredMesh = null;
        canvas.classList.remove(definition.cursorClass);
    };

    const setHighlightedMesh = (mesh) => {
        if (mesh === hoveredMesh) return;
        clearHighlight();

        if (canInteract(mesh)) {
            hoveredMesh = mesh;
            hazardRootByMesh.forEach((root, part) => {
                if (root === mesh && !hitAreas.has(part)) highlightLayer.addMesh(part, highlightColor);
            });
            canvas.classList.add(definition.cursorClass);
        }
    };

    const closeDialog = () => {
        if (dialog.open) dialog.close();
        selectedMesh = null;
    };

    scene.onPointerObservable.add((pointerInfo) => {
        if (
            pointerInfo.type !== PointerEventTypes.POINTERMOVE &&
            pointerInfo.type !== PointerEventTypes.POINTERPICK
        ) {
            return;
        }
        if (!isActive || dialog.open || isUnavailable()) {
            if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                clearHighlight();
            }
            return;
        }

        const hazardPick = scene.pick(
            scene.pointerX,
            scene.pointerY,
            (mesh) =>
                hazardRootByMesh.has(mesh) && !resolvedMeshes.has(hazardRootByMesh.get(mesh))
        );
        const hazardMesh = hazardPick?.hit ? hazardRootByMesh.get(hazardPick.pickedMesh) : null;

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
                scoring.recordCorrect({
                    mechanic: "hazard-identification",
                    itemId: definition.id,
                });
            }
            selectedMesh = hazardMesh;
            clearHighlight();
            renderDialogContent();
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
        hazardRootByMesh.forEach((root, mesh) => {
            if (root === resolvedMesh) mesh.isPickable = false;
        });
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
            if (isActive || resolvedMeshes.size === hazardMeshes.length) return;
            isActive = true;
            definition.activationMeshStates?.forEach((state) => {
                applyMeshState(configuredMeshes.get(state.meshName), state);
            });
            hazardRootByMesh.forEach((root, mesh) => {
                if (!resolvedMeshes.has(root)) mesh.isPickable = true;
            });
        },
        deactivate() {
            isActive = false;
            clearHighlight();
            hazardRootByMesh.forEach((_root, mesh) => {
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
