# Left on Read - App

## Download Packaged Version

<h3><a href=https://github.com/Left-on-Read/leftonread/releases>Download</a></h3>

<p align="right"><a href="https://leftonread.me/">leftonread.me</a></p>

## License

Left on Read is licensed under an Elastic License 2.0 (ELv2).

By contributing to Left on Read, you agree that your contributions will be licensed under ELv2.

## Table of Contents

- [Local Development](#local-development)
  - [Quick Start](#quick-start)
  - [Code Style](#code-style)
  - [Troubleshooting](#troubleshooting)

## Local Development

We are proud to be using [Electron-React Boilerplate
](https://electron-react-boilerplate.js.org/). They have fantastic documentation that covers the basics, including how to add tests and package the application. Read all of their docs first.

### Quick Start

- First, install dependencies with `yarn`

‼️ To run the app:

```
# from project root
cd app; yarn;
```

- Run the application with `yarn start` in the `app` directory.
- You many also run the application with `yarn start:debug` in the `app` directory if you would like to use chat.db test data.

### Releasing

To create a release, while in the root of `app`, run the following command depending on the release type:

```
yarn release:patch // This will bump 0.1.1 -> 0.1.2
yarn release:minor // This will bump 0.1.4 -> 0.2.0
yarn release:major // This will bump 0.1.4 -> 1.0.0
```

## Troubleshooting Local Development:

In general, make sure you `yarn` installed with node `16.13.0` and `yarn start` on `16.13.0`. It seems the M1 chip might require 15.19.0, however.

#### Permission denied or cannot find .db file

You need to give your terminal application (for example, iTerm2) "full disk access."

If you are running 'yarn start' in an IDE, like VScode, you will need to give that IDE full disk access in order to run Left on Read locally.

To give your Terminal full disk access, go to System Preferences > Security and Privacy > Full Disk Access (a folder on the scrollbar) > and select your terminal app or IDE.

#### DATABASE MALFORMED — TRIGGER ERROR

If you see a console error that says the database is malformed, then you need to delete the databases the application reads from (so then it can quickly create them from scratch again).

```
cd ~; rm -ir ./leftonread
```

Say yes to the prompt and delete all the files within `./leftonread` including the directory itself. The app will simply recreate it. You could remove the `-i` flag if you like to live on the edge and trust yourself not to delete your entire system because of a misspelling.

After deleting, simply refresh the Electron app with command + r or rerun yarn start. However, it should hot reload automatically.

#### Cannot yarn start: JavaScript heap out of memory

If you are getting:

```
➜  app git:(main) ✗ yarn start
yarn run v1.22.10
...
Starting Main Process...
ℹ ｢wds｣: Project is running at http://localhost:1212/
...
<--- Last few GCs --->

[5892:0x1046a1000]    23090 ms: Scavenge (reduce) 1935.6 (1941.6) -> 1934.8 (1942.6) MB, 1.4 / 0.0 ms  (average mu = 0.179, current mu = 0.155) allocation failure
...

<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

Then it appears you need to allocate more memory. If you have enough memory on your computer, consider running in your terminal:

```
export NODE_OPTIONS=--max_old_space_size=4096
```

where 4096 is in megabytes.

#### ENOENT: no such file or directory

If you see:

```
Reading /Users/.../node_modules/devtron/manifest.json failed.
Error: ENOENT: no such file or directory.
```

You most likely have an old electron process running. If this is warning, you can ignore it. Otherwise, kill the old process.

### Error: Cannot find module

If you are getting a "Cannot find module" error, you likely forgot to install the packages. Be sure to run `yarn` in the `app/` directory.


## Support

<a href="https://www.buymeacoffee.com/leftonread" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<a href="https://www.producthunt.com/posts/left-on-read?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-left&#0045;on&#0045;read" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=358899&theme=light" alt="Left&#0032;on&#0032;Read - iMessages&#0032;supercharged | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
