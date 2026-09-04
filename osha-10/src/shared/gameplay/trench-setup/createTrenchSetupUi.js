import "./trenchSetup.css";
import "../../ui/game-dialog/gameDialog.css";
import { appendUi, requireUiElement } from "../../ui/dom/appendUi.js";

const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (!element) throw new Error(`Missing trench interface element ${selector}`);
    element.textContent = value;
};

export function createTrenchSetupUi({
    root = document.getElementById("app") ?? document.body,
    config,
}) {
    if (document.getElementById("trenchPlanner")) return;
    appendUi(root, `
        <section id="trenchSetupPanel" class="trench-setup-panel" aria-live="polite" hidden>
            <div class="trench-setup-panel-copy"><span class="trench-setup-panel-icon" aria-hidden="true"></span><strong id="trenchSetupStatus"></strong></div>
            <button id="trenchSetupObjective" class="trench-setup-objective" type="button"></button>
        </section>
        <main id="trenchPlanner" class="trench-planner" hidden>
            <div class="planner-layout">
                <aside id="trenchReinspectionPanel" class="trench-reinspection-panel" hidden>
                    <span class="eyebrow"></span><h2></h2>
                    <p id="trenchReinspectionInstruction" class="reinspection-instruction" aria-live="polite"></p>
                    <div class="reinspection-checklist">
                        <button id="trenchWallsInspection" class="reinspection-check" type="button" aria-pressed="false"><span aria-hidden="true"></span><span class="reinspection-check-copy"><strong></strong><small></small></span></button>
                        <button id="trenchShieldInspection" class="reinspection-check" type="button" aria-pressed="false"><span aria-hidden="true"></span><span class="reinspection-check-copy"><strong></strong><small></small></span></button>
                        <button id="trenchEgressInspection" class="reinspection-check" type="button" aria-pressed="false"><span aria-hidden="true"></span><span class="reinspection-check-copy"><strong></strong><small></small></span></button>
                    </div>
                    <button id="completeTrenchReinspection" class="step-submit" type="button" disabled></button>
                </aside>
                <aside id="trenchPlanningSidebar" class="planner-sidebar">
                    <div id="geotechnicalReportControl" class="geotechnical-report-control">
                        <button id="openGeotechnicalReport" class="geotechnical-report-action" type="button" aria-describedby="geotechnicalReportStatus"><span aria-hidden="true"></span><span></span></button>
                        <span id="geotechnicalReportStatus" class="geotechnical-report-status" aria-live="polite"></span>
                    </div>
                    <section id="measurementSection" class="planner-section is-locked">
                        <span class="section-number"></span><h2></h2>
                        <button id="measureTrench" class="measure-trench-action" type="button" disabled><span class="measure-tape-icon" aria-hidden="true"></span><span></span></button>
                        <div id="trenchMeasurements" class="measurement-grid" hidden>
                            <label data-dimension="length"><span class="dimension-label"></span><span><input id="trenchLength" type="number" readonly aria-readonly="true"><span class="dimension-unit"></span></span></label>
                            <label data-dimension="width"><span class="dimension-label"></span><span><input id="trenchWidth" type="number" readonly aria-readonly="true"><span class="dimension-unit"></span></span></label>
                            <label data-dimension="depth"><span class="dimension-label"></span><span><input id="trenchDepth" type="number" readonly aria-readonly="true"><span class="dimension-unit"></span></span></label>
                        </div>
                        <button id="submitMeasurements" class="step-submit" type="button" hidden></button><p id="measurementFeedback" class="step-feedback" aria-live="polite"></p>
                    </section>
                    <section id="protectionSection" class="planner-section is-locked">
                        <span class="section-number"></span><h2></h2><div id="protectionOptions" class="protection-options" role="radiogroup"></div>
                        <button id="submitProtection" class="step-submit" type="button" disabled></button><p id="protectionFeedback" class="step-feedback" aria-live="polite"></p>
                    </section>
                    <section id="protectionConfiguration" class="planner-section protection-configuration" hidden>
                        <span class="section-number"></span><h2 id="configurationTitle"></h2><div id="protectionConfigurationOptions" class="configuration-options"></div>
                        <button id="submitConfiguration" class="step-submit" type="button"></button><p id="configurationFeedback" class="step-feedback" aria-live="polite"></p>
                    </section>
                    <section id="deviceSection" class="planner-section device-section" hidden>
                        <span class="section-number"></span><h2 id="deviceStepTitle"></h2><p id="deviceStepHelp" class="section-help"></p><div id="devicePalette" class="device-palette"></div>
                        <button id="submitDevices" class="step-submit" type="button"></button><p id="deviceFeedback" class="step-feedback" aria-live="polite"></p>
                    </section>
                    <section id="egressSection" class="planner-section egress-section" hidden>
                        <span class="section-number"></span><h2></h2><p class="section-help"></p><button id="addEgress" class="step-submit" type="button"></button><p id="egressFeedback" class="step-feedback" aria-live="polite"></p>
                    </section>
                    <section id="finalPlanReview" class="planner-section final-plan-review" hidden>
                        <span class="section-number"></span><h2></h2><strong id="finalPlanTitle"></strong><p id="finalPlanSummary"></p>
                    </section>
                </aside>
                <section class="planner-workspace">
                    <div class="workspace-toolbar"><div><span></span><strong id="dimensionReadout"></strong></div></div>
                    <div class="trench-stage">
                        <div id="trenchMeasurementGuides" class="trench-measurement-guides" aria-hidden="true" hidden>
                            <div class="measurement-guide measurement-guide-width"><span class="measurement-cap"></span><span class="measurement-line"></span><strong><span class="guide-label"></span> <span id="guideWidthValue"></span></strong><span class="measurement-line"></span><span class="measurement-cap"></span></div>
                            <div class="measurement-guide measurement-guide-depth"><span class="measurement-cap"></span><span class="measurement-line"></span><strong><span class="guide-label"></span> <span id="guideDepthValue"></span></strong><span class="measurement-line"></span><span class="measurement-cap"></span></div>
                        </div>
                        <div id="shieldPlacementGuide" class="measurement-guide shield-placement-guide" aria-hidden="true" hidden><span class="measurement-cap"></span><span class="measurement-line"></span><strong><span class="guide-label"></span> <span id="shieldPlacementValue"></span></strong><span class="measurement-cap"></span></div>
                        <div id="shieldTopPlacementGuide" class="measurement-guide shield-placement-guide" aria-hidden="true" hidden><span class="measurement-cap"></span><span class="measurement-line"></span><strong><span class="guide-label"></span> <span id="shieldTopPlacementValue"></span></strong><span class="measurement-cap"></span></div>
                        <div id="emptyTrenchMessage" class="scene-instruction"><strong></strong><span></span></div>
                    </div>
                    <div class="planner-status"><span class="status-dot"></span><span class="status-label"></span><strong id="protectionStatus"></strong></div>
                </section>
            </div>
        </main>
        <dialog id="setupCompleteDialog" class="hazard-dialog setup-complete-dialog" aria-labelledby="setupCompleteTitle" aria-describedby="setupCompleteDescription">
            <span class="hazard-dialog-icon" aria-hidden="true"></span><span class="eyebrow"></span><h2 id="setupCompleteTitle"></h2><p id="setupCompleteDescription"></p><button id="returnToMainScene" class="hazard-action" type="button"></button>
        </dialog>
        <dialog id="geotechnicalReport" class="geotechnical-report" aria-labelledby="geotechnicalReportTitle">
            <header><div><span class="eyebrow"></span><h2 id="geotechnicalReportTitle"></h2></div><button id="closeGeotechnicalReport" class="hazard-dialog-close" type="button"></button></header>
            <div class="geotechnical-summary"><span class="soil-type-badge"></span><div><strong></strong><span></span></div></div>
            <dl class="geotechnical-data"></dl><div class="geotechnical-warning"><strong></strong><p></p></div><button id="acknowledgeGeotechnicalReport" class="hazard-action" type="button"></button>
        </dialog>
    `);

    const ui = config.ui;
    const objective = requireUiElement("trenchSetupPanel");
    objective.querySelector(".trench-setup-panel-icon").textContent = ui.objective.icon;
    requireUiElement("trenchSetupStatus").textContent = ui.objective.status;
    requireUiElement("trenchSetupObjective").textContent = ui.objective.buttonLabel;
    requireUiElement("trenchPlanner").setAttribute("aria-label", ui.plannerAriaLabel);

    const reinspection = requireUiElement("trenchReinspectionPanel");
    setText(".eyebrow", ui.reinspection.eyebrow, reinspection);
    setText("h2", ui.reinspection.title, reinspection);
    requireUiElement("trenchReinspectionInstruction").textContent = ui.reinspection.instruction;
    const checklist = reinspection.querySelector(".reinspection-checklist");
    checklist.setAttribute("aria-label", ui.reinspection.checklistLabel);
    ["trenchWallsInspection", "trenchShieldInspection", "trenchEgressInspection"].forEach((id, index) => {
        const button = requireUiElement(id);
        button.children[0].textContent = ui.reinspection.items[index].number;
        button.querySelector("strong").textContent = ui.reinspection.items[index].label;
        button.querySelector("small").textContent = ui.reinspection.pendingLabel;
    });
    requireUiElement("completeTrenchReinspection").textContent = ui.reinspection.completeLabel;

    const reportControl = requireUiElement("geotechnicalReportControl");
    reportControl.querySelector("button span:first-child").textContent = ui.report.icon;
    reportControl.querySelector("button span:last-child").textContent = ui.report.buttonLabel;
    requireUiElement("geotechnicalReportStatus").textContent = ui.report.requiredStatus;

    const measurement = requireUiElement("measurementSection");
    setText(".section-number", ui.measurement.number, measurement);
    setText("h2", ui.measurement.title, measurement);
    measurement.querySelector(".measure-tape-icon").textContent = ui.measurement.icon;
    measurement.querySelector("#measureTrench span:last-child").textContent = ui.measurement.buttonLabel;
    ["length", "width", "depth"].forEach((dimension) => {
        const label = measurement.querySelector(`[data-dimension="${dimension}"]`);
        label.querySelector(".dimension-label").textContent = ui.measurement.labels[dimension];
        label.querySelector(".dimension-unit").textContent = ui.measurement.unit;
        label.querySelector("input").value = config.trenchDimensions[dimension];
    });
    requireUiElement("submitMeasurements").textContent = ui.measurement.submitLabel;

    const protection = requireUiElement("protectionSection");
    setText(".section-number", ui.protection.number, protection);
    setText("h2", ui.protection.title, protection);
    requireUiElement("protectionOptions").setAttribute("aria-label", ui.protection.ariaLabel);
    requireUiElement("protectionStatus").textContent = ui.protection.initialStatus;

    const configuration = requireUiElement("protectionConfiguration");
    setText(".section-number", ui.configuration.number, configuration);
    requireUiElement("configurationTitle").textContent = ui.configuration.title;
    const devices = requireUiElement("deviceSection");
    setText(".section-number", ui.devices.number, devices);
    requireUiElement("deviceStepTitle").textContent = ui.devices.title;
    requireUiElement("deviceStepHelp").textContent = ui.devices.help;
    const egress = requireUiElement("egressSection");
    setText(".section-number", ui.egress.number, egress);
    setText("h2", ui.egress.title, egress);
    setText(".section-help", ui.egress.help, egress);
    const review = requireUiElement("finalPlanReview");
    setText(".section-number", ui.review.number, review);
    setText("h2", ui.review.title, review);

    const workspace = document.querySelector(".planner-workspace");
    setText(".workspace-toolbar span", ui.workspace.viewLabel, workspace);
    requireUiElement("dimensionReadout").textContent = ui.workspace.notMeasured;
    workspace.querySelector(".measurement-guide-width .guide-label").textContent = ui.workspace.widthLabel;
    workspace.querySelector(".measurement-guide-depth .guide-label").textContent = ui.workspace.depthLabel;
    requireUiElement("shieldPlacementGuide").querySelector(".guide-label").textContent = ui.workspace.bottomLabel;
    requireUiElement("shieldTopPlacementGuide").querySelector(".guide-label").textContent = ui.workspace.topLabel;
    const empty = requireUiElement("emptyTrenchMessage");
    empty.querySelector("strong").textContent = ui.workspace.emptyTitle;
    empty.querySelector("span").textContent = ui.workspace.emptyHelp;
    workspace.querySelector(".status-label").textContent = ui.workspace.statusLabel;

    const setupComplete = requireUiElement("setupCompleteDialog");
    setupComplete.querySelector(".hazard-dialog-icon").textContent = ui.completion.icon;
    setupComplete.querySelector(".eyebrow").textContent = ui.completion.eyebrow;
    requireUiElement("setupCompleteTitle").textContent = config.completion.dialogTitle;
    requireUiElement("setupCompleteDescription").textContent = config.completion.dialogDescription;

    const report = requireUiElement("geotechnicalReport");
    report.querySelector(".eyebrow").textContent = ui.report.eyebrow;
    requireUiElement("geotechnicalReportTitle").textContent = ui.report.title;
    report.querySelector(".geotechnical-summary strong").textContent = ui.report.classificationLabel;
    const closeReport = requireUiElement("closeGeotechnicalReport");
    closeReport.textContent = ui.report.closeSymbol;
    closeReport.setAttribute("aria-label", ui.report.closeLabel);
    requireUiElement("acknowledgeGeotechnicalReport").textContent = ui.report.acknowledgeLabel;
}
