import * as Amplitude from '@amplitude/node';
import log from 'electron-log';

import { getUuid } from './store';

export const AmplitudeClient =
  process.env.NODE_ENV === 'production'
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
    AmplitudeClient.logEvent(
      {
        user_id: uuid,
        event_type: eventName,
      },
      properties
    );
  } catch (e) {
    log.error(e);
  }
}
