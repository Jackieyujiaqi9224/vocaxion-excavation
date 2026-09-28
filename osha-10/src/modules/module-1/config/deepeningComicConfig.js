const publicAssetUrl = (path) => `${import.meta.env?.BASE_URL ?? "/"}${path}`;

export const deepeningComicConfig = Object.freeze({
    id: "module-1-trench-deepening",
    startPageId: "drainage-connection",
    navigation: Object.freeze({
        ariaLabel: "Dialogue navigation",
        previousLabel: "Previous dialogue",
        nextLabel: "Next dialogue",
        previousSymbol: "←",
        nextSymbol: "→",
    }),
    presentation: Object.freeze({
        background: Object.freeze({
            src: publicAssetUrl("Graphic%20Novel/Scenario-01.webp"),
            alt: "An illustrated rural excavation worksite with a trench, excavator, and protective equipment",
        }),
        speaker: Object.freeze({
            label: "JORDAN · SITE SAFETY MENTOR",
            portraitSrc: publicAssetUrl("Graphic%20Novel/Headshot.webp"),
            portraitAlt: "Site safety mentor Jordan",
        }),
        completionMentorMessage:
            "Inspect the changed worksite before anyone enters. Find and put away the tool creating a trip hazard, and move the excavator's raised bucket away from the trench.",
    }),
    pages: Object.freeze([
        Object.freeze({
            id: "drainage-connection",
            type: "dialogue",
            title: "The crew must expose the drainage connection at a lower elevation.",
            nextPageId: "deeper-trench",
        }),
        Object.freeze({
            id: "deeper-trench",
            type: "dialogue",
            title: "We had to deepen the active trench from 4 ft to 6 ft.",
            body: "Soil is still Type A, and the work-zone width stays 15 ft.",
            nextPageId: "entry-decision",
        }),
        Object.freeze({
            id: "entry-decision",
            type: "choice",
            prompt: "Before anyone enters, what should happen next?",
            allowBack: true,
            choices: Object.freeze([
                Object.freeze({
                    id: "a",
                    label: "A. The crew can enter now because the soil is still Type A.",
                    correct: false,
                    retry: true,
                    feedback: "Try again. The depth has changed, so the previous setup must be reevaluated before entry.",
                }),
                Object.freeze({
                    id: "b",
                    label: "B. The setup must be reevaluated because the trench is now 6 ft deep, even though the soil type and work-zone width did not change.",
                    correct: true,
                    complete: true,
                    delayMs: 2200,
                    feedback: "Correct. Reevaluate the setup for the new 6 ft depth before anyone enters.",
                }),
                Object.freeze({
                    id: "c",
                    label: "C. Only the drainage connection matters, so the crew can enter as long as the pipe is exposed.",
                    correct: false,
                    retry: true,
                    feedback: "Try again. Exposing the pipe does not resolve the need to reevaluate the deeper trench before entry.",
                }),
                Object.freeze({
                    id: "d",
                    label: "D. The trench must be backfilled because a 15-ft work-zone can never be used at 6 ft depth.",
                    correct: false,
                    retry: true,
                    feedback: "Try again. The next step is to reevaluate the setup, rather than conclude from work-zone width alone that the trench must be backfilled.",
                }),
            ]),
        }),
    ]),
    timing: Object.freeze({ defaultChoiceAdvanceMs: 500, fadeDurationMs: 900 }),
});
