import { GraphicsUtilities } from '../utilities/graphics-utilities.js'

/**
 * オセロの石クラス
 * @param {Vector} position 石のワールド座標
 */
export const DiskView = class {
    constructor(position) {
        this.position = position;
        this.radius = 14;
        this.isBlack = true;
        this.blackColor = "black";
        this.whiteColor = "white";
    }
    turn() {
        this.isBlack = !this.isBlack;
    }
    turnTo(isToBlack) {
        this.isBlack = isToBlack;
    }
    getIsBlack() {
        return this.isBlack;
    }
    getCurrentColor() {
        return this.isBlack ? this.blackColor : this.whiteColor;
    }
    draw(context) {
        GraphicsUtilities.drawCircle(context, this.getCurrentColor(), this.position, this.radius);
    }
};
