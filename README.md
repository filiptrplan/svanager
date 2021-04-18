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
* [`svanager key:add`](#svanager-keyadd)
* [`svanager key:list [FILE]`](#svanager-keylist-file)
* [`svanager test`](#svanager-test)

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

## `svanager key:add`

Adds an SSH key. Opens an interactive shell for unprovided parameters.

```
USAGE
  $ svanager key:add

OPTIONS
  -h, --help                           show CLI help
  -n, --name=name                      Name of the key
  -r, --privateKeyPath=privateKeyPath  Path of the private key
  -u, --publicKeyPath=publicKeyPath    Path of the public key

EXAMPLE
  $ svanager key:add -n my_key -r /home/user/.ssh/id_rsa -u /home/user/.ssh/id_rsa.pub
```

_See code: [src/commands/key/add.ts](https://github.com/filiptrplan/svanager/blob/v1.0.0/src/commands/key/add.ts)_

## `svanager key:list [FILE]`

describe the command here

```
USAGE
  $ svanager key:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/key/list.ts](https://github.com/filiptrplan/svanager/blob/v1.0.0/src/commands/key/list.ts)_

## `svanager test`

description of this example command

```
USAGE
  $ svanager test
```

_See code: [src/commands/test.ts](https://github.com/filiptrplan/svanager/blob/v1.0.0/src/commands/test.ts)_
<!-- commandsstop -->
