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
      <Navbar />
      {/* Contains landing content and image */}
      <Box
        display="flex"
        flexDirection={{
          base: 'column',
        }}
        alignItems={{
          base: 'center',
        }}
      >
        {/* Contains just landing content */}
        <Box
          height={{
            base: '80vh',
          }}
          display="flex"
          flexDirection={{
            base: 'column',
          }}
          justifyContent={{
            base: 'center',
          }}
          alignItems={'flex-start'}
        >
          <Text
            bgGradient="linear(to-r, blue.400, purple.400)"
            bgClip="text"
            fontSize={{ base: '5xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            lineHeight={{
              base: 1.2,
            }}
          >
            What will you learn from your texts?
          </Text>
          <Text
            fontSize={{ base: 'md', lg: 'xl' }}
            style={{ marginTop: 16, lineHeight: 1.4 }}
            color="gray"
          >
            Learn about your friends and your texting habits with Left on Read,
            a secure iMessage analyzer made with ❤️
          </Text>
          <Button
            colorScheme="purple"
            onClick={handleGetStarted}
            data-testid="cta-button"
            size={{
              base: 'lg',
            }}
            fontSize={{
              base: 'lg',
              lg: '2xl',
            }}
            style={{ marginTop: 48 }}
            shadow="xl"
            rightIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
        </Box>
        {/* <Box style={{ width: '55%', position: 'relative' }}>
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
          </Box> */}
      </Box>
      <Box
        width={{ base: '100%' }}
        height={{ base: '200px' }}
        display={{
          base: 'block',
          md: 'none',
        }}
        style={{
          position: 'relative',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            zIndex: -1,
          }}
          top={{
            base: -240,
          }}
          left={{
            base: -100,
          }}
          height={{
            base: 600,
          }}
          width={{
            base: 600,
          }}
        >
          <Image src={'/floating_app_five.png'} layout="fill" />
        </Box>
      </Box>
    </DefaultContentContainer>
  )
}
