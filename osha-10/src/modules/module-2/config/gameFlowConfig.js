export const EXCAVATION_FLOW_STEPS = Object.freeze({
    UTILITY_MARKING: "utility-marking",
    SITE_INSPECTION: "site-inspection",
    TRENCH_PLANNING: "trench-planning",
    STORM_RESPONSE: "storm-response",
    POST_STORM_INSPECTION: "post-storm-inspection",
    POST_STORM_REINSPECTION: "post-storm-reinspection",
    COMPLETE: "complete",
});

export const excavationGameFlowConfig = Object.freeze({
    id: "excavation-module-flow",
    startStepId: EXCAVATION_FLOW_STEPS.UTILITY_MARKING,
    steps: Object.freeze([
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.UTILITY_MARKING,
            mechanicId: "utilityMarking",
            nextStepId: EXCAVATION_FLOW_STEPS.SITE_INSPECTION,
            pauseMovement: true,
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.SITE_INSPECTION,
            mechanicId: "siteInspection",
            nextStepId: EXCAVATION_FLOW_STEPS.TRENCH_PLANNING,
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.TRENCH_PLANNING,
            mechanicId: "trenchPlanning",
            activation: "manual",
            nextStepId: EXCAVATION_FLOW_STEPS.STORM_RESPONSE,
            objective: Object.freeze({
                actionId: "openTrenchPlanner",
                statusLabel: "All hazards are found",
                buttonLabel: "Set up trench",
                completionMessage:
                    "You have identified all the hazards. Now let’s take a look at the trench conditions and make sure it is safe for workers to enter.",
            }),
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.STORM_RESPONSE,
            mechanicId: "stormResponse",
            nextStepId: EXCAVATION_FLOW_STEPS.POST_STORM_INSPECTION,
            activationDelayMs: 1000,
            pauseMovement: true,
            preactivateNextOnBeforeComplete: true,
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.POST_STORM_INSPECTION,
            mechanicId: "postStormInspection",
            nextStepId: EXCAVATION_FLOW_STEPS.POST_STORM_REINSPECTION,
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.POST_STORM_REINSPECTION,
            mechanicId: "postStormReinspection",
            activation: "manual",
            nextStepId: EXCAVATION_FLOW_STEPS.COMPLETE,
            objective: Object.freeze({
                actionId: "openTrenchReinspection",
                statusLabel: "Post-storm hazards mitigated",
                buttonLabel: "Reinspect trench",
                completionMessage:
                    "The storm water has been mitigated and the truck has been moved to a safe distance. Reinspect the trench walls, shielding, and safe egress before work resumes.",
            }),
        }),
        Object.freeze({
            id: EXCAVATION_FLOW_STEPS.COMPLETE,
            mechanicId: "moduleCompletion",
        }),
    ]),
});
