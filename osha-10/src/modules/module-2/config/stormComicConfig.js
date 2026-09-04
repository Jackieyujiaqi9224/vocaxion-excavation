const publicAssetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export const stormComicConfig = Object.freeze({
    id: "excavation-storm-response",
    startPageId: "storm-arrives",
    navigation: Object.freeze({
        ariaLabel: "Dialogue navigation",
        previousLabel: "Previous dialogue",
        nextLabel: "Next dialogue",
        previousSymbol: "←",
        nextSymbol: "→",
    }),
    presentation: Object.freeze({
        background: Object.freeze({
            src: publicAssetUrl("Graphic%20Novel/Storm.png"),
            alt: "A storm arriving over the excavation worksite",
        }),
        speaker: Object.freeze({
            label: "JORDAN · SITE SAFETY MENTOR",
            portraitSrc: publicAssetUrl("Graphic%20Novel/Headshot.png"),
            portraitAlt: "Site safety mentor Jordan",
        }),
        completionMentorMessage:
            "Now that the storm has subsided, inspect the site for new hazards. Click each hazardous condition to identify and mitigate it before work resumes.",
    }),
    pages: Object.freeze([
        Object.freeze({
            id: "storm-arrives",
            type: "dialogue",
            title: "A storm has moved in.",
            nextPageId: "safety-decision",
        }),
        Object.freeze({
            id: "safety-decision",
            type: "choice",
            prompt: "What should we do now?",
            allowBack: true,
            choices: Object.freeze([
                Object.freeze({
                    id: "continue",
                    label: "Continue working in the storm",
                    correct: false,
                    retry: true,
                    feedback:
                        "Incorrect. Storm conditions can destabilize the excavation.",
                }),
                Object.freeze({
                    id: "stop",
                    label:
                        "Stop work immediately and evacuate the trench",
                    correct: true,
                    complete: true,
                    delayMs: 600,
                    feedback:
                        "Correct — stop work immediately and evacuate the trench.",
                }),
            ]),
        }),
    ]),
    timing: Object.freeze({
        defaultChoiceAdvanceMs: 500,
        fadeDurationMs: 900,
    }),
});
