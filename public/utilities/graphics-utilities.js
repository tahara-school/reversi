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
        //色を指定
        context.fillStyle = color;
        //円
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2, false);
        context.fill();
    }
};
