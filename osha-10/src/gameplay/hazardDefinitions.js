export const spoilPileHazardDefinition = Object.freeze({
    id: "spoilPile",
    meshNames: Object.freeze([
        "COL_Hazard_Pile_2_DELETEHAZARD",
        "COL_Hazard_Pile_DELETEHAZARD",
    ]),
    highlightColor: Object.freeze([1, 0.55, 0.05]),
    cursorClass: "hazard-hover",
    resolution: Object.freeze({
        selectedMeshState: Object.freeze({
            positionOffset: Object.freeze([10, 0, 0]),
        }),
    }),
    dialog: Object.freeze({
        elementId: "hazardDialog",
        closeButtonId: "closeHazardDialog",
        titleId: "hazardTitle",
        descriptionId: "hazardDescription",
        actionButtonId: "moveHazard",
        title: "Unsafe spoil pile placement",
        description:
            "This pile is too close to the trench. Excavated material can fall back into the excavation and put workers at risk.",
        actionLabel: "Move it further",
    }),
});

export const coneHazardDefinition = Object.freeze({
    id: "fallenCone",
    meshNames: Object.freeze(["COL_Incorrect_Cone_FIXHAZARD"]),
    highlightColor: Object.freeze([1, 0.55, 0.05]),
    cursorClass: "cone-hazard-hover",
    initialMeshStates: Object.freeze([
        Object.freeze({
            meshName: "COL_Correct_Cone_FIXHAZARD",
            enabled: false,
            visibility: 0,
            isPickable: false,
            checkCollisions: false,
        }),
    ]),
    resolution: Object.freeze({
        selectedMeshState: Object.freeze({
            enabled: false,
            isPickable: false,
            checkCollisions: false,
        }),
        meshStates: Object.freeze([
            Object.freeze({
                meshName: "COL_Correct_Cone_FIXHAZARD",
                enabled: true,
                visibility: 1,
                isPickable: false,
                checkCollisions: true,
            }),
        ]),
    }),
    dialog: Object.freeze({
        elementId: "coneHazardDialog",
        closeButtonId: "closeConeHazardDialog",
        titleId: "coneHazardTitle",
        descriptionId: "coneHazardDescription",
        actionButtonId: "fixConeHazard",
        title: "Fallen safety cone",
        description:
            "This cone has fallen and is no longer clearly marking the hazard area. Set it upright so workers can see the warning.",
        actionLabel: "Fix it",
    }),
});

export const stormWaterHazardDefinition = Object.freeze({
    id: "stormWater",
    meshNames: Object.freeze(["COL_Water"]),
    highlightColor: Object.freeze([0.15, 0.65, 1]),
    cursorClass: "hazard-hover",
    initialMeshStates: Object.freeze([
        Object.freeze({
            meshName: "COL_Water",
            enabled: false,
            visibility: 0,
            isPickable: false,
            checkCollisions: false,
        }),
    ]),
    activationMeshStates: Object.freeze([
        Object.freeze({
            meshName: "COL_Water",
            enabled: true,
            visibility: 1,
            isPickable: true,
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
    }),
    dialog: Object.freeze({
        elementId: "stormWaterHazardDialog",
        closeButtonId: "closeStormWaterHazardDialog",
        titleId: "stormWaterHazardTitle",
        descriptionId: "stormWaterHazardDescription",
        actionButtonId: "mitigateStormWater",
        title: "Storm water accumulation",
        description:
            "Correct — storm water must be mitigated before work can safely resume around the excavation.",
        actionLabel: "Mitigate storm water",
    }),
});

export const initialHazardDefinitions = Object.freeze([
    spoilPileHazardDefinition,
    coneHazardDefinition,
]);

export const postStormHazardDefinitions = Object.freeze([
    stormWaterHazardDefinition,
]);
