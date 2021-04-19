import UniversalAnalytics from 'universal-analytics';
import log from 'electron-log';
import { isProd } from '.';

const GA_TRACKING_ID = 'UA-113056721-3';

const visitor = UniversalAnalytics(GA_TRACKING_ID);

export function trackPageView(url: string) {
  if (isProd()) {
    visitor.pageview(url).send();
  }
  log.info(`EVENT: ${url} page view`);
}
