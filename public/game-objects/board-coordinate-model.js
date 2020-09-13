import { Vector } from '../utilities/vector.js'

/**
 * 盤の座標を管理するクラス
 * @param {Vector} centerPosition
 * @param {number} boardWidth
 */
export const BoardCoordinateModel = class {
    constructor(centerPosition, boardWidth) {
        this.centerPosition = centerPosition;
        this.boardWidth = boardWidth;
    }
    /**
     * 1マスの大きさを取得します。
     */
    getSquareScale() {
        return this.boardWidth / 8;
    }
    /**
     * 盤の原点のワールド座標します。
     */
    getOriginWorldPosition() {
        // ワールド座標系での、中心→原点オフセット計算。
        const worldOffset = this.boardWidth / 2;
        // 中心からXY軸へそれぞれオフセットを適応し、原点の座標を取得する。
        const result = this.centerPosition.clone();
        result.minus(new Vector(worldOffset, worldOffset));
        return result;
    }
    /**
     * 任意の盤上の座標が範囲外かを取得します。
     * @param {Vector} boardPosition 盤上の座標
     */
    getBoardPositionIsInRange(boardPosition) {
        const p = boardPosition.clone();
        if (p.x < 0) { return false; }
        if (p.y < 0) { return false; }
        if (p.x >= 8) { return false; }
        if (p.y >= 8) { return false; }
        return true;
    }
    /**
     * 任意のワールド座標が範囲外かを取得します。
     * @param {*} worldPosition ワールド座標
     */
    getWorldPositionIsInRange(worldPosition) {
        const p = worldPosition.clone();
        const cp = this.centerPosition.clone();
        const s = this.boardWidth;
        const hs = s / 2;
        if (p.x < cp.x - hs) { return false; }
        if (p.y < cp.y - hs) { return false; }
        if (p.x > cp.x + hs) { return false; }
        if (p.y > cp.y + hs) { return false; }
        return true;
    }
    /**
     * ワールド座標から盤上の座標を取得します。
     * @param {Vector} worldPosition ワールド座標
     */
    getBoardPosition(worldPosition) {
        // 盤の原点からの相対座標に変換。
        const relativePosition = worldPosition.clone();
        relativePosition.minus(this.getOriginWorldPosition());
        // 盤のXY軸それぞれに投影し、長さを計算。
        const ss = this.getSquareScale()
        const x = Math.floor(relativePosition.x / ss);
        const y = Math.floor(relativePosition.y / ss);
        // その長さがマス何個分の位置にあるかを計算。
        return new Vector(x, y);
    }
    /**
     * 盤上の座標からワールド座標を取得します。
     * @param {Vector} boardPosition 盤上の座標
     */
    getWorldPosition(boardPosition) {
        const ss = this.getSquareScale();
        // マスの中心に合わせるために0.5fを加算。
        const offsetX = (boardPosition.x + 0.5) * ss;
        const offsetY = (boardPosition.y + 0.5) * ss;
        // 盤の原点(端のマスの端)を取得。
        const result = this.getOriginWorldPosition();
        // 原点にオフセットを加算し返す。
        result.plus(new Vector(offsetX, offsetY));
        return result;
    }
};
