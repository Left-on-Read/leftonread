import { Box, Button, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'

import { belowBreakpoint } from '../theme'

export function Navbar({ onDownload }: { onDownload: () => void }) {
  const router = useRouter()

  const navigateHome = () => {
    router.push('/')
  }

  return (
    <>
      <Box
        style={{
          height: '70px',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <Image
          src={'/LogoWithText.svg'}
          width="250px"
          height="50px"
          style={{
            width: '350px',
            [belowBreakpoint.lg]: {
              width: '300px',
            },
            [belowBreakpoint.md]: {
              display: 'none',
            },
            cursor: 'pointer',
          }}
          onClick={navigateHome}
        />
        <Box
          style={{
            alignItems: 'center',
            fontSize: '22px',
            fontWeight: 300,
          }}
          display={{
            base: 'none',
            md: 'flex',
          }}
        >
          <Button
            variant="link"
            colorScheme="purple"
            onClick={() => onDownload()}
            style={{
              marginRight: 64,
            }}
          >
            <Text fontSize="xl" fontWeight="thin">
              Download
            </Text>
          </Button>
          <Button
            variant="link"
            colorScheme="purple"
            onClick={() => {
              window.location.assign('mailto:help.leftonread@gmail.com')
            }}
          >
            <Text fontSize="xl" fontWeight="thin">
              Contact Us
            </Text>
          </Button>
        </Box>
      </Box>
    </>
  )
}
