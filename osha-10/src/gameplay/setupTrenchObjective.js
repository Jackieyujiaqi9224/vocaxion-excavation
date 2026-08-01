import {
    Matrix,
    MeshBuilder,
    StandardMaterial,
    TransformNode,
    Vector3,
} from "@babylonjs/core";

const COMPLETION_MESSAGE =
    "You have identified all the hazards. Now let’s take a look at the trench conditions and make sure it is safe for workers to enter.";

export function setupTrenchObjective({
    scene,
    engine,
    trench,
    hazardSystems,
    openPlanner,
    isPlannerOpen,
    isPlannerComplete,
}) {
    const objectiveButton = document.getElementById("trenchSetupObjective");
    const mentorMessage = document.querySelector("#mentorMessage p");
    const marker = new TransformNode("trenchObjectiveMarker", scene);
    const material = new StandardMaterial("trenchObjectiveMaterial", scene);
    material.diffuseColor.set(1, 0.68, 0.05);
    material.emissiveColor.set(0.35, 0.18, 0.01);

    const shaft = MeshBuilder.CreateBox(
        "trenchObjectiveShaft",
        { width: 0.34, height: 1.25, depth: 0.34 },
        scene
    );
    shaft.position.y = 0.95;
    shaft.material = material;
    shaft.parent = marker;

    const head = MeshBuilder.CreateCylinder(
        "trenchObjectiveHead",
        { diameterTop: 1, diameterBottom: 0, height: 0.9, tessellation: 4 },
        scene
    );
    head.material = material;
    head.parent = marker;
    marker.setEnabled(false);

    let isActivated = false;

    const allHazardsResolved = () =>
        hazardSystems.every(
            (system) => system.getUnresolvedMeshes().length === 0
        );

    const positionObjective = () => {
        const center = trench.center;
        const bob = Math.sin(performance.now() * 0.005) * 0.18;
        marker.position.set(center.x, trench.maximum.y + 0.8 + bob, center.z);

        const camera = scene.activeCamera;
        if (!camera) return;

        const viewport = camera.viewport.toGlobal(
            engine.getRenderWidth(),
            engine.getRenderHeight()
        );
        const buttonWorldPosition = marker.position.add(new Vector3(0, 1.8, 0));
        const projected = Vector3.Project(
            buttonWorldPosition,
            Matrix.Identity(),
            scene.getTransformMatrix(),
            viewport
        );
        const canvasRect = engine.getRenderingCanvas().getBoundingClientRect();
        const projectedLeft =
            canvasRect.left +
            projected.x * canvasRect.width / engine.getRenderWidth();
        const projectedTop =
            canvasRect.top +
            projected.y * canvasRect.height / engine.getRenderHeight();
        objectiveButton.style.left =
            `${Math.max(80, Math.min(window.innerWidth - 80, projectedLeft))}px`;
        objectiveButton.style.top =
            `${Math.max(60, Math.min(window.innerHeight - 24, projectedTop))}px`;
    };

    objectiveButton.addEventListener("click", openPlanner);

    scene.onBeforeRenderObservable.add(() => {
        if (!isActivated && allHazardsResolved()) {
            isActivated = true;
            mentorMessage.textContent = COMPLETION_MESSAGE;
        }

        const isVisible =
            isActivated && !isPlannerOpen() && !isPlannerComplete();
        marker.setEnabled(isVisible);
        objectiveButton.hidden = !isVisible;

        if (isVisible) positionObjective();
    });

    return {
        isActive: () => isActivated,
    };
}
