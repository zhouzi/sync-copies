const fs = require("fs");

function getFileContent(filePath) {
  return new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (err, content) => {
      resolve(err ? null : content);
    });
  });
}

module.exports = getFileContent;
