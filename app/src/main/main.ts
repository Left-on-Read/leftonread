/* eslint global-require: off, no-console: off, promise/always-return: off, import/first: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import {
  events,
  init,
  measure,
  network,
  profiler,
} from '@palette.dev/electron/main';
import * as v8ProfilerNext from 'v8-profiler-next';

init({
  key: 'cl8j2xvzc014708mq30m2vaqv',
  // Collect click, performance events, and profiles
  plugins: [
    events(),
    measure(),
    profiler({ driver: v8ProfilerNext }),
    network(),
  ],
});

// Sample the main process
profiler.start({
  sampleInterval: 10,
});

import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  shell,
  Tray,
} from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';

import { attachIpcListeners } from './ipcListeners';
import MenuBuilder from './menu';
import { initMessageScheduler } from './messageScheduler';
import { NotificationsManager } from './notifications';
import { resolveHtmlPath } from './util';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

let mainWindow: BrowserWindow | null = null;

// Profile the main process for 10s after startup
app
  .whenReady()
  .then(() => {
    setTimeout(() => {
      profiler.stop();
    }, 10_000);
  })
  .catch(console.error);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    const checkForUpdates = () => {
      autoUpdater.checkForUpdates();

      setTimeout(checkForUpdates, ONE_DAY_IN_MS);
    };

    checkForUpdates();

    ipcMain.on('listen-to-updates', (event) => {
      autoUpdater.on('update-downloaded', () => {
        log.info('Update successfully downloaded.');

        event.sender.send('update-available');
      });

      // event.sender.send('update-available');
    });
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

attachIpcListeners();
const notificationsManager = new NotificationsManager({ getAssetPath });
notificationsManager.registerNotifications();

initMessageScheduler();

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1150,
    height: 770,
    minWidth: 1150,
    minHeight: 770,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

function createTray() {
  const icon = nativeImage.createFromPath(getAssetPath('icons/tray_icon.png'));

  const tray = new Tray(icon.resize({ width: 16 }));
  tray.setIgnoreDoubleClickEvents(true);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        if (!mainWindow) {
          createWindow();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }

  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});

// app.on('browser-window-focus', () => {
//   const uuid = getUuid();
//   try {
//     AmplitudeClient.logEvent({
//       user_id: uuid,
//       event_type: 'FOCUSED_APP',
//     });
//   } catch (e) {
//     log.error(e);
//   }
// });

app
  .whenReady()
  .then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
