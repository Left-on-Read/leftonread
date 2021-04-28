import * as React from 'react';
import { useInView } from 'react-intersection-observer';

import { useIsMainWindowFocused } from '../hooks/useIsMainWindowFocused';
import { TAnalytics } from '../utils/analytics';

const Analytics: TAnalytics = require('electron').remote.getGlobal('Analytics');

// NOTE(teddy): If we end up adding more windows, we can have this accept an optional window parameter
// that gets passed down to the focused hook
export function AppearanceTracker({
  eventContext,
  children,
}: {
  eventContext: {
    label: string;
  };
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [appearedTime, setAppearedTime] = React.useState<number | null>(null);
  const isMainWindowFocused = useIsMainWindowFocused();

  React.useEffect(() => {
    if (inView && isMainWindowFocused && appearedTime == null) {
      setAppearedTime(Date.now());
      Analytics.trackEvent({
        category: 'SCREEN_TRANSITION',
        action: 'APPEAR',
        label: eventContext.label,
        value: 0,
      });
    } else if (appearedTime !== null) {
      setAppearedTime(null);
      Analytics.trackEvent({
        category: 'SCREEN_TRANSITION',
        action: 'DISAPPEAR',
        label: eventContext.label,
        value: Date.now() - appearedTime,
      });
    }
  }, [inView, isMainWindowFocused, appearedTime, eventContext.label]);

  return <div ref={ref}>{children}</div>;
}
