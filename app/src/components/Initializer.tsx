import {
  Button,
  Icon,
  Text,
  theme as defaultTheme,
  useDisclosure,
} from '@chakra-ui/react';
import { EarliestAndLatestDateResults } from 'analysis/queries/EarliestAndLatestDatesQuery';
import { ipcRenderer } from 'electron';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { FiLifeBuoy, FiRepeat } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { BarChartLoading } from './Loaders/BarChartLoading';
import { InitializingTextSlider } from './Loaders/InitializingTextSlider';
import { EmailModal } from './Support/EmailModal';

export function Initializer({
  isInitializing,
  onUpdateIsInitializing,
  onUpdateEarliestAndLatestDates,
}: {
  isInitializing: boolean;
  onUpdateIsInitializing: (arg0: boolean) => void;
  onUpdateEarliestAndLatestDates: (arg0: {
    earliestDate: Date;
    latestDate: Date;
  }) => void;
}) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  const initializeTables = useCallback(async () => {
    setError(null);
    try {
      await ipcRenderer.invoke('initialize-tables');
      const datesDataList: EarliestAndLatestDateResults =
        await ipcRenderer.invoke('query-earliest-and-latest-dates');
      if (datesDataList && datesDataList.length === 1) {
        const earlyDate = datesDataList[0].earliest_date;
        const lateDate = datesDataList[0].latest_date;
        onUpdateEarliestAndLatestDates({
          earliestDate: new Date(earlyDate),
          latestDate: new Date(lateDate),
        });
      }
      navigate('/dashboard');
      onUpdateIsInitializing(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }, [navigate, onUpdateIsInitializing, onUpdateEarliestAndLatestDates]);

  useEffect(() => {
    if (isInitializing) {
      initializeTables();
    }
  }, [isInitializing, initializeTables]);

  return (
    <>
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={onEmailModalClose}
        defaultReason="support"
      />
      <AnimatePresence>
        {isInitializing && (
          <>
            <motion.div
              layout
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99,
                overflow: 'hidden',
              }}
            >
              <motion.div
                layout
                style={{
                  backgroundColor: defaultTheme.colors.purple['400'],
                  borderRadius: '50%',
                }}
                initial={{
                  width: 0,
                  height: 0,
                }}
                animate={{
                  width: 9999,
                  height: 9999,
                }}
                exit={{
                  width: 0,
                  height: 0,
                }}
                transition={{
                  duration: 1.5,
                }}
              />
            </motion.div>
            <motion.div
              layout
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99,
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  backgroundColor: defaultTheme.colors.purple['400'],
                  borderRadius: '50%',
                }}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <BarChartLoading
                    pause={!!error}
                    // colorOverride={defaultTheme.colors.red['300']}
                  />
                  {error ? (
                    <div
                      style={{
                        marginTop: 20,
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text fontSize="2xl">Uh oh! Something went wrong...</Text>
                      <Text
                        style={{ marginTop: 16 }}
                        fontSize="lg"
                        color="gray.800"
                        maxWidth="70vw"
                      >
                        {error}
                      </Text>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          color: 'black',
                          marginTop: 20,
                        }}
                      >
                        <Button
                          colorScheme="gray"
                          shadow="xl"
                          leftIcon={<Icon as={FiRepeat} />}
                          onClick={() => {
                            initializeTables();
                          }}
                          style={{ marginRight: 32 }}
                        >
                          Try Again
                        </Button>
                        <Button
                          colorScheme="gray"
                          shadow="xl"
                          leftIcon={<Icon as={FiLifeBuoy} />}
                          onClick={() => onEmailModalOpen()}
                        >
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <InitializingTextSlider />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
