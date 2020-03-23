# meow [![Build Status](https://travis-ci.org/sindresorhus/meow.svg?branch=master)](https://travis-ci.org/sindresorhus/meow)

> CLI app helper

![](meow.gif)

## Features

- Parses arguments using [minimist](https://github.com/substack/minimist)
- Converts flags to [camelCase](https://github.com/sindresorhus/camelcase)
- Outputs version when `--version`
- Outputs description and supplied help text when `--help`
- Makes unhandled rejected promises [fail loudly](https://github.com/sindresorhus/loud-rejection) instead of the default silent fail
- Sets the process title to the binary name defined in package.json

## Install

```
$ npm install --save meow
```
