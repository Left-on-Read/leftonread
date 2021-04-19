import log from 'electron-log';
import { openSystemPreferences } from 'electron-util';
import * as fs from 'fs';
import React, { useEffect, useState } from 'react';

import { createAppDirectory } from '../utils/initUtils';
import { chatPaths } from '../utils/initUtils/constants/directories';
import { Dashboard } from './Dashboard';

const { getGlobal } = require('electron').remote;
const trackPageView = getGlobal('trackPageView');

// TODO: turn this into a pretty modal/welcome screen
export default function App() {
  const [hasFullDisk, setHasFullDisk] = useState<boolean>(false);
  const [hasOpenedPreferences, setHasOpenedPreferences] = useState<boolean>(
    false
  );

  function checkAndSetFullDiskAccess() {
    fs.copyFile(chatPaths.original, chatPaths.init, (err) => {
      if (err) {
        log.warn('WARN: full disk access not set:', err);
        setHasFullDisk(false);
      } else {
        log.info('INFO: full disk access appears to be given');
        setHasFullDisk(true);
      }
    });
  }

  const app =
    process.env.NODE_ENV === 'development' ? 'iTerm2' : 'Left on Read';
  const text = `To continue, please give ${app} Full Disk Access`;

  const handleOpenPreferencesOnClick = () => {
    openSystemPreferences('security', 'Privacy_AllFiles');
    setHasOpenedPreferences(true);
  };

  const handleReturnOnClick = () => {
    checkAndSetFullDiskAccess();
  };

  useEffect(() => {
    async function onFirstLoad() {
      await createAppDirectory();
      checkAndSetFullDiskAccess();
    }
    onFirstLoad();

    trackPageView('/');
  }, []);

  if (hasFullDisk) {
    return <Dashboard />;
  }
  // NOTE: the user must quit the app after giving full disk access
  // so this condition should probably be deleted.
  if (hasOpenedPreferences) {
    return (
      <button type="button" onClick={handleReturnOnClick}>
        I have given full disk access.
      </button>
    );
  }
  return (
    <button type="button" onClick={handleOpenPreferencesOnClick}>
      {text}
    </button>
  );
}
