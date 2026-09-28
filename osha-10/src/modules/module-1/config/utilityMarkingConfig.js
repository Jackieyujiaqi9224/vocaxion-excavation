const publicAssetUrl = (path) => `${(import.meta.env?.BASE_URL ?? "/")}${path}`;

export const utilityMarkingConfig = Object.freeze({
    id: "module-1-811",
    background: Object.freeze({
        src: publicAssetUrl("2D%20Assets/module1_811.webp"),
        alt: "Bird's-eye view of the Module 1 worksite with a white-lined proposed trench",
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
        title: "Inspect a highlighted yellow flag",
        help: "Select a flag to identify what the marking means.",
        markerAriaLabel: "Inspect utility marking flag {number}",
        markerColor: "#facc15",
        line: Object.freeze({
            start: Object.freeze({ x: 1060, y: 175 }),
            end: Object.freeze({ x: 1060, y: 475 }),
        }),
        positions: Object.freeze([
            Object.freeze({ x: 1060, y: 220 }),
            Object.freeze({ x: 1060, y: 280 }),
            Object.freeze({ x: 1060, y: 350 }),
            Object.freeze({ x: 1060, y: 430 }),
        ]),
    }),
    utilityQuestion: Object.freeze({
        badge: "?",
        eyebrow: "UTILITY COLOR CODE",
        title: "What utility does a yellow marking identify?",
        correctAnswerId: "gas",
        correctFeedback:
            "Correct — yellow markings identify gas or petroleum lines.",
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
                x: 440,
                y: 255,
                width: 500,
                height: 137,
            }),
            Object.freeze({
                id: "area-b",
                label: "Area B",
                correctMethodId: "hand",
                className: "dig-zone-hand",
                x: 940,
                y: 255,
                width: 244,
                height: 137,
            }),
        ]),
        toleranceReminder: Object.freeze({
            ariaLabel: "Tolerance zone reminder",
            icon: "↔",
            eyebrow: "TOLERANCE ZONE REMINDER",
            title: "Protect the marked utility",
            description:
                "Use hand digging within the tolerance zone around the yellow gas-line markings. Mechanical excavation belongs outside that protected area.",
        }),
    }),
    timing: Object.freeze({
        advanceAfterCorrectMs: 700,
        closeQuizMs: 550,
        completeMs: 800,
    }),
});
