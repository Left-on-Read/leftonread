# Left on Read - App

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

‼️ To run the app, you need to install dependencies in both the `app/src/` directory and the `app/` root directory. In other words:

```
# from project root
cd app; yarn; cd src/; yarn;
```

- Run the application with `yarn start` in the `app` directory.

## Contributing

<!-- TODO: Move this to a CONTRIBUTING.md -->

### Code Style

- Use `electron-log` for logging
- Keep files small

## Troubleshooting Local Development:

In general, make sure you `yarn` installed with node `15.9.0` and `yarn start` on `15.9.0`. It seems the M1 chip requires this node version.

#### Permission denied

You need to give your terminal application (for example, iTerm) "full disk access" in order to run Left on Read locally. This is because the application needs to copy the chat.db file in `~/Library/Messages` into the Left on Read application folder `~/.leftonread`

To give your Terminal full disk access, go to System Preferences > Security and Privacy > Full Disk Access (a folder on the scrollbar) > and select iTerm.

#### DATABASE MALFORMED — TRIGGER ERROR

If you see a console error that says the database is malformed, then you need to delete the databases the application reads from (so then it can quickly create them from scratch again).

```
cd; rm -ir .leftonread
```

Say yes to the prompt and delete all the files within `./leftonread` including the directory itself. The app will simply recreate it. You could remove the `-i` flag if you like to live on the edge and trust yourself not to delete your entire system because of a misspelling.

After deleting, simply refresh the electron app. (It should hot reload automatically.)

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

If you are getting a "Cannot find module" error, you likely forgot to install the packages. Be sure to run `yarn` in the both the `app/` directory and `app/src` directory.
