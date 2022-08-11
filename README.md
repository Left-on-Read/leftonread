<h2 align="center">
	<img src="https://raw.githubusercontent.com/Left-on-Read/leftonread/main/web/src/assets/ICON_TEXT_LOGO.svg" />
</h2>

A free open-source iMessage analyzer for Mac Desktop. Built with Electron, SQLite, Typescript, and ❤️.

### Mission and Values

**👩🏻Open-Source Transparency**: We open-sourced the entire application to keep users' security and privacy first.

**Fast**: The first iteration was a [web application](https://www.reddit.com/r/dataisbeautiful/comments/biou3e/4_years_of_texts_between_me_and_my_long_distance/), but now we have rebuilt Left on Read as a desktop application that works without an Internet connection.

**Secure**: Without needing to manually re-upload, you can now use Left on Read securely and learn about yourself from your texts.

<p align="right"><a href="https://leftonread.me/">leftonread.me</a></p>

## Contributing

We ❤️ contributors. Please read our [CODE OF CONDUCT](./CODE_OF_CONDUCT.md).

At a high-level, this [lerna](https://github.com/lerna/lerna) monorepo is split up into 3 project subdirectories:

1. [app](./app/README.md) — the Left on Read Electron application itself. `app` is not dependent on anything in `web`. (Remember: the app does not need to connect to the Internet.)
2. [web](./web/README.md) - the marketing site, which uses Firebase to store emails.
3. [eslint-config](./eslint-config/README.md) - a shared eslint config to maintain consistency.

## License

Left on Read is MIT Licensed.

By contributing to Left on Read, you agree that your contributions will be licensed under its MIT license.

## Sponsors

_Support this project by becoming a sponsor. Your logo will show up here with a link to your website._

Thank you to Vercel for sponsoring this project!

[![Vercel](./assets/documentation/powered-by-vercel.svg)](https://vercel.com/?utm_source=leftonread&utm_campaign=oss)
