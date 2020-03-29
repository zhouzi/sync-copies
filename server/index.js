const path = require("path");
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

const folders = [
  "../examples/package-a",
  "../examples/package-b",
  "../examples/package-c",
  "../examples/package-d"
].map(folder => path.join(__dirname, folder));
const match = "*.md";

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
      return folders;
    },
    match: () => {
      return match;
    },
    files: () =>
      folders
        .map(folder => fs.readdirSync(folder))
        .reduce((acc, files) => acc.concat(files), [])
        .reduce(
          (acc, file) => (acc.includes(file) ? acc : acc.concat([file])),
          []
        )
        .map(file => ({
          basename: file
        }))
  },
  Mutation: {
    saveFileVersion: (_, { basename, content }) => {
      folders.forEach(folder => {
        fs.writeFileSync(path.join(folder, basename), content);
      });

      return {
        basename,
        versions: folders.map(folder => ({
          path: path.join(folder, basename),
          content
        }))
      };
    }
  },
  File: {
    versions: ({ basename }) => {
      return folders.map(folder => ({
        path: path.join(folder, basename),
        content: null
      }));
    }
  },
  FileVersion: {
    content: ({ path }) => {
      if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf8");
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

const port = 3000;
const url = `http://localhost:${port}/`;
app.listen(3000, () => {
  console.log(`Now serving app on ${url}`);
});
