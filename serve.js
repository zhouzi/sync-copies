const fs = require("fs");
const path = require("path");
const getPort = require("get-port");
const open = require("open");
const minimatch = require("minimatch");
const express = require("express");
const bodyParser = require("body-parser");

async function serve(opts) {
  const app = express();

  app.use(bodyParser.json());

  app.get("/api/files", (req, res) => {
    const files = opts.folders.reduce((allFiles, folder) => {
      return fs
        .readdirSync(folder)
        .filter(basename => minimatch(basename, opts.match))
        .reduce((acc, basename) => {
          const filePath = path.join(folder, basename);
          const content = fs.readFileSync(filePath, "utf8");

          return Object.assign(acc, {
            [basename]: Object.assign(
              allFiles[basename] ||
                opts.folders.reduce((acc, otherFolder) => {
                  const otherFilePath = path.join(otherFolder, basename);
                  return Object.assign(acc, {
                    [otherFilePath]: ""
                  });
                }, {}),
              {
                [filePath]: content
              }
            )
          });
        }, allFiles);
    }, {});

    res.json(
      Object.keys(files)
        .filter(basename => {
          const file = files[basename];
          const contents = Object.values(file);

          return contents.some(content => content !== contents[0]);
        })
        .reduce(
          (acc, basename) =>
            Object.assign(acc, { [basename]: files[basename] }),
          {}
        )
    );
  });

  app.post("/api/files", (req, res) => {
    req.body.forEach(({ path: filePath, content }) => {
      fs.writeFileSync(filePath, content);
    });
    res.json({ ok: true });
  });

  app.use(express.static(path.join(__dirname, "./build")));

  app.get((req, res) => {
    res.sendFile(path.join(__dirname, "./build/index.html"));
  });

  const port = opts.port || (await getPort());
  app.listen(port, () => {
    const url = `http://localhost:${port}/`;

    console.log(`Now serving on ${url}`);

    if (opts.open) {
      open(url);
    }
  });
}

module.exports = serve;
