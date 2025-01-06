import { Box, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { DefaultContentContainer } from './DefaultContentContainer'

export function Footer() {
  return (
    <footer>
      <DefaultContentContainer>
        <Box
          display="flex"
          justifyContent={{
            base: 'flex-start',
            md: 'space-around',
          }}
        >
          <Stack
            spacing={{
              base: 12,
              md: 14,
              lg: 48,
            }}
            marginBottom={8}
            direction={{
              base: 'column',
              md: 'row',
            }}
          >
            <Stack fontSize="md" fontWeight="light" spacing={4}>
              <Box
                height={{ base: '30px', lg: '50px' }}
                width={{ base: '200px', lg: '300px' }}
                style={{ position: 'relative', marginTop: 30 }}
              >
                <Image src={'/LogoWithText.svg'} layout="fill" />
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                {/* <Icon as={FiMap} style={{ marginRight: 8 }} /> */}
                San Francisco, USA
              </Box>
              <Box>© Left on Read 2025</Box>
            </Stack>
            <Stack style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Stack fontSize="md">
                <Text
                  fontWeight="medium"
                  fontSize="lg"
                  style={{ display: 'flex', alignItems: 'center' }}
                  marginTop={{
                    base: '0px',
                    md: '32px',
                  }}
                >
                  {/* <Icon as={FiLayers} style={{ marginRight: 8 }} /> */}
                  Product
                </Text>
                <Link href="/">Download</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
              </Stack>
              <iframe
                src="https://ghbtns.com/github-btn.html?user=Left-on-Read&repo=leftonread&type=star&count=true&size=large"
                frameBorder="0"
                scrolling="0"
                width="170"
                height="30"
                title="GitHub"
              ></iframe>
            </Stack>

            <Stack style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Stack>
                <Text
                  fontWeight="medium"
                  fontSize="lg"
                  style={{ display: 'flex', alignItems: 'center' }}
                  marginTop={{
                    base: '0px',
                    md: '32px',
                  }}
                >
                  {/* <Icon as={FiUser} style={{ marginRight: 8 }} /> */}
                  Contact & Support
                </Text>
                <Link href="mailto:help.leftonread@gmail.com">Email Us</Link>
                <Link href="https://github.com/Left-on-Read/leftonread">
                  Open-source on Github
                </Link>
                <Link href="https://billing.stripe.com/p/login/eVabK06mUcNG2oE6oo">
                  Manage Subscription
                </Link>{' '}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </DefaultContentContainer>
    </footer>
  )
}
