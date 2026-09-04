const publicAssetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export const trenchPlacementConfig = Object.freeze({
    id: "roadside-excavation",
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
    trenchDimensions: Object.freeze({ length: 35, width: 6, depth: 8 }),
    sceneNodes: Object.freeze({
        cameraPosition: "Camera Position",
        depthTop: "y1",
        measurementCross: "yx cross",
        widthLeft: "x1",
    }),
    protectionSystems: Object.freeze([
        Object.freeze({
            id: "none",
            label: "None",
            available: true,
            accepted: false,
            rejectionFeedback:
                "No protection is not acceptable. This trench requires a protective system.",
            configurations: Object.freeze([]),
        }),
        Object.freeze({
            id: "sloping",
            label: "Sloping",
            available: true,
            accepted: false,
            rejectionFeedback:
                "Sloping is not acceptable because the excavation is at the road curb. Select Shielding.",
            configurationTitle: "Select a sloping angle",
            configurations: Object.freeze([
                Object.freeze({
                    id: "slope-34",
                    label: "34°",
                    detail: "1.5H : 1V",
                    summary: "34° (1.5H:1V)",
                }),
                Object.freeze({
                    id: "slope-30",
                    label: "30°",
                    detail: "1.75H : 1V",
                    summary: "30° (1.75H:1V)",
                }),
                Object.freeze({
                    id: "slope-27",
                    label: "27°",
                    detail: "2H : 1V",
                    summary: "27° (2H:1V)",
                }),
            ]),
            placement: Object.freeze({
                title: "Place safe access or egress",
                help:
                    "Place a ladder or egress point for worker access, then submit.",
                availableDeviceIds: Object.freeze(["ladder", "egress-point"]),
                requiredDeviceIds: Object.freeze(["ladder", "egress-point"]),
                missingDeviceFeedback:
                    "Place a ladder or egress point before submitting.",
            }),
        }),
        Object.freeze({
            id: "shielding",
            label: "Shielding",
            available: true,
            accepted: true,
            acceptedFeedback:
                "Shielding is an acceptable protection approach. Configure it next.",
            configurationTitle: "Select a trench shield size",
            configurations: Object.freeze([
                Object.freeze({
                    id: "small-shield",
                    label: "8 × 4 ft",
                    detail: "Small shield",
                    summary: "8 ft deep × 4 ft wide shield",
                    prefabName: "Small_Shield",
                    dimensions: Object.freeze({ depth: 8, width: 4 }),
                    rules: Object.freeze({
                        minimumHeightAboveTrench: 2,
                    }),
                }),
                Object.freeze({
                    id: "large-shield",
                    label: "10 × 6 ft",
                    detail: "Big shield",
                    summary: "10 ft deep × 6 ft wide shield",
                    prefabName: "Big_Shield",
                    dimensions: Object.freeze({ depth: 10, width: 6 }),
                    placement: Object.freeze({
                        draggable: true,
                        snapPositionNames: Object.freeze([
                            "Big_Shield_Pos_01",
                            "Big_Shield_Pos_02",
                            "Big_Shield_Pos_03",
                        ]),
                        snapMeasurements: Object.freeze([
                            Object.freeze({ bottom: 0.1, top: 2 }),
                            Object.freeze({ bottom: 3, top: 5 }),
                            Object.freeze({ bottom: 6, top: 8 }),
                        ]),
                    }),
                    rules: Object.freeze({
                        minimumHeightAboveTrench: 2,
                        requiredSnapIndex: 0,
                        invalidPlacementFeedback:
                            "This shield position is not acceptable. Lower the big shield to Position 1 before submitting.",
                    }),
                }),
            ]),
            configurationCorrectFeedback:
                "Correct. The selected trench shield provides the required 2 ft of additional height beyond the 8 ft trench depth, ensuring adequate protective coverage.",
            placement: Object.freeze({
                title: "Place the trench shield",
                help:
                    "Position the selected trench shield in the trench, then submit.",
                availableDeviceIds: Object.freeze([]),
                requireConfiguredProtection: true,
                missingDeviceFeedback:
                    "Place a trench shield in the trench before submitting.",
                acceptedFeedback:
                    "Shield placement accepted. Add safe egress to complete the plan.",
                acceptedStatus: "Shield placed — safe egress required",
            }),
        }),
    ]),
    devices: Object.freeze([
        Object.freeze({
            id: "ladder",
            label: "Ladder",
            detail: "3 × 8 ft",
            symbol: "╫",
            symbolClass: "ladder-symbol",
            geometry: Object.freeze({
                type: "box",
                width: 0.8,
                height: 0.3,
                depth: 5,
            }),
        }),
        Object.freeze({
            id: "hydraulic-shore",
            label: "Hydraulic shore",
            detail: "8 × 3 ft",
            symbol: "↔",
            symbolClass: "shore-symbol",
            geometry: Object.freeze({
                type: "box",
                width: 7,
                height: 0.45,
                depth: 0.6,
            }),
        }),
        Object.freeze({
            id: "egress-point",
            label: "Egress point",
            detail: "Access marker",
            symbol: "↗",
            symbolClass: "egress-symbol",
            color: Object.freeze([0.2, 0.85, 0.45]),
            geometry: Object.freeze({
                type: "cylinder",
                diameter: 1.2,
                height: 0.35,
            }),
        }),
    ]),
    buttons: Object.freeze({
        submitProtection: "Submit protection",
        submitConfiguration: "Submit configuration",
        submitPlacement: "Submit placement",
        addEgress: "Add egress",
        addingEgress: "Adding egress…",
        egressAdded: "Egress added",
        retryEgress: "Try adding egress again",
        returnToScene: "Return to main scene",
    }),
    egress: Object.freeze({
        enabled: true,
        modelUrl: publicAssetUrl("models/SCAFFOLD%20LADDER.glb"),
        loadingFeedback: "Loading scaffold ladder…",
        successFeedback:
            "Safe egress added. The scaffold ladder is positioned for trench access.",
        failureFeedback:
            "The scaffold ladder could not be loaded. Try again.",
    }),
    completion: Object.freeze({
        dialogDelayMs: 1000,
        planTitle: "Trench plan complete",
        dialogTitle: "Excellent work!",
        dialogDescription:
            "You correctly positioned the trench shielding and added safe egress. This excavation setup is complete.",
        mentorMessage:
            "Great job! The workers can now proceed with installing the pipe safely in the trench.",
    }),
});
