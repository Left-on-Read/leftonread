import log from 'electron-log';
import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';

const schema = {
  uuid: {
    type: 'string',
    default: uuidv4(),
  },
} as const;

const store = new Store({ schema });
log.info(`Store path: ${store.path}`);

export function getUuid(): string {
  return store.get('uuid' as string);
}
