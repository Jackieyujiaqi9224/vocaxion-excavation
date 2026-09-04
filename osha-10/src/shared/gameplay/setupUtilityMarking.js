import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";
import { createUtilityMarkingUi } from "./utility-marking/createUtilityMarkingUi.js";

function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing 811 mechanic element #${id}`);
    return element;
}

function validateConfig(config) {
    const answerIds = new Set(
        config.utilityQuestion.answers.map((answer) => answer.id)
    );
    if (!answerIds.has(config.utilityQuestion.correctAnswerId)) {
        throw new Error(
            `811 config ${config.id} has an unknown correct utility answer`
        );
    }

    const methodIds = new Set(
        config.excavationStage.methods.map((method) => method.id)
    );
    const zoneIds = new Set();
    config.excavationStage.zones.forEach((zone) => {
        if (zoneIds.has(zone.id)) {
            throw new Error(`811 config ${config.id} repeats zone ${zone.id}`);
        }
        zoneIds.add(zone.id);
        if (!methodIds.has(zone.correctMethodId)) {
            throw new Error(
                `811 zone ${zone.id} uses unknown method ${zone.correctMethodId}`
            );
        }
    });
}

function createAnswerButton({ id, label }, dataAttribute, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `utility-answer ${className}`.trim();
    button.dataset[dataAttribute] = id;
    button.textContent = label;
    return button;
}

