const path = require("path");
const getPort = require("get-port");
const meow = require("meow");
const serve = require("./serve");

const { input, flags } = meow(
  `
    Usage
        $ sync-copies <folders>
    
    Options
        --port, -p The port to listen to.
        --ignore, -i Ignore files matching a given glob.
    
    Examples
        $ sync-copies ./examples/README1/ ./examples/README2/ --port 3001 --ignore *.DS_Store
`,
  {
    flags: {
      ignore: {
        type: "string",
        alias: "i"
      }
    }
  }
);

(async () => {
  serve({
    folders: input.map(inputPath => path.resolve(inputPath)),
    ignore: flags.ignore ? [flags.ignore] : [],
    port: flags.port || (await getPort())
  });
})();