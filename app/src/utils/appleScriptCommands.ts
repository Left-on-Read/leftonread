import util from 'util';

const exec = util.promisify(require('child_process').exec);

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
          keystroke "${phoneNumber}"  -- input the phone number
          delay 0.25 -- this is super critical, it seems without the delay it wont work
          key code 36 —- enter
          key code 48 -- tab
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
