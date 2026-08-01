import { KeyboardEventTypes } from "@babylonjs/core";

export function setupInput(scene) {
    const input = {
        forward: false,
        back: false,
        left: false,
        right: false,
        jump: false,
    };

    scene.onKeyboardObservable.add((keyboardInfo) => {
        const isDown = keyboardInfo.type === KeyboardEventTypes.KEYDOWN;

        switch (keyboardInfo.event.code) {
            case "KeyW":
            case "ArrowUp":
                input.forward = isDown;
                break;
            case "KeyS":
            case "ArrowDown":
                input.back = isDown;
                break;
            case "KeyA":
            case "ArrowLeft":
                input.left = isDown;
                break;
            case "KeyD":
            case "ArrowRight":
                input.right = isDown;
                break;
            case "Space":
                input.jump = isDown;
                break;
        }
    });

    return input;
}
