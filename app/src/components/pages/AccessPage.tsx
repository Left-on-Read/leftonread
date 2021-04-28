import log from 'electron-log';
import { openSystemPreferences } from 'electron-util';
import * as fs from 'fs';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { chatPaths } from '../../utils/initUtils/constants/directories';

const app = process.env.NODE_ENV === 'development' ? 'iTerm2' : 'Left on Read';
const text = `To continue, please give ${app} Full Disk Access`;

export function AccessPage() {
  const history = useHistory();
  const [hasFullDisk, setHasFullDisk] = useState<boolean>(false);
  const [hasOpenedPreferences, setHasOpenedPreferences] = useState<boolean>(
    false
  );

  function checkAndSetFullDiskAccess() {
    try {
      fs.accessSync(chatPaths.original, fs.constants.R_OK);
      log.info('INFO: full disk access appears to be given');
      setHasFullDisk(true);
    } catch (err) {
      log.warn('WARN: full disk access not set:', err);
    }
  }

  useEffect(() => {
    checkAndSetFullDiskAccess();
  }, []);

  useEffect(() => {
    if (hasFullDisk) {
      history.push('/dashboard');
    }
  }, [hasFullDisk, history]);

  const handleOpenPreferencesOnClick = () => {
    openSystemPreferences('security', 'Privacy_AllFiles');
    setHasOpenedPreferences(true);
  };

  const handleReturnOnClick = () => {
    checkAndSetFullDiskAccess();
  };

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
