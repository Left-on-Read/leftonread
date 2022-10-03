/* eslint-disable no-restricted-globals */
import {
  events,
  init,
  label,
  measure,
  network,
  profiler,
  vitals,
} from '@palette.dev/electron/renderer';
import { createRoot } from 'react-dom/client';

import { App } from '../components/App';

init({
  key: 'cl8j2xvzc014708mq30m2vaqv',
  plugins: [events(), vitals(), network(), measure(), profiler()],
});

// Profile page load
profiler.start({ sampleInterval: 10, maxBufferSize: 10_000 });
addEventListener('load', () => profiler.stop());

// A utility for profiling and label frequent events
const debounce = (start: any, stop: any, opts = { timeout: 1_000 }) => {
  let timeoutId: any;
  return () => {
    if (timeoutId === undefined) {
      start();
    } else {
      clearTimeout(timeoutId);
    }
    // Debounce marking the end of the label
    timeoutId = setTimeout(() => {
      stop();
      timeoutId = undefined;
    }, opts.timeout);
  };
};
// Debounce starting the profiler
const debounceProfiler = debounce(
  () => {
    label.start('ui.interaction');
    profiler.start({
      sampleInterval: 10,
      maxBufferSize: 10_000,
    });
  },
  () => {
    label.end('ui.interaction');
    return profiler.stop();
  }
);
// Profile scroll, mousemove, and click events
addEventListener('wheel', debounceProfiler);
addEventListener('mousemove', debounceProfiler);
addEventListener('click', debounceProfiler);
addEventListener('keypress', debounceProfiler);

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
