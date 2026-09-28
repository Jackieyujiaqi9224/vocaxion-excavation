import assert from "node:assert/strict";
import test from "node:test";
import { moduleOneGameFlowConfig } from "../src/modules/module-1/config/gameFlowConfig.js";
import {
    createMechanicGroup,
    setupGameFlow,
} from "../src/shared/gameplay/setupGameFlow.js";

function createMechanic() {
    const listeners = new Set();
    const beforeCompleteListeners = new Set();
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
        onBeforeComplete(listener) {
            beforeCompleteListeners.add(listener);
            return () => beforeCompleteListeners.delete(listener);
        },
        beginClosing() {
            beforeCompleteListeners.forEach((listener) => listener());
        },
    };
}

test("Module 1 waits for trench setup, the truck cue, and the final comic before completion", async () => {
    const mechanics = Object.fromEntries([
        "utilityMarking", "hazardIdentification", "trenchPlacement", "trenchDeepening", "secondTrenchPlacement", "dumpTruckCue", "dumpTruckComic", "moduleCompletion",
    ].map((id) => [id, createMechanic()]));
    const tool = createMechanic();
    const excavator = createMechanic();
    let toolComplete = false;
    let excavatorComplete = false;
    tool.isComplete = () => toolComplete;
    excavator.isComplete = () => excavatorComplete;
    mechanics.postDeepeningInspection = createMechanicGroup([tool, excavator]);
    const flow = setupGameFlow({ config: moduleOneGameFlowConfig, mechanics });
    flow.start();
    assert.equal(flow.getStepId(), "utility-marking");
    assert.equal(mechanics.utilityMarking.activations, 1);
    assert.equal(mechanics.hazardIdentification.activations, 0);
    assert.equal(flow.isMovementPaused(), true);
    mechanics.utilityMarking.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "hazard-identification");
    assert.equal(mechanics.hazardIdentification.activations, 1);
    mechanics.hazardIdentification.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "trench-placement");
    mechanics.trenchPlacement.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "trench-deepening");
    assert.equal(mechanics.trenchDeepening.activations, 1);
    assert.equal(flow.isMovementPaused(), true);
    assert.equal(mechanics.moduleCompletion.activations, 0);
    assert.equal(tool.activations, 0);
    assert.equal(excavator.activations, 0);
    mechanics.trenchDeepening.beginClosing();
    assert.equal(tool.activations, 1);
    assert.equal(excavator.activations, 1);
    assert.equal(flow.getStepId(), "trench-deepening");
    assert.equal(flow.isMovementPaused(), true);
    mechanics.trenchDeepening.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "post-deepening-inspection");
    assert.equal(tool.activations, 1);
    assert.equal(excavator.activations, 1);
    assert.equal(mechanics.moduleCompletion.activations, 0);
    toolComplete = true;
    tool.complete();
    await Promise.resolve();
    assert.equal(mechanics.moduleCompletion.activations, 0);
    excavatorComplete = true;
    excavator.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "second-trench-placement");
    assert.equal(mechanics.moduleCompletion.activations, 0);
    assert.equal(mechanics.secondTrenchPlacement.activations, 0);
    mechanics.secondTrenchPlacement.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "dump-truck-cue");
    assert.equal(flow.isMovementPaused(), true);
    assert.equal(mechanics.dumpTruckComic.activations, 0);
    assert.equal(mechanics.moduleCompletion.activations, 0);
    mechanics.dumpTruckCue.complete();
    await Promise.resolve();
    assert.equal(flow.getStepId(), "dump-truck-comic");
    assert.equal(flow.isMovementPaused(), true);
    assert.equal(mechanics.moduleCompletion.activations, 0);
    mechanics.dumpTruckComic.complete();
    await Promise.resolve();
    assert.equal(mechanics.moduleCompletion.activations, 1);
    assert.equal(flow.getStepId(), "complete");
    flow.dispose();
});

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
