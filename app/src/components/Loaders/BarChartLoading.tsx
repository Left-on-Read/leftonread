import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const scale = 15;

export function BarChartLoading({
  pause,
  colorOverride,
}: {
  pause: boolean;
  colorOverride?: string;
}) {
  const defaultBarStyles = {
    width: (25 * scale) / 12,
    backgroundColor: colorOverride ?? 'white',
    margin: '0 2px',
    borderRadius: '4px 4px 0 0',
  };

  const [heights, setHeights] = useState<number[]>([
    5 * scale,
    8 * scale,
    3 * scale,
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const getRandomHeight = () =>
        Math.floor(7 * scale * Math.random()) + 2 * scale;
      setHeights([getRandomHeight(), getRandomHeight(), getRandomHeight()]);
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: 9 * scale }}>
      <motion.div
        layout
        style={{
          ...defaultBarStyles,
          height: pause ? 5 * scale : heights[0],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        layout
        style={{
          ...defaultBarStyles,
          height: pause ? 8 * scale : heights[1],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        layout
        style={{
          ...defaultBarStyles,
          height: pause ? 3 * scale : heights[2],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
