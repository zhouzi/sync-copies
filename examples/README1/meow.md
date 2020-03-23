# meow [![Build Status](https://travis-ci.org/sindresorhus/meow.svg?branch=master)](https://travis-ci.org/sindresorhus/meow)

> CLI app helper

![](meow.gif)

## Features

- Parses arguments
- Converts flags to [camelCase](https://github.com/sindresorhus/camelcase)
- Negates flags when using the `--no-` prefix
- Outputs version when `--version`
- Outputs description and supplied help text when `--help`
- Makes unhandled rejected promises [fail hard](https://github.com/sindresorhus/hard-rejection) instead of the default silent fail
- Sets the process title to the binary name defined in package.json

## Install

```
$ npm install meow
```
