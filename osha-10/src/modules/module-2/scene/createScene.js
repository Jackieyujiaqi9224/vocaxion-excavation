import { Scene } from "@babylonjs/core/scene.js";
import { PhotoDome } from "@babylonjs/core/Helpers/photoDome.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

import { createNavigationArrow } from "../../../shared/gameplay/createNavigationArrow.js";
import {
    hazardIdentificationUiConfig,
    initialHazardDefinitions,
    postStormHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { setupClickableHazard } from "../../../shared/gameplay/setupClickableHazard.js";
import { setupComicChoiceScene } from "../../../shared/gameplay/setupComicChoiceScene.js";
import {
    createMechanicGroup,
    setupGameFlow,
} from "../../../shared/gameplay/setupGameFlow.js";
import { setupHazardHint } from "../../../shared/gameplay/setupHazardHint.js";
import { setupTrenchPlanner } from "../../../shared/gameplay/setupTrenchPlanner.js";
import { setupTrenchObjective } from "../../../shared/gameplay/setupTrenchObjective.js";
import { setupUtilityMarking } from "../../../shared/gameplay/setupUtilityMarking.js";
import { createPlayer } from "../../../shared/player/createPlayer.js";
import { createThirdPersonCamera } from "../../../shared/player/createThirdPersonCamera.js";
import { setupInput } from "../../../shared/player/setupInput.js";
import { setupMovement } from "../../../shared/player/setupMovement.js";
import { setupModuleCompletion } from "../../../shared/ui/setupModuleCompletion.js";
import { excavationGameFlowConfig } from "../config/gameFlowConfig.js";
import { utilityMarkingConfig } from "../config/utilityMarkingConfig.js";
import { stormComicConfig } from "../config/stormComicConfig.js";
import { trenchPlacementConfig } from "../config/trenchPlacementConfig.js";
import { loadExcavationSite } from "../world/loadExcavationSite.js";

const skyboxUrl = `${import.meta.env.BASE_URL}2D%20Assets/Skybox.jpg`;

function createPanoramicSky(scene) {
    const sky = new PhotoDome(
        "panoramicSky",
        skyboxUrl,
        {
            resolution: 32,
            size: 1000,
            useDirectMapping: false,
        },
        scene
    );
    sky.imageMode = PhotoDome.MODE_MONOSCOPIC;
    sky.position.y = 100;
    sky.mesh.isPickable = false;
    sky.mesh.infiniteDistance = true;
    return sky;
}

function configureEnvironment(scene) {
    scene.clearColor = new Color4(0.12, 0.12, 0.14, 1);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.6, 0);

    createPanoramicSky(scene);

    new HemisphericLight("hemisphericLight", Vector3.Up(), scene);

    const sun = new DirectionalLight(
        "sun",
        new Vector3(-0.3, -1, -0.2),
        scene
    );
    sun.position = new Vector3(30, 50, 20);
    sun.intensity = 0.8;
}

function setupInspectorShortcut(scene) {
    let inspectorPromise;

    window.addEventListener("keydown", async (event) => {
        if (event.code !== "KeyI" || event.repeat) return;

        // Loading the inspector also registers scene.debugLayer. With focused
        // Babylon imports it does not exist until this development-only import.
        inspectorPromise ??= import("@babylonjs/inspector");
        await inspectorPromise;

        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            // The inspector is several megabytes and is only needed on demand.
            // Keep it out of the initial gameplay bundle.
            await scene.debugLayer.show();
        }
    });
}

export async function createScene({
    engine,
    canvas,
    scoring,
    registerStartHandler,
    onModuleComplete,
}) {
    const scene = new Scene(engine);
    configureEnvironment(scene);

    // Bootstrap the Babylon world before creating any full-screen mechanic UI.
    // This matches Module 1 and guarantees that the gameplay camera remains the
    // active render camera after the trench planner creates its secondary camera.
    const trench = await loadExcavationSite(scene);
    const player = await createPlayer(scene);
    const { camera, cameraTarget } = createThirdPersonCamera(scene, player);
    scene.activeCamera = camera;
    const input = setupInput(scene);

    const stormScene = setupComicChoiceScene({
        canvas,
        config: stormComicConfig,
        scoring,
    });
    const moduleCompletion = setupModuleCompletion({
        onComplete: onModuleComplete,
        scoring,
    });
    const utilityMarking = setupUtilityMarking({
        canvas,
        config: utilityMarkingConfig,
        scoring,
    });
    const trenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player,
        trench,
        config: trenchPlacementConfig,
        scoring,
    });
    scene.activeCamera = camera;
    const allHazardSystems = [];
    const createHazardSystems = (definitions) => definitions.map(
        (definition) => {
            const system = setupClickableHazard({
                scene,
                canvas,
                definition,
                uiConfig: hazardIdentificationUiConfig,
                scoring,
                isUnavailable: () =>
                    allHazardSystems.some((hazard) => hazard.isOpen()),
            });
            allHazardSystems.push(system);
            return system;
        }
    );
    const siteHazardSystems = createHazardSystems(
        initialHazardDefinitions
    );
    const postStormHazardSystems = createHazardSystems(
        postStormHazardDefinitions
    );
    const siteInspection = createMechanicGroup(siteHazardSystems, {
        id: "site-inspection",
    });
    const postStormInspection = createMechanicGroup(
        postStormHazardSystems,
        { id: "post-storm-inspection" }
    );
    const flowMechanics = {
        utilityMarking,
        siteInspection,
        trenchPlanning: {
            onComplete: trenchPlanner.onComplete,
            isComplete: trenchPlanner.isComplete,
            isBlocking: trenchPlanner.isOpen,
        },
        stormResponse: {
            activate: stormScene.activate,
            onComplete: stormScene.onComplete,
            onBeforeComplete: stormScene.onBeforeClose,
            isBlocking: stormScene.isActive,
        },
        postStormInspection,
        postStormReinspection: {
            onComplete: trenchPlanner.onReinspectionComplete,
            isComplete: trenchPlanner.isReinspectionComplete,
            isBlocking: trenchPlanner.isOpen,
        },
        moduleCompletion,
    };
    const gameFlow = setupGameFlow({
        config: excavationGameFlowConfig,
        mechanics: flowMechanics,
    });
    const navigationArrow = createNavigationArrow(scene, player);

    setupHazardHint({
        scene,
        player,
        navigationArrow,
        hazardSystems: allHazardSystems,
        isUnavailable: gameFlow.isMovementPaused,
    });

    const objectiveActions = {
        openTrenchPlanner: trenchPlanner.open,
        openTrenchReinspection: trenchPlanner.openReinspection,
    };
    const objectiveStates = excavationGameFlowConfig.steps
        .filter((step) => step.objective)
        .map((step) => {
            const openPlanner = objectiveActions[step.objective.actionId];
            if (!openPlanner) {
                throw new Error(
                    `Unknown flow objective action ${step.objective.actionId}`
                );
            }
            return {
                ...step.objective,
                id: step.id,
                openPlanner,
                isEnabled: () => gameFlow.isStep(step.id),
            };
        });
    setupTrenchObjective({
        scene,
        isPlannerOpen: trenchPlanner.isOpen,
        states: objectiveStates,
    });
    setupMovement({
        scene,
        player,
        cameraTarget,
        input,
        isPaused: gameFlow.isMovementPaused,
    });
    if (import.meta.env.DEV) {
        setupInspectorShortcut(scene);
    }
    scene.activeCamera = camera;
    engine.resize();
    registerStartHandler(gameFlow.start);

    return scene;
}
