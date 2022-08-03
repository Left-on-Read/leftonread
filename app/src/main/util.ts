import path from 'path';
import { URL } from 'url';

// eslint-disable-next-line import/no-mutable-exports
export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function daysAgo(date1: Date, date2: Date) {
  const differenceInTime = date2.getTime() - date1.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}
