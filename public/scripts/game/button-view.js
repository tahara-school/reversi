import { TextWithFrameView } from './text-with-frame-view.js';

/**
 * ボタンクラス
 * @param {*} input 入力取得クラス
 * @param {*} position ボタンの中心座標
 * @param {*} scale ボタンの拡縮
 */
export const ButtonView = class {
    constructor(input, position, scale, frameColor, text, textColor) {
        this.input = input;
        this.position = position.clone();
        this.scale = scale.clone();
        this.textWithFrameView = new TextWithFrameView(position, textColor, text, frameColor, scale);
    }
    /**
     * ボタンを描画します。
     * @param {*} context
     */
    draw(context) {
        this.textWithFrameView.draw(context);
    }
    /**
     * ボタンがクリックされるまで待機します。
     */
    async waitToClickAsync() {
        while (true) {
            // クリックまで待機。
            await this.input.waitToClickAsync();

            // クリック時のカーソル位置が盤上じゃなかったらやり直し。
            const p = this.input.getMousePosition();
            const isOnButton = this.getIsOnButton(p);
            if (!isOnButton) { continue; }

            // ボタンが押されたので待機終了。
            return;
        }
    }
    /**
     * 任意の座標がボタンの上かを取得します。
     * @param {*} position ボタンの上かを調べたい座標
     */
    getIsOnButton(position) {
        const p = position.clone();
        const c = this.position.clone();
        const hw = this.scale.x / 2;
        const hh = this.scale.y / 2;
        if (p.x < c.x - hw) { return false; }
        if (p.y < c.y - hh) { return false; }
        if (p.x > c.x + hw) { return false; }
        if (p.y > c.y + hh) { return false; }
        return true;
    }
};
