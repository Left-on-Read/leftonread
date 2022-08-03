import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingEllipsis() {
  const [numEllipsis, setNumEllipsis] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (numEllipsis === 3) {
        setNumEllipsis(0);
      } else {
        setNumEllipsis(numEllipsis + 1);
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [setNumEllipsis, numEllipsis]);

  return <motion.span>{Array(numEllipsis).fill('.').join('')}</motion.span>;
}
