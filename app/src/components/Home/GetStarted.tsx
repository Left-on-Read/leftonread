import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { Button, Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { FiBarChart2, FiGlobe, FiLock, FiShield } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';

function BulletPoint({
  icon,
  title,
  description,
  color,
}: {
  icon: IconType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', marginBottom: 32 }}>
      <div style={{ marginRight: '8px' }}>
        <Icon
          as={icon}
          color={color}
          w={{ lg: 6, xl: 7 }}
          h={{ lg: 6, xl: 7 }}
        />
      </div>
      <div>
        <Text
          color="black"
          fontWeight="bold"
          fontSize={{ lg: 'lg', xl: '2xl' }}
        >
          {title}
        </Text>
        <Text fontSize={{ lg: 'sm', xl: 'lg' }} color="gray">
          {description}
        </Text>
      </div>
    </div>
  );
}

export function GetStarted({ onNext }: { onNext: (arg0: boolean) => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onStart = async () => {
    setIsLoading(true);
    console.log('about to run check permissions...');
    const hasAccess = await ipcRenderer.invoke('check-permissions');
    console.log('check permissions finished...');
    logEvent({
      eventName: 'GET_STARTED',
      properties: {
        hasAccess,
      },
    });
    onNext(hasAccess);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <BulletPoint
        icon={FiShield}
        title="Your privacy comes first"
        description="For your privacy, we analyze your texts locally on your Mac. Only you have access to them. Texting data is never sent off your Mac."
        color="blue.400"
      />
      <BulletPoint
        icon={FiLock}
        title="Open-source and secure"
        description="Left on Read is open-source. You can take a look at the code yourself."
        color="blue.400"
      />
      <BulletPoint
        icon={FiBarChart2}
        title="Learn about your habits"
        description={`We render graphs about your text messages, 
so you can feel better about your relationship 
with your phone.`}
        color="blue.400"
      />
      <Button
        style={{ marginTop: 0 }}
        rightIcon={<ArrowForwardIcon />}
        colorScheme="purple"
        onClick={() => {
          onStart();
        }}
        shadow="xl"
        isLoading={isLoading}
      >
        Get Started
      </Button>
    </div>
  );
}
