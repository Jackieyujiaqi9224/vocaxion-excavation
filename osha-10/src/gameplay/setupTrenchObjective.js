const COMPLETION_MESSAGE =
    "You have identified all the hazards. Now let’s take a look at the trench conditions and make sure it is safe for workers to enter.";

export function setupTrenchObjective({
    scene,
    states,
    isPlannerOpen,
}) {
    const objectiveButton = document.getElementById("trenchSetupObjective");
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
            }
        }

        if (activeState && !activatedStates.has(activeState.id)) {
            activatedStates.add(activeState.id);
            mentorMessage.textContent =
                activeState.completionMessage ?? COMPLETION_MESSAGE;
        }

        objectiveButton.hidden = !activeState || isPlannerOpen();
    });

    return {
        isActive: () => Boolean(activeState),
    };
}
