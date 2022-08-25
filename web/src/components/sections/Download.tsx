import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Text } from '@chakra-ui/react'

import { DefaultContentContainer } from '../DefaultContentContainer'

export function Download({
  ctaRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      bgGradient="linear(to-b, blue.50, green.50)"
      ref={ctaRef}
    >
      <DefaultContentContainer>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: 80,
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center', marginTop: 80 }}>
            {/* <Image src={'/ICON.png'} height={70} width={70} /> */}
            <Text
              fontSize={{
                base: '4xl',
                md: '5xl',
                lg: '6xl',
              }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
            >
              Get Left on Read
            </Text>
          </Box>

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text
              fontSize={{
                base: 'md',
                md: 'lg',
                lg: 'xl',
              }}
              textAlign={{
                base: 'center',
                lg: 'start',
              }}
            >
              Currently available on Mac OS and coming soon to other platforms.
            </Text>
            <Box shadow="xl">
              <Button
                colorScheme="purple"
                rightIcon={<DownloadIcon />}
                size="lg"
                style={{ marginTop: 40 }}
                // ref={ctaRef}
              >
                Download for Mac
              </Button>
            </Box>
          </Box>
          {/* <Box
            style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
            fontSize="2xl"
            fontWeight="extrabold"
          >
            <Text
              bgGradient="linear(to-br, orange.400, pink.500)"
              bgClip="text"
            >
              ✓ Open Source
            </Text>
            <Text
              bgGradient="linear(to-br, orange.400, pink.500)"
              bgClip="text"
            >
              ✓ Fun
            </Text>
            <Text
              bgGradient="linear(to-br, orange.400, pink.500)"
              bgClip="text"
            >
              ✓ Free to Try
            </Text>
          </Box> */}
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
