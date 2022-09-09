import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Text } from '@chakra-ui/react'

import { LATEST_APP_VERSION_FOR_MARKETING_SITE } from '../../constants/APP_VERSION'
import { logEvent } from '../../utils/gtag'
import { DefaultContentContainer } from '../DefaultContentContainer'

export const handleDownload = () => {
  logEvent({
    action: 'download',
    category: 'Download',
  })
  window.location.href = `https://github.com/Left-on-Read/leftonread/releases/download/v${LATEST_APP_VERSION_FOR_MARKETING_SITE}/Left-on-Read-${LATEST_APP_VERSION_FOR_MARKETING_SITE}.dmg`
}

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
                base: '5xl',
                md: '6xl',
                lg: '7xl',
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
                onClick={handleDownload}
              >
                Download for Mac
              </Button>
            </Box>
          </Box>
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
