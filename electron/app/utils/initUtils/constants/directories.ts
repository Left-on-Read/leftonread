export const appDirectoryPath = `${process.env.HOME}/.leftonread`;
export const addressBookDBName = `AddressBook-v22.abcddb`;
export const addressBookDBAliasName = 'addressBookDB';

export const addressBookPaths = {
  original: `${process.env.HOME}/Library/Application Support/AddressBook`,
  app: `${appDirectoryPath}/AddressBookFolder`,
};

export const chatPaths = {
  original: `${process.env.HOME}/Library/Messages/chat.db`,
  app: `${appDirectoryPath}/chat.db`,
};

export const dirPairings = [addressBookPaths, chatPaths];

export const addressBookBackUpFolderPath = `${addressBookPaths.app}/Sources`;
