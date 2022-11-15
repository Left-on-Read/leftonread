// Helper function for the renderer
import { ipcRenderer } from 'electron';

/**
 * ONLY WORKS IN THE RENDERER
 * DOES NOT WORK IN MAIN
 */
export function logEvent({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: Record<string, string | number>;
}) {
  ipcRenderer.invoke('log-event', eventName, properties);
}
