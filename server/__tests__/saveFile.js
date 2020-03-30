const path = require("path");
const fs = require("fs");
const mockFs = require("mock-fs");
const saveFile = require("../saveFile");

describe("saveFile", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("should save a file", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {}
      }
    });

    const filePath = path.resolve("./packages/a/readme.md");
    await saveFile(filePath, "");

    const actual = fs.readFileSync(filePath, "utf8");
    const expected = "";

    expect(actual).toEqual(expected);
  });

  it("should create the missing sub directories", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {}
      }
    });

    const filePath = path.resolve("./packages/a/docs/introduction/readme.md");
    await saveFile(filePath, "");

    const actual = fs.readFileSync(filePath, "utf8");
    const expected = "";

    expect(actual).toEqual(expected);
  });

  it("should not delete other files", async () => {
    mockFs({
      [path.resolve("./packages")]: {
        a: {
          "license.md": ""
        }
      }
    });

    const filePath = path.resolve("./packages/a/readme.md");
    await saveFile(filePath, "");

    const actual = fs.readFileSync(
      path.join(path.dirname(filePath), "license.md"),
      "utf8"
    );
    const expected = "";

    expect(actual).toEqual(expected);
  });
});
