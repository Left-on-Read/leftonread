import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { Button, Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiBarChart2, FiGlobe, FiLock } from 'react-icons/fi';

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

  const [thumbnail, setThumbnail] = useState<string>('');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    async function fetch() {
      const contacts = await ipcRenderer.invoke('get-contacts');
      console.log(contacts);

      const index = contacts.findIndex((c: any) => c.firstName === 'Teddy');

      const { contactThumbnailImage, contactImage } = contacts[index];
      console.log(contactImage, contactThumbnailImage);
      // const tb = contactThumbnailImage.toString('base64');
      // setThumbnail(tb);
      // const im = contactImage.toString('base64');
      // setImage(im);

      const myUrl = URL.createObjectURL(
        new Blob(
          [contactThumbnailImage.buffer],
          { type: 'image/png' } /* (1) */
        )
      );

      console.log(myUrl);
      setImage(myUrl);

      const url = URL.createObjectURL(
        new Blob([contactImage.buffer], { type: 'image/png' } /* (1) */)
      );

      console.log(url);

      setThumbnail(url);
    }
    fetch();
  }, []);

  const onStart = async () => {
    setIsLoading(true);
    const hasAccess = await ipcRenderer.invoke('check-permissions');
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
        icon={FiLock}
        title="Your Device Only"
        description="Just like your private photos and documents, your messages will remain accessible only by you. Your data will never leave your computer."
        color="blue.400"
      />
      <BulletPoint
        icon={FiGlobe}
        title="Open-Source"
        description="Security is our #1 priority, which is why this software is publicly available for anyone to audit."
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
      hello world
      <img
        id="na-img"
        src={image}
        style={{ borderRadius: '80%', width: '40px', height: '40px' }}
      />
      <img
        id="my-img"
        src={thumbnail}
        style={{ borderRadius: '80%', width: '40px', height: '40px' }}
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
