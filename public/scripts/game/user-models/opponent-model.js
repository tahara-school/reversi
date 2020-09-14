export const OpponentModel = class {
    constructor(name, networkManager) {
        this.name = name;
        this.networkManager = networkManager;
    }
    getName() {
        return this.name;
    }
    getIsPlayer() {
        return false;
    }
    getDiskPutPositionAsync(board, isBlack) {
        return this.networkManager.popNextDisk();
    }
};
