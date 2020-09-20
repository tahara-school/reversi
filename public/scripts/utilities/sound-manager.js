export const SoundManager = class {
    constructor() {
        this.sounds = {};
    }
    registerSE(source, soundName) {
        this.sounds[soundName] = new Audio(source);
    }
    playSE(soundName) {
        this.sounds[soundName].play();
    }
};
