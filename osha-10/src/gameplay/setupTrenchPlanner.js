import {
    Color3,
    Matrix,
    MeshBuilder,
    PointerDragBehavior,
    StandardMaterial,
    UniversalCamera,
    Vector3,
} from "@babylonjs/core";
import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";
import {
    BIG_SHIELD_NAME,
    SMALL_SHIELD_NAME,
} from "../world/loadExcavationSite.js";

const CAMERA_POSITION_NAME = "Camera Position";
const DEPTH_TOP_NAME = "y1";
const MEASUREMENT_CROSS_NAME = "yx cross";
const WIDTH_LEFT_NAME = "x1";
const TRENCH_DIMENSIONS_FT = Object.freeze({
    length: 35,
    width: 6,
    depth: 8,
});
const SHIELD_DIMENSIONS_FT = Object.freeze({
    [BIG_SHIELD_NAME]: Object.freeze({ depth: 10, width: 6 }),
    [SMALL_SHIELD_NAME]: Object.freeze({ depth: 8, width: 4 }),
});
const BIG_SHIELD_SNAP_MEASUREMENTS_FT = Object.freeze([
    Object.freeze({ bottom: 0.1, top: 2 }),
    Object.freeze({ bottom: 3, top: 5 }),
    Object.freeze({ bottom: 6, top: 8 }),
]);

function createDeviceMesh(scene, deviceName) {
    switch (deviceName) {
        case "Ladder":
            return MeshBuilder.CreateBox(
                "placedLadder",
                { width: 0.8, height: 0.3, depth: 5 },
                scene
            );
        case "Hydraulic shore":
            return MeshBuilder.CreateBox(
                "placedHydraulicShore",
                { width: 7, height: 0.45, depth: 0.6 },
                scene
            );
        default:
            return MeshBuilder.CreateCylinder(
                "placedEgressPoint",
                { diameter: 1.2, height: 0.35 },
                scene
            );
    }
}

