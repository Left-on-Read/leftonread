import { Box, Text } from '@chakra-ui/react'

import { DefaultContentContainer } from '../DefaultContentContainer'

export function Security() {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      bgGradient="linear(to-b, purple.50, blue.50)"
    >
      <DefaultContentContainer>
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: 32,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          padding={{
            base: '10%',
            md: '5%',
            lg: '5%',
          }}
          margin={{
            base: '0',
            lg: '3%',
          }}
          bgGradient="linear(to-tr, #0695FF, #A334FA, #FF6968)"
          flexDirection={{
            base: 'column',
            lg: 'row',
          }}
        >
          <Box width={{ base: '100%', lg: '50%' }}>
            <Box
              fontSize={{
                base: '3xl',
                md: '4xl',
                lg: '5xl',
              }}
              fontWeight="extrabold"
              style={{
                lineHeight: 1.3,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Text color="white">For your eyes only 👀</Text>
            </Box>
            <Text
              fontSize={{
                base: 'md',
                lg: 'xl',
              }}
              marginTop={{
                base: 4,
                lg: 8,
              }}
              color="white"
            >
              Privacy and security come first. We analyze your texts locally on
              your Mac and only you have access to them. Your texting data is
              NEVER sent off your computer. To prove this to you, our software
              is entirely open-source and available on GitHub.
            </Text>
          </Box>
          <Box
            fontSize={{
              base: '2xl',
              md: '3xl',
              lg: '5xl',
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
            fontWeight="extrabold"
            marginY={{
              base: 4,
              lg: 0,
            }}
          >
            <Text
              // bgGradient="linear(to-br, white.300, black.200)"
              // bgClip="text"
              color="white"
              style={{ marginBottom: 16 }}
            >
              Open-Source
            </Text>
            <Text
              style={{ marginBottom: 16 }}
              // bgGradient="linear(to-br, orange.300, pink.200)"
              // bgClip="text"
              color="white"
            >
              Runs Offline
            </Text>
            <Text color="white">Free to Try</Text>
          </Box>
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
