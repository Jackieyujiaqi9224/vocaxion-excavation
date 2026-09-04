export const hazardIdentificationUiConfig = Object.freeze({
    hintAriaLabel: "Show direction to the next hazard",
    hintIcon: "⌕",
    hintLabel: "Hint",
    dialogIcon: "!",
    eyebrow: "HAZARD IDENTIFIED",
    closeSymbol: "×",
    closeLabel: "Close hazard notice",
});

export const damagedCableHazardDefinition = Object.freeze({
    id: "damagedCable",
    meshNames: Object.freeze(["Bad Cable"]),
    highlightColor: Object.freeze([1, 0.55, 0.05]),
    cursorClass: "hazard-hover",
    resolution: Object.freeze({
        selectedMeshState: Object.freeze({
            enabled: false,
            visibility: 0,
            isPickable: false,
            checkCollisions: false,
        }),
    }),
    dialog: Object.freeze({
        elementId: "hazardDialog",
        closeButtonId: "closeHazardDialog",
        titleId: "hazardTitle",
        descriptionId: "hazardDescription",
        actionButtonId: "moveHazard",
        title: "Damaged electrical cable",
        description:
            "This damaged cable must be removed from service. Exposed or compromised electrical wiring can cause electric shock, burns, or a fire.",
        actionLabel: "Remove damaged cable",
    }),
});

export const missingHighVisibilityVestHazardDefinition = Object.freeze({
    id: "missingHighVisibilityVest",
    meshNames: Object.freeze(["Undressed"]),
    highlightColor: Object.freeze([1, 0.55, 0.05]),
    cursorClass: "hazard-hover",
    initialMeshStates: Object.freeze([
        Object.freeze({
            meshName: "Dressed",
            enabled: false,
            visibility: 0,
            isPickable: false,
            checkCollisions: false,
        }),
    ]),
    resolution: Object.freeze({
        selectedMeshState: Object.freeze({
            enabled: false,
            visibility: 0,
            isPickable: false,
            checkCollisions: false,
        }),
        meshStates: Object.freeze([
            Object.freeze({
                meshName: "Dressed",
                enabled: true,
                visibility: 1,
                isPickable: false,
                checkCollisions: false,
            }),
        ]),
    }),
    dialog: Object.freeze({
        elementId: "hazardDialog",
        closeButtonId: "closeHazardDialog",
        titleId: "hazardTitle",
        descriptionId: "hazardDescription",
        actionButtonId: "moveHazard",
        title: "Missing high-visibility vest",
        description:
            "This worker is not wearing high-visibility clothing and may be difficult for equipment operators and drivers to see.",
        actionLabel: "Provide high-visibility vest",
    }),
});

export const scenarioOneHazardDefinitions = Object.freeze([
    damagedCableHazardDefinition,
    missingHighVisibilityVestHazardDefinition,
]);
