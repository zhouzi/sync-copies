const path = require("path");
const getPort = require("get-port");
const open = require("open");
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const getFiles = require("./getFiles");
const saveFile = require("./saveFile");
const getFileContent = require("./getFileContent");

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
      files: async () => {
        const files = await getFiles(opts.folders, opts.match);
        return files.map((basename) => ({ basename }));
      }
    },
    Mutation: {
      saveFileVersion: async (_, { basename, content }) => {
        const versions = opts.folders.map((folder) => ({
          path: path.join(folder, basename),
          content
        }));

        await Promise.all(
          versions.map((version) => saveFile(version.path, version.content))
        );

        return {
          basename,
          versions
        };
      }
    },
    File: {
      versions: (parent) => {
        return opts.folders.map((folder) => ({
          path: path.join(folder, parent.basename),
          content: null
        }));
      }
    },
    FileVersion: {
      content: (parent) => {
        return getFileContent(parent.path);
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
    // eslint-disable-next-line no-console
    console.log(`Now serving app on ${url}`);

    if (opts.open) {
      open(url);
    }
  });
}

module.exports = serve;
