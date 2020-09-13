import { ReversiUtilities } from '../utilities/reversi-utilities.js';

export const Player = class {
    constructor(name, networkManager) {
        this.name = name;
        this.networkManager = networkManager;
    }
    getName() {
        return this.name;
    }
    async getDiskPutPositionAsync(board, isBlack) {
        while (true) {
            // 盤のクリックを待機。
            const clickPosition = await board.waitToClickAsync();
            // 既に石があったら再度待機。
            if (board.getSquareState(clickPosition) !== '-') { continue; }

            // クリックしたところに石を置いた時の、ひっくり返る石を取得。
            const diskPositions = ReversiUtilities.getTurnDisks(board, clickPosition, isBlack);
            // ひっくり返らなかったら再度待機。
            var turnDisksExist = diskPositions.length != 0;
            if (!turnDisksExist) { continue; }

            // 通信中の対戦相手に手を通知。
            this.networkManager.pushNextDisk(clickPosition);
            // ひっくり返ったらその座標を返す。
            return clickPosition;
        }
    }
};
