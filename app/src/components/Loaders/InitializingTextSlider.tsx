import { Text } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

const PHRASES = [
  'Labeling contacts...',
  'Discovering the meaning to life...',
  'Coloring graphs...',
];

export function InitializingTextSlider() {
  const [textToShow, setTextToShow] = useState<string>(
    'Initializing tables...'
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      let newText = textToShow;
      while (newText === textToShow) {
        newText = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      }
      setTextToShow(newText);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [textToShow]);

  return (
    <motion.div
      layout
      key={textToShow}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Text style={{ color: 'white', marginTop: 16 }} fontSize="xl">
        {textToShow}
      </Text>
    </motion.div>
  );
}
