import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // 当前模块的文件名
const __dirname = path.dirname(__filename); // 当前模块的目录名

// 合并文件内容到指定文件
function streamMerge(sourceDir, targetFile) {
  const scripts = fs.readdirSync(path.resolve(__dirname, sourceDir));
  const fileWriteStream = fs.createWriteStream(
    path.resolve(__dirname, targetFile)
  );

  streamMergeRecursive(scripts, fileWriteStream, sourceDir);
}

// 递归写入文件
function streamMergeRecursive(scripts = [], fileWriteStream, sourceDir = "") {
  console.log("待写入的文件", scripts);

  if (!scripts.length) {
    // fileWriteStream.end("console.log(Stream合并完成)");
    fileWriteStream.end(() => {
      console.log("Stream合并完成");
    });
    return;
  }

  const curFile = path.resolve(__dirname, sourceDir, scripts.shift());
  const curReadStream = fs.createReadStream(curFile);

  curReadStream.pipe(fileWriteStream, { end: false });
  curReadStream.on("end", () => {
    streamMergeRecursive(scripts, fileWriteStream, sourceDir);
  });

  curReadStream.on("error", (error) => {
    console.error(error);
    fileWriteStream.close();
  });
}

const sourceDir = "file";
const targetFile = "target.txt";

streamMerge(sourceDir, targetFile);


