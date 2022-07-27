<img src=".erb/img/erb-banner.svg" width="100%" />

<br>

<p>
  Electron React Boilerplate uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

<br>

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/Fjy3vfgy5q)

[![OpenCollective](https://opencollective.com/electron-react-boilerplate-594/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/electron-react-boilerplate-594/sponsors/badge.svg)](#sponsors)
[![StackOverflow][stackoverflow-img]][stackoverflow-url]

</div>

## Install

Clone the repo and install dependencies:

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
cd; rm -ir ./leftonread
```

Say yes to the prompt and delete all the files within `./leftonread` including the directory itself. The app will simply recreate it. You could remove the `-i` flag if you like to live on the edge and trust yourself not to delete your entire system because of a misspelling.

After deleting, simply refresh the electron app. (It should hot reload automatically.)

#### Cannot yarn start: JavaScript heap out of memory

If you are getting:

```bash
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git your-project-name
cd your-project-name
npm install
```

**Having issues installing? See our [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## Community

Join our Discord: https://discord.gg/Fjy3vfgy5q

## Donations

**Donations will ensure the following:**

- 🔨 Long term maintenance of the project
- 🛣 Progress on the [roadmap](https://electron-react-boilerplate.js.org/docs/roadmap)
- 🐛 Quick responses to bug reports and help requests

## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/electron-react-boilerplate-594#backer)]

<a href="https://opencollective.com/electron-react-boilerplate-594/backer/0/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/1/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/2/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/3/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/4/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/5/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/6/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/7/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/8/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/9/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/10/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/11/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/12/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/13/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/14/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/15/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/16/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/17/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/18/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/19/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/20/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/21/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/22/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/23/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/24/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/25/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/26/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/27/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/28/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/backer/29/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/backer/29/avatar.svg"></a>

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/electron-react-boilerplate-594-594#sponsor)]

<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/0/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/1/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/2/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/3/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/4/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/5/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/6/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/7/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/8/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/9/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/10/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/11/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/12/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/13/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/14/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/15/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/16/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/17/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/18/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/19/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/20/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/21/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/22/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/23/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/24/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/25/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/26/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/27/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/28/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/electron-react-boilerplate-594/sponsor/29/website" target="_blank"><img src="https://opencollective.com/electron-react-boilerplate-594/sponsor/29/avatar.svg"></a>

## Maintainers

- [Amila Welihinda](https://github.com/amilajack)
- [John Tran](https://github.com/jooohhn)
- [C. T. Lin](https://github.com/chentsulin)
- [Jhen-Jie Hong](https://github.com/jhen0409)

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[stackoverflow-img]: https://img.shields.io/badge/stackoverflow-electron_react_boilerplate-blue.svg
[stackoverflow-url]: https://stackoverflow.com/questions/tagged/electron-react-boilerplate
