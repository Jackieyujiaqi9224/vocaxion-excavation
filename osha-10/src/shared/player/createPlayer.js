import { Ray } from "@babylonjs/core/Culling/ray.js";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder.js";
import "../assets/registerGltfLoader.js";

const PLAYER_SPAWN = new Vector3(-3, 0, 100);
const PLAYER_MODEL_URL = `${import.meta.env.BASE_URL}models/PlayerCharacter.glb`;

export async function createPlayer(
    scene,
    { spawn = PLAYER_SPAWN, modelUrl = PLAYER_MODEL_URL } = {}
) {
    const playerImport = await ImportMeshAsync(modelUrl, scene);
    const playerModel = playerImport.meshes.find((mesh) => !mesh.parent);
    if (!playerModel) {
        throw new Error("PlayerCharacter.glb does not contain a root mesh");
    }
    playerModel.name = "playerCharacterModel";

    // Keep a non-rendering mesh as the collision/movement controller because
    // TransformNode hierarchies imported from glTF cannot moveWithCollisions.
    const player = CreateCapsule(
        "playerCollisionController",
        { height: 1.8, radius: 0.35 },
        scene
    );

    const groundPick = scene.pickWithRay(
        new Ray(
            new Vector3(spawn.x, spawn.y + 50, spawn.z),
            new Vector3(0, -1, 0),
            100
        ),
        (mesh) => mesh.checkCollisions && !mesh.isDescendantOf(playerModel)
    );
    const floorHeight = groundPick?.hit ? groundPick.pickedPoint.y : 0;
    player.position.copyFrom(spawn);
    player.position.y = floorHeight;
    player.metadata = { floorHeight };
    player.isVisible = false;
    player.checkCollisions = true;
    player.ellipsoid = new Vector3(0.35, 0.9, 0.35);
    player.ellipsoidOffset = new Vector3(0, 0.9, 0);

    playerModel.getChildMeshes(false).forEach((mesh) => {
        mesh.checkCollisions = false;
        mesh.isPickable = false;
    });
    playerModel.parent = player;
    playerModel.position.setAll(0);
    player.computeWorldMatrix(true);
    playerModel.computeWorldMatrix(true);
    const modelBounds = playerModel.getHierarchyBoundingVectors(true);
    playerModel.position.y -= modelBounds.min.y - floorHeight;

    const idleAnimation = playerImport.animationGroups.find(
        (animation) => animation.name === "Player_Static_Pose"
    );
    const walkAnimation = playerImport.animationGroups.find(
        (animation) => animation.name === "Player_Walk"
    );
    if (!idleAnimation || !walkAnimation) {
        throw new Error(
            "PlayerCharacter.glb must contain Player_Static_Pose and Player_Walk animations"
        );
    }

    [idleAnimation, walkAnimation].forEach((animationGroup) => {
        animationGroup.targetedAnimations.forEach(({ animation }) => {
            animation.enableBlending = true;
            animation.blendingSpeed = 0.08;
        });
    });
    player.metadata.animations = {
        idle: idleAnimation,
        walk: walkAnimation,
    };
    idleAnimation.start(true);

    return player;
}
