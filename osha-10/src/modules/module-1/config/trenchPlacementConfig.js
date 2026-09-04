export const trenchPlacementConfig = Object.freeze({
    id: "module-1-small-type-a-trench",
    ui: Object.freeze({
        plannerAriaLabel: "Trench protection planner",
        objective: Object.freeze({
            icon: "✓",
            status: "All hazards are found",
            buttonLabel: "Set up trench",
        }),
        reinspection: Object.freeze({
            eyebrow: "POST-STORM INSPECTION",
            title: "Reinspect the trench",
            instruction:
                "Use the buttons below to inspect each part of the trench. The selected component will be highlighted in the 3D viewport.",
            checklistLabel: "Trench reinspection checklist",
            pendingLabel: "Not inspected",
            completeLabel: "Complete reinspection",
            items: Object.freeze([
                Object.freeze({ number: "1", label: "Inspect trench walls" }),
                Object.freeze({ number: "2", label: "Inspect shielding" }),
                Object.freeze({ number: "3", label: "Inspect safe egress" }),
            ]),
        }),
        report: Object.freeze({
            icon: "▤",
            buttonLabel: "GEOTECHNICAL REPORT",
            requiredStatus:
                "Required — read and acknowledge to unlock trench placement",
            reviewedStatus:
                "Report acknowledged — trench placement unlocked",
            eyebrow: "SITE ASSESSMENT",
            title: "Geotechnical report",
            classificationLabel: "Soil classification",
            closeSymbol: "×",
            closeLabel: "Close geotechnical report",
            acknowledgeLabel: "Return to planner",
        }),
        measurement: Object.freeze({
            number: "01",
            title: "Measure the trench",
            icon: "📏",
            buttonLabel: "Measure trench",
            labels: Object.freeze({
                length: "Length",
                width: "Width",
                depth: "Depth",
            }),
            unit: "ft",
            submitLabel: "Submit measurement",
            recordedFeedback:
                "Measurements recorded. Select a protection system.",
        }),
        protection: Object.freeze({
            number: "02",
            title: "Select protection",
            ariaLabel: "Protection system",
            initialStatus: "None selected",
        }),
        configuration: Object.freeze({
            number: "03",
            title: "Configure protection",
        }),
        devices: Object.freeze({
            number: "04",
            title: "Place safety devices",
            help:
                "Drag a device into the trench. Drag placed devices to reposition them.",
        }),
        egress: Object.freeze({
            number: "05",
            title: "Add safe egress",
            help:
                "Install the scaffold ladder so workers have a safe way to enter and leave the protected trench.",
        }),
        review: Object.freeze({ number: "✓", title: "Plan review" }),
        workspace: Object.freeze({
            viewLabel: "TRENCH VIEW",
            notMeasured: "Not measured",
            widthLabel: "Width",
            depthLabel: "Depth",
            bottomLabel: "Bottom",
            topLabel: "Top",
            emptyTitle: "3D trench workspace",
            emptyHelp:
                "Drag a device here, then drag the mesh to reposition it",
            statusLabel: "Protection system:",
        }),
        completion: Object.freeze({
            icon: "✓",
            eyebrow: "SETUP COMPLETE",
        }),
    }),
    trenchDimensions: Object.freeze({ length: 20, width: 5, depth: 4 }),
    sceneNodes: Object.freeze({
        cameraPosition: "Camera Position_1",
        cameraFieldOfView: 1.4,
        depthTop: "y1_01.001",
        measurementCross: "yx cross_01.001",
        widthLeft: "x1_01.001",
    }),
    geotechnicalReport: Object.freeze({
        soilType: "TYPE A",
        classification: "Cohesive soil with high compressive strength",
        details: Object.freeze([
            Object.freeze({ label: "Trench depth", value: "4 ft" }),
            Object.freeze({ label: "Trench width", value: "5 ft" }),
            Object.freeze({ label: "Trench length", value: "20 ft" }),
            Object.freeze({
                label: "Site condition",
                value: "Stable conditions assumed for this scenario",
            }),
        ]),
        warningTitle: "Competent-person review required",
        warning:
            "This training scenario assumes stable Type A soil and no indication of a potential cave-in. A competent person must verify actual conditions before workers enter.",
    }),
    protectionSystems: Object.freeze([
        Object.freeze({
            id: "none",
            label: "None",
            available: true,
            accepted: true,
            assessment: "preferred",
            completeOnSelection: true,
            acceptedFeedback:
                "Correct. No protective system is needed for this 4 ft trench under the stated stable Type A conditions.",
            acceptedStatus: "No protection required",
            completionSummary:
                "No protective system is required for this 4 ft-deep trench under the stated stable Type A conditions.",
            configurations: Object.freeze([]),
        }),
        Object.freeze({
            id: "sloping",
            label: "Sloping",
            available: true,
            accepted: true,
            assessment: "acceptable",
            completeOnSelection: true,
            acceptedFeedback:
                "Sloping is acceptable, but it increases excavation and restoration costs unnecessarily for this scenario.",
            acceptedStatus: "Sloping accepted — unnecessary added cost",
            completionSummary:
                "Sloping would provide protection, but it is unnecessary for this scenario and adds avoidable excavation and restoration cost.",
            configurations: Object.freeze([]),
        }),
        Object.freeze({
            id: "shielding",
            label: "Shielding",
            available: true,
            accepted: true,
            assessment: "acceptable",
            completeOnSelection: true,
            acceptedFeedback:
                "Shielding is acceptable, but equipment, setup, and handling costs are unnecessary for this scenario.",
            acceptedStatus: "Shielding accepted — unnecessary added cost",
            completionSummary:
                "Shielding would provide protection, but it is unnecessary for this scenario and adds avoidable equipment and setup cost.",
            configurations: Object.freeze([]),
        }),
    ]),
    devices: Object.freeze([]),
    buttons: Object.freeze({
        submitProtection: "Submit protection",
        submitConfiguration: "Submit configuration",
        submitPlacement: "Submit placement",
        addEgress: "Add egress",
        addingEgress: "Adding egress…",
        egressAdded: "Egress added",
        retryEgress: "Try adding egress again",
        returnToScene: "Return to site",
    }),
    egress: Object.freeze({ enabled: false }),
    completion: Object.freeze({
        dialogDelayMs: 1000,
        planTitle: "Protection decision complete",
        dialogTitle: "Protection decision complete",
        dialogDescription:
            "Your protection decision has been recorded for the 4 ft Type A trench.",
        mentorMessage:
            "The 4 ft Type A trench protection review is complete. Continue inspecting the worksite.",
    }),
});
