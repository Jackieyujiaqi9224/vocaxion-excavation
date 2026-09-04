import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";
import { createComicChoiceUi } from "./comic-choice/createComicChoiceUi.js";

function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing comic mechanic element #${id}`);
    return element;
}

function validateConfig(config) {
    if (!config?.id) {
        throw new Error("Comic config needs an id");
    }
    if (!config.pages?.length) {
        throw new Error(`Comic config ${config.id} must contain pages`);
    }

    const pageById = new Map();
    config.pages.forEach((page) => {
        if (!page.id) {
            throw new Error(`Comic config ${config.id} has a page without an id`);
        }
        if (pageById.has(page.id)) {
            throw new Error(`Comic config ${config.id} repeats page ${page.id}`);
        }
        if (page.type !== "dialogue" && page.type !== "choice") {
            throw new Error(`Comic page ${page.id} has invalid type ${page.type}`);
        }
        pageById.set(page.id, page);
    });
    if (!pageById.has(config.startPageId)) {
        throw new Error(
            `Comic config ${config.id} has unknown start page ${config.startPageId}`
        );
    }

    const assertDestination = (sourceId, destinationId) => {
        if (destinationId && !pageById.has(destinationId)) {
            throw new Error(
                `Comic page ${sourceId} links to unknown page ${destinationId}`
            );
        }
    };
    config.pages.forEach((page) => {
        if (page.type === "dialogue") {
            assertDestination(page.id, page.nextPageId);
            if (!page.nextPageId && !page.complete) {
                throw new Error(
                    `Comic dialogue page ${page.id} needs nextPageId or complete`
                );
            }
            return;
        }
        if (!page.choices?.length) {
            throw new Error(`Comic choice page ${page.id} needs choices`);
        }
        const choiceIds = new Set();
        page.choices.forEach((choice) => {
            if (!choice.id) {
                throw new Error(`Comic page ${page.id} has a choice without an id`);
            }
            if (choiceIds.has(choice.id)) {
                throw new Error(
                    `Comic page ${page.id} repeats choice ${choice.id}`
                );
            }
            choiceIds.add(choice.id);
            assertDestination(page.id, choice.nextPageId);
            if (!choice.retry && !choice.nextPageId && !choice.complete) {
                throw new Error(
                    `Comic choice ${page.id}.${choice.id} has no outcome`
                );
            }
            if (
                choice.delayMs !== undefined &&
                (!Number.isFinite(choice.delayMs) || choice.delayMs < 0)
            ) {
                throw new Error(
                    `Comic choice ${page.id}.${choice.id} needs a non-negative delayMs`
                );
            }
            if (choice.retry && choice.correct === true) {
                throw new Error(
                    `Comic choice ${page.id}.${choice.id} cannot be both correct and retryable`
                );
            }
        });
    });

    ["defaultChoiceAdvanceMs", "fadeDurationMs"].forEach((key) => {
        if (!Number.isFinite(config.timing?.[key]) || config.timing[key] < 0) {
            throw new Error(
                `Comic config ${config.id} needs a non-negative timing.${key}`
            );
        }
    });

    const visited = new Set();
    const hasReachableCompletion = (pageId) => {
        if (visited.has(pageId)) return false;
        visited.add(pageId);
        const page = pageById.get(pageId);
        if (page.complete) return true;
        if (page.type === "dialogue") {
            return hasReachableCompletion(page.nextPageId);
        }
        return page.choices.some(
            (choice) =>
                choice.complete ||
                (choice.nextPageId &&
                    hasReachableCompletion(choice.nextPageId))
        );
    };
    if (!hasReachableCompletion(config.startPageId)) {
        throw new Error(
            `Comic config ${config.id} has no reachable completion`
        );
    }

    return pageById;
}

