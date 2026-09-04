const backgroundMusicUrl =
    `${import.meta.env.BASE_URL}Background Music/Background Music.wav`;

const BACKGROUND_MUSIC_VOLUME = 0.16;

export function setupBackgroundMusic() {
    const music = new Audio(backgroundMusicUrl);
    music.loop = true;
    music.preload = "auto";
    music.volume = BACKGROUND_MUSIC_VOLUME;

    return {
        play() {
            music.play().catch(() => {
                // Playback can be rejected if browser user-activation rules change.
            });
        },
        pause() {
            music.pause();
        },
    };
}
