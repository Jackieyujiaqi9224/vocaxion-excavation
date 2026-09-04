const buttonSoundUrl = `${import.meta.env.BASE_URL}Sound Effects/Mechanism Button.mp3`;

const BUTTON_SOUND_VOLUME = 0.35;

export function setupButtonSounds() {
    const sound = new Audio(buttonSoundUrl);
    sound.preload = "auto";
    sound.volume = BUTTON_SOUND_VOLUME;

    document.addEventListener(
        "click",
        (event) => {
            const button = event.target.closest("button");
            if (!button || button.disabled) return;

            sound.currentTime = 0;
            sound.play().catch(() => {
                // Browsers may reject audio if their user-activation policy changes.
            });
        },
        { capture: true }
    );
}
