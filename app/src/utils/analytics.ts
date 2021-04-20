import UniversalAnalytics from 'universal-analytics';
import log from 'electron-log';
import { isProd } from '.';

const GA_TRACKING_ID = 'UA-113056721-3';

const visitor = UniversalAnalytics(GA_TRACKING_ID);

// NOTE: See documentation here: https://www.npmjs.com/package/universal-analytics#getting-started

function trackPageView(url: string) {
  if (isProd()) {
    visitor.pageview(url).send();
  }
  log.info(`EVENT: ${url} page view`);
}

function trackEvent(
  category: string,
  action: string,
  label: string,
  value: number
) {
  if (isProd()) {
    visitor.event(category, action, label, value).send();
  }
  log.info(`EVENT: ${category} | ${action} | ${label} | ${value} event`);
}

export type TAnalytics = {
  trackPageView: (url: string) => void;
  trackEvent: (
    category: string,
    action: string,
    label: string,
    value: number
  ) => void;
};

export const Analytics: TAnalytics = {
  trackPageView,
  trackEvent,
};
