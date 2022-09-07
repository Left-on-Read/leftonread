import {
  queryRespondReminders,
  RespondRemindersResult,
} from '../../analysis/queries/RespondReminders';
import { initializeLiveDb } from './initializeLiveDb';

function hasNumber(myString: string) {
  return /\d/.test(myString);
}

function scoreReminder(reminder: RespondRemindersResult) {
  // Longer is good
  // Includes ? is good
  // Contact is legit is good
  return (
    reminder.message.length +
    300 *
      (reminder.message.includes('?') ? 2 : 1) *
      (hasNumber(reminder.friend) ? 1 : 10)
  );
}

export async function getLiveRespondReminders() {
  const db = await initializeLiveDb();

  const reminders = await queryRespondReminders(db);

  const sortedReminders = reminders.sort(
    (a, b) => scoreReminder(b) - scoreReminder(a)
  );

  return sortedReminders;
}
