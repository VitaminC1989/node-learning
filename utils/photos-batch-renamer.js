import fs, { createReadStream, createWriteStream } from "fs";
import path from "path";

/**
 * Reads the contents of a directory recursively.
 *
 * @param {string} directoryPath - The path of the directory to read.
 * @return {void} This function does not return a value.
 */
export function readDirectoryContents(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        console.log("File:", file);
      } else if (stats.isDirectory()) {
        console.log("Directory:", file);
        readDirectoryContents(filePath); // 递归读取子文件夹
      }
    });
  });
}

/**
 * Recursively retrieves all directories within a given directory path.
 *
 * @param {string} directoryPath - The path of the directory to search.
 * @param {Array} directories - An optional array to store the found directories.
 * @return {Array} An array containing the names of all the directories found.
 */
export function getDirectories(directoryPath, directories = []) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      directories.push(file);
      // getDirectories(filePath, directories); // 递归调用以获取子目录
    }
  });

  return directories;
}

// 提取桩号
export function extractPileNumber(filename) {
  const pattern = /K(\d+)/g;
  const matches = filename.matchAll(pattern);
  const miles = Array.from(matches, (match) => match[1]);

  return miles.length > 0 ? miles : null;
}

// 新建文件夹
export function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
    console.log(`文件夹 ${directory} 不存在，已创建成功。`);
  } else {
    console.log(`文件夹 ${directory} 已存在。`);
  }
}

/**
 * Checks if the given file is a photo file.
 *
 * @param {object} file - The file to check.
 * @return {boolean} Returns true if the file is a photo file, false otherwise.
 */
function isPhotoFile(file) {
  return file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name);
}

export function renameFilesInDirectory(
  directory,
  renameRule,
  option = { destinationDir: "" }
) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("An error occurred while reading the directory:", err);
      return;
    }

    files
      .filter((file) => isPhotoFile(file)) // 过滤非照片类型文件
      .forEach((file, index) => {
        const oldFilePath = path.join(directory, file.name);
        const newFileName = renameRule(file.name, index);
        const newFilePath = getNewFilePath(
          directory,
          option.destinationDir,
          newFileName
        );

        fs.rename(oldFilePath, newFilePath, (error) => {
          if (error) {
            console.error(
              `An error occurred while renaming the file ${file.name}:`,
              error
            );
          } else {
            console.log(`File ${file.name} renamed to ${newFileName}`);
          }
        });
      });
  });
}

function getNewFilePath(directory, destinationDir, newFileName) {
  if (destinationDir && destinationDir !== "") {
    return path.join(destinationDir, newFileName);
  } else {
    return path.join(directory, newFileName);
  }
}

export function renameFilesInDirectoryByCopy(
  directory,
  renameRule,
  option = {
    destinationDir: "",
    isReversed: false,
  }
) {
  fs.readdir(directory, { withFileTypes: true }, handleFiles);

  function handleFiles(err, files) {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // 倒转数组
    if (option.isReversed) {
      files.reverse();
    }

    files
      .filter((file) => isPhotoFile(file)) // 过滤非照片类型文件
      .forEach((file, index) => {
        const oldFilePath = path.join(directory, file.name);
        const newFileName = renameRule(file.name, index) || file.name;
        const newFilePath =
          option.destinationDir && option.destinationDir !== ""
            ? path.join(option.destinationDir, newFileName)
            : path.join(directory, newFileName);

        console.log("修改文件名", file.name, newFileName);
        // return

        const readStream = createReadStream(oldFilePath);
        const writeStream = createWriteStream(newFilePath);

        readStream.on("error", (error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });

        writeStream.on("error", (error) => {
          console.error(`Error writing file ${newFileName}:`, error);
        });

        writeStream.on("close", () => {
          console.log(`Renamed file ${file.name} to ${newFileName}`);
        });

        readStream.pipe(writeStream);
      });
  }
}
