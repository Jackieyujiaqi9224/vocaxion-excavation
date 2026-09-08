import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

import { createHazardInspection } from "../../../shared/gameplay/createHazardInspection.js";
import { setupTrenchPlanner } from "../../../shared/gameplay/setupTrenchPlanner.js";
import { wirePlayableFlow } from "../../../shared/gameplay/wirePlayableFlow.js";
import { createPlayableRuntime } from "../../../shared/player/createPlayableRuntime.js";
import { configurePlayableEnvironment } from "../../../shared/scene/configurePlayableEnvironment.js";
import { setupInspectorShortcut } from "../../../shared/scene/setupInspectorShortcut.js";
import { setupModuleCompletion } from "../../../shared/ui/setupModuleCompletion.js";
import { moduleOneGameFlowConfig } from "../config/gameFlowConfig.js";
import { trenchPlacementConfig } from "../config/trenchPlacementConfig.js";
import {
    hazardIdentificationUiConfig,
    scenarioOneHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { loadScenarioOne } from "../world/loadScenarioOne.js";

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

    const inspection = createHazardInspection({
        scene,
        canvas,
        scoring,
        uiConfig: hazardIdentificationUiConfig,
        groups: {
            hazardIdentification: scenarioOneHazardDefinitions,
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
    const moduleCompletion = setupModuleCompletion({
        onComplete: onModuleComplete,
        scoring,
    });
    const gameFlow = wirePlayableFlow({
        scene,
        runtime,
        flowConfig: moduleOneGameFlowConfig,
        hazardSystems: inspection.allSystems,
        mechanics: {
            hazardIdentification: inspection.mechanics.hazardIdentification,
            trenchPlacement: trenchPlanner,
            moduleCompletion,
        },
        objectives: {
            isBlocking: trenchPlanner.isOpen,
            actions: {
                openTrenchPlanner: trenchPlanner.open,
            },
        },
    });
    if (import.meta.env.DEV) {
        setupInspectorShortcut(scene);
    }

    return { scene, start: gameFlow.start };
}
