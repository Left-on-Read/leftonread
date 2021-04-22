import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import { useIsMainWindowFocused } from '../hooks/useIsMainWindowFocused';

// NOTE(teddy): If we end up adding more windows, we can have this accept an optional window parameter
// that gets passed down to the focused hook
export function AppearanceTracker({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [appearedTime, setAppearedTime] = React.useState<number | null>(null);
  const isMainWindowFocused = useIsMainWindowFocused();

  React.useEffect(() => {
    if (inView && isMainWindowFocused && appearedTime == null) {
      setAppearedTime(Date.now());
    } else if (appearedTime !== null) {
      // TODO(teddy): Log this event
      // log.info(Date.now() - appearedTime);
      setAppearedTime(null);
    }
  }, [inView, isMainWindowFocused]);

  return <div ref={ref}>{children}</div>;
}
