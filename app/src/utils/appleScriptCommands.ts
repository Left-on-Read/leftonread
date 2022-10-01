import util from 'util';

const exec = util.promisify(require('child_process').exec);

export async function openIMessageAndPasteImage(contacts?: string[]) {
  let contactsAppleScriptBlock;
  if (contacts && contacts.length > 0)
    contactsAppleScriptBlock = contacts
      .filter((c) => c.toLowerCase() !== 'you')
      .map((contact) => {
        return `
        keystroke "${contact}"  -- input the phone number
        delay 0.25 -- this is super critical, it seems without the delay it wont work
        key code 36 —- enter
        delay 0.25 -- this is super critical, it seems without the delay it wont work`;
      });

  try {
    await exec(
      `
          osascript -e  'activate application "Messages"
              delay 0.25 -- this is super critical, it seems without the delay it wont work
              tell application "System Events" to tell process "Messages"
              delay 0.25 -- this is super critical, it seems without the delay it wont work
              key code 45 using command down           -- press Command + N to start a new window
              delay 0.25 -- this is super critical, it seems without the delay it wont work
      
              ${
                contactsAppleScriptBlock
                  ? contactsAppleScriptBlock.join('\n')
                  : ''
              }
      
              key code 48 -- tab
              delay 0.25 -- this is super critical, it seems without the delay it wont work
              keystroke "v" using command down
              delay 0.25 -- this is super critical, it seems without the delay it wont work
              keystroke "Check out https://leftonread.me/?ref=share"  -- input the message
          end tell'
          `
    );
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Oops! Something went wrong. Open iMessage yourself to respond!');
  }
}

export async function typeMessageToPhoneNumber({
  message,
  phoneNumber,
}: {
  phoneNumber: string;
  message: string;
}) {
  try {
    await exec(
      `
      osascript -e  'activate application "Messages"
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          tell application "System Events" to tell process "Messages"
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          key code 45 using command down           -- press Command + N to start a new window
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          keystroke "${phoneNumber}"  -- input the phone number
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          key code 36 —- enter
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          key code 48 -- tab
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          keystroke "${message}"  -- input the message
      end tell'
      `
    );
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Oops! Something went wrong. Open iMessage yourself to respond!');
  }
}

export async function typeAndSendMessageToPhoneNumber({
  message,
  phoneNumber,
}: {
  phoneNumber: string;
  message: string;
}) {
  await exec(
    `osascript -e '
      tell application "Messages"
        set targetBuddy to "${phoneNumber}"
        set targetService to id of 1st service whose service type = iMessage
        set textMessage to "${message}"
        set theBuddy to buddy targetBuddy of service id targetService
        send textMessage to theBuddy
      end tell'`
  );
}
