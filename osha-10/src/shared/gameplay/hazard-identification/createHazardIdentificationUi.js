import "./hazardIdentification.css";
import "../../ui/game-dialog/gameDialog.css";
import { appendUi } from "../../ui/dom/appendUi.js";

function ensureHint(root, config) {
    if (document.getElementById("hazardHint")) return;
    appendUi(root, `
        <button id="hazardHint" class="hazard-hint" type="button">
            <span class="hint-icon" aria-hidden="true"></span><span class="hint-label"></span>
        </button>
    `);
    const hint = document.getElementById("hazardHint");
    hint.setAttribute("aria-label", config.hintAriaLabel);
    hint.querySelector(".hint-icon").textContent = config.hintIcon;
    hint.querySelector(".hint-label").textContent = config.hintLabel;
    hint.dataset.label = config.hintLabel;
}

function ensureDialog(root, config, dialogDefinition) {
    if (document.getElementById(dialogDefinition.elementId)) return;
    appendUi(root, `
        <dialog id="${dialogDefinition.elementId}" class="hazard-dialog" aria-labelledby="${dialogDefinition.titleId}" aria-describedby="${dialogDefinition.descriptionId}">
            <button id="${dialogDefinition.closeButtonId}" class="hazard-dialog-close" type="button"></button>
            <span class="hazard-dialog-icon" aria-hidden="true"></span><span class="eyebrow"></span>
            <h2 id="${dialogDefinition.titleId}"></h2><p id="${dialogDefinition.descriptionId}"></p>
            <button id="${dialogDefinition.actionButtonId}" class="hazard-action" type="button"></button>
        </dialog>
    `);
    const dialog = document.getElementById(dialogDefinition.elementId);
    const close = document.getElementById(dialogDefinition.closeButtonId);
    close.textContent = config.closeSymbol;
    close.setAttribute("aria-label", config.closeLabel);
    dialog.querySelector(".hazard-dialog-icon").textContent = config.dialogIcon;
    dialog.querySelector(".eyebrow").textContent = config.eyebrow;
}

export function createHazardIdentificationUi({
    root = document.getElementById("app") ?? document.body,
    config,
    dialogDefinition,
}) {
    ensureHint(root, config);
    ensureDialog(root, config, dialogDefinition);
}
