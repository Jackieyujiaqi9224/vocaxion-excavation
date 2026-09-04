import assert from "node:assert/strict";
import test from "node:test";
import { createScoringSystem } from "../src/shared/gameplay/createScoringSystem.js";

test("scoring records correct, incorrect, and reset events", () => {
    const scoring = createScoringSystem();
    const events = [];
    const unsubscribe = scoring.onChange((event) => events.push(event));

    assert.equal(scoring.recordCorrect({ itemId: "a" }), 10);
    assert.equal(scoring.recordIncorrect({ itemId: "b" }), 5);
    scoring.reset();

    assert.equal(scoring.getScore(), 0);
    assert.deepEqual(events.map(({ score, delta, outcome }) => ({
        score,
        delta,
        outcome,
    })), [
        { score: 10, delta: 10, outcome: "correct" },
        { score: 5, delta: -5, outcome: "incorrect" },
        { score: 0, delta: 0, outcome: "reset" },
    ]);

    unsubscribe();
    scoring.recordCorrect();
    assert.equal(events.length, 3);
});

test("scoring rejects invalid point rules", () => {
    assert.throws(
        () => createScoringSystem({ correctPoints: 0 }),
        /positive number/
    );
    assert.throws(
        () => createScoringSystem({ incorrectPoints: 5 }),
        /negative number/
    );
});
