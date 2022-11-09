import { Box, Text } from '@chakra-ui/react';

import Logo from '../../../assets/icon.svg';
import { Float } from '../Float';
import { Footer } from '../Footer';
import { Onboarding } from './Onboarding';

export function Home({ onInitialize }: { onInitialize: () => void }) {
  return (
    <Box
      p={{
        base: '24px 24px',
        sm: '24px 24px',
        lg: '48px 64px',
      }}
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div>
            <Float
              circleShadowDimensions={{
                marginTop: 12,
                width: 60,
              }}
            >
              <img src={Logo} alt="logo" style={{ width: 80, height: 80 }} />
            </Float>
            <Text
              bgGradient={['linear(to-r, blue.400, green.400)']}
              bgClip="text"
              fontSize={{ md: 'xl', lg: '2xl', xl: '3xl' }}
              fontWeight="bold"
              style={{
                width: 'fit-content',
                marginTop: 24,
              }}
            >
              WELCOME TO
            </Text>
            <Text
              bgGradient={['linear(to-r, purple.400, purple.300)']}
              bgClip="text"
              fontSize={{ md: '4xl', lg: '5xl', xl: '6xl' }}
              fontWeight="bold"
              style={{ marginTop: -10, width: 'fit-content' }}
            >
              LEFT ON READ
            </Text>
          </div>
          <div style={{ marginTop: 12 }}>
            <Text color="gray" fontSize="18px">
              What will your learn from your texts?
            </Text>
          </div>
        </div>
        <div style={{ width: '50%', display: 'flex' }}>
          <Box
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            p={{ base: '24px 12px' }}
          >
            <Onboarding onInitialize={onInitialize} />
          </Box>
        </div>
      </div>
      <Footer />
    </Box>
  );
}
