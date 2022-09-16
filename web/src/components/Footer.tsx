import { Box, Icon, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiLayers, FiMap, FiUser } from 'react-icons/fi'

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
                <Icon as={FiMap} style={{ marginRight: 8 }} />
                San Francisco, US
              </Box>
              <Box>© Left on Read 2022</Box>
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
                  <Icon as={FiLayers} style={{ marginRight: 8 }} />
                  Product
                </Text>
                <Link href="/">Download</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
              </Stack>
              <a
                rel="noreferrer"
                href="https://www.producthunt.com/posts/left-on-read?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-left&#0045;on&#0045;read"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=358899&theme=light"
                  alt="Left&#0032;on&#0032;Read - iMessages&#0032;supercharged | Product Hunt"
                  style={{
                    minHeight: '34px',
                    minWidth: '194px',
                    maxHeight: '42px',
                    maxWidth: '200px',
                  }}
                />
              </a>
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
                  <Icon as={FiUser} style={{ marginRight: 8 }} />
                  Contact
                </Text>
                <Link href="mailto:help.leftonread@gmail.com">Support</Link>
                <Link href="https://github.com/Left-on-Read/leftonread">
                  Github
                </Link>
              </Stack>
              <Box>
                <a
                  data-testid="footer-anchor-vercel"
                  href="https://vercel.com/?utm_source=leftonread&utm_campaign=oss"
                >
                  <img
                    data-testid="footer-img-vercel"
                    src={
                      'https://raw.githubusercontent.com/Left-on-Read/leftonread/main/assets/documentation/powered-by-vercel.svg'
                    }
                    style={{
                      minHeight: '34px',
                      minWidth: '194px',
                      maxHeight: '42px',
                      maxWidth: '200px',
                    }}
                  />
                </a>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </DefaultContentContainer>
    </footer>
  )
}
