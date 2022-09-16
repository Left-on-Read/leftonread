import { Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { shuffleArray } from '../../main/util';

const PHRASES_IN_ORDER = [
  'Loading Left on Read analysis...',
  'This may take a few seconds...',
  'Thanks for your patience 🙏',
  'Labeling contacts...',
  'Coloring graphs 🌈 ...',
];

const PHRASES_SCRAMBLED = [
  'Discovering the meaning to life...',
  'Analyzing reactions...',
  'Determining emoji usage...',
  '👀 ...',
  'Loading group chat analysis...',
  'Creating filtering capabilites...',
  'Using sentiment analysis algorithm...',
  'Preparing bar charts 📊',
  'Drawing line charts 🖍️',
  'Powering pie charts with 🍩 ...',
  'Launching machine learning model...',
  'Making it pop 🎉',
  '🤤',
  'Almost done...',
];

shuffleArray(PHRASES_SCRAMBLED);
const PHRASES = PHRASES_IN_ORDER.concat(PHRASES_SCRAMBLED);

export function InitializingTextSlider() {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      let proposedCurrentIndex = currentItemIndex + 1;

      if (proposedCurrentIndex >= PHRASES.length - 1) {
        proposedCurrentIndex = Math.floor(Math.random() * PHRASES.length);
      } else {
        proposedCurrentIndex = (currentItemIndex + 1) % PHRASES.length;
      }

      setCurrentItemIndex(proposedCurrentIndex);
    }, 5000);
    return () => {
      clearInterval(id);
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
