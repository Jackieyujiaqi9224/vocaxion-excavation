import { Vector3 } from "@babylonjs/core";

const MOVE_SPEED = 0.05;
const TURN_SPEED = 0.02;
const JUMP_STRENGTH = 0.22;
const GRAVITY_STEP = 0.02;
const VERTICAL_COLLISION_EPSILON = 0.001;

export function setupMovement({
    scene,
    player,
    cameraTarget,
    input,
    isPaused,
}) {
    let verticalVelocity = 0;
    let isGrounded = true;
    const floorHeight = player.metadata?.floorHeight ?? 0;
    const animations = player.metadata?.animations;
    let activeAnimation = animations?.idle ?? null;

    function playAnimation(animation) {
        if (!animation || animation === activeAnimation) return;

        activeAnimation?.stop();
        animation.start(true);
        activeAnimation = animation;
    }

    scene.onBeforeRenderObservable.add(() => {
        if (isPaused()) {
            playAnimation(animations?.idle);
            return;
        }

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
        playAnimation(
            movement.lengthSquared() > 0.0001
                ? animations?.walk
                : animations?.idle
        );

        if (input.jump && isGrounded) {
            verticalVelocity = JUMP_STRENGTH;
            isGrounded = false;
        }

        verticalVelocity += scene.gravity.y * GRAVITY_STEP;
        if (movement.lengthSquared() > 0.0001) {
            player.moveWithCollisions(movement);
            // The vertical collision pass must start from the horizontally
            // resolved position rather than the previous world matrix.
            player.computeWorldMatrix(true);
        }

        const verticalStart = player.position.y;
        const requestedVerticalMovement = verticalVelocity;
        player.moveWithCollisions(
            new Vector3(0, requestedVerticalMovement, 0)
        );
        const actualVerticalMovement = player.position.y - verticalStart;
        const downwardMovementBlocked =
            requestedVerticalMovement < 0 &&
            actualVerticalMovement >
                requestedVerticalMovement + VERTICAL_COLLISION_EPSILON;

        if (player.position.y < floorHeight) {
            player.position.y = floorHeight;
            verticalVelocity = 0;
            isGrounded = true;
        } else if (downwardMovementBlocked) {
            verticalVelocity = 0;
            isGrounded = true;
        } else {
            isGrounded = false;
        }

        cameraTarget.position.copyFrom(player.position);
        cameraTarget.rotation.y = player.rotation.y;
    });
}
