import * as Amplitude from '@amplitude/node';
import { app, ipcRenderer } from 'electron';

export function logEvent({
  eventName,
  properties,
}: {
  eventName: string;
  properties: Record<string, string | number> | undefined;
}) {
  ipcRenderer.invoke('log-event', eventName, properties);
}

export const AmplitudeClient = app.isPackaged
  ? Amplitude.init('5fdd650d1d9fa3b33f41029f44b188c3')
  : {
      logEvent: () => {},
    };
