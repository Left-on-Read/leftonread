import { ipcRenderer } from 'electron';

export function logEvent({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: Record<string, string | number>;
}) {
  ipcRenderer.invoke('log-event', eventName, properties);
}
