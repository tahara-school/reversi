const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// HTMLやJSなどを配置するディレクトリ
const DOCUMENT_ROOT = __dirname + "/public";

// 静的ファイルを返す
app.use(express.static(DOCUMENT_ROOT));

// マッチング待機中のユーザー配列
const usersWaitingToMatch = [];
// 対戦中のユーザーペア配列
let userPairsPlaying = [];

/**
 * [イベント] ユーザーが接続
 */
io.on("connection", socket => {
    console.log("ユーザーが接続しました。");

    // 切断
    socket.on("disconnect", msg => {
        console.log('ユーザーが切断しました。');

        const p = userPairsPlaying.find(p => p[0] == socket.id || p[1] == socket.id);
        if (p === undefined) { return; }

        // 相手に接続通知。
        const other = (p[0] == socket.id) ? p[1] : p[0];
        io.to(other).emit('go missing');
    });

    // 対戦相手の要求
    socket.on('try to match', msg => {
        usersWaitingToMatch.push(socket.id);
        console.log('ユーザーが接続待機を開始しました。');

        // マッチングできる人数待機していたらマッチング。
        if (usersWaitingToMatch.length < 2) { return; }

        // 待機ユーザーから2人取り出す。
        const user1 = usersWaitingToMatch.shift();
        const user2 = usersWaitingToMatch.shift();

        // マッチングしたユーザーに通知。
        io.to(user1).emit('finish matching', {
            selfID: user1,
            otherID: user2,
            isBlack: true
        })
        io.to(user2).emit('finish matching', {
            selfID: user2,
            otherID: user1,
            isBlack: false
        })

        // プレイ中のユーザーとして保持。
        userPairsPlaying.push([user1, user2]);

        console.log('マッチングしました。');
    });

    // 対戦終了
    socket.on('end to play', msg => {
        userPairsPlaying = userPairsPlaying.filter(p => p[0] != socket.id && p[1] != socket.id);
    });

    // 石の配置
    socket.on('put disk', msg => {
        console.log('石が置かれました。');
        console.log(msg.otherID);
        io.to(msg.otherID).emit('put disk', { diskPosition: msg.diskPosition });
    });
});

/**
 * 3000番でサーバを起動する
 */
http.listen(3000, () => {
    console.log("listening on *:3000");
});
