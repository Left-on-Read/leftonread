export const appDirectoryInitPath = `${process.env.HOME}/.leftonread/init`;
export const appDirectoryPath = `${process.env.HOME}/.leftonread`;
export const addressBookDBName = `AddressBook-v22.abcddb`;
export const addressBookDBAliasName = 'addressBookDB';

export const addressBookPaths = {
  original: `${process.env.HOME}/Library/Application Support/AddressBook`,
  app: `${appDirectoryPath}/AddressBookFolder`,
};

export const chatPaths = {
  original: process.env.DEBUG
    ? `./src/__tests__/chat.db`
    : `${process.env.HOME}/Library/Messages/chat.db`,
  app: `${appDirectoryPath}/chat.db`,
};

export const dirPairings = [addressBookPaths, chatPaths];

export const addressBookBackUpFolderPath = `${addressBookPaths.app}/Sources`;

export const appDirectoryLivePath = `${process.env.HOME}/.leftonread/live`;

export const liveAddressBookPaths = {
  original: `${process.env.HOME}/Library/Application Support/AddressBook`,
  app: `${appDirectoryLivePath}/AddressBookFolder`,
};

export const liveChatPaths = {
  original: process.env.DEBUG
    ? `./src/__tests__/chat.db`
    : `${process.env.HOME}/Library/Messages/chat.db`,
  app: `${appDirectoryLivePath}/chat.db`,
};

export const liveDirPairings = [liveAddressBookPaths, liveChatPaths];

export const liveAddBookBackUpFolderPath = `${liveAddressBookPaths.app}/Sources`;
