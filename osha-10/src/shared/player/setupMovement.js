import "@babylonjs/core/Collisions/collisionCoordinator.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

const MOVE_SPEED = 0.05;
const TURN_SPEED = 0.02;
const JUMP_STRENGTH = 0.22;
const GRAVITY_STEP = 0.02;
const VERTICAL_COLLISION_EPSILON = 0.001;
const REFERENCE_FRAME_MS = 1000 / 60;
const MAX_FRAME_SCALE = 3;

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

        // Preserve the authored 60 fps tuning while keeping movement stable on
        // high-refresh displays and during short frame-rate drops.
        const frameScale = Math.min(
            Math.max(scene.getEngine().getDeltaTime() / REFERENCE_FRAME_MS, 0),
            MAX_FRAME_SCALE
        );

        if (input.left) player.rotation.y -= TURN_SPEED * frameScale;
        if (input.right) player.rotation.y += TURN_SPEED * frameScale;

        const facing = new Vector3(
            Math.sin(player.rotation.y),
            0,
            Math.cos(player.rotation.y)
        );
        let movement = Vector3.Zero();

        if (input.forward) movement.addInPlace(facing);
        if (input.back) movement.subtractInPlace(facing);
        if (movement.lengthSquared() > 0.0001) {
            movement.normalize().scaleInPlace(MOVE_SPEED * frameScale);
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

        verticalVelocity += scene.gravity.y * GRAVITY_STEP * frameScale;
        if (movement.lengthSquared() > 0.0001) {
            player.moveWithCollisions(movement);
            // The vertical collision pass must start from the horizontally
            // resolved position rather than the previous world matrix.
            player.computeWorldMatrix(true);
        }

        const verticalStart = player.position.y;
        const requestedVerticalMovement = verticalVelocity * frameScale;
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
