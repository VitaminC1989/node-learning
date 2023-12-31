import net from "net";

const client = new net.createConnection({
  host: "127.0.0.1",
  port: 3000,
});

client.on("connect", () => {
  client.write("客户端开始写入数据>>>>>>");

  setTimeout(() => {
    client.write("JavaScript ");
    client.write("TypeScript ");
    client.write("Python ");
    client.write("Java ");
    client.write("C ");
    client.write("PHP ");
    client.write("ASP.NET ");
  }, 1000);
});

client.on("data", (buffer) => {
  console.log("[客户端接受信息]", buffer.toString());
});

// 例如监听一个未开启的端口就会报 ECONNREFUSED 错误
client.on("error", (err) => {
  console.error("服务器异常：", err);
});

client.on("close", (err) => {
  console.log("客户端链接断开！", err);
});
