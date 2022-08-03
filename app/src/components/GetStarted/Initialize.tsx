import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  CircularProgress,
  Collapse,
  Fade,
  Text,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TwoFactorAuth from '../../../assets/illustrations/two_factor_auth.svg';

const successGreen = 'green.400';
const errorRed = 'red.400';

function InitializeStep({
  title,
  description,
  actionFunc,
  triggered,
  onCompletion,
}: {
  title: string;
  description: string;
  actionFunc: () => Promise<void>;
  triggered: boolean;
  onCompletion: () => void;
}) {
  const [hasTriggeredAction, setHasTriggeredAction] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const triggerAction = async () => {
      setHasTriggeredAction(true);
      setIsRunning(true);
      try {
        await actionFunc();
        setIsSuccess(true);
        onCompletion();
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setIsRunning(false);
      }
    };

    if (triggered && !hasTriggeredAction) {
      triggerAction();
    }
  }, [triggered, actionFunc, hasTriggeredAction, onCompletion]);

  let color = 'black';
  if (isSuccess) {
    color = successGreen;
  } else if (error) {
    color = errorRed;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <CircularProgress
            isIndeterminate={isRunning}
            value={isSuccess || error ? 100 : 0}
            color={color}
            thickness="4px"
            size="30px"
          />
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Fade in={isSuccess || !!error}>
              {isSuccess && (
                <CheckIcon color={successGreen} width={3} height={3} />
              )}
              {error && <CloseIcon color={errorRed} width={3} height={3} />}
            </Fade>
          </div>
        </div>
        <Text
          fontWeight={800}
          color={color}
          style={{ transition: 'color 200ms ease-in-out', marginLeft: '8px' }}
        >
          {title}
        </Text>
      </div>
      <Collapse in={isRunning}>
        <Text size="s" color="gray">
          {description}
        </Text>
      </Collapse>
      <Collapse in={!!error}>
        <Text size="s" color={errorRed}>
          {error}
        </Text>
      </Collapse>
    </div>
  );
}

export function Initialize() {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        padding: '36px 48px',
      }}
    >
      <div
        style={{
          width: '50%',
          padding: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <InitializeStep
            title="Enabling Offline Mode"
            description="Left on Read runs offline to put your privacy first."
            actionFunc={() => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 3000);
              });
            }}
            triggered={step === 0}
            onCompletion={() => {
              setStep(step + 1);
            }}
          />
          <InitializeStep
            title="Checking Permissions"
            description="Left on Read reads directly off of your messages"
            actionFunc={async () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 3000);
              });
            }}
            triggered={step === 1}
            onCompletion={() => {
              setStep(step + 1);
            }}
          />
          {/* <InitializeStep
          title="Gathering and Parsing Contacts"
          description="Left on Read runs offline to put your privacy first."
          actionFunc={async () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 3000);
            });
          }}
          triggered={step === 2}
          onCompletion={() => {
            setStep(step + 1);
          }}
        /> */}
          <InitializeStep
            title="Creating Analysis Tables"
            description="Left on Read runs offline to put your privacy first."
            actionFunc={async () => {
              await ipcRenderer.invoke('initialize-tables');
            }}
            triggered={step === 2}
            onCompletion={() => {
              setStep(0);
            }}
          />
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
      <div
        style={{
          width: '50%',
          padding: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={TwoFactorAuth} alt="metrics" style={{ width: '80%' }} />
      </div>
    </div>
  );
}
