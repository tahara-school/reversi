export const PromiseUtilities = class {
    static delay(seconds) {
        const ms = Math.floor(seconds * 1000);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
