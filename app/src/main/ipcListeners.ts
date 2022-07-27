import { ipcMain } from 'electron';
import { initializeCoreDb } from '../analysis/initializeCoreDb';

export function attachIpcListeners() {
  ipcMain.handle('initialize-tables', async (event, arg) => {
    await initializeCoreDb();
  });
}
