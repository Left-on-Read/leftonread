import { app } from 'electron';
const remote = require('electron').remote;

export function delimList(myList: string[]): string {
  const l = myList.map((t) => `"${t}"`);
  return l.join(', ');
}

export function lowerCaseList(myList: string[]): string[] {
  return myList.map((t) => t.toLowerCase());
}

export function isProd(): boolean {
  return app.isPackaged;
}
