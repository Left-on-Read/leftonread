import log from 'electron-log';
import UniversalAnalytics from 'universal-analytics';

import { isProd } from '.';
import { getUUID } from './store';

const GA_TRACKING_ID = 'UA-113056721-3';

const visitor = UniversalAnalytics(GA_TRACKING_ID, getUUID());

// NOTE: See documentation here: https://www.npmjs.com/package/universal-analytics#getting-started

function trackPageView(url: string) {
  if (isProd()) {
    visitor.pageview(url).send();
  }
  log.info(`EVENT: ${url} page view`);
}

export type TScreenTransitionEventData = {
  category: 'SCREEN_TRANSITION';
  action: 'APPEAR' | 'DISAPPEAR' | 'UNSET';
  label: string;
  value: number;
};

export type TEventData = TScreenTransitionEventData;

function trackEvent(eventData: TEventData) {
  if (isProd()) {
    visitor
      .event(
        eventData.category,
        eventData.action,
        eventData.label,
        eventData.value
      )
      .send();
  }
  log.info(
    `EVENT: ${eventData.category} | ${eventData.action} | ${eventData.label} | ${eventData.value} event`
  );
}

export type TAnalytics = {
  trackPageView: (url: string) => void;
  trackEvent: (eventData: TEventData) => void;
};

export const Analytics: TAnalytics = {
  trackPageView,
  trackEvent,
};
