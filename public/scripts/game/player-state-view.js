import { GraphicsUtilities } from '../utilities/graphics-utilities.js';
import { Vector } from '../utilities/vector.js';
import { DiskView } from './disk-view.js';
import { NumberView } from './number-view.js';

/**
 * プレイヤー1人分の状態を表すUIクラス
 * @param {*} position このUIの座標
 * @param {*} isBlack このUIが示すのは黒プレイヤーか
 */
export const PlayerStateView = class {
    constructor(position, isBlack) {
        this.position = position.clone();
        this.scale = new Vector(100, 30);
        this.normalColor = "gray";
        this.myTurnColor = 'red';
        this.isBlack = isBlack;
        this.isMyTurn = false;

        // 石をアイコンとして使用。
        const diskPosition = new Vector(-35, 0);
        diskPosition.plus(position);
        this.diskView = new DiskView(diskPosition);
        this.diskView.turnTo(isBlack);

        // 数字を描画するクラス。
        this.numberView = new NumberView(position, 'white');
    }
    /**
     * 自分の石の数を設定します。
     * @param {number} diskCount 自分の石の数
     */
    setDiskCount(diskCount) {
        this.numberView.setNumber(diskCount);
    }
    /**
     * 今自分のターンかを設定します。
     * @param {boolean} isMyTurn 今自分のターンか
     */
    setIsMyTurn(isMyTurn) {
        this.isMyTurn = isMyTurn;
    }
    /**
     * このUIを描画します。
     * @param {*} context
     */
    draw(context) {
        GraphicsUtilities.drawRect(context, this.getCurrentColor(), this.position, this.scale);
        this.diskView.draw(context);
        this.numberView.draw(context);
    }
    /**
     * このUIの現在の枠の色を取得します。
     */
    getCurrentColor() {
        return this.isMyTurn ? this.myTurnColor : this.normalColor;
    }
};
