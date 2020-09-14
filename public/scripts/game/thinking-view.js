import { Vector } from '../utilities/vector.js';
import { TextWithFrameView } from './text-with-frame-view.js';

/**
 * 画面中央に表示されるテキストUI
 * @param {Vector} position UIを描画する座標
 */
export const ThinkingView = class {
    constructor(position) {
        this.position = position.clone();
        this.frameColor = 'rgba(0, 0, 0, 0.3)';
        this.frameScale = new Vector(100, 40);
        this.textColor = 'white';
        this.textWithFrameView = null;
        this.text = '思考中...';
    }
    /**
     * 指定した文字列を枠に入れて表示します。
     */
    beginToDisplay() {
        this.textWithFrameView = new TextWithFrameView(this.position, this.textColor, this.text, this.frameColor, this.frameScale);
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
