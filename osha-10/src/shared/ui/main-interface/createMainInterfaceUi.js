import "./mainInterface.css";
import "../game-dialog/gameDialog.css";
import { appendUi, requireUiElement } from "../dom/appendUi.js";

function createControlRow(row, separatorLabel) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-row";
    const keyGroup = document.createElement("span");
    keyGroup.className = "key-group";
    row.keyGroups.forEach((group, index) => {
        group.forEach((key) => {
            const keyElement = document.createElement("kbd");
            keyElement.textContent = key;
            keyGroup.append(keyElement);
        });
        if (index < row.keyGroups.length - 1) {
            const separator = document.createElement("span");
            separator.textContent = separatorLabel;
            keyGroup.append(separator);
        }
    });
    const action = document.createElement("span");
    action.textContent = row.action;
    wrapper.append(keyGroup, action);
    return wrapper;
}

export function createMainInterfaceUi({ root, config }) {
    appendUi(root, `
        <canvas id="renderCanvas" tabindex="0"></canvas>
        <section id="modulePlaceholder" class="module-placeholder" aria-live="polite" hidden>
            <div class="module-placeholder-card"><span class="eyebrow"></span><h2></h2><p></p></div>
        </section>
        <div id="gameStats" class="game-stats" hidden>
            <div id="gameTimer" class="game-stat-row game-timer" role="timer">
                <span class="game-stat-icon" aria-hidden="true"></span><strong id="gameTimerValue"></strong>
            </div>
            <div id="gameScore" class="game-stat-row game-score" aria-live="polite">
                <span class="game-stat-icon" aria-hidden="true"></span><strong id="gameScoreValue"></strong>
            </div>
        </div>
        <aside id="controlsPanel" class="controls-panel">
            <div class="controls-header">
                <div><span class="eyebrow"></span><h1></h1></div>
                <button id="closeControls" class="icon-button" type="button"></button>
            </div>
            <div class="control-list"></div>
            <p class="controls-hint"><kbd></kbd><span></span></p>
        </aside>
        <button id="showControls" class="show-controls" type="button" aria-controls="controlsPanel" aria-expanded="true">
            <span class="help-icon" aria-hidden="true"></span><span class="show-controls-label"></span><kbd></kbd>
        </button>
        <section id="mentorPanel" class="mentor-panel">
            <div class="mentor-accent" aria-hidden="true"></div>
            <div class="mentor-header">
                <div class="mentor-identity">
                    <span class="mentor-avatar" aria-hidden="true"></span>
                    <div><span class="mentor-role"></span><strong></strong></div>
                </div>
                <button id="toggleMentor" class="mentor-toggle" type="button" aria-controls="mentorMessage" aria-expanded="true">
                    <span class="mentor-toggle-label"></span><span class="mentor-chevron" aria-hidden="true"></span>
                </button>
            </div>
            <div id="mentorMessage" class="mentor-message"><p></p></div>
        </section>
        <dialog id="moduleCompleteDialog" class="hazard-dialog setup-complete-dialog module-complete-dialog" aria-labelledby="moduleCompleteTitle" aria-describedby="moduleCompleteDescription">
            <span class="hazard-dialog-icon" aria-hidden="true"></span><span class="eyebrow"></span>
            <h2 id="moduleCompleteTitle"></h2><p id="moduleCompleteDescription"></p>
            <strong id="moduleFinalScore" class="module-final-score"></strong>
            <button id="exitModule" class="hazard-action" type="button"></button>
        </dialog>
    `);

    const placeholder = requireUiElement("modulePlaceholder");
    placeholder.querySelector(".eyebrow").textContent = config.placeholder.eyebrow;
    placeholder.querySelector("h2").textContent = config.placeholder.title;
    placeholder.querySelector("p").textContent = config.placeholder.description;

    const stats = config.stats;
    const timer = requireUiElement("gameTimer");
    const score = requireUiElement("gameScore");
    timer.setAttribute("aria-label", stats.timerLabel);
    score.setAttribute("aria-label", stats.scoreLabel);
    timer.querySelector(".game-stat-icon").textContent = stats.timerIcon;
    score.querySelector(".game-stat-icon").textContent = stats.scoreIcon;
    requireUiElement("gameTimerValue").textContent = stats.initialTime;
    requireUiElement("gameScoreValue").textContent = String(stats.initialScore);

    const controls = config.controls;
    const controlsPanel = requireUiElement("controlsPanel");
    controlsPanel.setAttribute("aria-label", controls.ariaLabel);
    controlsPanel.querySelector(".eyebrow").textContent = controls.eyebrow;
    controlsPanel.querySelector("h1").textContent = controls.title;
    const closeControls = requireUiElement("closeControls");
    closeControls.textContent = controls.closeSymbol;
    closeControls.setAttribute("aria-label", controls.closeLabel);
    controlsPanel.querySelector(".control-list").replaceChildren(
        ...controls.rows.map((row) => createControlRow(row, controls.keySeparator))
    );
    controlsPanel.querySelector(".controls-hint kbd").textContent = controls.shortcutKey;
    controlsPanel.querySelector(".controls-hint span").textContent = controls.shortcutHelp;
    const showControls = requireUiElement("showControls");
    showControls.querySelector(".help-icon").textContent = controls.helpIcon;
    showControls.querySelector(".show-controls-label").textContent = controls.showLabel;
    showControls.querySelector("kbd").textContent = controls.shortcutKey;

    const mentor = config.mentor;
    const mentorPanel = requireUiElement("mentorPanel");
    mentorPanel.setAttribute("aria-label", mentor.ariaLabel);
    mentorPanel.querySelector(".mentor-avatar").textContent = mentor.avatar;
    mentorPanel.querySelector(".mentor-role").textContent = mentor.role;
    mentorPanel.querySelector(".mentor-identity strong").textContent = mentor.name;
    mentorPanel.querySelector(".mentor-toggle-label").textContent = mentor.collapseLabel;
    mentorPanel.querySelector(".mentor-chevron").textContent = mentor.chevron;
    mentorPanel.querySelector(".mentor-message p").textContent = mentor.message;

    const completion = config.completion;
    const completionDialog = requireUiElement("moduleCompleteDialog");
    completionDialog.querySelector(".hazard-dialog-icon").textContent = completion.icon;
    completionDialog.querySelector(".eyebrow").textContent = completion.eyebrow;
    requireUiElement("moduleCompleteTitle").textContent = completion.title;
    requireUiElement("moduleCompleteDescription").textContent = completion.description;
    requireUiElement("moduleFinalScore").textContent = `${completion.scoreLabel}: ${stats.initialScore}`;
    requireUiElement("moduleFinalScore").dataset.label = completion.scoreLabel;
    requireUiElement("exitModule").textContent = completion.exitLabel;
}
