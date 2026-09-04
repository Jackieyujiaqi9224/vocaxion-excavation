export const MODULE_ONE_FLOW_STEPS = Object.freeze({
    HAZARD_IDENTIFICATION: "hazard-identification",
    TRENCH_PLACEMENT: "trench-placement",
    AWAITING_NEXT_EVENT: "awaiting-next-event",
});

export const moduleOneGameFlowConfig = Object.freeze({
    id: "module-1-flow",
    startStepId: MODULE_ONE_FLOW_STEPS.HAZARD_IDENTIFICATION,
    steps: Object.freeze([
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.HAZARD_IDENTIFICATION,
            mechanicId: "hazardIdentification",
            nextStepId: MODULE_ONE_FLOW_STEPS.TRENCH_PLACEMENT,
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.TRENCH_PLACEMENT,
            mechanicId: "trenchPlacement",
            activation: "manual",
            nextStepId: MODULE_ONE_FLOW_STEPS.AWAITING_NEXT_EVENT,
            objective: Object.freeze({
                actionId: "openTrenchPlanner",
                statusLabel: "Both hazards have been corrected",
                buttonLabel: "Plan trench protection",
                completionMessage:
                    "The immediate hazards are corrected. Review the trench dimensions and soil report, then choose an appropriate protection approach.",
            }),
        }),
        Object.freeze({
            id: MODULE_ONE_FLOW_STEPS.AWAITING_NEXT_EVENT,
            mechanicId: "awaitingNextEvent",
        }),
    ]),
});
