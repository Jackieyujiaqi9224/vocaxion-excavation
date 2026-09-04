export function setupStartScreen({ onStart, readyLabel }) {
    const screen = document.getElementById("startScreen");
    const startButton = document.getElementById("startGame");

    const markReady = () => {
        startButton.disabled = false;
        startButton.textContent = readyLabel;
        startButton.focus();
    };

    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        onStart();
        screen.classList.add("is-leaving");
        screen.addEventListener(
            "transitionend",
            () => {
                screen.hidden = true;
            },
            { once: true }
        );
    });

    return { markReady };
}
