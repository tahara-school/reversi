import { GraphicsUtilities } from '../utilities/graphics-utilities.js';
import { PromiseUtilities } from '../utilities/promise-utilities.js';
import { Vector } from '../utilities/vector.js';
import { TitleSceneView } from './scene-views/title-scene-view.js';
import { MainSceneView } from './scene-views/main-scene-view.js';

// ゲームクラス
export const Game = class {
    constructor(canvas, context, input, networkManager, soundManager) {
        this.canvas = canvas;
        this.context = context;
        this.input = input;
        this.networkManager = networkManager;
        this.soundManager = soundManager;
    }
    async initialize() {
        // 画像の読み込み
        const boardImagePath = "./images/board.png";
        this.boardImage = await GraphicsUtilities.loadImage(boardImagePath);

        // 音の読み込み
        this.soundManager.registerBGM('./sounds/main.mp3', 'main');
        this.soundManager.registerSE('./sounds/decide.wav', 'decide');
        this.soundManager.registerSE('./sounds/put-disk.wav', 'put-disk');

        // canvasの中心座標を取得。
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.centerPosition = new Vector(centerX, centerY);

        // 現在のシーンに初期値としてタイトルシーンを入れる。
        this.currentSceneView = this.createTitleScene();
        this.currentSceneView.initialize();

    }
    update() {
        this.currentSceneView.update();

        const nextSceneName = this.currentSceneView.getNextSceneName();
        if (nextSceneName === null) { return; }

        this.currentSceneView.finalize();
        switch (nextSceneName) {
            case 'Title':
                this.currentSceneView = this.createTitleScene();
                break;
            case 'Main':
                this.currentSceneView = this.createMainScene();
                break;
        }
        this.currentSceneView.initialize();
    }
    draw() {
        // 画面を初期化。
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        GraphicsUtilities.drawBackground(this.canvas, this.context, 'navy');
        this.currentSceneView.draw(this.context);
    }
    createTitleScene() {
        return new TitleSceneView(this.input, this.soundManager, this.centerPosition);
    }
    createMainScene() {
        return new MainSceneView(this.input, this.soundManager, this.networkManager, this.centerPosition, this.boardImage);
    }
};
