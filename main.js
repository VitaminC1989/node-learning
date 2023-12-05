import {
  readDirectoryContents,
  getDirectories,
  extractPileNumber,
  createDirectory,
  renameFilesInDirectory,
  renameFilesInDirectoryByCopy,
} from "./utils/photos-batch-renamer.js";

import { executeCommand } from "./utils/common.mjs";

import path from "path";

// ---------------- 路径信息 ----------------
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);
// console.log("Root directory:", rootDir);

// 测试文件路径
// const path = "/Volumes/Elements/集团2023路面定检景观照片/东永";
const demoPath = `${rootDir}/file/东永`;
const renamedFolderPath = `${rootDir}/file/重命名`;

const folders = getDirectories(demoPath);
console.log("folder", folders);

// ---------------- 遍历文件夹 ----------------
folders.forEach(async (folderName) => {
  // 获取文件夹名称中的桩号
  const pileNumbers = extractPileNumber(folderName);
  const [pileStart, pileEnd] = pileNumbers;
  // 根据桩号计算公里
  const km = Math.abs(pileEnd - pileStart);
  const isDownLane = pileEnd - pileStart < 0; // 是否为下行车道

  console.log("pileNumber", pileNumbers, km);

  // 获取当前文件夹中的文件的数量
  const folderPath = `${demoPath}\/${folderName}`;
  // 只查找照片类型文件的数量 避免将.DS_Store等不相关文件算进来
  const command = `find "${folderPath}" -type f -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" | wc -l`;
  const photosNumber = (await executeCommand(command)).trim();
  console.log("照片数量", photosNumber);

  // 根据照片数量 计算刻度 单位（m）
  // const scale = Math.round((km / (photosNumber - 1)) * 1000);
  let scale = (km / (photosNumber - 1)) * 1000;
  // scale = Math.floor(scale * 10) / 10;
  console.log(`根据起始桩号和照片数量 计算每张照片之间的距离为 ${scale}(m)`);

  // return;

  // 创建文件夹（存储重命名后的文件）
  const destinationDir = `${renamedFolderPath}/${folderName}`;
  createDirectory(destinationDir);

  // 重命名文件

  // renameFilesInDirectory(
  renameFilesInDirectoryByCopy(
    folderPath,
    (filename, index) => {
      // if (index > 100) return;
      // console.log("filename", filename);

      const curLength = scale * index;
      const ONE_KM = 1000;

      const km = Math.floor(curLength / ONE_KM);
      const m = Math.round(curLength % ONE_KM);
      // const m = curLength % ONE_KM;
      // const m = ((curLength / ONE_KM) % 1) * ONE_KM;

      const start = isDownLane ? pileEnd : pileStart;
      const curPile = +start + km;
      const distance = m.toString().padStart(3, "0");
      const [name, ext] = filename.split("."); // 取文件名后缀前的部分
      const newFilename = `${name}-K${curPile}+${distance}.${ext}`;

      console.log("km m curLength", km, m, curLength, "\n");
      return newFilename;
    },
    { destinationDir, isReversed: isDownLane }
  );
});
