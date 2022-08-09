import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Redirecter() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkExistence = async () => {
      const doesExist = await ipcRenderer.invoke('check-initialized');
      if (doesExist) {
        navigate('/dashboard');
      } else {
        navigate('/start');
      }
    };

    checkExistence();
  }, [navigate]);

  return <div />;
}
