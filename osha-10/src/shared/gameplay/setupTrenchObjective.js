const DEFAULT_COMPLETION_MESSAGE =
    "The previous activity is complete. Review the trench conditions before workers enter.";

export function setupTrenchObjective({
    scene,
    states,
    isPlannerOpen,
}) {
    const objectivePanel = document.getElementById("trenchSetupPanel");
    const objectiveButton = document.getElementById("trenchSetupObjective");
    const objectiveStatus = document.getElementById("trenchSetupStatus");
    const mentorMessage = document.querySelector("#mentorMessage p");
    const activatedStates = new Set();
    let activeState = null;

    objectiveButton.addEventListener("click", () => {
        activeState?.openPlanner();
    });

    scene.onBeforeRenderObservable.add(() => {
        const nextState = states.find((state) => state.isEnabled()) ?? null;
        if (activeState !== nextState) {
            activeState = nextState;
            if (activeState) {
                objectiveButton.textContent = activeState.buttonLabel;
                objectiveStatus.textContent =
                    activeState.statusLabel ?? "Activity complete";
            }
        }

        if (activeState && !activatedStates.has(activeState.id)) {
            activatedStates.add(activeState.id);
            mentorMessage.textContent =
                activeState.completionMessage ?? DEFAULT_COMPLETION_MESSAGE;
        }

        objectivePanel.hidden = !activeState || isPlannerOpen();
    });

    return {
        isActive: () => Boolean(activeState),
    };
}
