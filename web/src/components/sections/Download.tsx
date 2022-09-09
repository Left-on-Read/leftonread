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
            marginTop: 40,
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center', marginTop: 80 }}>
            {/* <Image src={'/ICON.png'} height={70} width={70} /> */}
            <Text
              fontSize={{
                base: '4xl',
                md: '5xl',
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
              marginBottom: 60,
            }}
          >
            <Text
              fontSize={{
                base: 'lg',
                md: 'xl',
                lg: '2xl',
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
          <Box
            style={{
              backgroundColor: 'white',
              padding: '5%',
              borderRadius: 32,
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 120,
            }}
            margin={{
              base: '0',
              lg: '8%',
            }}
            bgGradient="linear(to-br, yellow.500, yellow.700)"
            flexDirection={{
              base: 'column',
              lg: 'row',
            }}
          >
            <Box width={{ base: '100%' }}>
              <Box
                style={{
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Text
                    color="white"
                    fontSize={{
                      base: '2xl',
                      md: '3xl',
                      lg: '4xl',
                    }}
                    fontWeight="extrabold"
                  >
                    Left on Read Gold 🌟
                  </Text>
                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 4,
                      lg: 8,
                    }}
                  >
                    Left on Read is free to try! To unlock more advanced
                    analytics and features, we offer Left on Read Gold for
                    $2.99/month.
                  </Text>
                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 4,
                      lg: 8,
                    }}
                  >
                    This helps us keep Left on Read running, and continue to
                    work on bringing exciting new features to you!
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
