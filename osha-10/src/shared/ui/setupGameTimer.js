const formatElapsedTime = (elapsedMilliseconds) => {
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [minutes, seconds];

    if (hours > 0) parts.unshift(hours);
    return parts.map((part) => String(part).padStart(2, "0")).join(":");
};

export function setupGameTimer() {
    const stats = document.getElementById("gameStats");
    const timer = document.getElementById("gameTimer");
    const value = document.getElementById("gameTimerValue");
    let startedAt = null;
    let intervalId = null;

    const render = () => {
        if (startedAt === null) return;
        value.textContent = formatElapsedTime(performance.now() - startedAt);
    };

    return {
        start() {
            if (startedAt !== null) return;
            startedAt = performance.now();
            stats.hidden = false;
            render();
            intervalId = window.setInterval(render, 250);
        },
        stop() {
            if (startedAt === null || intervalId === null) return;
            window.clearInterval(intervalId);
            intervalId = null;
            render();
            timer.classList.add("is-stopped");
            stats.classList.add("is-stopped");
        },
    };
}
