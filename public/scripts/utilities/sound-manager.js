export const SoundManager = class {
    constructor() {
        this.soundSources = {};
    }
    registerSE(source, soundName) {
        this.soundSources[soundName] = source;
    }
    playSE(soundName) {
        new Audio(this.soundSources[soundName]).play();
    }
};
