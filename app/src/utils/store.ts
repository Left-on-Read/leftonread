import log from 'electron-log';
import Store from 'electron-store';
import semver from 'semver';
import { v4 as uuidv4 } from 'uuid';

const migrations = {
  '0.1.1': (store: any) => store.set('requiredUpdateVersion', '0.1.1'),
};

const schema = {
  uuid: {
    type: 'string',
    default: uuidv4(),
  },
  lastUpdatedVersion: {
    // When the user last refreshed data
    type: 'string',
    default: '',
  },
  requiredUpdateVersion: {
    // Breaking version for user
    type: 'string',
    default: '0.0.1',
  },
} as const;

const store = new Store({ schema, migrations });
log.info(`Store path: ${store.path}`);

export function getUuid(): string {
  return store.get('uuid' as string);
}

export function checkRequiresRefresh(): boolean {
  const lastUpdatedVersion = store.get('lastUpdatedVersion') as string;
  const requiredUpdateVersion = store.get('requiredUpdateVersion') as string;

  if (lastUpdatedVersion === '') {
    return true;
  }

  return semver.gt(requiredUpdateVersion, lastUpdatedVersion);
}

export function setLastUpdatedVersion(version: string) {
  store.set('lastUpdatedVersion', version);
}
