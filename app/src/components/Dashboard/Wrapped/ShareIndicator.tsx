import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Text,
  theme as defaultTheme,
  useDisclosure,
} from '@chakra-ui/react';
import download from 'downloadjs';
import electron from 'electron';
import { AnimatePresence, motion } from 'framer-motion';
import { toBlob, toJpeg, toPixelData, toPng, toSvg } from 'html-to-image';
import { FiShare } from 'react-icons/fi';

import { WrappedShareModal } from './WrappedShareModal';

export function ShareIndicator({
  contentRef,
}: {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  //   const exportImg = async () => {
  //     if (!contentRef.current) {
  //       return;
  //     }

  //     const dataurl = await toPng(contentRef.current);
  //     const nativeImg = electron.nativeImage.createFromDataURL(dataurl);

  //     electron.clipboard.write({
  //       image: nativeImg,
  //     });
  //   };

  return (
    <>
      <AnimatePresence>
        <motion.div
          style={{
            position: 'absolute',
            bottom: '2vh',
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
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
            onClick={() => {
              onOpen();
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
      <WrappedShareModal
        isOpen={isOpen}
        onClose={onClose}
        contentRef={contentRef}
      />
    </>
  );
}
