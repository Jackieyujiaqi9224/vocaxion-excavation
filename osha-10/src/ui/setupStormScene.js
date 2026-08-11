import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";

const stormImageUrl = `${import.meta.env.BASE_URL}Graphic Novel/Storm.png`;
const headshotImageUrl = `${import.meta.env.BASE_URL}Graphic Novel/Headshot.png`;

export function setupStormScene() {
    const screen = document.getElementById("stormScene");
    const background = document.getElementById("stormSceneBackground");
    const headshot = document.getElementById("stormDialogueHeadshot");
    const title = document.getElementById("stormDialogueTitle");
    const question = document.getElementById("stormSafetyQuestion");
    const feedback = document.getElementById("stormAnswerFeedback");
    const previousButton = document.getElementById("previousStormDialogue");
    const nextButton = document.getElementById("nextStormDialogue");
    const progress = document.getElementById("stormDialogueProgress");
    let isActive = false;
    let transitionTimer = null;
    let returnTimer = null;
    let page = 0;
    let completionNotified = false;
    const completionListeners = new Set();

    background.src = stormImageUrl;
    headshot.src = headshotImageUrl;

    const setPage = (nextPage) => {
        page = Math.max(0, Math.min(1, nextPage));
        const isQuestion = page === 1;
        title.textContent = isQuestion
            ? "What should we do now?"
            : "A storm has moved in.";
        question.hidden = !isQuestion;
        previousButton.disabled = page === 0;
        nextButton.disabled = page === 1;
        progress.textContent = `${page + 1} / 2`;
    };

    previousButton.addEventListener("click", () => setPage(page - 1));
    nextButton.addEventListener("click", () => setPage(page + 1));
    const answerButtons = [
        ...question.querySelectorAll("[data-storm-answer]"),
    ];
    const returnToMainScene = () => {
        returnTimer = null;
        screen.classList.remove("is-visible");
        screen.addEventListener(
            "transitionend",
            () => {
                screen.hidden = true;
                document.body.classList.remove("storm-scene-open");
                isActive = false;
                document.querySelector("#mentorMessage p").textContent =
                    "Now that the storm has subsided, reevaluate the site to determine whether it is still safe to continue working.";
                if (!completionNotified) {
                    completionNotified = true;
                    completionListeners.forEach((listener) => listener());
                }
                document.getElementById("renderCanvas").focus();
            },
            { once: true }
        );
    };

    answerButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const isCorrect = button.dataset.stormAnswer === "stop";
            if (isCorrect) {
                playCorrectAnswerSound();
                feedback.textContent =
                    "Correct — stop work immediately and evacuate the trench.";
                feedback.className = "is-correct";
                answerButtons.forEach((answer) => {
                    answer.disabled = true;
                });
                previousButton.disabled = true;
                returnTimer = window.setTimeout(returnToMainScene, 600);
            } else {
                playWrongAnswerSound();
                feedback.textContent =
                    "Incorrect. Storm conditions can destabilize the excavation.";
                feedback.className = "is-incorrect";
            }
        });
    });

    const show = () => {
        transitionTimer = null;
        isActive = true;
        screen.hidden = false;
        document.body.classList.add("storm-scene-open");
        feedback.textContent = "";
        feedback.className = "";
        answerButtons.forEach((answer) => {
            answer.disabled = false;
        });
        setPage(0);

        // Force the hidden state to render before starting the opacity change.
        screen.getBoundingClientRect();
        screen.classList.add("is-visible");
        nextButton.focus();
    };

    return {
        activate(delay = 1000) {
            if (isActive || transitionTimer !== null) return;
            transitionTimer = window.setTimeout(show, delay);
        },
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        isActive: () => isActive,
    };
}
