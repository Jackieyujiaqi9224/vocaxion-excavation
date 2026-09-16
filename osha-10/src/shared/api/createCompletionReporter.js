// One reporter represents one playthrough. Retries reuse the original result
// and submission ID so the backend can safely deduplicate requests.
export function createCompletionReporter({
    endpoint,
    moduleId,
    fetchImpl = globalThis.fetch,
    createId = () => globalThis.crypto.randomUUID(),
    timeoutMs = 10000,
}) {
    let body;
    let pending;
    let saved = false;

    return {
        submit({ score, elapsedSeconds }) {
            if (!endpoint) return Promise.resolve({ status: "disabled" });
            if (saved) return Promise.resolve({ status: "saved" });
            if (pending) return pending;
            if (!Number.isFinite(score) || !Number.isInteger(elapsedSeconds) || elapsedSeconds < 0) {
                return Promise.reject(new Error("Invalid module completion result"));
            }
            body ??= JSON.stringify({
                submissionId: createId(),
                moduleId,
                completed: true,
                score,
                elapsedSeconds,
            });
            pending = (async () => {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    const response = await fetchImpl(endpoint, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body,
                        signal: controller.signal,
                        keepalive: true,
                    });
                    if (!response.ok) {
                        throw new Error(`Completion submission failed (${response.status})`);
                    }
                    saved = true;
                    return { status: "saved" };
                } finally {
                    clearTimeout(timeout);
                }
            })().finally(() => { pending = null; });
            return pending;
        },
    };
}
