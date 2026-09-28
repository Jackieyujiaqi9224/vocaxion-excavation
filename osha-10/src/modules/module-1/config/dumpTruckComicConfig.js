import { deepeningComicConfig } from "./deepeningComicConfig.js";

export const dumpTruckComicConfig = Object.freeze({
    ...deepeningComicConfig,
    id: "module-1-dump-truck",
    startPageId: "truck-starts",
    presentation: Object.freeze({
        ...deepeningComicConfig.presentation,
        background: Object.freeze({
            src: `${import.meta.env?.BASE_URL ?? "/"}Graphic%20Novel/Scenario-02.webp`,
            alt: "Comic illustration of a dump truck beside the excavation worksite",
        }),
        completionMentorMessage: "Move the truck away, keep workers out, and request reassessment.",
    }),
    pages: Object.freeze([
        Object.freeze({
            id: "truck-starts",
            type: "dialogue",
            title: "The dump truck starts up beside the excavation.",
            body: "The engine rumbles as the next worksite scenario begins.",
            nextPageId: "truck-response",
        }),
        Object.freeze({
            id: "truck-response",
            type: "choice",
            prompt: "How should the crew respond to the truck vibration?",
            allowBack: true,
            choices: Object.freeze([
                Object.freeze({
                    id: "continue",
                    label: "Continue because the setup was already approved",
                    correct: false,
                    retry: true,
                    feedback: "Try again. The conditions have changed since the setup was approved.",
                }),
                Object.freeze({
                    id: "move-truck",
                    label: "Move the truck away, keep workers out, and request reassessment",
                    correct: true,
                    complete: true,
                    delayMs: 2200,
                    feedback: "Correct. Move the truck away, keep workers out, and request reassessment before work resumes.",
                }),
                Object.freeze({
                    id: "change-protection",
                    label: "Change protective systems immediately without reassessment",
                    correct: false,
                    retry: true,
                    feedback: "Try again. Request reassessment before deciding whether to change protective systems.",
                }),
            ]),
        }),
    ]),
});
