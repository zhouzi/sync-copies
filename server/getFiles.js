const glob = require("glob");

async function getFiles(folders, match, acc = []) {
  return new Promise((resolve, reject) => {
    if (folders.length <= 0) {
      resolve(acc);
      return;
    }

    const head = folders[0];
    const tail = folders.slice(1);

    glob(
      match,
      {
        cwd: head,
        root: head
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(
          getFiles(
            tail,
            match,
            acc.concat(files.filter((file) => !acc.includes(file)))
          )
        );
      }
    );
  });
}

module.exports = getFiles;
