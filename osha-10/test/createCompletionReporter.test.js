import assert from "node:assert/strict";
import test from "node:test";
import { createCompletionReporter } from "../src/shared/api/createCompletionReporter.js";

test("posts completion once, including simultaneous and repeated calls", async () => {
    const requests = [];
    const reporter = createCompletionReporter({
        endpoint: "/api/training/completions",
        moduleId: "module-2",
        createId: () => "submission-123",
        fetchImpl: async (...args) => {
            requests.push(args);
            return { ok: true };
        },
    });
    const result = { score: -5, elapsedSeconds: 342 };
    await Promise.all([reporter.submit(result), reporter.submit(result)]);
    assert.deepEqual(await reporter.submit(result), { status: "saved" });
    assert.equal(requests.length, 1);
    const [url, options] = requests[0];
    assert.equal(url, "/api/training/completions");
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), {
        submissionId: "submission-123",
        moduleId: "module-2",
        completed: true,
        score: -5,
        elapsedSeconds: 342,
    });
});

for (const failure of ["http", "network"]) {
    test(`retries ${failure} failures with the same submission and original result`, async () => {
        const bodies = [];
        const reporter = createCompletionReporter({
            endpoint: "/complete",
            moduleId: "module-1",
            createId: () => "stable-id",
            fetchImpl: async (_url, options) => {
                bodies.push(options.body);
                if (bodies.length === 1) {
                    if (failure === "network") throw new TypeError("Offline");
                    return { ok: false, status: 503 };
                }
                return { ok: true };
            },
        });
        await assert.rejects(reporter.submit({ score: 20, elapsedSeconds: 12 }));
        await reporter.submit({ score: 99, elapsedSeconds: 100 });
        assert.equal(bodies.length, 2);
        assert.equal(bodies[0], bodies[1]);
    });
}

test("an unconfigured endpoint sends nothing", async () => {
    const reporter = createCompletionReporter({
        moduleId: "module-1",
        fetchImpl: () => assert.fail("Unexpected request"),
    });
    assert.deepEqual(await reporter.submit({ score: 0, elapsedSeconds: 0 }), { status: "disabled" });
});

test("a stalled request times out and permits retry", async () => {
    let calls = 0;
    const reporter = createCompletionReporter({
        endpoint: "/complete",
        moduleId: "module-2",
        createId: () => "timeout-id",
        timeoutMs: 5,
        fetchImpl: async (_url, { signal }) => {
            if (++calls > 1) return { ok: true };
            return new Promise((_resolve, reject) => {
                signal.addEventListener("abort", () => reject(new Error("Timed out")));
            });
        },
    });
    await assert.rejects(reporter.submit({ score: 10, elapsedSeconds: 5 }), /Timed out/);
    assert.deepEqual(await reporter.submit({ score: 10, elapsedSeconds: 5 }), { status: "saved" });
});
