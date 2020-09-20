import { PromiseUtilities } from './promise-utilities.js'
import { Vector } from './vector.js'

export const NetworkManager = class {
    constructor() {
        this.socket = io();
        this.isConnected = false;
        
        this.isMatched = false;
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
            this.otherID = msg.otherID;
            this.isBlack = msg.isBlack;
        });
        this.socket.on('put disk', msg => {
            this.isPut = true;
            this.diskPosition = msg.diskPosition;
        });
        this.socket.on('go missing', msg => {
            this.isMatched = false;
            this.otherID = null;
            this.isBlack = null;
        });
    }
    /**
     * 対戦相手を探します。
     */
    async tryToMatchAsync() {
        if (this.isMatched) {
            throw new Error('既に対戦相手が見つかっています。');
        }
        await PromiseUtilities.waitUntil(() => this.isConnected, 0.1);
        this.socket.emit('try to match');
        await PromiseUtilities.waitUntil(() => this.isMatched, 0.1);
        return {
            status: true,
            result: {
                isBlack: this.isBlack,
            },
        };
    }
    endToPlay() {
        this.socket.emit('end to play');
        this.isMatched = false;
        this.otherID = null;
        this.isBlack = null;
    }
    /**
     * 相手の次の手を取得します。
     */
    async popNextDisk() {
        // 切断されているので失敗。
        if (!this.isMatched) {
            return { status: false, result: null };
        }
        // 相手が石を置くまで待機。
        await PromiseUtilities.waitUntil(() => this.isPut || !this.isMatched, 0.1);
        // 切断されたので失敗。
        if (!this.isMatched) {
            return { status: false, result: null };
        }
        // 相手の手を保存。
        const result = this.diskPosition;
        // 同じ手を2回使わないように情報破棄。
        this.isPut = false;
        this.diskPosition = null;
        return {
            status: true,
            result: {
                diskPosition: new Vector(result.x, result.y),
            },
        };
    }
    async pushNextDisk(boardPosition) {
        if (!this.isMatched) {
            throw new Error('通信が切断されました。');
        }
        this.socket.emit('put disk', {
            otherID: this.otherID,
            diskPosition: {
                x: boardPosition.x,
                y: boardPosition.y
            }
        });
    }
};
