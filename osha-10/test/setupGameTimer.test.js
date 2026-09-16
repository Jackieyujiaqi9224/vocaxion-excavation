import assert from "node:assert/strict";
import test from "node:test";
import { setupGameTimer } from "../src/shared/ui/setupGameTimer.js";

test("elapsed seconds start at Start and remain frozen after completion", (t) => {
    let now = 1000;
    const elements = Object.fromEntries(["gameStats", "gameTimer", "gameTimerValue"].map(
        (id) => [id, { classList: { add() {} }, hidden: true, textContent: "" }]
    ));
    t.mock.method(performance, "now", () => now);
    const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    t.after(() => {
        for (const [key, descriptor] of [["document", originalDocument], ["window", originalWindow]]) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor);
            else delete globalThis[key];
        }
    });
    globalThis.document = { getElementById: (id) => elements[id] };
    globalThis.window = { setInterval: () => 1, clearInterval() {} };
    const timer = setupGameTimer();
    assert.equal(timer.getElapsedSeconds(), 0);
    timer.start();
    now = 6499;
    timer.stop();
    assert.equal(timer.getElapsedSeconds(), 5);
    assert.equal(elements.gameTimerValue.textContent, "00:05");
    now = 20000;
    timer.stop();
    assert.equal(timer.getElapsedSeconds(), 5);
});
