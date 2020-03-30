const path = require("path");
const fs = require("fs");

function saveFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(filePath), { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        reject(mkdirErr);
        return;
      }
      fs.writeFile(filePath, content, (writeFileErr) => {
        if (writeFileErr) {
          reject(writeFileErr);
          return;
        }
        resolve();
      });
    });
  });
}

module.exports = saveFile;
