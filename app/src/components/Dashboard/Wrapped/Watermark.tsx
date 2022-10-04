import { AnimatePresence, motion } from 'framer-motion';

import LogoWithText from '../../../../assets/LogoWithText.svg';

export function Watermark() {
  return (
    <AnimatePresence>
      <motion.div style={{ position: 'absolute', top: 40, left: 30 }}>
        <img src={LogoWithText} alt="Left on Read" style={{ height: '3vh' }} />
      </motion.div>
    </AnimatePresence>
  );
}
