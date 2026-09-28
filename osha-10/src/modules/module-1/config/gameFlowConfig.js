export const MODULE_ONE_FLOW_STEPS = Object.freeze({
    UTILITY_MARKING: "utility-marking",
    HAZARD_IDENTIFICATION: "hazard-identification",
    TRENCH_PLACEMENT: "trench-placement",
    TRENCH_DEEPENING: "trench-deepening",
    POST_DEEPENING_INSPECTION: "post-deepening-inspection",
    SECOND_TRENCH_PLACEMENT: "second-trench-placement",
    DUMP_TRUCK_CUE: "dump-truck-cue",
    DUMP_TRUCK_COMIC: "dump-truck-comic",
    COMPLETE: "complete",
});

export const moduleOneGameFlowConfig = Object.freeze({
    id: "module-1-flow",
    startStepId: MODULE_ONE_FLOW_STEPS.UTILITY_MARKING,
    steps: Object.freeze([
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.UTILITY_MARKING,
            mechanicId: "utilityMarking",
            nextStepId: MODULE_ONE_FLOW_STEPS.HAZARD_IDENTIFICATION,
            pauseMovement: true,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.HAZARD_IDENTIFICATION,
            mechanicId: "hazardIdentification",
            nextStepId: MODULE_ONE_FLOW_STEPS.TRENCH_PLACEMENT,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.TRENCH_PLACEMENT,
            mechanicId: "trenchPlacement",
            activation: "manual",
            nextStepId: MODULE_ONE_FLOW_STEPS.TRENCH_DEEPENING,
            objective: Object.freeze({
                actionId: "openTrenchPlanner",
                statusLabel: "Both hazards have been corrected",
                buttonLabel: "Plan trench protection",
                completionMessage:
                    "The immediate hazards are corrected. Review the trench dimensions and soil report, then choose an appropriate protection approach.",
            }),
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.TRENCH_DEEPENING,
            mechanicId: "trenchDeepening",
            nextStepId: MODULE_ONE_FLOW_STEPS.POST_DEEPENING_INSPECTION,
            pauseMovement: true,
            preactivateNextOnBeforeComplete: true,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.POST_DEEPENING_INSPECTION,
            mechanicId: "postDeepeningInspection",
            nextStepId: MODULE_ONE_FLOW_STEPS.SECOND_TRENCH_PLACEMENT,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.SECOND_TRENCH_PLACEMENT,
            mechanicId: "secondTrenchPlacement",
            activation: "manual",
            nextStepId: MODULE_ONE_FLOW_STEPS.DUMP_TRUCK_CUE,
            objective: Object.freeze({
                actionId: "openSecondTrenchPlanner",
                statusLabel: "The changed worksite hazards are corrected",
                buttonLabel: "Review the deeper trench",
                completionMessage: "Review the deeper trench, measure its updated dimensions, then select sloping or shielding.",
            }),
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.DUMP_TRUCK_CUE,
            mechanicId: "dumpTruckCue",
            pauseMovement: true,
            nextStepId: MODULE_ONE_FLOW_STEPS.DUMP_TRUCK_COMIC,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.DUMP_TRUCK_COMIC,
            mechanicId: "dumpTruckComic",
            pauseMovement: true,
            nextStepId: MODULE_ONE_FLOW_STEPS.COMPLETE,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.COMPLETE,
            mechanicId: "moduleCompletion",
        }),
    ]),
});
