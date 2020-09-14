import { GraphicsUtilities } from '../utilities/graphics-utilities.js';

/**
 * 枠に入った文字列を表示するクラス
 * @param {*} position 座標
 * @param {*} textColor 文字列の色
 * @param {*} text 文字列
 * @param {*} frameColor 枠の色
 * @param {*} frameScale 枠の拡縮
 */
export const TextWithFrameView = class {
    constructor(position, textColor, text, frameColor, frameScale) {
        this.position = position.clone();
        this.textColor = textColor;
        this.text = text;
        this.frameColor = frameColor;
        this.frameScale = frameScale;
    }
    /**
     * 枠と文字列を描画します。
     * @param {*} context
     */
    draw(context) {
        GraphicsUtilities.drawRect(context, this.frameColor, this.position, this.frameScale);
        GraphicsUtilities.drawText(context, this.textColor, this.text, this.position);
    }
};
