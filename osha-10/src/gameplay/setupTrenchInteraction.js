const INTERACTION_DISTANCE = 4;

export function setupTrenchInteraction(
    scene,
    player,
    trench,
    openPlanner,
    isEnabled = () => true
) {
    const prompt = document.getElementById("trenchInteraction");

    const distanceToTrench = () => {
        const dx = Math.max(
            Math.abs(player.position.x - trench.center.x) - trench.width / 2,
            0
        );
        const dz = Math.max(
            Math.abs(player.position.z - trench.center.z) - trench.depth / 2,
            0
        );
        return Math.hypot(dx, dz);
    };

    const interact = () => {
        if (!prompt.hidden) openPlanner();
    };

    prompt.addEventListener("click", interact);
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyE" && !event.repeat) interact();
    });

    scene.onBeforeRenderObservable.add(() => {
        prompt.hidden =
            !isEnabled() || distanceToTrench() > INTERACTION_DISTANCE;
    });
}
