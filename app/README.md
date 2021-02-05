# Left on Read - App

## Table of Contents

-   [Local Development](#local-development)
    -   [Quick Start](#quick-start)
    -   [Code Style](#code-style)
    -   [Troubleshooting](#troubleshooting)

## Local Development

<!-- TODO: move all of this to a CONTRIBUTING.md -->

We are proud to be using [Electron-React Boilerplate
](https://electron-react-boilerplate.js.org/). They have fantastic documentation that covers the basics, including how to add tests and package the application. Read all of their docs first.

### Quick Start

1. Install packages with `yarn`
2. Run the application with `yarn start`

### Code Style

-   Use `electron-log` for logging
-   Keep files small

### Troubleshooting:

If you see:

```
Reading /Users/.../node_modules/devtron/manifest.json failed.
Error: ENOENT: no such file or directory.
```

You most likely have an old electron process running. If this is warning, you can ignore it. Otherwise, kill the old process.
