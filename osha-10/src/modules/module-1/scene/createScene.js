import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

import { createHazardInspection } from "../../../shared/gameplay/createHazardInspection.js";
import { setupComicChoiceScene } from "../../../shared/gameplay/setupComicChoiceScene.js";
import { setupTrenchPlanner } from "../../../shared/gameplay/setupTrenchPlanner.js";
import { setupUtilityMarking } from "../../../shared/gameplay/setupUtilityMarking.js";
import { utilityMarkingConfig } from "../config/utilityMarkingConfig.js";
import { wirePlayableFlow } from "../../../shared/gameplay/wirePlayableFlow.js";
import { createPlayableRuntime } from "../../../shared/player/createPlayableRuntime.js";
import { configurePlayableEnvironment } from "../../../shared/scene/configurePlayableEnvironment.js";
import { setupInspectorShortcut } from "../../../shared/scene/setupInspectorShortcut.js";
import { setupModuleCompletion } from "../../../shared/ui/setupModuleCompletion.js";
import { moduleOneGameFlowConfig } from "../config/gameFlowConfig.js";
import { deepeningComicConfig } from "../config/deepeningComicConfig.js";
import { dumpTruckComicConfig } from "../config/dumpTruckComicConfig.js";
import { setupDumpTruckCue } from "../gameplay/setupDumpTruckCue.js";
import { trenchPlacementConfig } from "../config/trenchPlacementConfig.js";
import { secondTrenchPlacementConfig } from "../config/secondTrenchPlacementConfig.js";
import { createShieldPreview } from "../world/createShieldPreview.js";
import {
    hazardIdentificationUiConfig,
    scenarioOneHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { loadScenarioOne } from "../world/loadScenarioOne.js";
import { createPostDeepeningHazardDefinitions } from "../gameplay/postDeepeningHazards.js";

const PLAYER_SPAWN = new Vector3(0, 0, 10);

export async function createScene({
    engine,
    canvas,
    scoring,
    onModuleComplete,
}) {
    const scene = new Scene(engine);
    configurePlayableEnvironment(scene);
    const scenario = await loadScenarioOne(scene);
    const runtime = await createPlayableRuntime(scene, { spawn: PLAYER_SPAWN });
    runtime.player.rotation.y = Math.PI;
    runtime.cameraTarget.rotation.y = Math.PI;
    runtime.camera.position.copyFrom(runtime.player.position.add(
        new Vector3(0, runtime.camera.heightOffset, runtime.camera.radius)
    ));
    runtime.camera.setTarget(runtime.cameraTarget.position);
    const utilityMarking = setupUtilityMarking({ canvas, config: utilityMarkingConfig, scoring });

    const inspection = createHazardInspection({
        scene,
        canvas,
        scoring,
        uiConfig: hazardIdentificationUiConfig,
        groups: {
            hazardIdentification: scenarioOneHazardDefinitions,
            postDeepeningInspection: createPostDeepeningHazardDefinitions(scene, scenario.trench),
        },
    });
    const trenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player: runtime.player,
        trench: scenario.trench,
        config: trenchPlacementConfig,
        scoring,
    });
    const shieldPreview = createShieldPreview(scene);
    const secondTrenchPlanner = setupTrenchPlanner({
        scene,
        canvas,
        player: runtime.player,
        trench: scenario.trench,
        config: secondTrenchPlacementConfig,
        scoring,
        uiIdPrefix: "second-trench",
        onProtectionSelected: shieldPreview.selectProtection,
        onConfigurationSelected: shieldPreview.selectSize,
        validatePlacement: shieldPreview.validatePlacement,
        onPlacementAccepted: shieldPreview.finishPlacement,
        getShieldMeasurements: shieldPreview.getMeasurements,
        onConfigurationAccepted: (protectionId, configurationId) => {
            if (protectionId === "shielding") shieldPreview.startPlacement(configurationId);
            if (protectionId === "sloping" && configurationId === "slope-53") {
                scenario.slopeTrench();
            }
        },
    });
    const moduleCompletion = setupModuleCompletion({
        onComplete: onModuleComplete,
        scoring,
    });
    const trenchDeepening = setupComicChoiceScene({
        canvas,
        config: deepeningComicConfig,
        scoring,
    });
    trenchDeepening.onBeforeComplete(scenario.deepenTrench);
    const dumpTruckCue = setupDumpTruckCue(scene);
    const dumpTruckComic = setupComicChoiceScene({
        canvas,
        config: dumpTruckComicConfig,
        scoring,
        uiIdPrefix: "dump-truck",
    });
    const gameFlow = wirePlayableFlow({
        scene,
        runtime,
        flowConfig: moduleOneGameFlowConfig,
        hazardSystems: inspection.allSystems,
        mechanics: {
            utilityMarking,
            hazardIdentification: inspection.mechanics.hazardIdentification,
            trenchPlacement: trenchPlanner,
            secondTrenchPlacement: secondTrenchPlanner,
            trenchDeepening,
            dumpTruckCue,
            dumpTruckComic,
            postDeepeningInspection: inspection.mechanics.postDeepeningInspection,
            moduleCompletion,
        },
        objectives: {
            isBlocking: () => trenchPlanner.isOpen() || secondTrenchPlanner.isOpen(),
            actions: {
                openTrenchPlanner: trenchPlanner.open,
                openSecondTrenchPlanner: secondTrenchPlanner.open,
            },
        },
    });
    if (import.meta.env.DEV) {
        setupInspectorShortcut(scene);
    }

    return { scene, start: gameFlow.start };
}
