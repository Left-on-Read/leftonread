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
            marginTop: 100,
            margin: '3% 3%',
            backgroundColor: 'white',
            padding: '5%',
            borderRadius: 32,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          bgGradient="linear(to-br, purple.700, purple.400)"
        >
          <div style={{ width: '50%' }}>
            <Box
              fontSize="5xl"
              fontWeight="extrabold"
              style={{
                lineHeight: 1.3,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Text color="white">For your eyes only 👀</Text>
            </Box>
            <Text fontSize="xl" style={{ marginTop: 32 }} color="white">
              Just like your private photos and important documents, your text
              messages are only accessible to you and never seen by us. Privacy
              and security comes first: our software is open-source.
            </Text>
          </div>
          <Box
            fontSize="5xl"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
            fontWeight="extrabold"
          >
            <Text
              bgGradient="linear(to-br, orange.100, pink.200)"
              bgClip="text"
              style={{ marginBottom: 16 }}
            >
              Open Source
            </Text>
            <Text
              style={{ marginBottom: 16 }}
              bgGradient="linear(to-br, orange.100, pink.200)"
              bgClip="text"
            >
              Runs Offline
            </Text>
            <Text
              bgGradient="linear(to-br, orange.100, pink.200)"
              bgClip="text"
            >
              Free to Try
            </Text>
          </Box>
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
