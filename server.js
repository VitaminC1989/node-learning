import net from "net";

const HOST = "127.0.0.1";
const PORT = "3000";

const server = net.createServer();
server.listen(PORT, HOST);
server.on("listening", () => {
  console.log(`服务已开启在${HOST}:${PORT}`);
});

server.on("connection", (socket) => {
  socket.on("data", (buffer) => {
    const msg = buffer.toString();
    console.log("[服务端接受信息]",msg);

    // 写入数据 发回客户端
    socket.write(Buffer.from("服务器已接收到信息：" + msg));
  });
});

server.on("close", () => {
  console.log("服务已关闭");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log("地址正被使用，重试中...");

    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  } else {
    console.error("服务器异常：", err);
  }
});
