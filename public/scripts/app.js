import { Input } from './utilities/input.js'
import { NetworkManager } from './utilities/network-manager.js';
import { Game } from './game/game.js';

// ゲームループ
const update = () => {
    game.update();
    game.draw();
    window.requestAnimationFrame(update);
}

// ゲームインスタンス
let game;

window.onload = async () => {
    // ネットワーク管理クラス準備
    const socket = io();
    const networkManager = new NetworkManager(socket);
    // canvas準備
    const canvas = document.getElementById("main-canvas");
    const context = canvas.getContext("2d");
    // 入力取得クラス準備
    const input = new Input(canvas);
    // ゲームクラス準備
    game = new Game(canvas, context, input, networkManager);
    await game.initialize();

    // ループ開始
    update();
};
