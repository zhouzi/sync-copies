const path = require("path");
const mockFs = require("mock-fs");
const getFileContent = require("../getFileContent");

describe("getFileContent", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("should get an exisiting file's content", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "readme.md": ""
        }
      }
    });

    const actual = await getFileContent(path.resolve("./packages/a/readme.md"));
    const expected = "";

    expect(actual).toEqual(expected);
  });

  it("should return null if the file doesn't exist", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {}
      }
    });

    const actual = await getFileContent(path.resolve("./packages/a/readme.md"));
    const expected = null;

    expect(actual).toEqual(expected);
  });
});
