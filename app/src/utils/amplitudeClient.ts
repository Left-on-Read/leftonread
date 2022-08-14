import * as Amplitude from '@amplitude/node';

export const AmplitudeClient =
  process.env.NODE_ENV === 'production'
    ? Amplitude.init('5fdd650d1d9fa3b33f41029f44b188c3')
    : {
        logEvent: () => {},
      };
