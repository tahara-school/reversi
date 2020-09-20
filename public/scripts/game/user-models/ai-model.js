import { ReversiUtilities } from '../../utilities/reversi-utilities.js';
import { PromiseUtilities } from '../../utilities/promise-utilities.js';
import { Vector } from '../../utilities/vector.js';

export const AIModel = class {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getIsPlayer() {
        return false;
    }
    async getDiskPutPositionAsync(board, isBlack) {
        // 考えてるふりをする。
        await PromiseUtilities.delay(0.1);

        // 全マスを走査。
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const p = new Vector(x, y);

                // 石が既にあるマスは無視。
                const state = board.getSquareState(p);
                if (state !== '-') { continue; }

                // 石を置くことで石をひっくり返せるマスだったら、そのマスの座標を返す。
                const turnDisks = ReversiUtilities.getTurnDisks(board, p, isBlack);
                const turnDisksExist = turnDisks.length !== 0;
                if (!turnDisksExist) { continue; }

                return {
                    status: true,
                    result: {
                        diskPosition: p,
                    },
                };
            }
        }
        throw new Error('盤に配置できる場所がありません。');
    }
};
