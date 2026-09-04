export function setupScoreDisplay(scoring) {
    const panel = document.getElementById("gameStats");
    const display = document.getElementById("gameScore");
    const value = document.getElementById("gameScoreValue");
    let animationTimer = null;

    if (!panel || !display || !value) {
        throw new Error("Missing game score display elements");
    }

    const unsubscribe = scoring.onChange(({ score, delta }) => {
        value.textContent = String(score);
        panel.classList.remove("is-gain", "is-loss");
        window.clearTimeout(animationTimer);
        if (delta !== 0) {
            panel.classList.add(delta > 0 ? "is-gain" : "is-loss");
            animationTimer = window.setTimeout(() => {
                panel.classList.remove("is-gain", "is-loss");
            }, 450);
        }
    });

    value.textContent = String(scoring.getScore());

    return {
        show() {
            panel.hidden = false;
        },
        hide() {
            display.hidden = true;
        },
        dispose() {
            window.clearTimeout(animationTimer);
            unsubscribe();
        },
    };
}
