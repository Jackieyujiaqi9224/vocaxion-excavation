import {
    Color4,
    DirectionalLight,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";

import { createNavigationArrow } from "../gameplay/createNavigationArrow.js";
import { setupConeHazard } from "../gameplay/setupConeHazard.js";
import { setupHazardIdentification } from "../gameplay/setupHazardIdentification.js";
import { setupHazardHint } from "../gameplay/setupHazardHint.js";
import { setupTrenchInteraction } from "../gameplay/setupTrenchInteraction.js";
import { setupTrenchObjective } from "../gameplay/setupTrenchObjective.js";
import { setupTrenchPlanner } from "../gameplay/setupTrenchPlanner.js";
import { setupUtilityMarking } from "../gameplay/setupUtilityMarking.js";
import { createPlayer } from "../player/createPlayer.js";
import { createThirdPersonCamera } from "../player/createThirdPersonCamera.js";
import { setupInput } from "../player/setupInput.js";
import { setupMovement } from "../player/setupMovement.js";
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
    const utilityMarking = setupUtilityMarking({ canvas });

    const trench = await loadExcavationSite(scene);
    const player = createPlayer(scene);
    const { cameraTarget } = createThirdPersonCamera(scene, player);
    const input = setupInput(scene);
    const trenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player,
        trench,
        onReturnToMainScene: () => stormScene.showAfterDelay(1000),
    });
    const hazards = setupHazardIdentification({
        scene,
        canvas,
        isUnavailable: trenchPlanner.isOpen,
    });
    const coneHazard = setupConeHazard({
        scene,
        canvas,
        isUnavailable: () => trenchPlanner.isOpen() || hazards.isOpen(),
    });
    const navigationArrow = createNavigationArrow(scene, player);

    setupHazardHint({
        scene,
        player,
        navigationArrow,
        hazardSystems: [hazards, coneHazard],
        isUnavailable: () =>
            trenchPlanner.isOpen() || hazards.isOpen() || coneHazard.isOpen(),
    });

    const hazardSystems = [hazards, coneHazard];
    const allHazardsResolved = () =>
        hazardSystems.every(
            (system) => system.getUnresolvedMeshes().length === 0
        );

    setupTrenchObjective({
        scene,
        engine,
        trench,
        hazardSystems,
        openPlanner: trenchPlanner.open,
        isPlannerOpen: trenchPlanner.isOpen,
        isPlannerComplete: trenchPlanner.isComplete,
    });
    setupTrenchInteraction(
        scene,
        player,
        trench,
        trenchPlanner.open,
        () => allHazardsResolved() && !trenchPlanner.isComplete()
    );
    setupMovement({
        scene,
        player,
        cameraTarget,
        input,
        isPaused: () =>
            utilityMarking.isActive() ||
            trenchPlanner.isOpen() ||
            hazards.isOpen() ||
            coneHazard.isOpen() ||
            stormScene.isActive(),
    });
    setupInspectorShortcut(scene);

    return scene;
}
