import { Scene } from "@babylonjs/core/scene.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { PhotoDome } from "@babylonjs/core/Helpers/photoDome.js";

import { createNavigationArrow } from "../../../shared/gameplay/createNavigationArrow.js";
import { setupClickableHazard } from "../../../shared/gameplay/setupClickableHazard.js";
import {
    createMechanicGroup,
    setupGameFlow,
} from "../../../shared/gameplay/setupGameFlow.js";
import { setupHazardHint } from "../../../shared/gameplay/setupHazardHint.js";
import { setupTrenchObjective } from "../../../shared/gameplay/setupTrenchObjective.js";
import { setupTrenchPlanner } from "../../../shared/gameplay/setupTrenchPlanner.js";
import { createPlayer } from "../../../shared/player/createPlayer.js";
import { createThirdPersonCamera } from "../../../shared/player/createThirdPersonCamera.js";
import { setupInput } from "../../../shared/player/setupInput.js";
import { setupMovement } from "../../../shared/player/setupMovement.js";
import { moduleOneGameFlowConfig } from "../config/gameFlowConfig.js";
import { trenchPlacementConfig } from "../config/trenchPlacementConfig.js";
import {
    hazardIdentificationUiConfig,
    scenarioOneHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { loadScenarioOne } from "../world/loadScenarioOne.js";

const skyboxUrl = `${import.meta.env.BASE_URL}2D%20Assets/Skybox.jpg`;
const PLAYER_SPAWN = new Vector3(0, 0, 10);

function configureEnvironment(scene) {
    scene.clearColor = new Color4(0.12, 0.12, 0.14, 1);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.6, 0);

    const sky = new PhotoDome(
        "moduleOnePanoramicSky",
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

    new HemisphericLight("moduleOneHemisphericLight", Vector3.Up(), scene);
    const sun = new DirectionalLight(
        "moduleOneSun",
        new Vector3(-0.3, -1, -0.2),
        scene
    );
    sun.position = new Vector3(30, 50, 20);
    sun.intensity = 0.8;
}

export async function createScene({
    engine,
    canvas,
    scoring,
    registerStartHandler,
}) {
    const scene = new Scene(engine);
    configureEnvironment(scene);
    const scenario = await loadScenarioOne(scene);

    const player = await createPlayer(scene, { spawn: PLAYER_SPAWN });
    const { camera, cameraTarget } = createThirdPersonCamera(scene, player);
    scene.activeCamera = camera;
    const input = setupInput(scene);

    const hazardSystems = [];
    scenarioOneHazardDefinitions.forEach((definition) => {
        const hazardSystem = setupClickableHazard({
            scene,
            canvas,
            definition,
            uiConfig: hazardIdentificationUiConfig,
            scoring,
            isUnavailable: () =>
                hazardSystems.some((hazard) => hazard.isOpen()),
        });
        hazardSystems.push(hazardSystem);
    });
    const hazardIdentification = createMechanicGroup(hazardSystems, {
        id: "module-1-hazard-identification",
    });
    const trenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player,
        trench: scenario.trench,
        config: trenchPlacementConfig,
        scoring,
    });
    const gameFlow = setupGameFlow({
        config: moduleOneGameFlowConfig,
        mechanics: {
            hazardIdentification,
            trenchPlacement: {
                onComplete: trenchPlanner.onComplete,
                isComplete: trenchPlanner.isComplete,
                isBlocking: trenchPlanner.isOpen,
            },
            awaitingNextEvent: {},
        },
    });

    const navigationArrow = createNavigationArrow(scene, player);
    setupHazardHint({
        scene,
        player,
        navigationArrow,
        hazardSystems,
        isUnavailable: gameFlow.isMovementPaused,
    });
    const objectiveActions = {
        openTrenchPlanner: trenchPlanner.open,
    };
    const objectiveStates = moduleOneGameFlowConfig.steps
        .filter((step) => step.objective)
        .map((step) => ({
            ...step.objective,
            id: step.id,
            openPlanner: objectiveActions[step.objective.actionId],
            isEnabled: () => gameFlow.isStep(step.id),
        }));
    setupTrenchObjective({
        scene,
        states: objectiveStates,
        isPlannerOpen: trenchPlanner.isOpen,
    });
    setupMovement({
        scene,
        player,
        cameraTarget,
        input,
        isPaused: gameFlow.isMovementPaused,
    });

    registerStartHandler(gameFlow.start);
    return scene;
}
