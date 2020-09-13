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

/**
 * [イベント] ユーザーが接続
 */
io.on("connection", socket => {
  console.log("ユーザーが接続しました");
  //---------------------------------
  // 発言を全員に送信
  //---------------------------------
  socket.on("post", msg => {
    io.emit("member-post", msg);
  });
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

    console.log('マッチングしました。');
  });
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
