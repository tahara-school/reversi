import { Vector } from '../utilities/vector.js';
import { TextWithFrameView } from './text-with-frame-view.js';

/**
 * 画面中央に表示されるテキストUI
 * @param {Vector} position UIを描画する座標
 */
export const CenterTextView = class {
    constructor(position) {
        this.position = position.clone();
        this.frameColor = 'gray';
        this.frameScale = new Vector(400, 50);
        this.textColor = 'white';
        this.textWithFrameView = null;
    }
    /**
     * 指定した文字列を枠に入れて表示します。
     * @param {*} text 表示したい文字列
     */
    beginToDisplay(text) {
        this.textWithFrameView = new TextWithFrameView(this.position, this.textColor, text, this.frameColor, this.frameScale);
    }
    /**
     * 文字列の表示を終了します。
     */
    endToDisplay() {
        this.textWithFrameView = null;
    }
    /**
     * 文字列の表示を開始している場合、表示します。
     * @param {*} context
     */
    draw(context) {
        if (this.textWithFrameView === null) { return; }
        this.textWithFrameView.draw(context);
    }
};
