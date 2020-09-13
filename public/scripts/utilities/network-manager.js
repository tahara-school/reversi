import { PromiseUtilities } from './promise-utilities.js'
import { Vector } from './vector.js'

export const NetworkManager = class {
    constructor(socket) {
        this.socket = socket;
        this.isConnected = false;
        this.isMatched = false;
        this.selfID = null;
        this.otherID = null;
        this.isBlack = null;

        this.isPut = false;
        this.diskPosition = null;

        // 正常に接続出来た時呼ばれる。
        this.socket.on('connect', () => {
            this.isConnected = true;
        });
        this.socket.on('finish matching', msg => {
            this.isMatched = true;
            this.selfID = msg.selfID;
            this.otherID = msg.otherID;
            this.isBlack = msg.isBlack;
        });
        this.socket.on('put disk', msg => {
            this.isPut = true;
            this.diskPosition = msg.diskPosition;
        });
    }
    async tryToMatchAsync() {
        await PromiseUtilities.waitUntil(() => this.isConnected, 0.1);
        this.socket.emit('try to match');
        await PromiseUtilities.waitUntil(() => this.isMatched, 0.1);
        return this.isBlack;
    }
    async popNextDisk() {
        // 相手が石を置くまで待機。
        await PromiseUtilities.waitUntil(() => this.isPut, 0.1);
        // 相手の手を保存。
        const result = this.diskPosition;
        // 同じ手を2回使わないように情報破棄。
        this.isPut = false;
        this.diskPosition = null;
        return new Vector(result.x, result.y);
    }
    async pushNextDisk(boardPosition) {
        this.socket.emit('put disk', {
            otherID: this.otherID,
            diskPosition: {
                x: boardPosition.x,
                y: boardPosition.y
            }
        });
    }
};
