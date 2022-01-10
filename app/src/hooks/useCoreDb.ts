import { useEffect, useState } from 'react';
import * as sqlite3 from 'sqlite3';

import { coreInit } from '../utils/initUtils';

export function useCoreDb() {
  const [db, setDb] = useState<sqlite3.Database | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const initializeCoreDb = async () => {
      setError(null);
      try {
        const coreDb = await coreInit();
        setDb(coreDb);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    initializeCoreDb();
  }, []);

  return {
    isLoading,
    error,
    data: db,
  };
}
