import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera.js";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer.js";
import "@babylonjs/core/Layers/effectLayerSceneComponent.js";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder.js";
import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";
import "../assets/registerGltfLoader.js";
import { createTrenchSetupUi } from "./trench-setup/createTrenchSetupUi.js";

function validateConfig(config) {
    if (!config?.id) throw new Error("Trench config needs an id");
    if (!config.protectionSystems?.length) {
        throw new Error(`Trench config ${config.id} needs protection systems`);
    }
    if (!Array.isArray(config.devices)) {
        throw new Error(`Trench config ${config.id} needs a devices array`);
    }
    const protectionIds = new Set();
    const configurationIds = new Set();
    const deviceIds = new Set(config.devices.map((device) => device.id));
    if (deviceIds.size !== config.devices.length) {
        throw new Error(`Trench config ${config.id} repeats a device ID`);
    }
    config.protectionSystems.forEach((protection) => {
        if (!protection.id || !Array.isArray(protection.configurations)) {
            throw new Error(
                `Trench config ${config.id} has an invalid protection system`
            );
        }
        if (protectionIds.has(protection.id)) {
            throw new Error(
                `Trench config ${config.id} repeats protection ${protection.id}`
            );
        }
        protectionIds.add(protection.id);
        if (
            protection.accepted &&
            !protection.completeOnSelection &&
            !protection.configurations.length
        ) {
            throw new Error(
                `Accepted protection ${protection.id} needs configurations`
            );
        }
        if (
            protection.accepted &&
            !protection.completeOnSelection &&
            !protection.placement
        ) {
            throw new Error(
                `Accepted protection ${protection.id} needs placement data`
            );
        }
        if (
            protection.assessment &&
            protection.assessment !== "preferred" &&
            protection.assessment !== "acceptable"
        ) {
            throw new Error(
                `Protection ${protection.id} has invalid assessment ${protection.assessment}`
            );
        }
        if (protection.assessment && !protection.accepted) {
            throw new Error(
                `Assessed protection ${protection.id} must be accepted`
            );
        }
        protection.configurations.forEach((configuration) => {
            if (configurationIds.has(configuration.id)) {
                throw new Error(
                    `Trench config ${config.id} repeats configuration ${configuration.id}`
                );
            }
            configurationIds.add(configuration.id);
        });
        protection.placement?.availableDeviceIds?.forEach((deviceId) => {
            if (!deviceIds.has(deviceId)) {
                throw new Error(
                    `Protection ${protection.id} uses unknown device ${deviceId}`
                );
            }
        });
        protection.placement?.requiredDeviceIds?.forEach((deviceId) => {
            if (!deviceIds.has(deviceId)) {
                throw new Error(
                    `Protection ${protection.id} requires unknown device ${deviceId}`
                );
            }
        });
    });

    if (!config.protectionSystems.some(
        (protection) => protection.available !== false
    )) {
        throw new Error(`Trench config ${config.id} has no available protection`);
    }
}

function createDeviceMesh(scene, device) {
    const meshName = `placed-${device.id}`;
    if (device.geometry.type === "box") {
        return CreateBox(meshName, device.geometry, scene);
    }
    if (device.geometry.type === "cylinder") {
        return CreateCylinder(meshName, device.geometry, scene);
    }
    throw new Error(
        `Device ${device.id} has unsupported geometry ${device.geometry.type}`
    );
}

