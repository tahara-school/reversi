import { GraphicsUtilities } from '../utilities/graphics-utilities.js'
import { Vector } from '../utilities/vector.js'
import { BoardCoordinateModel } from './board-coordinate-model.js'
import { DiskView } from './disk-view.js';

/**
 * オセロの盤面クラス
 * @param {*} input 
 * @param {*} image 
 */
export const BoardView = class {
    constructor(input, image) {
        this.input = input;
        this.image = image;
        this.position = new Vector(300, 250);
        this.boardWidth = 300;
        this.frameWidth = 3;

        // 縦横軸それぞれ違うスケールは未対応なので、Xスケールだけ渡す。
        this.coordinateModel = new BoardCoordinateModel(this.position, this.boardWidth);

        // 盤面情報。まず空で埋める。
        this.diskViewTable = [];
        for (let i = 0; i < 8; i++) {
            const row = [null, null, null, null, null, null, null, null];
            this.diskViewTable.push(row);
        }

        // オセロの初期配置。
        this.putDisk(new Vector(3, 3), false);
        this.putDisk(new Vector(3, 4), true);
        this.putDisk(new Vector(4, 3), true);
        this.putDisk(new Vector(4, 4), false);
    }
    draw(context) {
        // 盤と枠(左右or上下の両側)の幅を足して、全体の幅を計算。
        const totalWidth = this.boardWidth + this.frameWidth * 2;
        const scale = new Vector(totalWidth, totalWidth);
        GraphicsUtilities.drawImage(context, this.image, this.position, scale);

        // 全石を描画。
        for (const diskViewRow of this.diskViewTable) {
            for (const diskView of diskViewRow) {
                if (diskView === null) { continue; }
                diskView.draw(context);
            }
        }
    }
    /**
     * 盤上にクリックされるまで待機します。
     */
    async waitToClickAsync() {
        while (true) {
            // クリックまで待機。
            await this.input.waitToClickAsync();

            // クリック時のカーソル位置が盤上じゃなかったらやり直し。
            const mouseWP = this.input.getMousePosition();
            const isOnBoard = this.coordinateModel.getWorldPositionIsInRange(mouseWP);
            if (!isOnBoard) { continue; }

            // 盤面上のカーソル位置を、盤上の座標に変換して返す。
            const mouseBP = this.coordinateModel.getBoardPosition(mouseWP);
            return mouseBP;
        }
    }
    /**
     * 盤の任意のマスの状態を取得します。
     * @param {Vector} boardPosition 盤上の座標
     */
    getSquareState(boardPosition) {
        // 引数が正しいかを確認。
        const isInRange = this.coordinateModel.getBoardPositionIsInRange(boardPosition);
        if (!isInRange) {
            throw new Error('盤の範囲外が指定されました。');
        }

        const diskView = this.diskViewTable[boardPosition.y][boardPosition.x];

        // まだ石が置かれていない。
        if (diskView === null) {
            return '-';
        }

        // 黒石が置かれている。
        if (diskView.getIsBlack()) {
            return '*';
        }
        // 白石が置かれている。
        else {
            return 'o';
        }
    }
    /**
     * 盤上に石を置きます。
     * @param {Vector} boardPosition 置く石の盤上の座標
     * @param {boolean} isBlack 置く石が黒か
     */
    putDisk(boardPosition, isBlack) {
        // 引数が正しいかを確認。
        const isInRange = this.coordinateModel.getBoardPositionIsInRange(boardPosition);
        if (!isInRange) {
            throw new Error('盤の範囲外が指定されました。');
        }
        if (this.diskViewTable[boardPosition.y][boardPosition.x] !== null) {
            throw new Error(`(x: ${boardPosition.x}, y: ${boardPosition.y})には既に石が置かれています。`);
        }

        // 指定された座標に石を生成。
        const worldPosition = this.coordinateModel.getWorldPosition(boardPosition);
        const createdDisk = new DiskView(worldPosition);
        // 置かれた石を二次元配列に保持。
        this.diskViewTable[boardPosition.y][boardPosition.x] = createdDisk;

        // 指定された表面の色に合わせてひっくり返す。
        createdDisk.turnTo(isBlack);
    }
    /**
     * 盤上の石をひっくり返します。
     * @param {Vector} boardPosition 盤上の座標
     */
    turnDisk(boardPosition) {
        // 引数が正しいかを確認。
        const isInRange = this.coordinateModel.getBoardPositionIsInRange(boardPosition);
        if (!isInRange) {
            throw new Error('盤の範囲外が指定されました。');
        }
        if (this.diskViewTable[boardPosition.y][boardPosition.x] === null) {
            throw new Error('石が置かれていません。');
        }

        // 指定された座標の石をひっくり返す。
        this.diskViewTable[boardPosition.y][boardPosition.x].turn();
    }
};
