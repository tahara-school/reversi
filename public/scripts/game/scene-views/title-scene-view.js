import { GraphicsUtilities } from '../../utilities/graphics-utilities.js';
import { Vector } from '../../utilities/vector.js';
import { ButtonView } from '../button-view.js';

export const TitleSceneView = class {
    constructor(input, soundManager, centerPosition) {
        this.soundManager = soundManager;
        this.nextSceneName = null;
        this.mainSceneName = 'Main';

        this.titlePosition = centerPosition.clone();
        this.titlePosition.plus(new Vector(0, -40));
        const buttonPosition = centerPosition.clone();
        buttonPosition.plus(new Vector(0, 50));

        this.startButton = new ButtonView(input, buttonPosition, new Vector(100, 40), 'gray', '遊ぶ', 'white');
        this.waitToClickAndTransitionSceneAsync();
    }
    initialize() {
    }
    finalize() {
    }
    update() {
    }
    draw(context) {
        GraphicsUtilities.drawTitle(context, 'silver', 'リバーシ', this.titlePosition)
        this.startButton.draw(context);
    }
    getNextSceneName() {
        return this.nextSceneName;
    }
    async waitToClickAndTransitionSceneAsync() {
        await this.startButton.waitToClickAsync();
        this.nextSceneName = this.mainSceneName;
        this.soundManager.playSE('decide');
    }
};
