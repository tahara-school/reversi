export const SoundManager = class {
    constructor() {
        this.currentBGM = null;
        this.BGMSources = {};
        this.SESources = {};
    }
    registerBGM(source, soundName) {
        this.BGMSources[soundName] = source;
    }
    playBGM(soundName) {
        if (this.currentBGM !== null) {
            this.currentBGM.pause();
            this.currentBGM = null;
        }
        this.currentBGM = new Audio(this.BGMSources[soundName]);
        this.currentBGM.loop = true;
        this.currentBGM.play();
    }
    stopBGM() {
        this.currentBGM.pause();
        this.currentBGM = null;
    }
    registerSE(source, soundName) {
        this.SESources[soundName] = source;
    }
    playSE(soundName) {
        new Audio(this.SESources[soundName]).play();
    }
};
