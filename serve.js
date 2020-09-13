const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// HTMLやJSなどを配置するディレクトリ
const DOCUMENT_ROOT = __dirname + "/public";

app.use(express.static(DOCUMENT_ROOT));

/**
 * "/"にアクセスがあったらindex.htmlを返却
 */


/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  //---------------------------------
  // 発言を全員に送信
  //---------------------------------
  socket.on("post", (msg) => {
    io.emit("member-post", msg);
  });
});

/**
 * 3000番でサーバを起動する
 */
http.listen(3000, () => {
  console.log("listening on *:3000");
});
