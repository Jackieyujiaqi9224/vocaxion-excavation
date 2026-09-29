const MODULE_COMPLETION_DELAY_MS = 1000;

export function setupModuleCompletion({ onComplete, scoring }) {
    const dialog = document.getElementById("moduleCompleteDialog");
    const exitButton = document.getElementById("exitModule");
    const finalScore = document.getElementById("moduleFinalScore");
    const saveStatus = document.createElement("p");
    saveStatus.setAttribute("role", "status");
    saveStatus.hidden = true;
    exitButton.before(saveStatus);
    let isScheduled = false;

    const saveCompletion = async () => {
        exitButton.disabled = true;
        saveStatus.hidden = false;
        saveStatus.textContent = "Saving your result…";
        try {
            const result = await onComplete();
            saveStatus.hidden = result?.status !== "saved";
            saveStatus.textContent = result?.status === "saved" ? "Your result has been saved." : "";
        } catch (error) {
            console.error("Could not save module completion:", error);
            saveStatus.textContent = "Your result could not be saved. Your completion may not appear on the website.";
        } finally {
            exitButton.disabled = false;
        }
    };

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
