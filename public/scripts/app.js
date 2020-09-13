import { PromiseUtilities } from './utilities/promise-utilities.js';
import { GraphicsUtilities } from './utilities/graphics-utilities.js'
import { ReversiUtilities } from './utilities/reversi-utilities.js'
import { Input } from './utilities/input.js'
import { Vector } from './utilities/vector.js';
import { BoardView } from './game-objects/board-view.js';
import { DiskView } from './game-objects/disk-view.js';
import { Player } from './game-objects/player.js'

// ゲームクラス
const Game = class {
    constructor(canvas, context, input) {
        this.canvas = canvas;
        this.context = context;
        this.input = input;
    }
    async initialize() {
        const boardImagePath = "./images/board.png";
        const boardImage = await GraphicsUtilities.loadImage(boardImagePath);

        // 各オブジェクト初期化
        this.boardView = new BoardView(this.input, boardImage);

        // 両プレイヤー初期化
        this.player = new Player('Player');
        this.opponent = new Player('Opponent');
        this.isBlackTurn = true;

        this.test();
    }
    async test() {
        //const p = await this.boardView.waitToClickAsync();
        //console.log(p);
        //this.boardView.putDisk(p, true);

        while (true) {
            // このターンのキャラクターを取得。
            const turnPlayer = this.isBlackTurn ? this.player : this.opponent;

            // 盤の状態取得。
            const boardState = ReversiUtilities.getBoardState(this.boardView, this.isBlackTurn);

            switch (boardState) {
                // 石を置けるのでターン続行。
                case 'Continue':
                    console.log(`${turnPlayer.getName()}の番`);
                    var putDiskPosition = await turnPlayer.getDiskPutPositionAsync(this.boardView, this.isBlackTurn);

                    // 石配置。
                    this.boardView.putDisk(putDiskPosition, this.isBlackTurn);

                    // 石をひっくり返す。
                    var diskPositions = ReversiUtilities.getTurnDisks(this.boardView, putDiskPosition, this.isBlackTurn);
                    for (const diskPosition of diskPositions) {
                        await PromiseUtilities.delay(0.1);
                        this.boardView.turnDisk(diskPosition);
                    }
                    this.isBlackTurn = !this.isBlackTurn;
                    break;

                // 石を置け無かったらパス。
                case 'Pass':
                    console.log(`${turnPlayer.Name}の番はパス`);
                    this.isBlackTurn = !this.isBlackTurn;
                    await PromiseUtilities.delay(3);
                    break;

                // 盤が埋まってたら終了。
                case 'Finish':
                    console.log("ゲーム終了");
                    return;
            }
        }
    }
    update() {
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 各オブジェクト描画
        this.boardView.draw(this.context);
    }
};

// ゲームループ
const update = () => {
    game.update();
    game.draw();
    window.requestAnimationFrame(update);
}

// ゲームインスタンス
let game;

window.onload = async () => {
    // canvas準備
    const canvas = document.getElementById("main-canvas");
    const context = canvas.getContext("2d");
    // 入力取得クラス準備
    const input = new Input(canvas);
    // ゲームクラス準備
    game = new Game(canvas, context, input);
    await game.initialize();

    // ループ開始
    update();
};
