import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiShare } from 'react-icons/fi';

export function ShareIndicator() {
  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2vh',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 400,
            cursor: 'pointer',
          }}
        >
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: defaultTheme.colors.purple['100'],
              height: '5vh',
              width: '5vh',
              marginRight: '1vh',
            }}
          >
            <Icon as={FiShare} color="purple.500" />
          </Box>
          <Text fontSize="xl" color="purple.500">
            Share this story
          </Text>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
