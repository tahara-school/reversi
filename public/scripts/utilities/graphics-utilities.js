
/**
 * レンダリングに関する便利関数群を纏めた静的クラス
 * 基本的に中心座標を指定して描画する。
 */
export const GraphicsUtilities = class {
    // 画像非同期読み込み
    static loadImage = source => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = source;
            image.onload = () => resolve(image);
        });
    }
    // 全画像非同期読み込み
    static loadImageAll = sources => Promise.all(sources.map(loadImage));
    /**
     * canvasを指定色で塗りつぶします。
     * @param {*} canvas
     * @param {*} context
     * @param {*} color 塗りつぶす色
     */
    static drawBackground(canvas, context, color) {
        const rect = canvas.getBoundingClientRect();
        context.fillStyle = color;
        context.fillRect(0, 0, rect.width, rect.height);
    }
    // 画像の描画
    static drawImage(context, image, position, scale) {
        const dw = scale.x;
        const dh = scale.y;
        const dx = position.x - dw / 2;
        const dy = position.y - dh / 2;
        context.drawImage(image, dx, dy, dw, dh);
    }
    // 円の描画
    static drawCircle(context, color, position, radius) {
        //色を指定。
        context.fillStyle = color;
        //円を描画。
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2, false);
        context.fill();
    }
    /**
     * 矩形を描画します。
     * @param {*} context
     * @param {*} color
     * @param {Vector} position 矩形の座標
     * @param {Vector} scale 矩形の拡縮
     */
    static drawRect(context, color, position, scale) {
        const w = scale.x;
        const h = scale.y;
        const x = position.x - w / 2;
        const y = position.y - h / 2;
        //色を指定。
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    }
    /**
     * 文字列を描画します。
     * @param {*} context
     * @param {*} color 描画する文字列の色
     * @param {string} text 描画する文字列
     * @param {Vector} position 描画する座標
     */
    static drawText(context, color, text, position) {
        context.fillStyle = color;
        context.font = "24px serif";
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        const x = position.x;
        const y = position.y;
        context.fillText(text, x, y);
    }
    static drawTitle(context, color, text, position) {
        context.fillStyle = color;
        context.font = "48px serif";
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        const x = position.x;
        const y = position.y;
        context.fillText(text, x, y);
    }
};
