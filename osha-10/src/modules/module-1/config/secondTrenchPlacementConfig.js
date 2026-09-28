import { trenchPlacementConfig } from "./trenchPlacementConfig.js";

export const secondTrenchPlacementConfig = Object.freeze({
    ...trenchPlacementConfig,
    id: "module-1-deeper-trench",
    measurementOnly: false,
    requirePreferredProtection: false,
    ui: Object.freeze({
        ...trenchPlacementConfig.ui,
        plannerAriaLabel: "Deeper trench protection planner",
        measurement: Object.freeze({
            ...trenchPlacementConfig.ui.measurement,
            buttonLabel: "Measure trench depth",
        }),
        workspace: Object.freeze({
            ...trenchPlacementConfig.ui.workspace,
            emptyTitle: "Deeper trench",
            emptyHelp: "Review the soil report, measure the updated trench, then select protection.",
            statusLabel: "Protection system:",
        }),
        protection: Object.freeze({
            ...trenchPlacementConfig.ui.protection,
            initialStatus: "None selected",
        }),
    }),
    trenchDimensions: Object.freeze({ length: 20, width: 5, depth: 6 }),
    sceneNodes: Object.freeze({
        ...trenchPlacementConfig.sceneNodes,
        cameraPosition: "Camera Position_2",
        depthTop: "y1_02",
        measurementCross: "yx cross_02",
        widthLeft: "x1_02",
    }),
    geotechnicalReport: Object.freeze({
        ...trenchPlacementConfig.geotechnicalReport,
        details: Object.freeze([
            Object.freeze({ label: "Trench depth", value: "6 ft" }),
            Object.freeze({ label: "Trench width", value: "5 ft" }),
            Object.freeze({ label: "Trench length", value: "20 ft" }),
            Object.freeze({ label: "Work-zone width", value: "15 ft" }),
        ]),
    }),
    protectionSystems: Object.freeze([
        Object.freeze({
            id: "none",
            label: "None",
            available: true,
            accepted: false,
            rejectionFeedback: "Select sloping or shielding for this deeper trench scenario.",
            configurations: Object.freeze([]),
        }),
        ...["sloping", "shielding"].map((id) => {
            const label = id === "sloping" ? "Sloping" : "Shielding";
            return Object.freeze({
                id,
                label,
                available: true,
                accepted: true,
                completeOnSelection: false,
                completeOnConfiguration: id === "sloping",
                requirePreferredConfiguration: id === "shielding",
                configurationTitle: id === "sloping" ? "Choose the sloping angle" : "Select a shield size",
                configurationCorrectFeedback: id === "sloping"
                    ? "Correct. Apply the 53-degree slope."
                    : "Correct. Drag the small shield down into place, then submit placement.",
                placement: id === "shielding" ? Object.freeze({
                    external: true,
                    availableDeviceIds: Object.freeze([]),
                    requiredDeviceIds: Object.freeze([]),
                    title: "Place the small shield",
                    help: "Drag the small shield down into the trench until it snaps into place, then submit.",
                    acceptedFeedback: "The small shield has been placed in the trench.",
                }) : undefined,
                acceptedFeedback: `${label} is an accepted protection choice for this scenario.`,
                acceptedStatus: `${label} accepted`,
                completionSummary: `${label} selected for the 6 ft Type A trench.`,
                configurations: Object.freeze(id === "sloping"
                    ? [53, 45, 34].map((angle) => Object.freeze({
                        id: `slope-${angle}`,
                        label: `${angle} degrees`,
                        summary: `${angle} degrees`,
                        detail: "",
                        accepted: angle === 53,
                        rejectionFeedback: "That is not the correct angle for this activity. Try again.",
                        completionSummary: "53-degree sloping applied to the deeper trench.",
                    }))
                    : ["small", "large"].map((size) => Object.freeze({
                        id: `shield-${size}`,
                        label: size === "small" ? "Small" : "Large",
                        summary: `${size} shield`,
                        detail: size === "small"
                            ? "8 ft long × 8 ft wall height × 4 ft clear inside width"
                            : "12 ft long × 10 ft wall height × 6 ft clear inside width",
                        assessment: size === "small" ? "preferred" : "acceptable",
                        acceptedFeedback: "The large shield is acceptable, but oversized for this scenario. Select Small to continue this activity.",
                        completionSummary: `${size === "small" ? "Small" : "Large"} shield selected for the deeper trench.`,
                    }))),
            });
        }),
    ]),
    egress: Object.freeze({
        enabled: true,
        sceneNodeName: "Scaffold_Ladder",
        sceneNodeNamesByProtection: Object.freeze({
            sloping: "Scaffold_Ladder_Slope",
            shielding: "Scaffold_Ladder",
        }),
        loadingFeedback: "Adding the scaffold ladder…",
        successFeedback: "Scaffold ladder added for egress.",
        failureFeedback: "The scaffold ladder could not be added. Try again.",
    }),
    completion: Object.freeze({
        dialogDelayMs: 1000,
        planTitle: "Deeper trench setup complete",
        dialogTitle: "Protection and egress complete",
        dialogDescription: "The deeper trench protection is configured and the scaffold ladder has been added for egress.",
        mentorMessage: "The deeper trench protection and egress setup is complete.",
    }),
});
