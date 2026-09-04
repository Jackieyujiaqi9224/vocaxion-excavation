import { setupButtonSounds } from "./setupButtonSounds.js";

const isEditableTarget = (target) =>
    target instanceof Element &&
    Boolean(target.closest("input, textarea, select, [contenteditable='true']"));

function setupInstructionsUI(config) {
    const panel = document.getElementById("controlsPanel");
    const closeButton = document.getElementById("closeControls");
    const showButton = document.getElementById("showControls");
    let isVisible = true;

    const setVisible = (visible) => {
        isVisible = visible;
        panel.classList.toggle("is-hidden", !visible);
        showButton.classList.toggle("is-visible", !visible);
        showButton.setAttribute("aria-expanded", String(visible));
    };

    closeButton.addEventListener("click", () => setVisible(false));
    showButton.addEventListener("click", () => setVisible(true));
    window.addEventListener("keydown", (event) => {
        if (isEditableTarget(event.target)) return;
        if (event.code === "KeyH" && !event.repeat) setVisible(!isVisible);
    });
}

function setupMentorUI(config) {
    const panel = document.getElementById("mentorPanel");
    const toggleButton = document.getElementById("toggleMentor");
    const toggleLabel = toggleButton.querySelector(".mentor-toggle-label");
    let isExpanded = true;

    const setExpanded = (expanded) => {
        isExpanded = expanded;
        panel.classList.toggle("is-collapsed", !expanded);
        toggleButton.setAttribute("aria-expanded", String(expanded));
        toggleButton.setAttribute(
            "aria-label",
            expanded ? config.collapseAriaLabel : config.expandAriaLabel
        );
        toggleLabel.textContent = expanded
            ? config.collapseLabel
            : config.expandLabel;
    };

    toggleButton.addEventListener("click", () => setExpanded(!isExpanded));
    window.addEventListener("keydown", (event) => {
        if (isEditableTarget(event.target)) return;
        if (event.code === "KeyM" && !event.repeat) setExpanded(!isExpanded);
    });
}

function preventGameKeyScrolling() {
    window.addEventListener(
        "keydown",
        (event) => {
            if (isEditableTarget(event.target)) return;
            const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
            if (gameKeys.includes(event.code)) event.preventDefault();
        },
        { passive: false }
    );
}

export function setupInterface(config) {
    setupButtonSounds();
    setupInstructionsUI(config.controls);
    setupMentorUI(config.mentor);
    preventGameKeyScrolling();
}
