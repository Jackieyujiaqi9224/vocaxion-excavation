import "./utilityMarking.css";
import { appendUi } from "../../ui/dom/appendUi.js";

export function createUtilityMarkingUi({
    root = document.getElementById("app") ?? document.body,
}) {
    if (document.getElementById("utilityMarkingScreen")) return;
    appendUi(root, `
        <section id="utilityMarkingScreen" class="utility-marking-screen" aria-labelledby="utilityMarkingTitle" hidden>
            <img id="utilityMarkingBackground" class="utility-marking-background" alt="">
            <div id="utilityFlagLayer" class="utility-flag-layer" hidden></div>
            <div id="digZoneLayer" class="dig-zone-layer" hidden></div>
            <div id="utilityCallCard" class="utility-call-card">
                <span class="utility-call-badge" aria-hidden="true"></span><span class="eyebrow"></span>
                <h1 id="utilityMarkingTitle"></h1><p></p>
                <button id="call811" class="utility-call-action" type="button" data-game-start-focus></button>
            </div>
            <div id="utilityInspectionPanel" class="utility-inspection-panel" hidden>
                <span class="eyebrow"></span><strong id="utilityInspectionTitle"></strong><span id="utilityInspectionHelp"></span>
            </div>
            <aside id="toleranceReminder" class="tolerance-reminder" hidden>
                <span class="tolerance-reminder-icon" aria-hidden="true"></span>
                <div><span class="eyebrow"></span><strong></strong><p></p></div>
            </aside>
        </section>
        <dialog id="utilityQuiz" class="utility-quiz" aria-labelledby="utilityQuizTitle">
            <span class="utility-call-badge" aria-hidden="true"></span><span class="eyebrow"></span>
            <h2 id="utilityQuizTitle"></h2><div class="utility-answer-grid"></div>
            <p id="utilityQuizFeedback" class="utility-quiz-feedback" aria-live="polite"></p>
        </dialog>
        <dialog id="digMethodQuiz" class="utility-quiz" aria-labelledby="digMethodTitle">
            <span class="utility-call-badge" aria-hidden="true"></span><span class="eyebrow"></span>
            <h2 id="digMethodTitle"><span id="digMethodArea"></span></h2><div class="utility-answer-grid"></div>
            <p id="digMethodFeedback" class="utility-quiz-feedback" aria-live="polite"></p>
        </dialog>
    `);
}
