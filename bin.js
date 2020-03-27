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
        --match, -m Files to match (glob).
        --open, -o Open the app in the default browser.
    
    Examples
        $ sync-copies ./examples/README1/ ./examples/README2/ --port 3001 --match '*.md'
`,
  {
    flags: {
      match: {
        type: "string",
        alias: "m",
        default: "*"
      },
      port: {
        type: "string",
        alias: "p"
      },
      open: {
        type: "boolean",
        alias: "o",
        default: false
      }
    }
  }
);

serve({
  ...flags,
  folders: input.map(inputPath => path.resolve(inputPath))
});