export function setupUtilityMarking({ canvas, config, scoring }) {
    validateConfig(config);
    createUtilityMarkingUi({ config });

    const screen = requireElement("utilityMarkingScreen");
    const background = requireElement("utilityMarkingBackground");
    const callCard = requireElement("utilityCallCard");
    const callButton = requireElement("call811");
    const inspectionPanel = requireElement("utilityInspectionPanel");
    const inspectionTitle = requireElement("utilityInspectionTitle");
    const inspectionHelp = requireElement("utilityInspectionHelp");
    const toleranceReminder = requireElement("toleranceReminder");
    const flagLayer = requireElement("utilityFlagLayer");
    const zoneLayer = requireElement("digZoneLayer");
    const utilityQuiz = requireElement("utilityQuiz");
    const utilityTitle = requireElement("utilityQuizTitle");
    const utilityFeedback = requireElement("utilityQuizFeedback");
    const utilityAnswerGrid = utilityQuiz.querySelector(
        ".utility-answer-grid"
    );
    const digQuiz = requireElement("digMethodQuiz");
    const digTitle = requireElement("digMethodTitle");
    const digQuizArea = requireElement("digMethodArea");
    const digFeedback = requireElement("digMethodFeedback");
    const digAnswerGrid = digQuiz.querySelector(".utility-answer-grid");
    const call = config.callToAction;
    const inspection = config.markingInspection;
    const utilityQuestion = config.utilityQuestion;
    const excavation = config.excavationStage;
    const timings = config.timing;

    let isActive = false;
    let flagsPlaced = false;
    let selectedZone = null;
    const completedZones = new Set();
    const completionListeners = new Set();

    background.src = config.background.src;
    background.alt = config.background.alt;
    screen.style.setProperty("--utility-marker-color", inspection.markerColor);

    callCard.querySelector(".utility-call-badge").textContent = call.badge;
    callCard.querySelector(".eyebrow").textContent = call.eyebrow;
    requireElement("utilityMarkingTitle").textContent = call.title;
    callCard.querySelector("p").textContent = call.description;
    callButton.textContent = call.buttonLabel;

    inspectionPanel.querySelector(".eyebrow").textContent = inspection.eyebrow;
    inspectionTitle.textContent = inspection.title;
    inspectionHelp.textContent = inspection.help;

    utilityQuiz.querySelector(".utility-call-badge").textContent =
        utilityQuestion.badge;
    utilityQuiz.querySelector(".eyebrow").textContent = utilityQuestion.eyebrow;
    utilityTitle.textContent = utilityQuestion.title;
    utilityAnswerGrid.replaceChildren(
        ...utilityQuestion.answers.map((answer) =>
            createAnswerButton(answer, "utility")
        )
    );
    const utilityAnswers = [...utilityAnswerGrid.children];

    digQuiz.querySelector(".utility-call-badge").textContent = excavation.badge;
    digQuiz.querySelector(".eyebrow").textContent = excavation.eyebrow;
    digTitle.replaceChildren(
        document.createTextNode(excavation.questionPrefix),
        digQuizArea,
        document.createTextNode(excavation.questionSuffix)
    );
    digAnswerGrid.replaceChildren(
        ...excavation.methods.map((method) =>
            createAnswerButton(method, "method", "dig-method-answer")
        )
    );
    const digAnswers = [...digAnswerGrid.children];

    const reminder = excavation.toleranceReminder;
    toleranceReminder.setAttribute("aria-label", reminder.ariaLabel);
    toleranceReminder.querySelector(".tolerance-reminder-icon").textContent =
        reminder.icon;
    toleranceReminder.querySelector(".eyebrow").textContent = reminder.eyebrow;
    toleranceReminder.querySelector("strong").textContent = reminder.title;
    toleranceReminder.querySelector("p").textContent = reminder.description;

    const getImageTransform = () => {
        const scale = Math.max(
            screen.clientWidth / background.naturalWidth,
            screen.clientHeight / background.naturalHeight
        );
        return {
            scale,
            offsetX:
                (screen.clientWidth - background.naturalWidth * scale) / 2,
            offsetY:
                (screen.clientHeight - background.naturalHeight * scale) / 2,
        };
    };

    const positionInteractiveElements = () => {
        if (!background.naturalWidth || !background.naturalHeight) return;
        const { scale, offsetX, offsetY } = getImageTransform();

        [...flagLayer.children].forEach((flag, index) => {
            const position = inspection.positions[index];
            flag.style.left = `${offsetX + position.x * scale}px`;
            flag.style.top = `${offsetY + position.y * scale}px`;
        });
        [...zoneLayer.children].forEach((zoneButton, index) => {
            const zone = excavation.zones[index];
            zoneButton.style.left = `${offsetX + zone.x * scale}px`;
            zoneButton.style.top = `${offsetY + zone.y * scale}px`;
            zoneButton.style.width = `${zone.width * scale}px`;
            zoneButton.style.height = `${zone.height * scale}px`;
        });
    };

    const openUtilityQuiz = () => {
        utilityFeedback.textContent = "";
        utilityFeedback.className = "utility-quiz-feedback";
        utilityQuiz.showModal();
        utilityAnswers[0]?.focus();
    };

    const placeFlags = () => {
        if (flagsPlaced) return;
        flagsPlaced = true;
        inspection.positions.forEach((_, index) => {
            const flag = document.createElement("button");
            flag.type = "button";
            flag.className = "utility-flag";
            flag.setAttribute(
                "aria-label",
                inspection.markerAriaLabel.replace("{number}", index + 1)
            );
            flag.innerHTML =
                '<span class="utility-flag-cloth" aria-hidden="true"></span>' +
                '<span class="utility-flag-pole" aria-hidden="true"></span>';
            flag.addEventListener("click", openUtilityQuiz);
            flagLayer.append(flag);
        });
        callCard.hidden = true;
        inspectionPanel.hidden = false;
        flagLayer.hidden = false;
        positionInteractiveElements();
    };

    const openDigQuiz = (zone) => {
        if (completedZones.has(zone.id)) return;
        selectedZone = zone;
        digQuizArea.textContent = zone.label;
        digFeedback.textContent = "";
        digFeedback.className = "utility-quiz-feedback";
        digQuiz.showModal();
        digAnswers[0]?.focus();
    };

    const createDigZones = () => {
        excavation.zones.forEach((zone) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `dig-zone ${zone.className ?? ""}`.trim();
            button.dataset.zone = zone.id;
            button.innerHTML =
                `<span>${zone.label}</span>` +
                `<strong>${excavation.zoneActionLabel}</strong>`;
            button.addEventListener("click", () => openDigQuiz(zone));
            zoneLayer.append(button);
        });
        positionInteractiveElements();
    };

    const startDigMethodStage = () => {
        utilityQuiz.close();
        flagLayer.classList.add("is-reference");
        zoneLayer.hidden = false;
        toleranceReminder.hidden = false;
        inspectionTitle.textContent = excavation.inspectionTitle;
        inspectionHelp.textContent = excavation.inspectionHelp;
        createDigZones();
    };

    const completeUtilityMarking = () => {
        isActive = false;
        digQuiz.close();
        screen.classList.add("is-complete");
        document.body.classList.remove("utility-marking-open");
        screen.addEventListener(
            "transitionend",
            () => {
                screen.hidden = true;
                canvas.focus();
                completionListeners.forEach((listener) => listener());
            },
            { once: true }
        );
    };

    callButton.addEventListener("click", placeFlags);
    background.addEventListener("load", positionInteractiveElements);
    window.addEventListener("resize", positionInteractiveElements);

    utilityAnswers.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.utility === utilityQuestion.correctAnswerId) {
                playCorrectAnswerSound();
                scoring.recordCorrect({
                    mechanic: "utility-marking",
                    itemId: "utility-color",
                });
                utilityFeedback.textContent = utilityQuestion.correctFeedback;
                utilityFeedback.className =
                    "utility-quiz-feedback is-correct";
                utilityAnswers.forEach((answer) => {
                    answer.disabled = true;
                });
                window.setTimeout(
                    startDigMethodStage,
                    timings.advanceAfterCorrectMs
                );
            } else {
                playWrongAnswerSound();
                scoring.recordIncorrect({
                    mechanic: "utility-marking",
                    itemId: "utility-color",
                });
                utilityFeedback.textContent = utilityQuestion.incorrectFeedback;
                utilityFeedback.className =
                    "utility-quiz-feedback is-incorrect";
            }
        });
    });

    digAnswers.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.method !== selectedZone?.correctMethodId) {
                playWrongAnswerSound();
                scoring.recordIncorrect({
                    mechanic: "utility-marking",
                    itemId: selectedZone?.id,
                });
                digFeedback.textContent = excavation.incorrectFeedback;
                digFeedback.className = "utility-quiz-feedback is-incorrect";
                return;
            }

            playCorrectAnswerSound();
            scoring.recordCorrect({
                mechanic: "utility-marking",
                itemId: selectedZone.id,
            });
            completedZones.add(selectedZone.id);
            const zoneButton = zoneLayer.querySelector(
                `[data-zone="${selectedZone.id}"]`
            );
            const method = excavation.methods.find(
                ({ id }) => id === selectedZone.correctMethodId
            );
            zoneButton.classList.add("is-complete");
            zoneButton.querySelector("strong").textContent = method.label;
            digFeedback.textContent = excavation.correctFeedback;
            digFeedback.className = "utility-quiz-feedback is-correct";

            if (completedZones.size === excavation.zones.length) {
                window.setTimeout(
                    completeUtilityMarking,
                    timings.completeMs
                );
            } else {
                window.setTimeout(() => digQuiz.close(), timings.closeQuizMs);
            }
        });
    });

    return {
        activate() {
            isActive = true;
            screen.hidden = false;
            document.body.classList.add("utility-marking-open");
        },
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        isActive: () => isActive,
    };
}
