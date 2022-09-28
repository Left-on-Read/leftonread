import { Box, Text } from '@chakra-ui/react';

import LogoWithText from '../../../../../assets/LogoWithText.svg';

export function WrappedIntro() {
  return (
    <Box
      height="100%"
      width="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '36px',
        borderRadius: 16,
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <div style={{ height: '10vh' }} />
      <Text fontSize="5xl" fontWeight="bold" color="black">
        Wrapped
      </Text>
      <Text>Sep 27, 2021 — Sep 27, 2022</Text>
      <div style={{ marginTop: '4vh', padding: '36px' }}>
        <img src={LogoWithText} alt="Left on Read" style={{ height: '100%' }} />
      </div>
    </Box>
  );
}
