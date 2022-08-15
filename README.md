# userscript-composer

Ability to compose userscripts for unified distribution.

**Table of Contents**

- [userscript-composer](#userscript-composer)
- [Overview](#overview)
  - [Quickstart](#quickstart)
  - [Workaround](#workaround)
- [Usage](#usage)
  - [Commands](#commands)
    - [`userscript-composer init`](#userscript-composer-init)
    - [`userscript-composer build`](#userscript-composer-build)
    - [`userscript-composer batch`](#userscript-composer-batch)
    - [`userscript-composer unify`](#userscript-composer-unify)
  - [API](#api)
- [Development](#development)

---

# Overview

Elegant userscript build tool with:
- ✨ TypeScript support
- 💫 JSX support
- 🔗 Bundling with dependencies
- 📋 Composing scripts
- 🙃 Standalone bundling

userscript-composer is built top on **cac, esbuild, picomatch, and terser** to give you best development experience and production output.
Thanks to authors and contributors of those packages as userscript-composer could not exists without their technologies.

## Quickstart

To install quick as possible, you can use following commands to initiate building.

```sh
mkdir userscript-composer-playground
cd userscript-composer-playground

mkdir scripts
touch header.txt # header.txt will be prepended to unified output

npm init -y
npm install -g userscript-composer

# Or you may use GitHub for latest versions which might have bug fixes for NPM versions
npm install -g git+https://github.com/seia-soto/userscript-composer.git
```

The script above will install userscript-composer as global package.
If you don't want to install package as global, you can remove `-g` flag from the command and add following entry to `script` in `package.json`.

```json
{
  "scripts": {
    "composer": "userscript-composer"
  }
}
```

Now, bomb!

```sh
npm run composer -h
```

## Workaround

The reason of userscript-composer to exist is automating the build process of multiple userscripts into one userscript.
To reach the goal, I decided to use transpilers and bundlers to build userscripts, and this made userscript-composer able to compile TypeScript, JSX files, and userscripts including dependencies.

Sure, we need some refactoring to enhance developer experience of userscript-composer project but here is the brief summary of the process.

1. `cac` process cli part
2. `esbuild` bundles and transforms userscripts
3. `picomatch` recognizes glob patterns and exports to regular expression
4. `terser` compresses the output

It's the basic thought I did first time to build this application.
I think this would be helpful if you want to contribute.

Then go to development section to continue.

# Usage

## Commands

Before getting started, let's create some folders and files for userscript-composer to work with.
Every options are changable, so don't worry.

- **/scripts**; directory userscripts located
- **/out**; directory output located
- **/header.txt**; file prepended to unified userscript

Also, there are some terms used in this project:

- **Unified userscript**, merged userscript including all subsequent userscripts under **/scripts** folder.
- **Standalone userscript**, the standalone version of each userscripts under **/scripts** folder. (Or the term **bundled** maybe familiar to you)

**Trivials**

- Nothing now.

**Shared options**

The options below are shared in all commands.

```
Options:
  --source [directory]  Set source directory to build (default: scripts)
  --out [directory]     Set output directory for build (default: dist)
  --minify              Minify the output for production use (default: false)
  --clean               Clean the build directory before build (default: false)
  -v, --version         Display version number
  -h, --help            Display this message
```

### `userscript-composer init`

Create new userscript-composer workspace with `header.txt` template, `config.json` file, and script directory.
This command runs `userscript-composer build` automatically after setting up.

If you give some arguments for `build` command, it will automatically apply it.

```bash
userscript-composer init [--source [directory]] [--out [directory]] [--minify] [--clean]
```

### `userscript-composer build`

Generate standalone userscript from source file.

- Define source file via `--source [file]`.
- Define out file via `--out [file]`.

```bash
userscript-composer build [--source [file]] [--out [file]] [--minify] [--clean]
```

### `userscript-composer batch`

Batch build userscripts from source directory and save bundled userscripts to output directory.
Generate standalone userscripts from source directory files including `.user.`.

```bash
userscript-composer batch [--source [directory]] [--out [directory]] [--minify] [--clean]
```

### `userscript-composer unify`

Generate unified userscript bundling all userscripts from source directory.

- Define header file location via `--header [filename]`.
- Define the output file name via `--name [name]`.

```bash
userscript-composer unify [--source [directory]] [--out [directory]] [--name [name]] [--header [headerfile]] [--minify] [--clean]
```

## API

We provide the JavaScript API to build from Node.JS application via ES Module format.
Read more about [ES Module by Lin Clark](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/).

By seeing the [`/src/index.ts`](/src/index.ts), you can see what things are being exported via module.
Also, every functions necessary required to implement the build action has comment.

# Development

To make our development environment to be flatten, here are the list of **necessary** softwares we should use.
As you know, the editor is not important and you may use any of released or your own.

- Node.JS LTS Gallium (v16) as JavaScript Runtime
- PNPM as Package Manager
- All version manager supporting `.nvmrc`

That's all.

> WIP
