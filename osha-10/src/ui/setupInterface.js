function setupInstructionsUI() {
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
        if (event.code === "KeyH" && !event.repeat) setVisible(!isVisible);
    });
}

function setupMentorUI() {
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
            expanded ? "Collapse mentor instructions" : "Expand mentor instructions"
        );
        toggleLabel.textContent = expanded ? "Collapse" : "Expand";
    };

    toggleButton.addEventListener("click", () => setExpanded(!isExpanded));
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyM" && !event.repeat) setExpanded(!isExpanded);
    });
}

function preventGameKeyScrolling() {
    window.addEventListener(
        "keydown",
        (event) => {
            const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
            if (gameKeys.includes(event.code)) event.preventDefault();
        },
        { passive: false }
    );
}

export function setupInterface() {
    setupButtonSounds();
    setupInstructionsUI();
    setupMentorUI();
    preventGameKeyScrolling();
}
import { setupButtonSounds } from "./setupButtonSounds.js";
