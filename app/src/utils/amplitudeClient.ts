import * as Amplitude from '@amplitude/node';
import log from 'electron-log';
import { machineIdSync } from 'node-machine-id';

import { getUuid } from './store';

const regristrationId = machineIdSync(false);
export const AmplitudeClient =
  process.env.NODE_ENV === 'production' &&
  regristrationId !==
    '4ebffdd19ef0686028071bd7e4d41e00ab70636404cb195a9896373ec0d1346c'
    ? Amplitude.init('5fdd650d1d9fa3b33f41029f44b188c3')
    : {
        logEvent: () => {},
      };

export function logEventMain({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: Record<string, string | number>;
}) {
  const uuid = getUuid();

  try {
    AmplitudeClient.logEvent({
      user_id: uuid,
      event_type: eventName,
      event_properties: properties,
    });
  } catch (e) {
    log.error(e);
  }
}
