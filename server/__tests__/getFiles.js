const path = require("path");
const mockFs = require("mock-fs");
const getFiles = require("../getFiles");

describe("getFiles", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("should find all files in a directory", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "readme.md": ""
        }
      }
    });

    const actual = await getFiles(["./packages/a"], "*");
    const expected = ["readme.md"];

    expect(actual).toEqual(expected);
  });

  it("should find all files in several directories", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "readme.md": ""
        },
        b: {
          "license.md": ""
        }
      }
    });

    const actual = await getFiles(["./packages/a", "./packages/b"], "*");
    const expected = ["readme.md", "license.md"];

    expect(actual).toEqual(expected);
  });

  it("should dedupe files", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "readme.md": ""
        },
        b: {
          "readme.md": ""
        }
      }
    });

    const actual = await getFiles(["./packages/a", "./packages/b"], "*");
    const expected = ["readme.md"];

    expect(actual).toEqual(expected);
  });

  it("should find all files with a particular type", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "readme.md": "",
          "index.html": ""
        }
      }
    });

    const actual = await getFiles(["./packages/a", "./packages/b"], "*.md");
    const expected = ["readme.md"];

    expect(actual).toEqual(expected);
  });

  it("should find all files in sub directories", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          src: {
            "readme.md": ""
          }
        }
      }
    });

    const actual = await getFiles(["./packages/a"], "**/*.md");
    const expected = ["src/readme.md"];

    expect(actual).toEqual(expected);
  });
});
