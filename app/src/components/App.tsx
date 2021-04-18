import { openSystemPreferences } from 'electron-util';
import React, { useEffect, useState } from 'react';

import { Dashboard } from './Dashboard';

export default function App() {
  const [hasFullDisk, setHasFullDisk] = useState<boolean>(false);

  const app =
    process.env.NODE_ENV === 'development' ? 'iTerm2' : 'Left on Read';
  const text = `To continue, please give ${app} Full Disk Access`;

  const handleOnClick = () => {
    openSystemPreferences('security', 'Privacy_AllFiles');
    setHasFullDisk(true);
  };

  useEffect(() => {
    async function checkIfUserHasFullDiskAccess() {
      try {
        // setHasFullDisk(true);
      } catch (err) {
        alert(`Error! ${text}`);
      }
    }
    checkIfUserHasFullDiskAccess();
  }, [text]);

  if (hasFullDisk) {
    return <Dashboard />;
  }
  return (
    <button type="button" onClick={handleOnClick}>
      {text}
    </button>
  );
}
