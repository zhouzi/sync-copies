const path = require("path");
const fs = require("fs");
const minimatch = require("minimatch");
const getPort = require("get-port");
const open = require("open");
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

async function serve(opts) {
  if (opts.folders.length <= 0) {
    throw new Error(`A list of folders must be provided.`);
  }

  const typeDefs = gql`
    type FileVersion {
      path: String!
      content: String
    }

    type File {
      basename: String!
      versions: [FileVersion]
    }

    type Query {
      folders: [String]
      match: String!
      files: [File]
    }

    type Mutation {
      saveFileVersion(basename: String!, content: String!): File
    }
  `;

  const resolvers = {
    Query: {
      folders: () => {
        return opts.folders;
      },
      match: () => {
        return opts.match;
      },
      files: () =>
        opts.folders
          .map(folder => fs.readdirSync(folder))
          .reduce((acc, files) => acc.concat(files), [])
          .reduce(
            (acc, file) => (acc.includes(file) ? acc : acc.concat([file])),
            []
          )
          .filter(file => minimatch(file, opts.match))
          .map(file => ({
            basename: file
          }))
    },
    Mutation: {
      saveFileVersion: (_, { basename, content }) => {
        opts.folders.forEach(folder => {
          fs.writeFileSync(path.join(folder, basename), content);
        });

        return {
          basename,
          versions: opts.folders.map(folder => ({
            path: path.join(folder, basename),
            content
          }))
        };
      }
    },
    File: {
      versions: ({ basename }) => {
        return opts.folders.map(folder => ({
          path: path.join(folder, basename),
          content: null
        }));
      }
    },
    FileVersion: {
      content: parent => {
        if (fs.existsSync(parent.path)) {
          return fs.readFileSync(parent.path, "utf8");
        }
        return null;
      }
    }
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  const app = express();

  server.applyMiddleware({ app });

  app.use(express.static(path.join(__dirname, "./public")));

  app.get((req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  const port = opts.port || (await getPort());
  const url = `http://localhost:${port}/`;

  app.listen(port, () => {
    console.log(`Now serving app on ${url}`);

    if (opts.open) {
      open(url);
    }
  });
}

module.exports = serve;
