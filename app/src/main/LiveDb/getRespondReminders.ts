import { queryRespondReminders } from '../../analysis/queries/RespondReminders';
import { initializeLiveDb } from './initializeLiveDb';

export async function getLiveRespondReminders() {
  const db = await initializeLiveDb();

  const reminders = await queryRespondReminders(db);

  return reminders;
}
