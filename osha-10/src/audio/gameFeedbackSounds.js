const correctAnswerUrl = new URL(
    "../../Sound Effects/Correct Answer.mp3",
    import.meta.url
).href;
const wrongAnswerUrl = new URL(
    "../../Sound Effects/Wrong Answer.wav",
    import.meta.url
).href;

function createSound(url, volume) {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = volume;
    return audio;
}

const correctSound = createSound(correctAnswerUrl, 0.55);
const wrongSound = createSound(wrongAnswerUrl, 0.5);

function play(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {
        // Ignore a browser-level playback rejection.
    });
}

export function playCorrectAnswerSound() {
    play(correctSound);
}

export function playWrongAnswerSound() {
    play(wrongSound);
}
