import {
    Color4,
    DirectionalLight,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";

import { createNavigationArrow } from "../gameplay/createNavigationArrow.js";
import {
    initialHazardDefinitions,
    postStormHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { setupClickableHazard } from "../gameplay/setupClickableHazard.js";
import {
    GAME_PHASES,
    setupGameFlow,
} from "../gameplay/setupGameFlow.js";
import { setupHazardHint } from "../gameplay/setupHazardHint.js";
import { setupTrenchObjective } from "../gameplay/setupTrenchObjective.js";
import { setupTrenchPlanner } from "../gameplay/setupTrenchPlanner.js";
import { setupUtilityMarking } from "../gameplay/setupUtilityMarking.js";
import { createPlayer } from "../player/createPlayer.js";
import { createThirdPersonCamera } from "../player/createThirdPersonCamera.js";
import { setupInput } from "../player/setupInput.js";
import { setupMovement } from "../player/setupMovement.js";
import { setupModuleCompletion } from "../ui/setupModuleCompletion.js";
import { setupStormScene } from "../ui/setupStormScene.js";
import { loadExcavationSite } from "../world/loadExcavationSite.js";

function configureEnvironment(scene) {
    scene.clearColor = new Color4(0.12, 0.12, 0.14, 1);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.6, 0);

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

        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            // The inspector is several megabytes and is only needed on demand.
            // Keep it out of the initial gameplay bundle.
            inspectorPromise ??= import("@babylonjs/inspector");
            await inspectorPromise;
            await scene.debugLayer.show();
        }
    });
}

export async function createScene({ engine, canvas }) {
    const scene = new Scene(engine);
    configureEnvironment(scene);
    const stormScene = setupStormScene();
    const moduleCompletion = setupModuleCompletion();
    const utilityMarking = setupUtilityMarking({ canvas });

    const trench = await loadExcavationSite(scene);
    const player = await createPlayer(scene);
    const { cameraTarget } = createThirdPersonCamera(scene, player);
    const input = setupInput(scene);
    const trenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player,
        trench,
    });
    const allHazardSystems = [];
    const createHazardSystems = (definitions) => definitions.map(
        (definition) => {
            const system = setupClickableHazard({
                scene,
                canvas,
                definition,
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
    const gameFlow = setupGameFlow({
        utilityMarking,
        siteHazardSystems,
        postStormHazardSystems,
        trenchPlanner,
        stormScene,
        moduleCompletion,
    });
    const navigationArrow = createNavigationArrow(scene, player);

    setupHazardHint({
        scene,
        player,
        navigationArrow,
        hazardSystems: allHazardSystems,
        isUnavailable: gameFlow.isMovementPaused,
    });

    setupTrenchObjective({
        scene,
        isPlannerOpen: trenchPlanner.isOpen,
        states: [
            {
                id: GAME_PHASES.TRENCH_PLANNING,
                buttonLabel: "Set up trench",
                openPlanner: trenchPlanner.open,
                isEnabled: () =>
                    gameFlow.isPhase(GAME_PHASES.TRENCH_PLANNING),
            },
            {
                id: GAME_PHASES.POST_STORM_REINSPECTION,
                buttonLabel: "Reinspect trench",
                openPlanner: trenchPlanner.openReinspection,
                isEnabled: () =>
                    gameFlow.isPhase(
                        GAME_PHASES.POST_STORM_REINSPECTION
                    ),
                completionMessage:
                    "The storm water has been mitigated. Reinspect the trench walls, shielding, and safe egress before work resumes.",
            },
        ],
    });
    setupMovement({
        scene,
        player,
        cameraTarget,
        input,
        isPaused: gameFlow.isMovementPaused,
    });
    setupInspectorShortcut(scene);
    gameFlow.start();

    return scene;
}
