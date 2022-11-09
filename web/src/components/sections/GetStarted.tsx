import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Text } from '@chakra-ui/react'
import Image from 'next/image'

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
      <Navbar onDownload={handleGetStarted} />
      {/* Contains landing content and image */}
      <Box
        display="flex"
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
        alignItems={{
          base: 'center',
        }}
      >
        {/* Contains just landing content */}
        <Box
          height={{
            base: '80vh',
            lg: '90vh',
          }}
          display="flex"
          flexDirection={{
            base: 'column',
          }}
          justifyContent={{
            base: 'center',
          }}
          alignItems={'flex-start'}
          width={{
            base: '100%',
            lg: '45%',
          }}
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
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            style={{ marginTop: 16, lineHeight: 1.4 }}
            color="gray"
          >
            Meet your new favorite Desktop app.
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
              md: 'xl',
              lg: '2xl',
            }}
            style={{ marginTop: 48 }}
            shadow="xl"
            padding={{
              sm: 3,
              lg: 7,
            }}
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
        <Box
          width={{ base: '100%', lg: '55%' }}
          height={{ base: 200, md: 300, lg: 400 }}
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
              md: -280,
              lg: -290,
            }}
            left={{
              base: -100,
              md: -50,
              lg: -150,
            }}
            height={{
              base: 600,
              md: 700,
              lg: 1000,
            }}
            width={{
              base: 600,
              md: 700,
              lg: 1000,
            }}
          >
            <Image src={'/floating_app_five.png'} layout="fill" />
          </Box>
        </Box>
      </Box>
    </DefaultContentContainer>
  )
}
