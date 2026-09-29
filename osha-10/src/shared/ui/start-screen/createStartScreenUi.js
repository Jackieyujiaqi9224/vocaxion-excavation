import "./startScreen.css";
import { appendUi, requireUiElement } from "../dom/appendUi.js";

export function createStartScreenUi({ root, config }) {
    appendUi(root, `
        <section id="startScreen" class="start-screen" aria-labelledby="startScreenTitle" aria-busy="true">
            <img class="start-screen-background" alt="" width="1600" height="900" fetchpriority="high">
            <div class="start-screen-content">
                <h1 id="startScreenTitle"></h1>
                <button id="startGame" class="start-game-button" type="button" disabled></button>
            </div>
            <button id="testCompletion" class="test-completion-button" type="button" disabled hidden aria-label="Test course completion with zero score and time">Test completion</button>
            <footer class="start-screen-logos"></footer>
        </section>
    `);

    const screen = requireUiElement("startScreen");
    const background = screen.querySelector(".start-screen-background");
    const logos = screen.querySelector(".start-screen-logos");
    background.src = config.background.src;
    background.alt = config.background.alt ?? "";
    requireUiElement("startScreenTitle").textContent = config.title;
    requireUiElement("startGame").textContent = config.loadingLabel;
    logos.setAttribute("aria-label", config.partnerLabel);
    logos.replaceChildren(...config.logos.map((logo) => {
        const image = document.createElement("img");
        image.src = logo.src;
        image.alt = logo.alt;
        image.width = logo.width;
        image.height = logo.height;
        return image;
    }));
}
