#!/usr/bin/env node

const path = require("path");
const meow = require("meow");
const serve = require("./serve");

const { input, flags } = meow(
  `
    Usage
        $ sync-copies <folders>
    
    Options
        --port, -p The port to listen to.
        --ignore, -i Ignore files matching a given glob.
        --open, -o Open the app in the default browser.
    
    Examples
        $ sync-copies ./examples/README1/ ./examples/README2/ --port 3001 --ignore *.DS_Store
`,
  {
    flags: {
      ignore: {
        type: "string",
        alias: "i"
      },
      port: {
        type: "string",
        alias: "p"
      },
      open: {
        type: "boolean",
        alias: "o"
      }
    }
  }
);

serve({
  folders: input.map(inputPath => path.resolve(inputPath)),
  ignore: flags.ignore ? [flags.ignore] : [],
  port: flags.port,
  open: flags.open
});
