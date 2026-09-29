export function setupStartScreen({ onStart, onTestComplete, readyLabel }) {
    const screen = document.getElementById("startScreen");
    const startButton = document.getElementById("startGame");
    const testButton = document.getElementById("testCompletion");
    let hasStarted = false;
    testButton.hidden = typeof onTestComplete !== "function";
    const setBackgroundInert = (inert) => {
        [...screen.parentElement.children].forEach((element) => {
            if (element !== screen) element.inert = inert;
        });
    };

    const markReady = () => {
        // Mechanics are added while the 3D world loads. Lock all of them behind
        // the start screen only after scene setup is complete.
        setBackgroundInert(true);
        screen.setAttribute("aria-busy", "false");
        startButton.disabled = false;
        testButton.disabled = testButton.hidden;
        startButton.textContent = readyLabel;
        startButton.focus();
    };

    startButton.addEventListener("click", () => {
        if (hasStarted || startButton.disabled) return;
        hasStarted = true;
        startButton.disabled = true;
        testButton.disabled = true;
        onStart();
        screen.classList.add("is-leaving");
        let hasFinished = false;
        let fallbackTimer = null;
        const finish = () => {
            if (hasFinished) return;
            hasFinished = true;
            window.clearTimeout(fallbackTimer);
            screen.removeEventListener("transitionend", onTransitionEnd);
            screen.hidden = true;
            setBackgroundInert(false);
            const preferredFocus = [...screen.parentElement.querySelectorAll(
                "[data-game-start-focus]"
            )].find((element) => !element.disabled && !element.closest("[hidden]"));
            (preferredFocus ?? document.getElementById("renderCanvas"))?.focus();
        };
        const onTransitionEnd = (event) => {
            if (event.target === screen && event.propertyName === "opacity") {
                finish();
            }
        };
        screen.addEventListener("transitionend", onTransitionEnd);
        fallbackTimer = window.setTimeout(finish, 500);
    });

    testButton.addEventListener("click", () => {
        if (hasStarted || testButton.disabled || testButton.hidden) return;
        hasStarted = true;
        startButton.disabled = true;
        testButton.disabled = true;
        screen.hidden = true;
        setBackgroundInert(false);
        onTestComplete();
    });

    return { markReady };
}
