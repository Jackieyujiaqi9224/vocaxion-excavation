import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents.js";

export function setupInput(scene) {
    const input = {
        forward: false,
        back: false,
        left: false,
        right: false,
        jump: false,
    };

    const reset = () => {
        input.forward = false;
        input.back = false;
        input.left = false;
        input.right = false;
        input.jump = false;
    };
    const isEditableTarget = (target) =>
        target instanceof Element &&
        Boolean(target.closest("input, textarea, select, [contenteditable='true']"));

    scene.onKeyboardObservable.add((keyboardInfo) => {
        const isDown = keyboardInfo.type === KeyboardEventTypes.KEYDOWN;
        if (isDown && isEditableTarget(keyboardInfo.event.target)) return;

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

    const resetWhenHidden = () => {
        if (document.hidden) reset();
    };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", resetWhenHidden);
    scene.onDisposeObservable.addOnce(() => {
        window.removeEventListener("blur", reset);
        document.removeEventListener("visibilitychange", resetWhenHidden);
    });

    return input;
}
