const correctAnswerUrl = `${import.meta.env.BASE_URL}Sound Effects/Correct Answer.mp3`;
const wrongAnswerUrl = `${import.meta.env.BASE_URL}Sound Effects/Wrong Answer.wav`;

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
