svanager
========

A CLI tool for managing web servers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/svanager.svg)](https://npmjs.org/package/svanager)
[![Downloads/week](https://img.shields.io/npm/dw/svanager.svg)](https://npmjs.org/package/svanager)
[![License](https://img.shields.io/npm/l/svanager.svg)](https://github.com/https://github.com/filiptrplan/svanager/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g svanager
$ svanager COMMAND
running command...
$ svanager (-v|--version|version)
svanager/1.0.0 linux-x64 node-v12.18.2
$ svanager --help [COMMAND]
USAGE
  $ svanager COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`svanager hello [FILE]`](#svanager-hello-file)
* [`svanager help [COMMAND]`](#svanager-help-command)

## `svanager hello [FILE]`

describe the command here

```
USAGE
  $ svanager hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ svanager hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/filiptrplan/svanager/blob/v1.0.0/src/commands/hello.ts)_

## `svanager help [COMMAND]`

display help for svanager

```
USAGE
  $ svanager help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
