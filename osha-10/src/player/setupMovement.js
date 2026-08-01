import { Vector3 } from "@babylonjs/core";

const MOVE_SPEED = 0.12;
const TURN_SPEED = 0.035;
const JUMP_STRENGTH = 0.22;
const GRAVITY_STEP = 0.02;

export function setupMovement({
    scene,
    player,
    cameraTarget,
    input,
    isPaused,
}) {
    let verticalVelocity = 0;
    const floorHeight = player.metadata?.floorHeight ?? 0;

    scene.onBeforeRenderObservable.add(() => {
        if (isPaused()) return;

        if (input.left) player.rotation.y -= TURN_SPEED;
        if (input.right) player.rotation.y += TURN_SPEED;

        const facing = new Vector3(
            Math.sin(player.rotation.y),
            0,
            Math.cos(player.rotation.y)
        );
        let movement = Vector3.Zero();

        if (input.forward) movement.addInPlace(facing);
        if (input.back) movement.subtractInPlace(facing);
        if (movement.lengthSquared() > 0.0001) {
            movement.normalize().scaleInPlace(MOVE_SPEED);
        }

        const isGrounded = player.position.y <= floorHeight + 0.01;
        if (input.jump && isGrounded) verticalVelocity = JUMP_STRENGTH;

        verticalVelocity += scene.gravity.y * GRAVITY_STEP;
        player.moveWithCollisions(
            new Vector3(movement.x, verticalVelocity, movement.z)
        );

        if (player.position.y < floorHeight) {
            player.position.y = floorHeight;
            verticalVelocity = 0;
        }

        cameraTarget.position.copyFrom(player.position);
        cameraTarget.rotation.y = player.rotation.y;
    });
}
