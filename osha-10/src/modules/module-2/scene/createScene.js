import { Scene } from "@babylonjs/core/scene.js";

import { createHazardInspection } from "../../../shared/gameplay/createHazardInspection.js";
import { setupComicChoiceScene } from "../../../shared/gameplay/setupComicChoiceScene.js";
import { setupTrenchPlanner } from "../../../shared/gameplay/setupTrenchPlanner.js";
import { setupUtilityMarking } from "../../../shared/gameplay/setupUtilityMarking.js";
import { wirePlayableFlow } from "../../../shared/gameplay/wirePlayableFlow.js";
import { createPlayableRuntime } from "../../../shared/player/createPlayableRuntime.js";
import { configurePlayableEnvironment } from "../../../shared/scene/configurePlayableEnvironment.js";
import { setupInspectorShortcut } from "../../../shared/scene/setupInspectorShortcut.js";
import { setupModuleCompletion } from "../../../shared/ui/setupModuleCompletion.js";
import { excavationGameFlowConfig } from "../config/gameFlowConfig.js";
import { utilityMarkingConfig } from "../config/utilityMarkingConfig.js";
import { stormComicConfig } from "../config/stormComicConfig.js";
import { trenchPlacementConfig } from "../config/trenchPlacementConfig.js";
import {
    hazardIdentificationUiConfig,
    initialHazardDefinitions,
    postStormHazardDefinitions,
} from "../gameplay/hazardDefinitions.js";
import { loadExcavationSite } from "../world/loadExcavationSite.js";

export async function createScene({
    engine,
    canvas,
    scoring,
    onModuleComplete,
}) {
    const scene = new Scene(engine);
    configurePlayableEnvironment(scene);

    // Bootstrap the Babylon world before creating any full-screen mechanic UI.
    // This matches Module 1 and guarantees that the gameplay camera remains the
    // active render camera after the trench planner creates its secondary camera.
    const trench = await loadExcavationSite(scene);
    const runtime = await createPlayableRuntime(scene);

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
        player: runtime.player,
        trench,
        config: trenchPlacementConfig,
        scoring,
    });
    scene.activeCamera = runtime.camera;
    const inspection = createHazardInspection({
        scene,
        canvas,
        scoring,
        uiConfig: hazardIdentificationUiConfig,
        groups: {
            siteInspection: initialHazardDefinitions,
            postStormInspection: postStormHazardDefinitions,
        },
    });
    const gameFlow = wirePlayableFlow({
        scene,
        runtime,
        flowConfig: excavationGameFlowConfig,
        hazardSystems: inspection.allSystems,
        mechanics: {
            utilityMarking,
            siteInspection: inspection.mechanics.siteInspection,
            trenchPlanning: trenchPlanner,
            stormResponse: stormScene,
            postStormInspection: inspection.mechanics.postStormInspection,
            postStormReinspection: trenchPlanner.reinspection,
            moduleCompletion,
        },
        objectives: {
            isBlocking: trenchPlanner.isOpen,
            actions: {
                openTrenchPlanner: trenchPlanner.open,
                openTrenchReinspection: trenchPlanner.openReinspection,
            },
        },
    });
    if (import.meta.env.DEV) {
        setupInspectorShortcut(scene);
    }

    return { scene, start: gameFlow.start };
}
