import { Vector } from "./vector.js";

/**
 * 入力取得クラス
 * @param {*} canvas
 */
export const Input = class {
    constructor(canvas) {
        this.canvas = canvas;

        // canvasに枠があるとその分ズレるので注意。
        const rect = this.canvas.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        // canvas中心座標をマウス座標の初期値とする。
        this.mousePosition = new Vector(x, y);

        // canvas上でマウスが動くたび更新。
        this.canvas.addEventListener('mousemove', e => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.mousePosition = new Vector(x, y);
        });
    }
    /**
     * マウスクリックされるまで待機します。
     */
    waitToClickAsync() {
        return new Promise(resolve => {
            const listener = resolve;
            this.canvas.addEventListener("click", listener, { once: true });
        });
    }
    /**
     * マウスのCanvas上の座標を取得します。
     */
    getMousePosition() {
        return this.mousePosition.clone();
    }
};
