import { Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { shuffleArray } from '../../main/util';

const PHRASES_IN_ORDER = [
  'Initializing tables...',
  'Labeling contacts...',
  'Coloring graphs...',
];

const PHRASES_SCRAMBLED = [
  'Discovering the meaning to life...',
  'Sifting through 🍆...',
  'Analzying reactions...',
  'Determining emoji usage...',
  '👀...',
  'Loading group chat analysis...',
  'Creating filtering capabilites...',
  'Using sentiment analysis algorithm...',
  'Powering bar chart with 🍑...',
  'Powering line charts with ⛽...',
  'Powering pie charts with 🍩...',
  'Launching machine learning model...',
];

shuffleArray(PHRASES_SCRAMBLED);
const PHRASES = PHRASES_IN_ORDER.concat(PHRASES_SCRAMBLED);

export function InitializingTextSlider() {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setCurrentItemIndex((currentItemIndex + 1) % PHRASES.length),
      4500
    );
    return () => {
      clearInterval(id); // removes React warning when gets unmounted
    };
  }, [currentItemIndex]);

  const textToShow = PHRASES[currentItemIndex];
  return (
    <>
      <motion.div
        layout
        key={textToShow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Text style={{ color: 'white', marginTop: 16 }} fontSize="3xl">
          {textToShow}
        </Text>
      </motion.div>
    </>
  );
}
