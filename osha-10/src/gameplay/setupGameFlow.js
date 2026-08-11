export const GAME_PHASES = Object.freeze({
    UTILITY_MARKING: "utilityMarking",
    SITE_INSPECTION: "siteInspection",
    TRENCH_PLANNING: "trenchPlanning",
    STORM_RESPONSE: "stormResponse",
    POST_STORM_INSPECTION: "postStormInspection",
    POST_STORM_REINSPECTION: "postStormReinspection",
    COMPLETE: "complete",
});

const NEXT_PHASE = Object.freeze({
    [GAME_PHASES.UTILITY_MARKING]: GAME_PHASES.SITE_INSPECTION,
    [GAME_PHASES.SITE_INSPECTION]: GAME_PHASES.TRENCH_PLANNING,
    [GAME_PHASES.TRENCH_PLANNING]: GAME_PHASES.STORM_RESPONSE,
    [GAME_PHASES.STORM_RESPONSE]: GAME_PHASES.POST_STORM_INSPECTION,
    [GAME_PHASES.POST_STORM_INSPECTION]:
        GAME_PHASES.POST_STORM_REINSPECTION,
    [GAME_PHASES.POST_STORM_REINSPECTION]: GAME_PHASES.COMPLETE,
});

export function setupGameFlow({
    utilityMarking,
    siteHazardSystems,
    postStormHazardSystems,
    trenchPlanner,
    stormScene,
    moduleCompletion,
}) {
    let currentPhase = null;
    let hasStarted = false;

    const allHazardSystems = [
        ...siteHazardSystems,
        ...postStormHazardSystems,
    ];
    const anyHazardOpen = () =>
        allHazardSystems.some((system) => system.isOpen());
    const allComplete = (systems) =>
        systems.every((system) => system.isComplete());

    const exitPhase = (phase) => {
        if (phase === GAME_PHASES.SITE_INSPECTION) {
            siteHazardSystems.forEach((system) => system.deactivate());
        }
        if (phase === GAME_PHASES.POST_STORM_INSPECTION) {
            postStormHazardSystems.forEach((system) => system.deactivate());
        }
    };

    const enterPhase = (phase) => {
        if (phase === GAME_PHASES.UTILITY_MARKING) {
            utilityMarking.activate();
        }
        if (phase === GAME_PHASES.SITE_INSPECTION) {
            siteHazardSystems.forEach((system) => system.activate());
        }
        if (phase === GAME_PHASES.STORM_RESPONSE) {
            stormScene.activate(1000);
        }
        if (phase === GAME_PHASES.POST_STORM_INSPECTION) {
            postStormHazardSystems.forEach((system) => system.activate());
        }
        if (phase === GAME_PHASES.COMPLETE) {
            moduleCompletion.activate();
        }
    };

    const transitionTo = (nextPhase) => {
        if (currentPhase === nextPhase) return;
        if (
            currentPhase !== null &&
            NEXT_PHASE[currentPhase] !== nextPhase
        ) {
            throw new Error(
                `Invalid game-flow transition: ${currentPhase} → ${nextPhase}`
            );
        }

        exitPhase(currentPhase);
        currentPhase = nextPhase;
        enterPhase(currentPhase);
    };

    utilityMarking.onComplete(() => {
        transitionTo(GAME_PHASES.SITE_INSPECTION);
    });
    siteHazardSystems.forEach((system) => {
        system.onComplete(() => {
            if (allComplete(siteHazardSystems)) {
                transitionTo(GAME_PHASES.TRENCH_PLANNING);
            }
        });
    });
    trenchPlanner.onComplete(() => {
        transitionTo(GAME_PHASES.STORM_RESPONSE);
    });
    stormScene.onComplete(() => {
        transitionTo(GAME_PHASES.POST_STORM_INSPECTION);
        if (allComplete(postStormHazardSystems)) {
            transitionTo(GAME_PHASES.POST_STORM_REINSPECTION);
        }
    });
    postStormHazardSystems.forEach((system) => {
        system.onComplete(() => {
            if (allComplete(postStormHazardSystems)) {
                transitionTo(GAME_PHASES.POST_STORM_REINSPECTION);
            }
        });
    });
    trenchPlanner.onReinspectionComplete(() => {
        transitionTo(GAME_PHASES.COMPLETE);
    });

    return {
        start() {
            if (hasStarted) return;
            hasStarted = true;
            transitionTo(GAME_PHASES.UTILITY_MARKING);
        },
        getPhase: () => currentPhase,
        isPhase: (phase) => currentPhase === phase,
        isMovementPaused: () =>
            currentPhase === GAME_PHASES.UTILITY_MARKING ||
            currentPhase === GAME_PHASES.STORM_RESPONSE ||
            trenchPlanner.isOpen() ||
            anyHazardOpen(),
    };
}
