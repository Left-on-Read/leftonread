import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import * as React from 'react'
import Marquee from 'react-fast-marquee'

import { DefaultContentContainer } from '../DefaultContentContainer'

export function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      marginTop={{
        base: '24px',
        lg: '24px',
      }}
      marginBottom={{
        base: '24px',
        lg: '24px',
      }}
      marginRight={{
        base: '24px',
        lg: '64px',
      }}
      marginLeft={{
        base: '24px',
        lg: '64px',
      }}
    >
      {children}
    </Box>
  )
}

export function Wrapped() {
  return (
    <Box
      height={{
        base: 'auto',
      }}
      style={{
        padding: '5%',
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: Theme.palette.frogGreen.faded,
        position: 'relative',
      }}
      bgGradient="linear(to-b, purple.50, purple.50)"
    >
      <div style={{ paddingBottom: '20px' }}>
        <DefaultContentContainer>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 8,
            }}
          >
            <Text
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
              fontSize={{
                base: '4xl',
                lg: '5xl',
              }}
              fontWeight="bold"
              textAlign={'center'}
            >
              {`iMessage Wrapped`}
            </Text>
            <Text
              fontSize={{
                base: 'md',
                md: 'lg',
              }}
              textAlign={'center'}
              style={{ margin: '12px 0' }}
            >
              Download today to revisit your funniest messages, group chats, and
              words of the year.
            </Text>
          </div>
          <Marquee
            style={{ backgroundColor: '#E9D8FD' }}
            gradientColor={[250, 245, 255]}
            speed={30}
            gradientWidth={100}
          >
            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Top Group Chat
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="blue.500"
                fontWeight="bold"
              >
                the chatgpt fam
              </Text>
            </MarqueeItem>

            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Top Friend
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="green.500"
                fontWeight="bold"
              >
                George
              </Text>
            </MarqueeItem>
            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Funniest Message
              </Text>
              <Text fontSize="md" color="teal.500" fontWeight="bold">
                Holy, I lost my air pods
              </Text>
            </MarqueeItem>

            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Sent
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="purple.500"
                fontWeight="bold"
              >
                8,482 texts
              </Text>
            </MarqueeItem>
            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Received
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="yellow.500"
                fontWeight="bold"
              >
                10,210 texts
              </Text>
            </MarqueeItem>
            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Top Word
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="orange.500"
                fontWeight="bold"
              >
                AI
              </Text>
            </MarqueeItem>
            <MarqueeItem>
              <Text
                fontSize={{
                  base: 'md',
                  lg: 'xl',
                }}
                fontWeight="medium"
              >
                Top Emoji
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  lg: '4xl',
                }}
                color="orange.500"
                fontWeight="bold"
              >
                🍆
              </Text>
            </MarqueeItem>
          </Marquee>
        </DefaultContentContainer>
      </div>
    </Box>
  )
}
