import { createNavigationArrow } from "./createNavigationArrow.js";
import { setupGameFlow } from "./setupGameFlow.js";
import { setupHazardHint } from "./setupHazardHint.js";
import { setupTrenchObjective } from "./setupTrenchObjective.js";
import { setupMovement } from "../player/setupMovement.js";

function resolveFlowObjectives(flowConfig, actions, isStep) {
    return flowConfig.steps
        .filter((step) => step.objective)
        .map((step) => {
            const openPlanner = actions[step.objective.actionId];
            if (!openPlanner) {
                throw new Error(
                    `Unknown flow objective action ${step.objective.actionId}`
                );
            }
            return {
                ...step.objective,
                id: step.id,
                openPlanner,
                isEnabled: () => isStep(step.id),
            };
        });
}

export function wirePlayableFlow({
    scene,
    runtime,
    flowConfig,
    mechanics,
    hazardSystems = [],
    objectives = null,
}) {
    const gameFlow = setupGameFlow({
        config: flowConfig,
        mechanics,
    });

    if (hazardSystems.length) {
        const navigationArrow = createNavigationArrow(scene, runtime.player);
        setupHazardHint({
            scene,
            player: runtime.player,
            navigationArrow,
            hazardSystems,
            isUnavailable: gameFlow.isMovementPaused,
        });
    }

    const objectiveStates = resolveFlowObjectives(
        flowConfig,
        objectives?.actions ?? {},
        gameFlow.isStep
    );
    if (objectiveStates.length) {
        setupTrenchObjective({
            scene,
            states: objectiveStates,
            isPlannerOpen: objectives?.isBlocking ?? (() => false),
        });
    }

    setupMovement({
        scene,
        player: runtime.player,
        cameraTarget: runtime.cameraTarget,
        input: runtime.input,
        isPaused: gameFlow.isMovementPaused,
    });
    scene.activeCamera = runtime.camera;
    scene.getEngine().resize();

    return gameFlow;
}
