export function createScoringSystem({
    correctPoints = 10,
    incorrectPoints = -5,
} = {}) {
    if (!Number.isFinite(correctPoints) || correctPoints <= 0) {
        throw new Error("correctPoints must be a positive number");
    }
    if (!Number.isFinite(incorrectPoints) || incorrectPoints >= 0) {
        throw new Error("incorrectPoints must be a negative number");
    }
    let score = 0;
    const listeners = new Set();

    const update = (delta, outcome, context) => {
        score += delta;
        const event = Object.freeze({ score, delta, outcome, context });
        listeners.forEach((listener) => listener(event));
        return score;
    };

    return Object.freeze({
        recordCorrect(context = {}) {
            return update(correctPoints, "correct", context);
        },
        recordIncorrect(context = {}) {
            return update(incorrectPoints, "incorrect", context);
        },
        reset() {
            score = 0;
            listeners.forEach((listener) => listener(Object.freeze({
                score,
                delta: 0,
                outcome: "reset",
                context: {},
            })));
        },
        getScore: () => score,
        onChange(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        rules: Object.freeze({ correctPoints, incorrectPoints }),
    });
}
