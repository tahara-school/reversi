import { PromiseUtilities } from '../utilities/promise-utilities.js';
import { GraphicsUtilities } from '../utilities/graphics-utilities.js';
import { ReversiUtilities } from '../utilities/reversi-utilities.js';
import { BoardView } from './board-view.js';
import { PlayerModel } from './player-model.js';
import { OpponentModel } from './opponent-model.js';
import { PlayerStateView } from './player-state-view.js';
import { Vector } from '../utilities/vector.js';
import { CenterTextView } from './center-text-view.js';
import { ThinkingView } from './thinking-view.js';
import { AIModel } from './ai-model.js';

// ゲームクラス
export const Game = class {
    constructor(canvas, context, input, networkManager) {
        this.canvas = canvas;
        this.context = context;
        this.input = input;
        this.networkManager = networkManager;

        this.isOnline = false;
    }
    async initialize() {
        const boardImagePath = "./images/board.png";
        const boardImage = await GraphicsUtilities.loadImage(boardImagePath);

        // canvasの中心座標を取得。
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const center = new Vector(centerX, centerY);

        // 各オブジェクト初期化。
        // 盤面
        this.boardView = new BoardView(this.input, boardImage);
        // プレイヤーの情報(石・石数・ターンプレイヤー)
        const p1 = new Vector(-100, -180);
        p1.plus(center);
        const p2 = new Vector(100, -180);
        p2.plus(center);
        this.playerStateView1 = new PlayerStateView(p1, true);
        this.playerStateView2 = new PlayerStateView(p2, false);
        // マッチング待機中UI
        this.textView = new CenterTextView(center);
        // 思考中UI
        this.thinkingView = new ThinkingView(center);

        this.isBlackTurn = true;

        this.playReversiAsync();
    }
    async playReversiAsync() {
        // 両プレイヤー初期化。
        if (this.isOnline) {
            // マッチングを試み、自分の石を取得。
            this.textView.beginToDisplay('遊ぶ人を探しています...');
            const isBlack = await this.networkManager.tryToMatchAsync();
            this.textView.endToDisplay();

            const playerModel = new PlayerModel('自分', this.networkManager);
            const opponentModel = new OpponentModel('相手', this.networkManager);
            if (isBlack) {
                this.blackUserModel = playerModel;
                this.whiteUserModel = opponentModel;
            }
            else {
                this.blackUserModel = opponentModel;
                this.whiteUserModel = playerModel;
            }

            this.textView.beginToDisplay('遊ぶ人が決まりました！');
            await PromiseUtilities.delay(1);
            this.textView.endToDisplay();
        }
        else {
            //this.blackUserModel = new PlayerModel('自分', null);
            this.blackUserModel = new AIModel('AI');
            this.whiteUserModel = new AIModel('AI');
            this.isBlackTurn = true;
        }

        // 石の数を初期化。
        this.updateDiskNumberView();

        while (true) {
            // このターンのキャラクターを取得。
            const turnPlayer = this.isBlackTurn ? this.blackUserModel : this.whiteUserModel;

            // 盤の状態取得。
            const boardState = ReversiUtilities.getBoardState(this.boardView, this.isBlackTurn);

            switch (boardState) {
                // 石を置けるのでターン続行。
                case 'Continue':
                    console.log(`${turnPlayer.getName()}の番`);

                    // プレイヤー以外の手を待つ場合、
                    if (!turnPlayer.getIsPlayer()) {
                        // 思考中UIを出す。
                        this.thinkingView.beginToDisplay();
                    }
                    var putDiskPosition = await turnPlayer.getDiskPutPositionAsync(this.boardView, this.isBlackTurn);
                    this.thinkingView.endToDisplay();

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
                    await PromiseUtilities.delay(0.1);
                    break;

                // 盤が埋まってたら終了。
                case 'Finish':
                    console.log("ゲーム終了");
                    const result = ReversiUtilities.getDiskCount(this.boardView);
                    const isDraw = result.blackCount === result.whiteCount;
                    const blackWins = result.blackCount > result.whiteCount;
                    if (isDraw) {
                        this.textView.beginToDisplay('引き分け！');
                    }
                    else if (blackWins) {
                        this.textView.beginToDisplay('黒番の勝利！');
                    }
                    else {
                        this.textView.beginToDisplay('白番の勝利！');
                    }
                    return;
            }

            // ターンが終了したので、石を数え直して表示を更新。
            this.updateDiskNumberView();
        }
    }
    update() {
    }
    draw() {
        // 画面を初期化。
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        GraphicsUtilities.drawBackground(this.canvas, this.context, 'navy');

        // 各オブジェクト描画。
        this.boardView.draw(this.context);
        this.playerStateView1.draw(this.context);
        this.playerStateView2.draw(this.context);

        // テキストUI描画。
        this.textView.draw(this.context);
        this.thinkingView.draw(this.context);
    }
    updateDiskNumberView() {
        const result = ReversiUtilities.getDiskCount(this.boardView);
        this.playerStateView1.setDiskCount(result.blackCount);
        this.playerStateView2.setDiskCount(result.whiteCount);
    }
};
