import { Vector3 } from "@babylonjs/core";

function distanceToPlayer(mesh, player) {
    mesh.computeWorldMatrix(true);
    const target = mesh.getBoundingInfo().boundingSphere.centerWorld;
    return Vector3.DistanceSquared(target, player.position);
}

export function setupHazardHint({
    scene,
    player,
    navigationArrow,
    hazardSystems,
    isUnavailable,
}) {
    const hintButton = document.getElementById("hazardHint");
    let isActive = false;
    let currentTarget = null;

    const getUnresolvedHazards = () =>
        hazardSystems.flatMap((system) => system.getUnresolvedMeshes());

    const findNearestHazard = (hazards) => hazards.reduce(
        (nearest, mesh) =>
            !nearest ||
            distanceToPlayer(mesh, player) < distanceToPlayer(nearest, player)
                ? mesh
                : nearest,
        null
    );

    const activateHint = () => {
        isActive = true;
        currentTarget = findNearestHazard(getUnresolvedHazards());
        navigationArrow.setTarget(currentTarget);
    };

    hintButton.addEventListener("click", activateHint);

    scene.onBeforeRenderObservable.add(() => {
        const unresolvedHazards = getUnresolvedHazards();

        if (currentTarget && !unresolvedHazards.includes(currentTarget)) {
            currentTarget = findNearestHazard(unresolvedHazards);
            navigationArrow.setTarget(currentTarget);
        }

        const hasHazards = unresolvedHazards.length > 0;
        hintButton.hidden = !hasHazards;
        hintButton.disabled = !hasHazards;
        hintButton.classList.toggle("is-complete", !hasHazards);
        navigationArrow.setEnabled(
            isActive &&
            Boolean(currentTarget) &&
            !isUnavailable()
        );
        navigationArrow.update();
    });
}
