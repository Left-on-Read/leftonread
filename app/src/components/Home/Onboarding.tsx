import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { GetStarted } from './GetStarted';
import { Permissions } from './Permissions';

export function Onboarding({ onInitialize }: { onInitialize: () => void }) {
  const [step, setStep] = useState<number>(0);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        layout
        style={{
          borderRadius: 16,
          backgroundColor: '#EDF2F7',
          padding: '36px 36px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          id="onboarding-container"
          key={step}
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.5 }}
          layout
        >
          {step === 0 && (
            <GetStarted
              onNext={(hasAccess: boolean) => {
                if (hasAccess) {
                  onInitialize();
                } else {
                  setStep(step + 1);
                }
              }}
            />
          )}
          {step === 1 && <Permissions />}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
