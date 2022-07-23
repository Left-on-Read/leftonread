import log from 'electron-log';
import Store from 'electron-store';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

const schema = {
  uuid: {
    type: 'string',
    default: uuidv4(),
  },
  acceptedTermsPrivacy: {
    type: 'boolean',
    default: false,
  },
} as const;

const store = new Store({ schema, watch: true });
log.info(`Store path: ${store.path}`);

export function getUUID(): string {
  return store.get('uuid') as string;
}

export function setAcceptedTermsPrivacy(value = true) {
  store.set('acceptedTermsPrivacy', value);
}

export function useAcceptedTermsPrivacy(): boolean {
  const [ATP, setATP] = React.useState<boolean>(
    store.get('acceptedTermsPrivacy') as boolean
  );
  React.useEffect(() => {
    const unsusbcribe = store.onDidChange('acceptedTermsPrivacy', (value) => {
      setATP(value as boolean);
    });

    return () => {
      unsusbcribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ATP;
}
