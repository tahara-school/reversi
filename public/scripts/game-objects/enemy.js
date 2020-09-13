export const Enemy = class {
    constructor(name, networkManager) {
        this.name = name;
        this.networkManager = networkManager;
    }
    getName() {
        return this.name;
    }
    getDiskPutPositionAsync(board, isBlack) {
        return this.networkManager.popNextDisk();
    }
};
