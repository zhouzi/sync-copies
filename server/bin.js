#!/usr/bin/env node
const path = require("path");
const meow = require("meow");
const serve = require("./serve");

const { input, flags } = meow(
  `
    Usage
        $ sync-copies <folders>
    
    Options
        --match, -m Files to match in the provided folders.
        --port, -p The port to listen to.
        --open, -o Open the app in the default browser.
    
    Examples
        $ sync-copies ./packages/package-a/ ./packages/package-b/ --match '*.md'
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
  folders: input.map((inputPath) => path.resolve(inputPath))
});
