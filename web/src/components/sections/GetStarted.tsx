import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Text } from '@chakra-ui/react'
import Image from 'next/Image'

import { MIN_HEIGHT } from '../../theme'
import { logEvent } from '../../utils/gtag'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Navbar } from '../Navbar'

export function GetStarted({
  ctaRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement>
}) {
  const handleGetStarted = () => {
    logEvent({
      action: 'clicked_top_level_download',
      category: 'Top Level Download',
    })

    if (ctaRef.current) {
      ctaRef.current?.scrollIntoView()
    }
  }

  return (
    <DefaultContentContainer>
      <Box
        style={{
          height: '100vh',
          minHeight: MIN_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Box
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Box style={{ width: '45%' }}>
            <Text
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
              style={{
                lineHeight: 1.3,
              }}
            >
              What will you learn from your texts?
            </Text>
            <Text
              fontSize="xl"
              style={{ marginTop: 16, lineHeight: 1.4 }}
              color="gray"
            >
              Learn about your friends and your texting habits with Left on
              Read, a secure iMessage analyzer made with ❤️
            </Text>
            <Button
              colorScheme="purple"
              onClick={handleGetStarted}
              data-testid="cta-button"
              size="lg"
              fontSize="2xl"
              style={{ padding: 28, marginTop: 48 }}
              shadow="xl"
              rightIcon={<ArrowForwardIcon />}
            >
              Get Started
            </Button>
          </Box>
          <Box style={{ width: '55%', position: 'relative' }}>
            {/* <Box
              style={{
                position: 'absolute',
                backgroundColor: 'lightgray',
                opacity: 0.4,
                width: 850,
                height: 30,
                borderRadius: '50%',
                top: 270,
                left: 150,
              }}
            /> */}
            {/* <Box
              style={{
                position: 'absolute',
                top: -500,
                left: -50,
                height: 850,
                width: 1000,
              }}
            >
              <Image src={'/floating_app.png'} layout="fill" />
            </Box> */}
            {/* <Box
              style={{
                position: 'absolute',
                top: -450,
                left: -150,
                height: 890,
                width: 1200,
              }}
            >
              <Image src={'/floating_app_three.png'} layout="fill" />
            </Box> */}
            {/* <Box
              style={{
                position: 'absolute',
                top: -550,
                left: -100,
                height: 950,
                width: 1200,
              }}
            >
              <Image src={'/floating_app_four.png'} layout="fill" />
            </Box> */}
            <Box
              style={{
                position: 'absolute',
                top: -500,
                left: -150,
                height: 1000,
                width: 1000,
                zIndex: -1,
              }}
            >
              <Image src={'/floating_app_five.png'} layout="fill" />
            </Box>
          </Box>
        </Box>
      </Box>
    </DefaultContentContainer>
  )
}
