import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import LogoWithText from '../../../assets/LogoWithText.svg';

export function GetStarted() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={LogoWithText}
        alt="Left on Read"
        style={{ height: '15vh', minHeight: '50px', maxWidth: '60vw' }}
      />
      <div style={{ width: '60vw', marginTop: 16 }}>
        {/* TODO: Update this copy */}
        <Text color="gray" fontSize="lg">
          {`
            Welcome to Left on Read! We are the internet's first and only text message analyzing platform. 
            Our platform runs completely offline. We are also open source.
            `}
        </Text>
      </div>
      <Button
        size="lg"
        style={{ marginRight: 16, marginTop: 32 }}
        rightIcon={<ArrowForwardIcon />}
        colorScheme="purple"
        onClick={() => {
          navigate('/initialize');
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