export function setupTrenchPlanner({
    scene,
    canvas,
    player,
    trench,
    config,
    scoring,
}) {
    validateConfig(config);
    createTrenchSetupUi({ config });
    const recordCorrect = (itemId) => {
        playCorrectAnswerSound();
        scoring.recordCorrect({
            mechanic: "trench-placement",
            scenarioId: config.id,
            itemId,
        });
    };
    const recordIncorrect = (itemId) => {
        playWrongAnswerSound();
        scoring.recordIncorrect({
            mechanic: "trench-placement",
            scenarioId: config.id,
            itemId,
        });
    };
    const planner = document.getElementById("trenchPlanner");
    const planningSidebar = document.getElementById("trenchPlanningSidebar");
    const reinspectionPanel = document.getElementById(
        "trenchReinspectionPanel"
    );
    const reinspectionInstruction = document.getElementById(
        "trenchReinspectionInstruction"
    );
    const wallsInspection = document.getElementById("trenchWallsInspection");
    const shieldInspection = document.getElementById(
        "trenchShieldInspection"
    );
    const egressInspection = document.getElementById(
        "trenchEgressInspection"
    );
    const completeReinspectionButton = document.getElementById(
        "completeTrenchReinspection"
    );
    const emptyMessage = document.getElementById("emptyTrenchMessage");
    const reportControl = document.getElementById(
        "geotechnicalReportControl"
    );
    const reportButton = document.getElementById("openGeotechnicalReport");
    const reportStatus = document.getElementById("geotechnicalReportStatus");
    const reportDialog = document.getElementById("geotechnicalReport");
    const closeReportButton = document.getElementById(
        "closeGeotechnicalReport"
    );
    const acknowledgeReportButton = document.getElementById(
        "acknowledgeGeotechnicalReport"
    );
    const measureButton = document.getElementById("measureTrench");
    const measurementSection = document.getElementById("measurementSection");
    const measurements = document.getElementById("trenchMeasurements");
    const measurementGuides = document.getElementById(
        "trenchMeasurementGuides"
    );
    const trenchStage = measurementGuides.parentElement;
    const widthGuide = measurementGuides.querySelector(
        ".measurement-guide-width"
    );
    const depthGuide = measurementGuides.querySelector(
        ".measurement-guide-depth"
    );
    const shieldPlacementGuide = document.getElementById(
        "shieldPlacementGuide"
    );
    const shieldPlacementValue = document.getElementById(
        "shieldPlacementValue"
    );
    const shieldTopPlacementGuide = document.getElementById(
        "shieldTopPlacementGuide"
    );
    const shieldTopPlacementValue = document.getElementById(
        "shieldTopPlacementValue"
    );
    const guideWidthValue = document.getElementById("guideWidthValue");
    const guideDepthValue = document.getElementById("guideDepthValue");
    const dimensionReadout = document.getElementById("dimensionReadout");
    const protectionStatus = document.getElementById("protectionStatus");
    const protectionSection = document.getElementById("protectionSection");
    const submitMeasurements = document.getElementById("submitMeasurements");
    const submitProtection = document.getElementById("submitProtection");
    const submitConfiguration = document.getElementById(
        "submitConfiguration"
    );
    const submitDevices = document.getElementById("submitDevices");
    const measurementFeedback = document.getElementById(
        "measurementFeedback"
    );
    const protectionFeedback = document.getElementById("protectionFeedback");
    const configurationFeedback = document.getElementById(
        "configurationFeedback"
    );
    const deviceFeedback = document.getElementById("deviceFeedback");
    const egressSection = document.getElementById("egressSection");
    const addEgressButton = document.getElementById("addEgress");
    const egressFeedback = document.getElementById("egressFeedback");
    const configurationSection = document.getElementById(
        "protectionConfiguration"
    );
    const configurationTitle = document.getElementById("configurationTitle");
    const protectionOptions = document.getElementById("protectionOptions");
    const configurationOptions = document.getElementById(
        "protectionConfigurationOptions"
    );
    const deviceSection = document.getElementById("deviceSection");
    const devicePalette = document.getElementById("devicePalette");
    const deviceStepTitle = document.getElementById("deviceStepTitle");
    const deviceStepHelp = document.getElementById("deviceStepHelp");
    const finalPlanReview = document.getElementById("finalPlanReview");
    const finalPlanSummary = document.getElementById("finalPlanSummary");
    const setupCompleteDialog = document.getElementById(
        "setupCompleteDialog"
    );
    const setupCompleteTitle = document.getElementById("setupCompleteTitle");
    const setupCompleteDescription = document.getElementById(
        "setupCompleteDescription"
    );
    const returnToMainScene = document.getElementById("returnToMainScene");
    const measurementInputs = [
        document.getElementById("trenchLength"),
        document.getElementById("trenchWidth"),
        document.getElementById("trenchDepth"),
    ];
    const protectionById = new Map(
        config.protectionSystems.map((protection) => [
            protection.id,
            protection,
        ])
    );
    const configurationById = new Map(
        config.protectionSystems.flatMap((protection) =>
            protection.configurations.map((configuration) => [
                configuration.id,
                configuration,
            ])
        )
    );
    const deviceById = new Map(
        config.devices.map((device) => [device.id, device])
    );

    protectionOptions.replaceChildren(
        ...config.protectionSystems
            .filter((protection) => protection.available !== false)
            .map((protection) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "protection-option";
                button.setAttribute("role", "radio");
                button.setAttribute("aria-checked", "false");
                button.dataset.protection = protection.id;
                button.disabled = true;
                button.textContent = protection.label;
                return button;
            })
    );
    devicePalette.replaceChildren(
        ...config.devices.map((device) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "device-card";
            button.draggable = true;
            button.dataset.device = device.id;
            const symbol = document.createElement("span");
            symbol.className = `device-symbol ${device.symbolClass ?? ""}`;
            symbol.textContent = device.symbol;
            const label = document.createElement("span");
            label.append(device.label);
            if (device.detail) {
                const detail = document.createElement("small");
                detail.textContent = device.detail;
                label.append(detail);
            }
            button.append(symbol, label);
            return button;
        })
    );
    submitProtection.textContent = config.buttons.submitProtection;
    submitConfiguration.textContent = config.buttons.submitConfiguration;
    submitDevices.textContent = config.buttons.submitPlacement;
    addEgressButton.textContent = config.buttons.addEgress;
    returnToMainScene.textContent = config.buttons.returnToScene;
    setupCompleteTitle.textContent =
        config.completion.dialogTitle ?? setupCompleteTitle.textContent;
    setupCompleteDescription.textContent =
        config.completion.dialogDescription ??
        setupCompleteDescription.textContent;

    if (config.geotechnicalReport) {
        const report = config.geotechnicalReport;
        reportDialog.querySelector(".soil-type-badge").textContent =
            report.soilType;
        reportDialog.querySelector(
            ".geotechnical-summary div span"
        ).textContent = report.classification;
        const reportData = reportDialog.querySelector(".geotechnical-data");
        reportData.replaceChildren(
            ...report.details.map(({ label, value }) => {
                const row = document.createElement("div");
                const term = document.createElement("dt");
                const description = document.createElement("dd");
                term.textContent = label;
                description.textContent = value;
                row.append(term, description);
                return row;
            })
        );
        const warning = reportDialog.querySelector(".geotechnical-warning");
        warning.querySelector("strong").textContent = report.warningTitle;
        warning.querySelector("p").textContent = report.warning;
    }

    const placedDevices = [];
    let isOpen = false;
    let plannerMode = null;
    let selectedProtection = null;
    let selectedConfiguration = null;
    let hasAcknowledgedReport = false;
    let configuredShield = null;
    let placedEgress = null;
    let isEgressLoading = false;
    let isShieldPlacementAccepted = false;
    let previousCamera = null;
    let isComplete = false;
    let completionNotified = false;
    const completionListeners = new Set();
    let isReinspectionComplete = false;
    const inspectedItems = new Set();
    const reinspectionCompletionListeners = new Set();
    const reinspectionHighlight = new HighlightLayer(
        "trenchReinspectionHighlight",
        scene
    );
    reinspectionHighlight.innerGlow = false;
    const reinspectionHighlightColor = new Color3(0.2, 0.82, 0.58);
    const authoredWallMeshes = trench.meshes.filter((mesh) =>
        mesh.name.includes("Dirt_Edge")
    );
    const trenchWallMeshes = authoredWallMeshes.length > 0
        ? authoredWallMeshes
        : trench.meshes;

    const cameraPosition = scene.getTransformNodeByName(
        config.sceneNodes.cameraPosition
    );
    if (!cameraPosition) {
        throw new Error(
            `Trench scene is missing ${config.sceneNodes.cameraPosition}`
        );
    }
    cameraPosition.computeWorldMatrix(true);

    const measurementPoints = {
        depthTop: scene.getTransformNodeByName(config.sceneNodes.depthTop),
        cross: scene.getTransformNodeByName(
            config.sceneNodes.measurementCross
        ),
        widthLeft: scene.getTransformNodeByName(config.sceneNodes.widthLeft),
    };
    Object.entries(measurementPoints).forEach(([key, point]) => {
        if (!point) {
            throw new Error(`Excavation scene is missing measurement point ${key}`);
        }
    });
    measurementPoints.depthTop.computeWorldMatrix(true);
    measurementPoints.cross.computeWorldMatrix(true);
    const trenchVerticalWorldSpan = Math.abs(
        measurementPoints.depthTop.getAbsolutePosition().y -
        measurementPoints.cross.getAbsolutePosition().y
    );
    if (!Number.isFinite(trenchVerticalWorldSpan) || trenchVerticalWorldSpan <= 0) {
        throw new Error("Trench measurement points need a non-zero vertical span");
    }
    const verticalFeetPerWorldUnit =
        config.trenchDimensions.depth / trenchVerticalWorldSpan;

    const cameraHeight = trench.minimum.y + 3;
    const cameraCenterX = trench.center.x - 1.5;
    const planningCamera = new UniversalCamera(
        "trenchPlanningCamera",
        cameraPosition.getAbsolutePosition().clone(),
        scene
    );
    const syncPlanningCameraTransform = () => {
        cameraPosition.computeWorldMatrix(true);
        planningCamera.position.copyFrom(
            cameraPosition.getAbsolutePosition()
        );
        if (config.sceneNodes.useAuthoredCameraRotation) {
            // Use the complete world-space basis instead of the decomposed
            // quaternion. glTF's handedness-conversion root contains a
            // negative scale that a quaternion alone cannot preserve.
            const authoredForward = cameraPosition
                .getDirection(Vector3.Forward())
                .normalize();
            const authoredUp = cameraPosition
                .getDirection(Vector3.Up())
                .normalize();
            planningCamera.rotationQuaternion = null;
            planningCamera.upVector.copyFrom(authoredUp);
            planningCamera.setTarget(
                planningCamera.position.add(authoredForward)
            );
            return;
        }
        planningCamera.rotationQuaternion = null;
        planningCamera.upVector.copyFrom(Vector3.Up());
        planningCamera.setTarget(
            new Vector3(cameraCenterX, cameraHeight, trench.center.z + 8)
        );
    };
    syncPlanningCameraTransform();
    // A wider field of view exposes more of the trench interior for placement.
    planningCamera.fov = config.sceneNodes.cameraFieldOfView ?? 1.2;
    planningCamera.minZ = 0.1;
    planningCamera.inputs.clear();

    const projectWorldToStage = (worldPosition) => {
        const engine = scene.getEngine();
        const viewport = planningCamera.viewport.toGlobal(
            engine.getRenderWidth(),
            engine.getRenderHeight()
        );
        const projected = Vector3.Project(
            worldPosition,
            Matrix.Identity(),
            scene.getTransformMatrix(),
            viewport
        );
        const canvasRect = canvas.getBoundingClientRect();
        const stageRect = trenchStage.getBoundingClientRect();

        return {
            x:
                canvasRect.left - stageRect.left +
                projected.x * canvasRect.width / engine.getRenderWidth(),
            y:
                canvasRect.top - stageRect.top +
                projected.y * canvasRect.height / engine.getRenderHeight(),
        };
    };

    const projectToStage = (node) => {
        node.computeWorldMatrix(true);
        return projectWorldToStage(node.getAbsolutePosition());
    };

    const positionGuide = (guide, start, end) => {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        guide.style.left = `${start.x}px`;
        guide.style.top = `${start.y}px`;
        guide.style.width = `${Math.hypot(deltaX, deltaY)}px`;
        guide.style.transform =
            `translateY(-50%) rotate(${Math.atan2(deltaY, deltaX)}rad)`;
    };

    const positionMeasurementGuides = () => {
        if (!isOpen || measurementGuides.hidden) return;

        const cross = projectToStage(measurementPoints.cross);
        positionGuide(
            widthGuide,
            projectToStage(measurementPoints.widthLeft),
            cross
        );
        positionGuide(
            depthGuide,
            projectToStage(measurementPoints.depthTop),
            cross
        );
    };

    scene.onBeforeRenderObservable.add(positionMeasurementGuides);

    const updateWorkspaceState = () => {
        const count = placedDevices.length;
        emptyMessage.classList.toggle("is-hidden", count > 0);
    };

    const clampToTrench = (mesh) => {
        const halfWidth = trench.width / 2 - 0.3;
        const halfDepth = trench.depth / 2 - 0.3;

        mesh.position.x = Math.max(
            trench.center.x - halfWidth,
            Math.min(mesh.position.x, trench.center.x + halfWidth)
        );
        mesh.position.z = Math.max(
            trench.center.z - halfDepth,
            Math.min(mesh.position.z, trench.center.z + halfDepth)
        );
    };

    const placeDevice = (deviceDefinition, position = trench.center) => {
        const device = createDeviceMesh(scene, deviceDefinition);
        const material = new StandardMaterial(`${device.name}Material`, scene);
        material.diffuseColor = Color3.FromArray(
            deviceDefinition.color ?? [1, 0.68, 0.05]
        );
        material.emissiveColor = material.diffuseColor.scale(0.16);

        device.material = material;
        device.position.copyFrom(position);
        device.computeWorldMatrix(true);
        const halfDeviceHeight =
            device.getBoundingInfo().boundingBox.extendSize.y;
        const placementY = trench.minimum.y + halfDeviceHeight + 0.15;
        device.position.y = placementY;
        device.checkCollisions = true;
        device.metadata = {
            trenchDevice: true,
            deviceId: deviceDefinition.id,
            type: deviceDefinition.label,
        };
        clampToTrench(device);

        const dragBehavior = new PointerDragBehavior({
            dragPlaneNormal: Vector3.Up(),
        });
        dragBehavior.useObjectOrientationForDragging = false;
        dragBehavior.onDragObservable.add(() => {
            device.position.y = placementY;
            clampToTrench(device);
        });
        device.addBehavior(dragBehavior);

        placedDevices.push(device);
        updateWorkspaceState();
    };

    const removeConfiguredShield = () => {
        if (!configuredShield) return;

        shieldPlacementGuide.hidden = true;
        shieldTopPlacementGuide.hidden = true;
        const index = placedDevices.indexOf(configuredShield);
        if (index >= 0) placedDevices.splice(index, 1);
        configuredShield.dispose();
        configuredShield = null;
        updateWorkspaceState();
    };

    const placeShield = (configuration) => {
        const { prefabName } = configuration;
        removeConfiguredShield();
        const shield = trench.shieldPrefabs.instantiate(
            prefabName,
            "placedTrenchShield"
        );
        shield.computeWorldMatrix(true);
        const bounds = shield.getHierarchyBoundingVectors(true);
        const size = bounds.max.subtract(bounds.min);
        const center = bounds.min.add(size.scale(0.5));
        const dragCollider = CreateBox(
            "placedTrenchShieldDragCollider",
            {
                width: size.x,
                height: size.y,
                depth: size.z,
            },
            scene
        );
        dragCollider.position.copyFrom(center);
        dragCollider.visibility = 0;
        dragCollider.isVisible = true;
        dragCollider.isPickable = true;
        dragCollider.checkCollisions = false;
        dragCollider.metadata = {
            trenchDevice: true,
            type: "Trench shield",
            prefabName,
            configurationId: configuration.id,
            dimensions: configuration.dimensions,
        };
        shield.getChildMeshes(false).forEach((mesh) => {
            mesh.isPickable = false;
        });
        shield.setParent(dragCollider);
        const lockedPosition = dragCollider.getAbsolutePosition().clone();
        const snapYPositions = configuration.placement?.snapPositionNames
            ?.map((name) => trench.shieldPrefabs.snapYPositions[name]);
        if (snapYPositions?.some((position) => position === undefined)) {
            throw new Error(
                `Configuration ${configuration.id} references a missing shield snap point`
            );
        }
        const nearestSnapIndex = (y) => snapYPositions.reduce(
            (nearestIndex, candidate, index) =>
                Math.abs(candidate - y) <
                Math.abs(snapYPositions[nearestIndex] - y)
                    ? index
                    : nearestIndex,
            0
        );
        const updateShieldPlacementGuide = () => {
            shield.computeWorldMatrix(true);
            const shieldBounds = shield.getHierarchyBoundingVectors(true);
            measurementPoints.cross.computeWorldMatrix(true);
            measurementPoints.depthTop.computeWorldMatrix(true);
            const crossWorld = measurementPoints.cross.getAbsolutePosition();
            const y1World = measurementPoints.depthTop.getAbsolutePosition();
            const bottomWorld = new Vector3(
                crossWorld.x,
                shieldBounds.min.y,
                crossWorld.z
            );
            const topWorld = new Vector3(
                y1World.x,
                shieldBounds.max.y,
                y1World.z
            );
            const crossScreen = projectWorldToStage(crossWorld);
            const bottomScreen = projectWorldToStage(bottomWorld);
            const y1Screen = projectWorldToStage(y1World);
            const topScreen = projectWorldToStage(topWorld);

            // Keep the overlay visually vertical while its endpoints retain
            // the projected world-Y values.
            bottomScreen.x = crossScreen.x;
            topScreen.x = y1Screen.x;
            positionGuide(shieldPlacementGuide, crossScreen, bottomScreen);
            positionGuide(shieldTopPlacementGuide, y1Screen, topScreen);
            if (snapYPositions?.length) {
                const measurements = configuration.placement.snapMeasurements[
                    nearestSnapIndex(dragCollider.getAbsolutePosition().y)
                ];
                shieldPlacementValue.textContent =
                    `${measurements.bottom} ft`;
                shieldTopPlacementValue.textContent = `${measurements.top} ft`;
            } else {
                shieldPlacementValue.textContent =
                    `${(
                        Math.abs(shieldBounds.min.y - crossWorld.y) *
                        verticalFeetPerWorldUnit
                    ).toFixed(1)} ft`;
                shieldTopPlacementValue.textContent =
                    `${(
                        Math.abs(shieldBounds.max.y - y1World.y) *
                        verticalFeetPerWorldUnit
                    ).toFixed(1)} ft`;
            }
        };

        const dragBehavior = new PointerDragBehavior({
            dragAxis: Vector3.Up(),
        });
        dragBehavior.useObjectOrientationForDragging = false;
        dragBehavior.onDragObservable.add(() => {
            const draggedPosition = dragCollider.getAbsolutePosition();
            const snapIndex = snapYPositions?.length
                ? nearestSnapIndex(draggedPosition.y)
                : null;
            const y = snapYPositions?.length
                ? snapYPositions[snapIndex]
                : draggedPosition.y;
            dragCollider.setAbsolutePosition(
                new Vector3(
                    lockedPosition.x,
                    y,
                    lockedPosition.z
                )
            );
            dragCollider.metadata.snapIndex = snapIndex;
            updateShieldPlacementGuide();
        });
        dragBehavior.onDragStartObservable.add(() => {
            shieldPlacementGuide.hidden = false;
            shieldTopPlacementGuide.hidden = false;
            updateShieldPlacementGuide();
        });
        dragBehavior.onDragEndObservable.add(() => {
            updateShieldPlacementGuide();
        });
        if (snapYPositions?.length) {
            const initialSnapIndex = nearestSnapIndex(lockedPosition.y);
            dragCollider.setAbsolutePosition(
                new Vector3(
                    lockedPosition.x,
                    snapYPositions[initialSnapIndex],
                    lockedPosition.z
                )
            );
            dragCollider.metadata.snapIndex = initialSnapIndex;
        }
        dragBehavior.enabled = configuration.placement?.draggable === true;
        dragCollider.addBehavior(dragBehavior);
        dragCollider.metadata.dragBehavior = dragBehavior;

        configuredShield = dragCollider;
        placedDevices.push(dragCollider);
        updateWorkspaceState();
    };

    const resetReinspection = () => {
        inspectedItems.clear();
        reinspectionHighlight.removeAllMeshes();
        [
            wallsInspection,
            shieldInspection,
            egressInspection,
        ].forEach((item) => {
            item.classList.remove("is-inspected");
            item.setAttribute("aria-pressed", "false");
            item.querySelector("small").textContent =
                config.ui.reinspection.pendingLabel;
        });
        reinspectionInstruction.textContent = config.ui.reinspection.instruction;
        completeReinspectionButton.disabled = true;
    };

    const addInspectionHighlight = (meshes) => {
        meshes.forEach((mesh) => {
            if (mesh.getTotalVertices() > 0) {
                reinspectionHighlight.addMesh(
                    mesh,
                    reinspectionHighlightColor
                );
            }
        });
    };

    const inspectItem = (item) => {
        if (plannerMode !== "reinspection" || inspectedItems.has(item)) {
            return;
        }

        inspectedItems.add(item);
        recordCorrect(`reinspection-${item}`);
        if (item === "walls") {
            wallsInspection.classList.add("is-inspected");
            wallsInspection.setAttribute("aria-pressed", "true");
            wallsInspection.querySelector("small").textContent =
                "Inspected — no visible post-storm movement";
            addInspectionHighlight(trenchWallMeshes);
        } else if (item === "shield") {
            shieldInspection.classList.add("is-inspected");
            shieldInspection.setAttribute("aria-pressed", "true");
            shieldInspection.querySelector("small").textContent =
                "Inspected — remains correctly positioned";
            addInspectionHighlight(
                configuredShield?.getChildMeshes(false) ?? []
            );
        } else {
            egressInspection.classList.add("is-inspected");
            egressInspection.setAttribute("aria-pressed", "true");
            egressInspection.querySelector("small").textContent =
                "Inspected — ladder remains secure and accessible";
            addInspectionHighlight(
                placedEgress?.getChildMeshes(false) ?? []
            );
        }

        if (inspectedItems.size === 3) {
            reinspectionInstruction.textContent =
                "All three conditions have been inspected. Complete the reinspection to resume work.";
            completeReinspectionButton.disabled = false;
        }
    };

    wallsInspection.addEventListener("click", () => inspectItem("walls"));
    shieldInspection.addEventListener("click", () => inspectItem("shield"));
    egressInspection.addEventListener("click", () => inspectItem("egress"));

    document.querySelectorAll(".device-card").forEach((card) => {
        const getDevice = () => deviceById.get(card.dataset.device);

        card.addEventListener("dragstart", (event) => {
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData(
                "text/plain",
                card.dataset.device
            );
        });
        card.addEventListener("click", () => {
            if (plannerMode !== "planning") return;
            placeDevice(getDevice());
        });
    });

    canvas.addEventListener("dragover", (event) => {
        if (plannerMode !== "planning") return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    });

    canvas.addEventListener("drop", (event) => {
        if (plannerMode !== "planning") return;
        event.preventDefault();

        const deviceId = event.dataTransfer.getData("text/plain");
        const device = deviceById.get(deviceId);
        if (!device) return;

        const rect = canvas.getBoundingClientRect();
        const pick = scene.pick(
            event.clientX - rect.left,
            event.clientY - rect.top,
            (mesh) => trench.meshes.includes(mesh)
        );
        placeDevice(
            device,
            pick?.pickedPoint ?? trench.center
        );
    });

    const setFeedback = (element, message, type) => {
        element.textContent = message;
        element.className = `step-feedback ${type ? `is-${type}` : ""}`;
    };

    const completePlan = ({ summary, status = "Plan complete" }) => {
        finalPlanTitle.textContent = config.completion.planTitle;
        finalPlanSummary.textContent = summary;
        finalPlanReview.hidden = false;
        protectionStatus.textContent = status;
        isComplete = true;
        window.setTimeout(() => {
            if (!isComplete || setupCompleteDialog.open) return;
            setupCompleteDialog.showModal();
            returnToMainScene.focus();
        }, config.completion.dialogDelayMs);
    };

    const removePlacedEgress = () => {
        if (!placedEgress) return;

        const index = placedDevices.indexOf(placedEgress);
        if (index >= 0) placedDevices.splice(index, 1);
        placedEgress.dispose();
        placedEgress = null;
        updateWorkspaceState();
    };

    const resetEgressStep = () => {
        removePlacedEgress();
        isComplete = false;
        isEgressLoading = false;
        isShieldPlacementAccepted = false;
        egressSection.hidden = true;
        addEgressButton.disabled = false;
        addEgressButton.textContent = config.buttons.addEgress;
        submitDevices.disabled = false;
        setFeedback(egressFeedback, "", "");
    };

    const resetDownstreamSteps = () => {
        removeConfiguredShield();
        resetEgressStep();
        selectedConfiguration = null;
        configurationSection.hidden = true;
        deviceSection.hidden = true;
        finalPlanReview.hidden = true;
        setFeedback(configurationFeedback, "", "");
        setFeedback(deviceFeedback, "", "");
        document.querySelectorAll(".configuration-option").forEach(
            (configuration) => {
                configuration.classList.remove("is-selected");
                configuration.setAttribute("aria-pressed", "false");
            }
        );
    };

    protectionOptions.querySelectorAll(".protection-option").forEach((option) => {
        option.addEventListener("click", () => {
            protectionOptions.querySelectorAll(".protection-option").forEach((item) => {
                const isSelected = item === option;
                item.classList.toggle("is-selected", isSelected);
                item.setAttribute("aria-checked", String(isSelected));
            });

            selectedProtection = option.dataset.protection;
            submitProtection.disabled = false;
            setFeedback(protectionFeedback, "", "");
            resetDownstreamSteps();
            const protection = protectionById.get(selectedProtection);
            protectionStatus.textContent =
                `${protection.label} selected — submit to continue`;
        });
    });

    const renderConfigurationOptions = (protection) => {
        configurationOptions.replaceChildren(
            ...protection.configurations.map((configuration) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "configuration-option";
                button.dataset.configuration = configuration.id;
                const label = document.createElement("strong");
                label.textContent = configuration.label;
                const detail = document.createElement("span");
                detail.textContent = configuration.detail;
                button.append(label, detail);
                return button;
            })
        );
    };

    configurationOptions.addEventListener("click", (event) => {
        const option = event.target.closest(".configuration-option");
        if (!option || !configurationOptions.contains(option)) return;
        configurationOptions.querySelectorAll(".configuration-option").forEach(
            (configuration) => {
                const isSelected = configuration === option;
                configuration.classList.toggle("is-selected", isSelected);
                configuration.setAttribute("aria-pressed", String(isSelected));
            }
        );

        selectedConfiguration = configurationById.get(
            option.dataset.configuration
        );
        if (selectedConfiguration.prefabName) {
            placeShield(selectedConfiguration);
        }
        setFeedback(configurationFeedback, "", "");
        const protection = protectionById.get(selectedProtection);
        protectionStatus.textContent =
            `${protection.label}: ${selectedConfiguration.summary} selected`;
    });

    submitProtection.addEventListener("click", () => {
        const protection = protectionById.get(selectedProtection);
        if (!protection?.accepted) {
            recordIncorrect(`protection-${selectedProtection ?? "missing"}`);
            setFeedback(
                protectionFeedback,
                protection?.rejectionFeedback ??
                    "Select an acceptable protective system.",
                "incorrect"
            );
            return;
        }

        const assessment = protection.assessment ?? "preferred";
        if (assessment === "preferred") {
            recordCorrect(`protection-${selectedProtection}`);
        }
        setFeedback(
            protectionFeedback,
            protection.acceptedFeedback ??
                `${protection.label} is acceptable. Configure it next.`,
            assessment === "preferred" ? "correct" : "acceptable"
        );
        submitProtection.disabled = true;
        protectionOptions.querySelectorAll(".protection-option").forEach((option) => {
            option.disabled = true;
        });
        if (protection.completeOnSelection) {
            completePlan({
                summary:
                    protection.completionSummary ??
                    protection.acceptedFeedback ??
                    `${protection.label} selected.`,
                status:
                    protection.acceptedStatus ??
                    `${protection.label} accepted`,
            });
            return;
        }
        configurationSection.hidden = false;
        configurationTitle.textContent = protection.configurationTitle;
        renderConfigurationOptions(protection);
        protectionStatus.textContent =
            `${protection.label} accepted — configuration required`;
    });

    const configureDeviceStep = () => {
        const deviceCards = [...devicePalette.querySelectorAll(".device-card")];
        const protection = protectionById.get(selectedProtection);
        const placement = protection.placement;

        deviceCards.forEach((card) => {
            card.hidden = !placement.availableDeviceIds.includes(
                card.dataset.device
            );
        });

        deviceStepTitle.textContent = placement.title;
        deviceStepHelp.textContent = placement.help;
        deviceSection.hidden = false;
    };

    submitConfiguration.addEventListener("click", () => {
        if (!selectedConfiguration) {
            recordIncorrect("configuration-missing");
            setFeedback(
                configurationFeedback,
                "Select a configuration before submitting.",
                "incorrect"
            );
            return;
        }

        const protection = protectionById.get(selectedProtection);
        const minimumExtraHeight =
            selectedConfiguration.rules?.minimumHeightAboveTrench;
        if (minimumExtraHeight !== undefined) {
            const shieldHeight = selectedConfiguration.dimensions.depth;
            const trenchDepth = Number(measurementInputs[2].value);
            if (shieldHeight < trenchDepth + minimumExtraHeight) {
                recordIncorrect(`configuration-${selectedConfiguration.id}`);
                setFeedback(
                    configurationFeedback,
                    selectedConfiguration.rules.invalidSizeFeedback ??
                        `This protection must extend at least ${minimumExtraHeight} ft beyond the ${trenchDepth} ft trench depth.`,
                    "incorrect"
                );
                return;
            }
        }

        recordCorrect(`configuration-${selectedConfiguration.id}`);
        setFeedback(
            configurationFeedback,
            protection.configurationCorrectFeedback ??
                `${selectedConfiguration.summary} accepted. Complete the placement step.`,
            "correct"
        );
        submitConfiguration.disabled = true;
        configurationOptions.querySelectorAll(".configuration-option").forEach(
            (option) => {
                option.disabled = true;
            }
        );
        protectionStatus.textContent =
            `${protection.label}: ${selectedConfiguration.summary}`;
        configureDeviceStep();
    });

    submitDevices.addEventListener("click", () => {
        const protection = protectionById.get(selectedProtection);
        const placement = protection.placement;
        const placedShield = placedDevices.find(
            (device) => device.metadata?.type === "Trench shield"
        );
        const requiredDevice = placement.requireConfiguredProtection
            ? Boolean(placedShield)
            : placedDevices.some((device) =>
                placement.requiredDeviceIds.includes(
                    device.metadata?.deviceId
                )
            );

        if (!requiredDevice) {
            recordIncorrect("placement-missing");
            setFeedback(
                deviceFeedback,
                placement.missingDeviceFeedback,
                "incorrect"
            );
            return;
        }

        if (
            placement.requireConfiguredProtection &&
            selectedConfiguration.rules?.requiredSnapIndex !== undefined &&
            placedShield.metadata?.snapIndex !==
                selectedConfiguration.rules.requiredSnapIndex
        ) {
            recordIncorrect(`placement-${selectedConfiguration.id}`);
            setFeedback(
                deviceFeedback,
                selectedConfiguration.rules.invalidPlacementFeedback,
                "incorrect"
            );
            return;
        }

        recordCorrect(`placement-${selectedConfiguration.id}`);
        setFeedback(
            deviceFeedback,
            placement.acceptedFeedback ?? "Placement accepted.",
            "correct"
        );
        isShieldPlacementAccepted = true;
        submitDevices.disabled = true;
        egressSection.hidden = config.egress.enabled === false;
        protectionStatus.textContent =
            placement.acceptedStatus ?? "Placement accepted";
        if (placedShield?.metadata?.dragBehavior) {
            placedShield.metadata.dragBehavior.enabled = false;
        }
    });

    addEgressButton.addEventListener("click", async () => {
        if (
            !isShieldPlacementAccepted ||
            placedEgress ||
            isEgressLoading
        ) {
            return;
        }

        isEgressLoading = true;
        addEgressButton.disabled = true;
        addEgressButton.textContent = config.buttons.addingEgress;
        setFeedback(egressFeedback, config.egress.loadingFeedback, "");

        try {
            const ladderImport = await ImportMeshAsync(
                config.egress.modelUrl,
                scene
            );
            const ladderRoot = ladderImport.meshes.find(
                (mesh) => !mesh.parent
            );
            if (!ladderRoot) {
                throw new Error(
                    "SCAFFOLD LADDER.glb does not contain a root mesh"
                );
            }

            ladderRoot.name = "placedEgressLadder";
            ladderRoot.metadata = {
                trenchDevice: true,
                type: "Egress ladder",
            };
            ladderImport.meshes.forEach((mesh) => {
                if (mesh.getTotalVertices() > 0) {
                    mesh.checkCollisions = true;
                    mesh.isPickable = true;
                    mesh.metadata = {
                        ...(mesh.metadata ?? {}),
                        trenchDevice: true,
                        type: "Egress ladder",
                    };
                }
            });

            placedEgress = ladderRoot;
            placedDevices.push(ladderRoot);
            isEgressLoading = false;
            updateWorkspaceState();
            recordCorrect("egress");
            setFeedback(
                egressFeedback,
                config.egress.successFeedback,
                "correct"
            );
            addEgressButton.textContent = config.buttons.egressAdded;
            completePlan({
                summary:
                    `${selectedConfiguration.summary} is positioned in the trench with a scaffold ladder for safe egress.`,
            });
        } catch (error) {
            console.error("Failed to add scaffold ladder", error);
            isEgressLoading = false;
            addEgressButton.disabled = false;
            addEgressButton.textContent = config.buttons.retryEgress;
            setFeedback(
                egressFeedback,
                config.egress.failureFeedback,
                "incorrect"
            );
        }
    });

    const updateMeasurements = () => {
        const [length, width, depth] = measurementInputs.map((input) =>
            Math.max(1, Number(input.value) || 1)
        );
        dimensionReadout.textContent =
            `${length} ft × ${width} ft × ${depth} ft deep`;
        guideWidthValue.textContent = `${width} ft`;
        guideDepthValue.textContent = `${depth} ft`;
    };

    measurementInputs.forEach((input) =>
        input.addEventListener("input", updateMeasurements)
    );

    measureButton.addEventListener("click", () => {
        measurementInputs[0].value = config.trenchDimensions.length;
        measurementInputs[1].value = config.trenchDimensions.width;
        measurementInputs[2].value = config.trenchDimensions.depth;
        measureButton.hidden = true;
        measurements.hidden = false;
        measurementGuides.hidden = false;
        submitMeasurements.hidden = false;
        updateMeasurements();
    });

    submitMeasurements.addEventListener("click", () => {
        recordCorrect("measurements");
        measurementGuides.hidden = true;
        setFeedback(
            measurementFeedback,
            config.ui.measurement.recordedFeedback,
            "correct"
        );
        protectionSection.classList.remove("is-locked");
        document.querySelectorAll(".protection-option").forEach((option) => {
            option.disabled = false;
        });
        submitMeasurements.disabled = true;
    });

    const closeReport = () => {
        if (reportDialog.open) reportDialog.close();
        reportButton.focus();
    };

    reportButton.addEventListener("click", () => {
        reportDialog.showModal();
        acknowledgeReportButton.focus();
    });
    closeReportButton.addEventListener("click", closeReport);
    acknowledgeReportButton.addEventListener("click", () => {
        if (!hasAcknowledgedReport) {
            hasAcknowledgedReport = true;
            measureButton.disabled = false;
            measurementSection.classList.remove("is-locked");
            reportButton.classList.add("is-reviewed");
            reportStatus.textContent = config.ui.report.reviewedStatus;
        }
        closeReport();
        measureButton.focus();
    });
    reportDialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeReport();
    });

    const enterPlannerView = (mode) => {
        if (isOpen) return false;

        previousCamera = scene.activeCamera;
        isOpen = true;
        plannerMode = mode;
        const isReinspection = mode === "reinspection";
        reportControl.hidden = isReinspection;
        planningSidebar.hidden = isReinspection;
        reinspectionPanel.hidden = !isReinspection;
        canvas.classList.toggle(
            "trench-reinspection-active",
            isReinspection
        );
        document.body.classList.add("planner-open");
        planner.hidden = false;
        player.setEnabled(false);
        syncPlanningCameraTransform();
        scene.activeCamera = planningCamera;
        return true;
    };

    const leavePlannerView = () => {
        isOpen = false;
        plannerMode = null;
        planner.hidden = true;
        planningSidebar.hidden = false;
        reinspectionPanel.hidden = true;
        reportControl.hidden = false;
        document.body.classList.remove("planner-open");
        canvas.classList.remove("trench-reinspection-active");
        reinspectionHighlight.removeAllMeshes();
        shieldPlacementGuide.hidden = true;
        shieldTopPlacementGuide.hidden = true;
        player.setEnabled(true);
        if (previousCamera) scene.activeCamera = previousCamera;
        canvas.focus();
    };

    setupCompleteDialog.addEventListener("cancel", (event) => {
        event.preventDefault();
    });
    returnToMainScene.addEventListener("click", () => {
        setupCompleteDialog.close();
        leavePlannerView();
        document.querySelector("#mentorMessage p").textContent =
            config.completion.mentorMessage;
        if (!completionNotified) {
            completionNotified = true;
            completionListeners.forEach((listener) => listener());
        }
    });

    completeReinspectionButton.addEventListener("click", () => {
        if (
            completeReinspectionButton.disabled ||
            isReinspectionComplete
        ) {
            return;
        }

        isReinspectionComplete = true;
        leavePlannerView();
        document.querySelector("#mentorMessage p").textContent =
            "The trench walls, shielding, and safe egress have been reinspected. Work can now resume.";
        reinspectionCompletionListeners.forEach((listener) => listener());
    });

    const open = () => {
        if (enterPlannerView("planning")) {
            if (hasAcknowledgedReport) {
                measureButton.focus();
            } else {
                reportButton.focus();
            }
        }
    };

    const openReinspection = () => {
        if (
            !isComplete ||
            isReinspectionComplete ||
            !configuredShield ||
            !placedEgress
        ) {
            return;
        }

        resetReinspection();
        enterPlannerView("reinspection");
    };

    return {
        open,
        openReinspection,
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        onReinspectionComplete(listener) {
            reinspectionCompletionListeners.add(listener);
            return () => reinspectionCompletionListeners.delete(listener);
        },
        isOpen: () => isOpen,
        isComplete: () => isComplete,
        isReinspectionComplete: () => isReinspectionComplete,
    };
}
