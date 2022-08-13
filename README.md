# userscript-composer

> Working In Progress

Ability to compose userscripts for unified distribution.

## Table of Contents

- [userscript-composer](#userscript-composer)
  - [Table of Contents](#table-of-contents)
- [Overview](#overview)
  - [Quickstart](#quickstart)
  - [Workaround](#workaround)
- [Usage](#usage)
  - [`userscript-composer build`](#userscript-composer-build)
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
touch header.txt # header.txt will be prepended to composed output

npm init -y
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

Before getting started, let's create some folders and files for userscript-composer to work with.
Every options are changable, so don't worry.

- **/scripts**; directory userscripts located
- **/out**; directory output located
- **/header.txt**; file prepended to composed userscript

Also, there are some terms used in this project:

- **Composed userscript**, merged userscript including all subsequent userscripts under **/scripts** folder.
- **Standalone userscript**, the standalone version of each userscripts under **/scripts** folder. (Or the term **bundled** maybe familiar to you)

**Trivials**

- I am planning to use `.userscript-composer/config` as future config file location. You may ignore the creation of `.userscript-composer` directory at this time.

**Shared options**

The options below are shared in all commands.

```
Options:
  --source [directory]  Set source directory to build (default: scripts)
  --out [directory]     Set output directory for build (default: dist)
  --header [file]       Set header file location to prepend (default: header.txt)
  --name [name]         Set the name of complete user-script (default: index)
  --minify              Minify the output for production use (default: false)
  --clean               Clean the build directory before build (default: false)
  -v, --version         Display version number
  -h, --help            Display this message
```

## `userscript-composer build`

Generates composed userscript and standalone userscripts.
For production use, I recommend adding `--minify`.

# Development

To make our development environment to be flatten, here are the list of **necessary** softwares we should use.
As you know, the editor is not important and you may use any of released or your own.

- Node.JS LTS Gallium (v16) as JavaScript Runtime
- PNPM as Package Manager
- All version manager supporting `.nvmrc`

That's all.

> WIP
