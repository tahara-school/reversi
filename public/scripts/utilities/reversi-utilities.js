import { Vector } from './vector.js';

/**
 * オセロのロジック用便利関数群をまとめた静的クラス
 */
export const ReversiUtilities = class {
    /**
     * 盤上の任意の場所に石を置いた時の、任意の方向のひっくり返る石のシーケンスを取得します。
     * @param {*} board 盤情報
     * @param {Vector} diskPosition 置く石の座標
     * @param {boolean} diskIsBlack 置く石が黒か
     * @param {Vector} checkDirection ひっくり返る石を調べたい方向
     */
    static getTurnDisksWithDirection(board, diskPosition, diskIsBlack, checkDirection) {
        const result = [];
        const checkPosition = diskPosition.clone();

        while (true) {
            // 確認中の座標を進める。
            checkPosition.plus(checkDirection);

            // 空白まで対が無かった。
            const state = ReversiUtilities.getSquareStateOrEmpty(board, checkPosition);
            if (state === '-') { return []; }

            // 対が見つかった。
            if (diskIsBlack) {
                if (state === '*') {
                    return result;
                }
            }
            else {
                if (state === 'o') {
                    return result;
                }
            }

            // 挟みたい石があったので保持。
            result.push(checkPosition.clone());
        }
    }
    /**
     * 盤上の任意の場所に石を置いた時の、ひっくり返る石のシーケンスを取得します。
     * @param {*} board 盤情報
     * @param {Vector} diskPosition 置く石の座標
     * @param {boolean} diskIsBlack 置く石が黒か
     */
    static getTurnDisks(board, diskPosition, diskIsBlack) {
        // ひっくり返る可能性のある、全方向ベクトル。
        const directions = [
            new Vector(-1, 0),
            new Vector(1, 0),
            new Vector(0, -1),
            new Vector(0, 1),
            new Vector(-1, -1),
            new Vector(-1, 1),
            new Vector(1, -1),
            new Vector(1, 1),
        ];
        // 全方向のひっくり返る石を集めて返す。
        const result = [];
        for (const direction of directions) {
            const disks = ReversiUtilities.getTurnDisksWithDirection(board, diskPosition, diskIsBlack, direction);
            for (const disk of disks) {
                result.push(disk);
            }
        }
        return result;
    }
    /**
     * 盤の任意のマスの状態を取得します。盤外だった場合は空状態として返します。
     * @param {*} board 盤情報
     * @param {Vector} boardPosition 盤上の座標
     */
    static getSquareStateOrEmpty(board, boardPosition) {
        // 枠外だったら、石が置かれていない扱いとする。
        const isInRange = ReversiUtilities.getIsInRange(boardPosition);
        if (!isInRange) { return '-'; }

        return board.getSquareState(boardPosition);
    }
    /**
     * 任意の盤上の座標が範囲外かを取得します。
     * @param {Vector} boardPosition 盤上の座標
     */
    static getIsInRange(boardPosition) {
        const p = boardPosition.clone();
        if (p.x < 0) { return false; }
        if (p.y < 0) { return false; }
        if (p.x >= 8) { return false; }
        if (p.y >= 8) { return false; }
        return true;
    }
    /**
     * 盤の状態を取得します。
     * 石が置ける: 'Continue',
     * パス: 'Pass',
     * ゲーム終了: 'Finish'
     * @param {*} board 盤情報
     * @param {boolean} isBlack 置く石は黒か
     */
    static getBoardState(board, isBlack) {
        // 空白のマスがあるか。
        let emptyExists = false;

        // 全マスを走査。
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const p = new Vector(x, y);

                // 石が既にあるマスは無視。
                const state = board.getSquareState(p);
                if (state !== '-') { continue; }

                emptyExists = true;

                // 石を置くことで石をひっくり返せるマスだったら、そのマスの座標を返す。
                const turnDisks = ReversiUtilities.getTurnDisks(board, p, isBlack);
                const turnDisksExist = turnDisks.length !== 0;
                if (turnDisksExist) { return 'Continue'; }
            }
        }

        // 空白のマスがあったらパス、無かったらゲーム終了。
        return emptyExists ? 'Pass' : 'Finish';
    }
};
