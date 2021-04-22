import * as React from 'react';
const remote = require('electron').remote;

export function useIsMainWindowFocused(): boolean {
  const windows = remote.BrowserWindow.getAllWindows();
  const mainWindow = windows[0];

  const [isFocused, setIsFocused] = React.useState<boolean>(
    !!mainWindow?.isFocused()
  );

  React.useEffect(() => {
    const focusHandler = () => {
      setIsFocused(true);
    };

    const blurHandler = () => {
      setIsFocused(false);
    };

    mainWindow?.on('focus', focusHandler);
    mainWindow?.on('blur', blurHandler);

    return () => {
      mainWindow?.removeListener('focus', focusHandler);
      mainWindow?.removeListener('blur', blurHandler);
    };
  });

  return isFocused;
}