export function setupTrenchPlanner({
    scene,
    canvas,
    player,
    trench,
    onReturnToMainScene,
}) {
    const planner = document.getElementById("trenchPlanner");
    const emptyMessage = document.getElementById("emptyTrenchMessage");
    const deviceCount = document.getElementById("deviceCount");
    const clearButton = document.getElementById("clearDevices");
    const reportButton = document.getElementById("openGeotechnicalReport");
    const reportDialog = document.getElementById("geotechnicalReport");
    const closeReportButton = document.getElementById(
        "closeGeotechnicalReport"
    );
    const acknowledgeReportButton = document.getElementById(
        "acknowledgeGeotechnicalReport"
    );
    const measureButton = document.getElementById("measureTrench");
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
    const configurationSection = document.getElementById(
        "protectionConfiguration"
    );
    const configurationTitle = document.getElementById("configurationTitle");
    const slopingConfigurations = document.getElementById(
        "slopingConfigurations"
    );
    const shieldingConfigurations = document.getElementById(
        "shieldingConfigurations"
    );
    const deviceSection = document.getElementById("deviceSection");
    const deviceStepTitle = document.getElementById("deviceStepTitle");
    const deviceStepHelp = document.getElementById("deviceStepHelp");
    const finalPlanReview = document.getElementById("finalPlanReview");
    const finalPlanSummary = document.getElementById("finalPlanSummary");
    const setupCompleteDialog = document.getElementById(
        "setupCompleteDialog"
    );
    const returnToMainScene = document.getElementById("returnToMainScene");
    const measurementInputs = [
        document.getElementById("trenchLength"),
        document.getElementById("trenchWidth"),
        document.getElementById("trenchDepth"),
    ];

    const placedDevices = [];
    let isOpen = false;
    let selectedProtection = null;
    let selectedConfiguration = null;
    let configuredShield = null;
    let previousCamera = null;
    let isComplete = false;

    const cameraPosition = scene.getTransformNodeByName(CAMERA_POSITION_NAME);
    if (!cameraPosition) {
        throw new Error(`Excavation scene is missing ${CAMERA_POSITION_NAME}`);
    }
    cameraPosition.computeWorldMatrix(true);

    const measurementPoints = {
        depthTop: scene.getTransformNodeByName(DEPTH_TOP_NAME),
        cross: scene.getTransformNodeByName(MEASUREMENT_CROSS_NAME),
        widthLeft: scene.getTransformNodeByName(WIDTH_LEFT_NAME),
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
    const verticalFeetPerWorldUnit =
        TRENCH_DIMENSIONS_FT.depth / trenchVerticalWorldSpan;

    const cameraHeight = trench.minimum.y + 3;
    const cameraCenterX = trench.center.x - 1.5;
    const planningCamera = new UniversalCamera(
        "trenchPlanningCamera",
        cameraPosition.getAbsolutePosition().clone(),
        scene
    );
    planningCamera.setTarget(
        new Vector3(cameraCenterX, cameraHeight, trench.center.z + 8)
    );
    // A wider field of view exposes more of the trench interior for placement.
    planningCamera.fov = 1.2;
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

    const updateDeviceCount = () => {
        const count = placedDevices.length;
        deviceCount.textContent = `${count} device${count === 1 ? "" : "s"} placed`;
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

    const placeDevice = (data, position = trench.center) => {
        const device = createDeviceMesh(scene, data.name);
        const material = new StandardMaterial(`${device.name}Material`, scene);
        material.diffuseColor = data.name === "Egress point"
            ? new Color3(0.2, 0.85, 0.45)
            : new Color3(1, 0.68, 0.05);
        material.emissiveColor = material.diffuseColor.scale(0.16);

        device.material = material;
        device.position.copyFrom(position);
        device.computeWorldMatrix(true);
        const halfDeviceHeight =
            device.getBoundingInfo().boundingBox.extendSize.y;
        const placementY = trench.minimum.y + halfDeviceHeight + 0.15;
        device.position.y = placementY;
        device.checkCollisions = true;
        device.metadata = { trenchDevice: true, type: data.name };
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
        updateDeviceCount();
    };

    const removeConfiguredShield = () => {
        if (!configuredShield) return;

        shieldPlacementGuide.hidden = true;
        shieldTopPlacementGuide.hidden = true;
        const index = placedDevices.indexOf(configuredShield);
        if (index >= 0) placedDevices.splice(index, 1);
        configuredShield.dispose();
        configuredShield = null;
        updateDeviceCount();
    };

    const placeShield = (prefabName) => {
        if (![SMALL_SHIELD_NAME, BIG_SHIELD_NAME].includes(prefabName)) {
            throw new Error(`Unsupported trench shield ${prefabName}`);
        }

        removeConfiguredShield();
        const shield = trench.shieldPrefabs.instantiate(
            prefabName,
            "placedTrenchShield"
        );
        shield.computeWorldMatrix(true);
        const bounds = shield.getHierarchyBoundingVectors(true);
        const size = bounds.max.subtract(bounds.min);
        const center = bounds.min.add(size.scale(0.5));
        const dragCollider = MeshBuilder.CreateBox(
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
            dimensions: SHIELD_DIMENSIONS_FT[prefabName],
        };
        shield.getChildMeshes(false).forEach((mesh) => {
            mesh.isPickable = false;
        });
        shield.setParent(dragCollider);
        const lockedPosition = dragCollider.getAbsolutePosition().clone();
        const snapYPositions = prefabName === BIG_SHIELD_NAME
            ? Object.values(trench.shieldPrefabs.bigShieldSnapYPositions)
            : null;
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
            if (snapYPositions) {
                const measurements = BIG_SHIELD_SNAP_MEASUREMENTS_FT[
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
            const snapIndex = snapYPositions
                ? nearestSnapIndex(draggedPosition.y)
                : null;
            const y = snapYPositions
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
        if (snapYPositions) {
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
        dragCollider.addBehavior(dragBehavior);
        dragCollider.metadata.dragBehavior = dragBehavior;

        configuredShield = dragCollider;
        placedDevices.push(dragCollider);
        updateDeviceCount();
    };

    document.querySelectorAll(".device-card").forEach((card) => {
        const getDeviceData = () => ({
            name: card.dataset.device,
            width: Number(card.dataset.width),
            height: Number(card.dataset.height),
        });

        card.addEventListener("dragstart", (event) => {
            if (card.dataset.device === "Trench shield") {
                event.preventDefault();
                return;
            }
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData(
                "application/json",
                JSON.stringify(getDeviceData())
            );
        });
        card.addEventListener("click", () => {
            // Shielding is assessed as a drag-and-drop placement task.
            if (card.dataset.device !== "Trench shield") {
                placeDevice(getDeviceData());
            }
        });
    });

    canvas.addEventListener("dragover", (event) => {
        if (!isOpen) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    });

    canvas.addEventListener("drop", (event) => {
        if (!isOpen) return;
        event.preventDefault();

        const rawData = event.dataTransfer.getData("application/json");
        if (!rawData) return;

        const rect = canvas.getBoundingClientRect();
        const pick = scene.pick(
            event.clientX - rect.left,
            event.clientY - rect.top,
            (mesh) => trench.meshes.includes(mesh)
        );
        placeDevice(
            JSON.parse(rawData),
            pick?.pickedPoint ?? trench.center
        );
    });

    const setFeedback = (element, message, type) => {
        element.textContent = message;
        element.className = `step-feedback ${type ? `is-${type}` : ""}`;
    };

    const resetDownstreamSteps = () => {
        removeConfiguredShield();
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

    document.querySelectorAll(".protection-option").forEach((option) => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".protection-option").forEach((item) => {
                const isSelected = item === option;
                item.classList.toggle("is-selected", isSelected);
                item.setAttribute("aria-checked", String(isSelected));
            });

            selectedProtection = option.dataset.protection;
            submitProtection.disabled = false;
            setFeedback(protectionFeedback, "", "");
            resetDownstreamSteps();
            protectionStatus.textContent =
                selectedProtection === "None"
                    ? "None selected"
                    : `${selectedProtection} selected — submit to continue`;
        });
    });

    document.querySelectorAll(".configuration-option").forEach((option) => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".configuration-option").forEach(
                (configuration) => {
                    const isSelected = configuration === option;
                    configuration.classList.toggle("is-selected", isSelected);
                    configuration.setAttribute(
                        "aria-pressed",
                        String(isSelected)
                    );
                }
            );

            selectedConfiguration = option;
            if (option.dataset.shieldPrefab) {
                placeShield(option.dataset.shieldPrefab);
            }
            setFeedback(configurationFeedback, "", "");
            protectionStatus.textContent =
                `${option.dataset.system}: ${option.dataset.configuration} selected`;
        });
    });

    submitProtection.addEventListener("click", () => {
        if (!selectedProtection || selectedProtection === "None") {
            playWrongAnswerSound();
            setFeedback(
                protectionFeedback,
                "No protection is not acceptable. This trench requires a protective system.",
                "incorrect"
            );
            return;
        }
        if (selectedProtection === "Sloping") {
            playWrongAnswerSound();
            setFeedback(
                protectionFeedback,
                "Sloping is not acceptable because the excavation is at the road curb. Select Shielding.",
                "incorrect"
            );
            return;
        }

        playCorrectAnswerSound();
        setFeedback(
            protectionFeedback,
            `${selectedProtection} is an acceptable protection approach. Configure it next.`,
            "correct"
        );
        configurationSection.hidden = false;
        configurationTitle.textContent =
            selectedProtection === "Sloping"
                ? "Select a sloping angle"
                : "Select a trench shield size";
        slopingConfigurations.hidden = selectedProtection !== "Sloping";
        shieldingConfigurations.hidden = selectedProtection !== "Shielding";
        protectionStatus.textContent =
            `${selectedProtection} accepted — configuration required`;
    });

    const configureDeviceStep = () => {
        const deviceCards = [...document.querySelectorAll(".device-card")];
        const isShielding = selectedProtection === "Shielding";

        deviceCards.forEach((card) => {
            const deviceName = card.dataset.device;
            card.hidden = isShielding
                ? true
                : !["Ladder", "Egress point"].includes(deviceName);
        });

        deviceStepTitle.textContent = isShielding
            ? "Place the trench shield"
            : "Place safe access or egress";
        deviceStepHelp.textContent = isShielding
            ? "Position the selected trench shield in the trench, then submit."
            : "Place a ladder or egress point for worker access, then submit.";
        deviceSection.hidden = false;
    };

    submitConfiguration.addEventListener("click", () => {
        if (!selectedConfiguration) {
            playWrongAnswerSound();
            setFeedback(
                configurationFeedback,
                "Select a configuration before submitting.",
                "incorrect"
            );
            return;
        }

        if (selectedProtection === "Shielding") {
            if (
                selectedConfiguration.dataset.shieldPrefab ===
                SMALL_SHIELD_NAME
            ) {
                playWrongAnswerSound();
                setFeedback(
                    configurationFeedback,
                    "The 8 ft deep × 4 ft wide small shield is not acceptable for this trench. Select the big shield.",
                    "incorrect"
                );
                return;
            }

            const shieldHeight = Number(selectedConfiguration.dataset.height);
            const trenchDepth = Number(measurementInputs[2].value);
            if (shieldHeight < trenchDepth) {
                playWrongAnswerSound();
                setFeedback(
                    configurationFeedback,
                    `The ${shieldHeight} ft shield is not tall enough for a ${trenchDepth} ft trench.`,
                    "incorrect"
                );
                return;
            }
        }

        playCorrectAnswerSound();
        setFeedback(
            configurationFeedback,
            `${selectedConfiguration.dataset.configuration} accepted. Complete the placement step.`,
            "correct"
        );
        protectionStatus.textContent =
            `${selectedProtection}: ${selectedConfiguration.dataset.configuration}`;
        configureDeviceStep();
    });

    submitDevices.addEventListener("click", () => {
        const placedShield = placedDevices.find(
            (device) => device.metadata?.type === "Trench shield"
        );
        const requiredDevice = selectedProtection === "Shielding"
            ? Boolean(placedShield)
            : placedDevices.some((device) =>
                ["Ladder", "Egress point"].includes(device.metadata?.type)
            );

        if (!requiredDevice) {
            playWrongAnswerSound();
            setFeedback(
                deviceFeedback,
                selectedProtection === "Shielding"
                    ? "Drag a trench shield into the trench before submitting."
                    : "Place a ladder or egress point before submitting.",
                "incorrect"
            );
            return;
        }

        if (
            selectedProtection === "Shielding" &&
            placedShield.metadata?.prefabName === BIG_SHIELD_NAME &&
            placedShield.metadata?.snapIndex !== 0
        ) {
            playWrongAnswerSound();
            setFeedback(
                deviceFeedback,
                "This shield position is not acceptable. Lower the big shield to Position 1 before submitting.",
                "incorrect"
            );
            return;
        }

        playCorrectAnswerSound();
        setFeedback(
            deviceFeedback,
            "Placement accepted. The protection plan is complete.",
            "correct"
        );
        finalPlanSummary.textContent =
            selectedProtection === "Shielding"
                ? `${selectedConfiguration.dataset.configuration} is positioned in the trench. Confirm daily conditions before entry.`
                : `${selectedConfiguration.dataset.configuration} is paired with worker access or egress. Confirm the slope remains stable before entry.`;
        finalPlanReview.hidden = false;
        protectionStatus.textContent = "Plan complete";
        isComplete = true;
        if (placedShield?.metadata?.dragBehavior) {
            placedShield.metadata.dragBehavior.enabled = false;
        }
        setupCompleteDialog.showModal();
        returnToMainScene.focus();
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
        measurementInputs[0].value = TRENCH_DIMENSIONS_FT.length;
        measurementInputs[1].value = TRENCH_DIMENSIONS_FT.width;
        measurementInputs[2].value = TRENCH_DIMENSIONS_FT.depth;
        measureButton.hidden = true;
        measurements.hidden = false;
        measurementGuides.hidden = false;
        submitMeasurements.hidden = false;
        updateMeasurements();
    });

    submitMeasurements.addEventListener("click", () => {
        playCorrectAnswerSound();
        measurementGuides.hidden = true;
        setFeedback(
            measurementFeedback,
            "Measurements recorded. Select a protection system.",
            "correct"
        );
        protectionSection.classList.remove("is-locked");
        document.querySelectorAll(".protection-option").forEach((option) => {
            option.disabled = false;
        });
        submitMeasurements.disabled = true;
    });

    clearButton.addEventListener("click", () => {
        placedDevices.splice(0).forEach((device) => device.dispose());
        configuredShield = null;
        shieldPlacementGuide.hidden = true;
        shieldTopPlacementGuide.hidden = true;
        updateDeviceCount();
        finalPlanReview.hidden = true;
        setFeedback(deviceFeedback, "", "");
        if (selectedConfiguration) {
            protectionStatus.textContent =
                `${selectedProtection}: ${selectedConfiguration.dataset.configuration}`;
        }
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
    acknowledgeReportButton.addEventListener("click", closeReport);
    reportDialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeReport();
    });

    setupCompleteDialog.addEventListener("cancel", (event) => {
        event.preventDefault();
    });
    returnToMainScene.addEventListener("click", () => {
        setupCompleteDialog.close();
        isOpen = false;
        planner.hidden = true;
        document.body.classList.remove("planner-open");
        shieldPlacementGuide.hidden = true;
        shieldTopPlacementGuide.hidden = true;
        player.setEnabled(true);
        if (previousCamera) scene.activeCamera = previousCamera;
        document.querySelector("#mentorMessage p").textContent =
            "Great job! The workers can now proceed with installing the pipe safely in the trench.";
        canvas.focus();
        onReturnToMainScene();
    });

    const open = () => {
        previousCamera = scene.activeCamera;
        isOpen = true;
        document.body.classList.add("planner-open");
        planner.hidden = false;
        player.setEnabled(false);
        cameraPosition.computeWorldMatrix(true);
        planningCamera.position.copyFrom(cameraPosition.getAbsolutePosition());
        scene.activeCamera = planningCamera;
        measureButton.focus();
    };

    return {
        open,
        isOpen: () => isOpen,
        isComplete: () => isComplete,
    };
}
