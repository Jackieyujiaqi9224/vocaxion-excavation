import assert from "node:assert/strict";
import test from "node:test";
import {
    createMechanicGroup,
    setupGameFlow,
} from "../src/shared/gameplay/setupGameFlow.js";

function createMechanic() {
    const listeners = new Set();
    return {
        activations: 0,
        deactivations: 0,
        activate() {
            this.activations += 1;
        },
        deactivate() {
            this.deactivations += 1;
        },
        onComplete(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        complete() {
            listeners.forEach((listener) => listener());
        },
    };
}

test("game flow activates and transitions through configured mechanics", async () => {
    const first = createMechanic();
    const second = createMechanic();
    const flow = setupGameFlow({
        config: {
            id: "test-flow",
            startStepId: "first",
            steps: [
                { id: "first", mechanicId: "first", nextStepId: "second" },
                { id: "second", mechanicId: "second" },
            ],
        },
        mechanics: { first, second },
    });

    assert.equal(flow.isStarted(), false);
    assert.equal(flow.isMovementPaused(), true);
    flow.start();
    assert.equal(flow.isStarted(), true);
    assert.equal(flow.isMovementPaused(), false);
    assert.equal(flow.getStepId(), "first");
    assert.equal(first.activations, 1);

    first.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "second");
    assert.equal(first.deactivations, 1);
    assert.equal(second.activations, 1);
});

test("manual steps wait for their UI action", async () => {
    const first = createMechanic();
    const manual = createMechanic();
    const flow = setupGameFlow({
        config: {
            id: "manual-flow",
            startStepId: "first",
            steps: [
                { id: "first", mechanicId: "first", nextStepId: "manual" },
                { id: "manual", mechanicId: "manual", activation: "manual" },
            ],
        },
        mechanics: { first, manual },
    });

    flow.start();
    first.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "manual");
    assert.equal(manual.activations, 0);
});

test("flow validation rejects cycles", () => {
    const mechanic = createMechanic();
    assert.throws(() => setupGameFlow({
        config: {
            id: "cyclic-flow",
            startStepId: "a",
            steps: [
                { id: "a", mechanicId: "mechanic", nextStepId: "b" },
                { id: "b", mechanicId: "mechanic", nextStepId: "a" },
            ],
        },
        mechanics: { mechanic },
    }), /contains a cycle/);
});

test("an empty mechanic group completes when activated", () => {
    const group = createMechanicGroup([], { id: "empty" });
    let completions = 0;
    group.onComplete(() => {
        completions += 1;
    });
    group.activate();
    assert.equal(group.isComplete(), true);
    assert.equal(completions, 1);
});
