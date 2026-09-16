const MODULE_COMPLETION_DELAY_MS = 1000;

export function setupModuleCompletion({ onComplete, scoring }) {
    const dialog = document.getElementById("moduleCompleteDialog");
    const exitButton = document.getElementById("exitModule");
    const finalScore = document.getElementById("moduleFinalScore");
    const saveStatus = document.createElement("p");
    saveStatus.setAttribute("role", "status");
    saveStatus.hidden = true;
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "hazard-action";
    retryButton.textContent = "Retry saving";
    retryButton.hidden = true;
    exitButton.before(saveStatus, retryButton);
    let isScheduled = false;

    const saveCompletion = async () => {
        exitButton.disabled = true;
        retryButton.hidden = true;
        saveStatus.hidden = false;
        saveStatus.textContent = "Saving your result…";
        try {
            const result = await onComplete();
            saveStatus.hidden = result?.status !== "saved";
            saveStatus.textContent = result?.status === "saved" ? "Your result has been saved." : "";
        } catch (error) {
            console.error("Could not save module completion:", error);
            saveStatus.textContent = "Your result could not be saved. Retry before exiting; exiting now may lose this result.";
            retryButton.hidden = false;
        } finally {
            exitButton.disabled = false;
        }
    };
    retryButton.addEventListener("click", saveCompletion);

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
            void saveCompletion();
            finalScore.textContent =
                `${finalScore.dataset.label}: ${scoring.getScore()}`;
            window.setTimeout(() => {
                dialog.showModal();
                exitButton.focus();
            }, MODULE_COMPLETION_DELAY_MS);
        },
        isOpen: () => dialog.open,
        isBlocking: () => isScheduled,
    };
}
