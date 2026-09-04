const publicAssetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export const utilityMarkingConfig = Object.freeze({
    id: "excavation-811",
    background: Object.freeze({
        src: publicAssetUrl("2D%20Assets/excavationbirdview.jpg"),
        alt: "Bird's-eye view of an excavation worksite",
    }),
    callToAction: Object.freeze({
        badge: "811",
        eyebrow: "BEFORE YOU DIG",
        title: "Call 811 for utility marking",
        description:
            "Underground utilities must be located and marked before excavation begins.",
        buttonLabel: "Call 811",
    }),
    markingInspection: Object.freeze({
        eyebrow: "UTILITIES MARKED",
        title: "Inspect a highlighted red flag",
        help: "Select a flag to identify what the marking means.",
        markerAriaLabel: "Inspect utility marking flag {number}",
        markerColor: "#ef2424",
        positions: Object.freeze([
            Object.freeze({ x: 950, y: 232 }),
            Object.freeze({ x: 990, y: 270 }),
            Object.freeze({ x: 1030, y: 307 }),
            Object.freeze({ x: 1070, y: 345 }),
        ]),
    }),
    utilityQuestion: Object.freeze({
        badge: "?",
        eyebrow: "UTILITY COLOR CODE",
        title: "What utility does a red marking identify?",
        correctAnswerId: "electric",
        correctFeedback:
            "Correct — red markings identify electric power lines.",
        incorrectFeedback:
            "Not quite. Review the marking color and try again.",
        answers: Object.freeze([
            Object.freeze({ id: "electric", label: "Electric power" }),
            Object.freeze({ id: "gas", label: "Gas or petroleum" }),
            Object.freeze({ id: "water", label: "Potable water" }),
            Object.freeze({ id: "sewer", label: "Sewer or drain" }),
        ]),
    }),
    excavationStage: Object.freeze({
        inspectionTitle: "Classify both excavation areas",
        inspectionHelp:
            "Select each area and decide whether to use mechanical excavation or hand digging.",
        badge: "811",
        eyebrow: "SAFE EXCAVATION METHOD",
        questionPrefix: "How should ",
        questionSuffix: " be excavated?",
        zoneActionLabel: "Select excavation method",
        correctFeedback: "Correct method selected.",
        incorrectFeedback:
            "That method is not appropriate for this area. Try again.",
        methods: Object.freeze([
            Object.freeze({
                id: "mechanical",
                label: "Mechanical excavation",
            }),
            Object.freeze({ id: "hand", label: "Hand dig" }),
        ]),
        zones: Object.freeze([
            Object.freeze({
                id: "area-a",
                label: "Area A",
                correctMethodId: "mechanical",
                className: "dig-zone-mechanical",
                x: 364,
                y: 212,
                width: 540,
                height: 153,
            }),
            Object.freeze({
                id: "area-b",
                label: "Area B",
                correctMethodId: "hand",
                className: "dig-zone-hand",
                x: 904,
                y: 212,
                width: 240,
                height: 153,
            }),
        ]),
        toleranceReminder: Object.freeze({
            ariaLabel: "Tolerance zone reminder",
            icon: "↔",
            eyebrow: "TOLERANCE ZONE REMINDER",
            title: "Protect the marked utility",
            description:
                "Use hand digging within the tolerance zone around the red utility markings. Mechanical excavation belongs outside that protected area.",
        }),
    }),
    timing: Object.freeze({
        advanceAfterCorrectMs: 700,
        closeQuizMs: 550,
        completeMs: 800,
    }),
});
