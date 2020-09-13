/**
 * 2Dベクトルクラス
 * @param {number} x X座標
 * @param {number} y Y座標
 */
export const Vector = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    /**
     * @param {Vector} v
     */
    plus(v) {
        this.x += v.x;
        this.y += v.y;
    }
    /**
     * @param {Vector} v 
     */
    minus(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    /**
     * @param {number} s
     */
    multiple(s) {
        this.x *= s;
        this.y *= s;
    }
};
