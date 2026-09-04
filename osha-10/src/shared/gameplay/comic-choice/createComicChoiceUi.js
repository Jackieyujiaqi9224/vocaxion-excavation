import "./comicChoice.css";
import { appendUi, requireUiElement } from "../../ui/dom/appendUi.js";

export function createComicChoiceUi({
    root = document.getElementById("app") ?? document.body,
    config,
}) {
    if (document.getElementById("stormScene")) return;
    appendUi(root, `
        <section id="stormScene" class="storm-scene" aria-labelledby="stormDialogueTitle" tabindex="-1" hidden>
            <img id="stormSceneBackground" class="storm-scene-background" alt="">
            <div class="storm-dialogue">
                <img id="stormDialogueHeadshot" class="storm-dialogue-headshot" alt="">
                <div class="storm-dialogue-copy">
                    <span></span><strong id="stormDialogueTitle"></strong><p id="stormDialogueBody" hidden></p>
                    <div id="stormSafetyQuestion" class="storm-safety-question" hidden><p id="stormAnswerFeedback" aria-live="polite"></p></div>
                </div>
                <nav class="storm-dialogue-navigation">
                    <button id="previousStormDialogue" type="button" disabled></button>
                    <span id="stormDialogueProgress"></span>
                    <button id="nextStormDialogue" type="button"></button>
                </nav>
            </div>
        </section>
    `);
    const navigation = config.navigation;
    const nav = document.querySelector(".storm-dialogue-navigation");
    nav.setAttribute("aria-label", navigation.ariaLabel);
    const previous = requireUiElement("previousStormDialogue");
    previous.textContent = navigation.previousSymbol;
    previous.setAttribute("aria-label", navigation.previousLabel);
    const next = requireUiElement("nextStormDialogue");
    next.textContent = navigation.nextSymbol;
    next.setAttribute("aria-label", navigation.nextLabel);
}
