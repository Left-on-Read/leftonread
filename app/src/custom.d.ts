import TAnalytics from './utils/analytics';

declare global {
  namespace NodeJS {
    interface Global {
      Analytics: TAnalytics;
    }
  }
}
