import { useEffect, useState } from 'react';
import * as sqlite3 from 'sqlite3';

import { initializeCoreDb } from './initializeCoreDb';

export function useCoreDb() {
  const [db, setDb] = useState<sqlite3.Database | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setError(null);
      try {
        const coreDb = await initializeCoreDb();
        setDb(coreDb);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    initialize();
  }, []);

  return {
    isLoading,
    error,
    data: db,
  };
}
