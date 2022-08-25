import { Box, Icon, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiLayers, FiMap, FiUser } from 'react-icons/fi'

import Theme from '../theme'
import { DefaultContentContainer } from './DefaultContentContainer'
import { handleDownload } from './sections/GetNotified'

function LinkWrapper({ children }: { children: React.ReactNode }) {
  return <Box marginTop={{ base: 4 }}>{children}</Box>
}

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
            </Stack>
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
              <Link href="https://github.com/Left-on-Read/leftonread">
                Github
              </Link>
              <Link href="mailto:help.leftonread@gmail.com">Email</Link>
            </Stack>
          </Stack>
        </Box>
      </DefaultContentContainer>
    </footer>
  )
}

// NOTE(teddy): This is probably going to require a refactor to a column structure once we have more footer content.
export function Footer2() {
  return (
    <footer>
      <Box
        style={{ paddingTop: '80px', paddingBottom: '40px' }}
        bgColor="white"
      >
        <DefaultContentContainer>
          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              flexDirection={{
                base: 'column',
                md: 'row',
              }}
              alignItems={{
                base: 'start',
              }}
              style={{
                display: 'flex',
              }}
            >
              <Link href="/">
                <Image
                  src={'/ICON.png'}
                  style={{
                    width: Theme.footer.images.md.width,
                    height: Theme.footer.images.md.height,
                  }}
                  width={Theme.footer.images.md.width}
                  height={Theme.footer.images.md.height}
                />
              </Link>
              <Box
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
                flexDirection={{
                  base: 'column',
                }}
                alignItems={{
                  base: 'start',
                }}
              >
                <Box
                  onClick={handleDownload}
                  marginTop={{
                    base: 2,
                  }}
                >
                  Download
                </Box>
                <LinkWrapper>
                  <a
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                    href="https://github.com/Left-on-Read/leftonread/issues/new?&labels=contact-us&template=contact_us.md"
                  >
                    Feedback
                  </a>
                </LinkWrapper>

                <LinkWrapper>
                  <a
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                    href="mailto:help.leftonread@gmail.com"
                  >
                    Contact Us
                  </a>
                </LinkWrapper>

                <LinkWrapper>
                  <Link href="/privacy">
                    <div>Privacy Policy</div>
                  </Link>
                </LinkWrapper>
                <LinkWrapper>
                  <Link href="/terms">
                    <div>Terms</div>
                  </Link>
                </LinkWrapper>
              </Box>
              <LinkWrapper>
                <a href="https://github.com/Left-on-Read/leftonread">
                  <Image
                    src={'/GitHub_Icon.png'}
                    style={{
                      color: 'violet',
                      width: Theme.footer.images.sm.width,
                      height: Theme.footer.images.sm.width,
                    }}
                    width={Theme.footer.images.sm.width}
                    height={Theme.footer.images.sm.width}
                  />
                </a>
              </LinkWrapper>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '28px',
              }}
              flexDirection={{
                base: 'column',
              }}
              alignItems={{
                base: 'start',
              }}
            >
              <a
                data-testid="footer-anchor-vercel"
                href="https://vercel.com/?utm_source=leftonread&utm_campaign=oss"
              >
                <img
                  data-testid="footer-img-vercel"
                  src={
                    'https://raw.githubusercontent.com/Left-on-Read/leftonread/main/assets/documentation/powered-by-vercel.svg'
                  }
                />
              </a>
              <Box
                style={{
                  textAlign: 'center',
                }}
                marginTop={{
                  base: 4,
                }}
              >
                © Left on Read 2022
              </Box>
            </Box>
          </Box>
        </DefaultContentContainer>
      </Box>
    </footer>
  )
}
