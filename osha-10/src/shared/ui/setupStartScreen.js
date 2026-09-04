export function setupStartScreen({ onStart, readyLabel }) {
    const screen = document.getElementById("startScreen");
    const startButton = document.getElementById("startGame");
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
        startButton.textContent = readyLabel;
        startButton.focus();
    };

    startButton.addEventListener("click", () => {
        startButton.disabled = true;
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

    return { markReady };
}