export function setupComicChoiceScene({ canvas, config, scoring }) {
    const pageById = validateConfig(config);
    createComicChoiceUi({ config });
    const screen = requireElement("stormScene");
    const background = requireElement("stormSceneBackground");
    const portrait = requireElement("stormDialogueHeadshot");
    const speakerLabel = screen.querySelector(".storm-dialogue-copy > span");
    const title = requireElement("stormDialogueTitle");
    const body = requireElement("stormDialogueBody");
    const question = requireElement("stormSafetyQuestion");
    const feedback = requireElement("stormAnswerFeedback");
    const previousButton = requireElement("previousStormDialogue");
    const nextButton = requireElement("nextStormDialogue");
    const progress = requireElement("stormDialogueProgress");
    const pageNumberById = new Map(
        config.pages.map((page, index) => [page.id, index + 1])
    );
    const completionListeners = new Set();
    const beforeCloseListeners = new Set();
    const history = [];
    let currentPage = null;
    let isActive = false;
    let isTransitioning = false;
    let activationTimer = null;
    let actionTimer = null;
    let fadeFallbackTimer = null;
    let completionNotified = false;
    let beforeCloseNotified = false;
    const scoredCorrectChoices = new Set();

    const applyPresentation = (page) => {
        const sceneBackground = {
            ...config.presentation.background,
            ...page.background,
        };
        const speaker = {
            ...config.presentation.speaker,
            ...page.speaker,
        };
        background.src = sceneBackground.src;
        background.alt = sceneBackground.alt;
        portrait.src = speaker.portraitSrc;
        portrait.alt = speaker.portraitAlt;
        speakerLabel.textContent = speaker.label;
    };

    const finishClose = () => {
        if (!isTransitioning) return;
        isTransitioning = false;
        window.clearTimeout(fadeFallbackTimer);
        screen.hidden = true;
        document.body.classList.remove("storm-scene-open");
        isActive = false;
        const mentorMessage = config.presentation.completionMentorMessage;
        if (mentorMessage) {
            const mentorCopy = document.querySelector("#mentorMessage p");
            if (mentorCopy) mentorCopy.textContent = mentorMessage;
        }
        if (!completionNotified) {
            completionNotified = true;
            completionListeners.forEach((listener) => listener());
        }
        canvas.focus();
    };

    const closeScene = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        if (!beforeCloseNotified) {
            beforeCloseNotified = true;
            beforeCloseListeners.forEach((listener) => listener());
        }
        screen.classList.remove("is-visible");
        const onTransitionEnd = (event) => {
            if (event.target !== screen || event.propertyName !== "opacity") {
                return;
            }
            screen.removeEventListener("transitionend", onTransitionEnd);
            finishClose();
        };
        screen.addEventListener("transitionend", onTransitionEnd);
        fadeFallbackTimer = window.setTimeout(
            () => {
                screen.removeEventListener("transitionend", onTransitionEnd);
                finishClose();
            },
            config.timing.fadeDurationMs + 100
        );
    };

    const scheduleOutcome = (choice) => {
        const delay =
            choice.delayMs ?? config.timing.defaultChoiceAdvanceMs;
        actionTimer = window.setTimeout(() => {
            actionTimer = null;
            if (choice.complete) {
                closeScene();
            } else {
                history.push(currentPage.id);
                renderPage(choice.nextPageId);
            }
        }, delay);
    };

    const renderChoices = (page) => {
        question.hidden = false;
        const buttons = page.choices.map((choice) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.choice = choice.id;
            button.textContent = choice.label;
            button.addEventListener("click", () => {
                if (actionTimer || isTransitioning) return;
                const choiceKey = `${page.id}.${choice.id}`;
                if (
                    choice.correct === true &&
                    !scoredCorrectChoices.has(choiceKey)
                ) {
                    scoredCorrectChoices.add(choiceKey);
                    playCorrectAnswerSound();
                    scoring.recordCorrect({
                        mechanic: "comic-choice",
                        itemId: choiceKey,
                    });
                }
                if (choice.correct === false) {
                    playWrongAnswerSound();
                    scoring.recordIncorrect({
                        mechanic: "comic-choice",
                        itemId: `${page.id}.${choice.id}`,
                    });
                }
                feedback.textContent = choice.feedback ?? "";
                feedback.className = choice.correct
                    ? "is-correct"
                    : choice.correct === false
                      ? "is-incorrect"
                      : "";
                if (choice.retry) return;
                [...question.querySelectorAll("button")].forEach(
                    (answer) => {
                        answer.disabled = true;
                    }
                );
                previousButton.disabled = true;
                scheduleOutcome(choice);
            });
            return button;
        });
        question.replaceChildren(...buttons, feedback);
    };

    function renderPage(pageId) {
        const page = pageById.get(pageId);
        currentPage = page;
        applyPresentation(page);
        title.textContent = page.type === "choice" ? page.prompt : page.title;
        body.textContent = page.body ?? "";
        body.hidden = !page.body;
        feedback.textContent = "";
        feedback.className = "";
        question.hidden = page.type !== "choice";
        if (page.type === "choice") {
            renderChoices(page);
        } else {
            question.replaceChildren(feedback);
        }
        previousButton.disabled =
            history.length === 0 || page.allowBack === false;
        nextButton.disabled = page.type === "choice";
        nextButton.hidden = page.type === "choice";
        progress.textContent = `${pageNumberById.get(page.id)} / ${config.pages.length}`;
        (page.type === "choice"
            ? question.querySelector("button")
            : nextButton
        )?.focus();
    }

    previousButton.addEventListener("click", () => {
        if (!history.length || actionTimer || isTransitioning) return;
        renderPage(history.pop());
    });
    nextButton.addEventListener("click", () => {
        if (!currentPage || currentPage.type !== "dialogue") return;
        if (currentPage.complete) {
            closeScene();
            return;
        }
        history.push(currentPage.id);
        renderPage(currentPage.nextPageId);
    });

    const show = () => {
        activationTimer = null;
        history.length = 0;
        scoredCorrectChoices.clear();
        completionNotified = false;
        beforeCloseNotified = false;
        isTransitioning = false;
        isActive = true;
        screen.hidden = false;
        document.body.classList.add("storm-scene-open");
        renderPage(config.startPageId);
        screen.getBoundingClientRect();
        screen.classList.add("is-visible");
    };

    return {
        activate(delay = 0) {
            if (isActive || activationTimer !== null) return;
            activationTimer = window.setTimeout(show, delay);
        },
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        onBeforeClose(listener) {
            beforeCloseListeners.add(listener);
            return () => beforeCloseListeners.delete(listener);
        },
        getCurrentPageId: () => currentPage?.id ?? null,
        isActive: () => isActive,
    };
}
