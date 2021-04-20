import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';

const schema = {
  uuid: {
    type: 'string',
    default: uuidv4(),
  },
} as const;

const store = new Store({ schema });

export function getUUID(): string {
  return store.get('uuid') as string;
}
