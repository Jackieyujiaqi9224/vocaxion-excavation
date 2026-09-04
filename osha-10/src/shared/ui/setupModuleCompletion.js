const MODULE_COMPLETION_DELAY_MS = 1000;

export function setupModuleCompletion({ onComplete, scoring }) {
    const dialog = document.getElementById("moduleCompleteDialog");
    const exitButton = document.getElementById("exitModule");
    const finalScore = document.getElementById("moduleFinalScore");
    let isScheduled = false;

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
    });

    exitButton.addEventListener("click", () => {
        dialog.close();
        if (document.referrer && window.history.length > 1) {
            window.history.back();
            return;
        }

        window.close();
        window.setTimeout(() => {
            if (!window.closed) window.location.replace("about:blank");
        }, 100);
    });

    return {
        activate() {
            if (isScheduled) return;
            isScheduled = true;
            onComplete();
            finalScore.textContent =
                `${finalScore.dataset.label}: ${scoring.getScore()}`;
            window.setTimeout(() => {
                dialog.showModal();
                exitButton.focus();
            }, MODULE_COMPLETION_DELAY_MS);
        },
        isOpen: () => dialog.open,
    };
}
