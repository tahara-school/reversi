import { GraphicsUtilities } from '../../utilities/graphics-utilities.js';

export const TitleSceneView = class {
    constructor(centerPosition) {
        this.centerPosition = centerPosition;
        this.nextSceneName = null;
        this.mainSceneName = 'Main';
    }
    update() {
    }
    draw(context) {
        GraphicsUtilities.drawText(context, 'silver', 'リバーシ', this.centerPosition)
    }
    getNextSceneName() {
        return this.nextSceneName;
    }
};
