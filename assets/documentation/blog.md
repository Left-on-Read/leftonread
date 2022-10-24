I built a text message analyzer

Hi, I built [Left on Read](https://leftonread.me/) — an open-source iMessage analyzer that anyone with a Mac can try for free.

![Graphic!](https://raw.githubusercontent.com/Left-on-Read/leftonread/main/assets/documentation/Header-Graphic.png)

The data never leaves your computer and everything is [open source](https://github.com/Left-on-Read/leftonread). Left on Read also includes a "your year in texts" experience (simliar to Spotify Wrapped) and productivity tooling, such as response reminders and the ability to schedule messages.

## Links

- [Download link](https://leftonread.me/)
- [Github link](https://github.com/Left-on-Read/leftonread)

## Features:

- top sent word, emoji, contact
- reactions sent in group chats
- filter by a word, friend, or time range
- sentiment analysis
- "Your Year in Text" experience

## Technical Details:

Built with Electron, SQLite, Typescript, React, Charka UI, chartjs

We copy the ~/Library/Messages/chat.db file on your Mac (this is the same file the Apple iMessage app reads) and then query it with sqlite. We then render graphs off the queries.

![Graphic!](https://raw.githubusercontent.com/Left-on-Read/leftonread/main/assets/documentation/Supercharge-Graphic.png)

Thanks for reading. Appreciate the support and this community.
