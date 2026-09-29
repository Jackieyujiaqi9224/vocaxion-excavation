import assert from "node:assert/strict";
import test from "node:test";
import { setupStartScreen } from "../src/shared/ui/setupStartScreen.js";
import { setupModuleCompletion } from "../src/shared/ui/setupModuleCompletion.js";
import { createCompletionReporter } from "../src/shared/api/createCompletionReporter.js";
import { createScoringSystem } from "../src/shared/gameplay/createScoringSystem.js";
import { setupGameTimer } from "../src/shared/ui/setupGameTimer.js";

function mockUi(t) {
    const element = () => ({
        disabled: true,
        hidden: false,
        dataset: { label: "Score" },
        listeners: {},
        classList: { add() {} },
        setAttribute() {},
        before() {},
        focus() {},
        showModal() { this.open = true; },
        addEventListener(name, handler) { this.listeners[name] = handler; },
        click() { this.listeners.click?.(); },
    });
    const elements = Object.fromEntries([
        "startScreen", "startGame", "testCompletion", "moduleCompleteDialog",
        "exitModule", "moduleFinalScore", "gameStats", "gameTimer", "gameTimerValue",
    ].map((id) => [id, element()]));
    elements.startScreen.parentElement = { children: Object.values(elements) };
    for (const name of ["document", "window"]) {
        const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
        t.after(() => {
            if (descriptor) Object.defineProperty(globalThis, name, descriptor);
            else delete globalThis[name];
        });
    }
    globalThis.document = {
        getElementById: (id) => elements[id],
        createElement: element,
    };
    globalThis.window = { setTimeout(callback) { callback(); } };
    return elements;
}

for (const moduleId of ["module-1", "module-2"]) {
    test(`${moduleId} shortcut submits zero result once without starting gameplay`, async (t) => {
        const ui = mockUi(t);
        const requests = [];
        const reporter = createCompletionReporter({
            endpoint: "/api/training/completions",
            moduleId,
            createId: () => "test-submission",
            fetchImpl: async (url, options) => {
                requests.push({ url, ...options });
                return { ok: true };
            },
        });
        const scoring = createScoringSystem();
        const timer = setupGameTimer();
        let submission;
        const completion = setupModuleCompletion({
            scoring,
            onComplete() {
                timer.stop();
                submission = reporter.submit({
                    score: scoring.getScore(),
                    elapsedSeconds: timer.getElapsedSeconds(),
                });
                return submission;
            },
        });
        let starts = 0;
        const screen = setupStartScreen({
            readyLabel: "Start",
            onStart() { starts++; },
            onTestComplete() { scoring.reset(); completion.activate(); },
        });
        ui.testCompletion.click();
        assert.equal(requests.length, 0, "shortcut waits for readiness");
        screen.markReady();
        ui.testCompletion.click();
        ui.testCompletion.click();
        ui.startGame.click();
        await submission;
        assert.equal(starts, 0);
        assert.equal(requests.length, 1);
        assert.equal(requests[0].url, "/api/training/completions");
        assert.equal(requests[0].method, "POST");
        assert.equal(requests[0].credentials, "include");
        assert.deepEqual(JSON.parse(requests[0].body), {
            submissionId: "test-submission", moduleId, completed: true,
            score: 0, elapsedSeconds: 0,
        });
        assert.equal(ui.startScreen.hidden, true);
        assert.equal(ui.moduleCompleteDialog.inert, false);
        assert.equal(ui.moduleCompleteDialog.open, true);
        assert.equal(ui.moduleFinalScore.textContent, "Score: 0");
        assert.equal(ui.exitModule.disabled, false);
    });
}

test("modules without a completion callback keep the shortcut hidden", (t) => {
    const ui = mockUi(t);
    const screen = setupStartScreen({ onStart() {}, readyLabel: "Start" });
    screen.markReady();
    assert.equal(ui.testCompletion.hidden, true);
    assert.equal(ui.testCompletion.disabled, true);
});
