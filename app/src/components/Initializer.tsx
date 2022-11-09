import {
  Button,
  Icon,
  Text,
  theme as defaultTheme,
  useDisclosure,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { FiLifeBuoy, FiRepeat, FiSkipBack } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { BarChartLoading } from './Loaders/BarChartLoading';
import { InitializingTextSlider } from './Loaders/InitializingTextSlider';
import { EmailModal } from './Support/EmailModal';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function Initializer({
  isRefresh,
  isInitializing,
  onUpdateIsInitializing,
}: {
  isRefresh: boolean;
  isInitializing: boolean;
  onUpdateIsInitializing: (arg0: boolean) => void;
}) {
  const navigate = useNavigate();

  const [progressNumber, setProgressNumber] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  useEffect(() => {
    const id = setTimeout(() => {
      let proposedProgressNumber = randomIntFromInterval(1, 3) + progressNumber;
      if (proposedProgressNumber > 99) {
        proposedProgressNumber = 99;
        setProgressNumber(99);
      } else {
        setProgressNumber(proposedProgressNumber);
      }
    }, randomIntFromInterval(1000, 4000));
    return () => {
      clearInterval(id);
    };
  }, [progressNumber]);

  const initializeTables = useCallback(async () => {
    setProgressNumber(1);
    setError(null);
    setIsRunning(true);
    try {
      navigate('/start');
      await ipcRenderer.invoke('initialize-tables', isRefresh);
      setProgressNumber(99);
      navigate('/dashboard');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      onUpdateIsInitializing(false);
      setIsRunning(false);
    }
  }, [navigate, onUpdateIsInitializing, isRefresh]);

  useEffect(() => {
    if (isInitializing && !isRunning) {
      initializeTables();
    }
  }, [isInitializing, initializeTables, isRunning]);

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
                  <BarChartLoading pause={!!error} />
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
                      <Text fontSize="2xl">
                        Uh oh! Something went wrong... 😥
                      </Text>
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
                          style={{ marginRight: 32 }}
                        >
                          Contact Support
                        </Button>
                        <Button
                          colorScheme="gray"
                          shadow="xl"
                          leftIcon={<Icon as={FiSkipBack} />}
                          onClick={() => {
                            setError(null);
                            setIsRunning(false);
                            setProgressNumber(1);
                            onUpdateIsInitializing(false);
                            navigate('/start');
                          }}
                        >
                          Go Home
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <InitializingTextSlider />
                      <motion.div
                        layout
                        key={progressNumber}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Text
                          style={{ color: 'white', marginTop: 16 }}
                          fontSize="2xl"
                        >
                          {progressNumber}%
                        </Text>
                      </motion.div>
                    </>
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
