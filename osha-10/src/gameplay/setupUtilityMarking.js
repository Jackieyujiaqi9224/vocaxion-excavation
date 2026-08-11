import {
    playCorrectAnswerSound,
    playWrongAnswerSound,
} from "../audio/gameFeedbackSounds.js";

const excavationBirdViewUrl = `${import.meta.env.BASE_URL}2D Assets/excavationbirdview.png`;

const FLAG_SOURCE_POSITIONS = [
    { x: 950, y: 232 },
    { x: 990, y: 270 },
    { x: 1030, y: 307 },
    { x: 1070, y: 345 },
];

const DIG_ZONES = [
    {
        id: "mechanical",
        label: "Area A",
        x: 364,
        y: 212,
        width: 540,
        height: 153,
    },
    {
        id: "hand",
        label: "Area B",
        x: 904,
        y: 212,
        width: 240,
        height: 153,
    },
];

export function setupUtilityMarking({ canvas }) {
    const screen = document.getElementById("utilityMarkingScreen");
    const background = document.getElementById("utilityMarkingBackground");
    const callCard = document.getElementById("utilityCallCard");
    const callButton = document.getElementById("call811");
    const inspectionPanel = document.getElementById("utilityInspectionPanel");
    const inspectionTitle = document.getElementById("utilityInspectionTitle");
    const inspectionHelp = document.getElementById("utilityInspectionHelp");
    const toleranceReminder = document.getElementById("toleranceReminder");
    const flagLayer = document.getElementById("utilityFlagLayer");
    const zoneLayer = document.getElementById("digZoneLayer");
    const utilityQuiz = document.getElementById("utilityQuiz");
    const utilityFeedback = document.getElementById("utilityQuizFeedback");
    const utilityAnswers = [
        ...document.querySelectorAll("#utilityQuiz .utility-answer"),
    ];
    const digQuiz = document.getElementById("digMethodQuiz");
    const digQuizArea = document.getElementById("digMethodArea");
    const digFeedback = document.getElementById("digMethodFeedback");
    const digAnswers = [...document.querySelectorAll(".dig-method-answer")];

    let isActive = true;
    let flagsPlaced = false;
    let selectedZone = null;
    const completedZones = new Set();
    const completionListeners = new Set();

    background.src = excavationBirdViewUrl;
    document.body.classList.add("utility-marking-open");

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
            const position = FLAG_SOURCE_POSITIONS[index];
            flag.style.left = `${offsetX + position.x * scale}px`;
            flag.style.top = `${offsetY + position.y * scale}px`;
        });

        [...zoneLayer.children].forEach((zone, index) => {
            const bounds = DIG_ZONES[index];
            zone.style.left = `${offsetX + bounds.x * scale}px`;
            zone.style.top = `${offsetY + bounds.y * scale}px`;
            zone.style.width = `${bounds.width * scale}px`;
            zone.style.height = `${bounds.height * scale}px`;
        });
    };

    const openUtilityQuiz = () => {
        utilityFeedback.textContent = "";
        utilityFeedback.className = "utility-quiz-feedback";
        utilityQuiz.showModal();
        utilityAnswers[0].focus();
    };

    const placeFlags = () => {
        if (flagsPlaced) return;
        flagsPlaced = true;

        FLAG_SOURCE_POSITIONS.forEach((_, index) => {
            const flag = document.createElement("button");
            flag.type = "button";
            flag.className = "utility-flag";
            flag.setAttribute(
                "aria-label",
                `Inspect utility marking flag ${index + 1}`
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
        digAnswers[0].focus();
    };

    const createDigZones = () => {
        DIG_ZONES.forEach((zone) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `dig-zone dig-zone-${zone.id}`;
            button.dataset.zone = zone.id;
            button.innerHTML =
                `<span>${zone.label}</span>` +
                "<strong>Select excavation method</strong>";
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
        inspectionTitle.textContent = "Classify both excavation areas";
        inspectionHelp.textContent =
            "Select each area and decide whether to use mechanical excavation or hand digging.";
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
            if (button.dataset.utility === "electric") {
                playCorrectAnswerSound();
                utilityFeedback.textContent =
                    "Correct — red markings identify electric power lines.";
                utilityFeedback.className =
                    "utility-quiz-feedback is-correct";
                utilityAnswers.forEach((answer) => {
                    answer.disabled = true;
                });
                window.setTimeout(startDigMethodStage, 700);
            } else {
                playWrongAnswerSound();
                utilityFeedback.textContent =
                    "Not quite. Review the marking color and try again.";
                utilityFeedback.className =
                    "utility-quiz-feedback is-incorrect";
            }
        });
    });

    digAnswers.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.method !== selectedZone?.id) {
                playWrongAnswerSound();
                digFeedback.textContent =
                    "That method is not appropriate for this area. Try again.";
                digFeedback.className =
                    "utility-quiz-feedback is-incorrect";
                return;
            }

            playCorrectAnswerSound();
            completedZones.add(selectedZone.id);
            const zoneButton = zoneLayer.querySelector(
                `[data-zone="${selectedZone.id}"]`
            );
            zoneButton.classList.add("is-complete");
            zoneButton.querySelector("strong").textContent =
                selectedZone.id === "hand"
                    ? "Hand dig"
                    : "Mechanical excavation";

            digFeedback.textContent = "Correct method selected.";
            digFeedback.className = "utility-quiz-feedback is-correct";

            if (completedZones.size === DIG_ZONES.length) {
                window.setTimeout(completeUtilityMarking, 800);
            } else {
                window.setTimeout(() => digQuiz.close(), 550);
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
