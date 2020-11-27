export const appDirectoryPath = `${process.env.HOME}/.leftonread`;

export const addressBookPaths = {
  original: `${process.env.HOME}/Library/Application Support/AddressBook`,
  app: `${appDirectoryPath}/AddressBookFolder`,
};

export const chatPaths = {
  original: `${process.env.HOME}/Library/Messages/chat.db`,
  app: `${appDirectoryPath}/chat.db`,
};

export const parings = {
  addressBookPaths,
  chatPaths,
};
