const fs = require("fs");
const path = require("path");
const getPort = require("get-port");
const open = require("open");
const minimatch = require("minimatch");
const express = require("express");
const bodyParser = require("body-parser");

function createVersion(folder, basename) {
  return {
    path: path.join(folder, basename),
    content: null
  };
}

function createVersions(basename, folders) {
  return folders.reduce(
    (versions, folder) =>
      Object.assign(versions, {
        [folder]: createVersion(folder, basename)
      }),
    {}
  );
}

function createFileCopy(basename, folders) {
  return {
    basename,
    versions: createVersions(basename, folders)
  };
}

function createFilesCopies(folders, match) {
  return folders.reduce(
    (acc, folder) =>
      fs
        .readdirSync(folder)
        .filter(basename => minimatch(basename, match))
        .filter(basename => acc[basename] == null)
        .reduce(
          (acc, basename) =>
            Object.assign(acc, {
              [basename]: createFileCopy(basename, folders)
            }),
          acc
        ),
    {}
  );
}

function readVersionContent(version) {
  return {
    ...version,
    content: fs.existsSync(version.path)
      ? fs.readFileSync(version.path, "utf8")
      : null
  };
}

function readVersionsContent(map) {
  return Object.keys(map).reduce((files, basename) => {
    const file = map[basename];

    return Object.assign(files, {
      [basename]: {
        ...file,
        versions: Object.keys(file.versions).reduce(
          (versions, folder) =>
            Object.assign(versions, {
              [folder]: readVersionContent(file.versions[folder])
            }),
          {}
        )
      }
    });
  }, {});
}

async function serve(opts) {
  const app = express();

  app.use(bodyParser.json());

  app.get("/api/files", (req, res) => {
    res.json(readVersionsContent(createFilesCopies(opts.folders, opts.match)));
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
