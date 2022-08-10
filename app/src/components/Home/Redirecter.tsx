import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { APP_VERSION } from '../../constants/versions';

export function Redirecter() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkExistence = async () => {
      let doesExist = false;

      try {
        doesExist = await ipcRenderer.invoke('check-initialized');
      } catch (e) {
        log.error(e);
      }
      if (doesExist) {
        navigate('/dashboard');
      } else {
        navigate('/start');
      }
    };

    log.info(`Started up on version ${APP_VERSION}`);
    checkExistence();
  }, [navigate]);

  return <div />;
}
