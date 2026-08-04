import { MeshBuilder, Ray, Vector3 } from "@babylonjs/core";

const PLAYER_SPAWN = new Vector3(-3, 0, 100);
const PLAYER_MODEL_NAME = "COL_Player";

export function createPlayer(scene) {
    const playerModel = scene.getNodeByName(PLAYER_MODEL_NAME);
    if (!playerModel) {
        throw new Error(`Excavation scene is missing ${PLAYER_MODEL_NAME}`);
    }

    // Keep a non-rendering mesh as the collision/movement controller because
    // TransformNode hierarchies imported from glTF cannot moveWithCollisions.
    const player = MeshBuilder.CreateCapsule(
        "playerCollisionController",
        { height: 1.8, radius: 0.35 },
        scene
    );

    const groundPick = scene.pickWithRay(
        new Ray(
            new Vector3(PLAYER_SPAWN.x, 50, PLAYER_SPAWN.z),
            new Vector3(0, -1, 0),
            100
        ),
        (mesh) =>
            mesh.checkCollisions && !mesh.isDescendantOf(playerModel)
    );
    const floorHeight = groundPick?.hit ? groundPick.pickedPoint.y : 0;
    player.position.copyFrom(PLAYER_SPAWN);
    player.position.y = floorHeight;
    player.metadata = { floorHeight };
    player.isVisible = false;
    player.checkCollisions = true;
    player.ellipsoid = new Vector3(0.35, 0.9, 0.35);
    player.ellipsoidOffset = new Vector3(0, 0.9, 0);

    playerModel.getChildMeshes(false).forEach((mesh) => {
        mesh.checkCollisions = false;
    });
    playerModel.parent = player;
    playerModel.position.setAll(0);
    player.computeWorldMatrix(true);
    playerModel.computeWorldMatrix(true);
    const modelBounds = playerModel.getHierarchyBoundingVectors(true);
    playerModel.position.y -= modelBounds.min.y - floorHeight;

    return player;
}
