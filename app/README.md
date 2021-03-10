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

1. Install packages with `yarn`
2. Run the application with `yarn start` 

## Contributing

<!-- TODO: Move this to a CONTRIBUTING.md -->

### Code Style

- Use `electron-log` for logging
- Keep files small

## Troubleshooting Local Development:

#### Permissioned denied

You need to give your terminal application (for example, iTerm) "full disk access" in order to run Left on Read locally. This is because the application needs to copy the chat.db file in `~/Library/Messages` into the Left on Read application folder `~/.leftonread`

To give your Terminal full disk access, go to System Preferences > Security and Privacy > Full Disk Access (a folder on the scrollbar) > and select iTerm. 

It is an open issue to prompt you automatically. See [#92](https://github.com/Left-on-Read/leftonread/issues/92). 


#### DATABASE MALFORMED — TRIGGER ERROR

If you see a console error that says the database is malformed, then you need to delete the databases the application reads from (so then it can create them from scratch again)

1. `cd ~/.leftonread`
2. `rm -r AddressBookFolder chat.db chat.db-shm chat.db-wal`

#### ENOENT: no such file or directory

If you see:

```
Reading /Users/.../node_modules/devtron/manifest.json failed.
Error: ENOENT: no such file or directory.
```

You most likely have an old electron process running. If this is warning, you can ignore it. Otherwise, kill the old process.
