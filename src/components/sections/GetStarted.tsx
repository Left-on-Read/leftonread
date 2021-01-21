/** @jsx jsx */
import { jsx } from '@emotion/core'

import { Navbar } from '../Navbar'
import Button from '../Button'
import { belowBreakpoint } from '../../theme'
import { Gradient } from '../Gradient'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Text } from '../Text'

const DISPLAY_TEXT = 'What can you learn from your texts?'
const DESCRIPTION_TEXT =
  'Trillions of text messages are sent daily between billions of people. See how you can communicate more effectively and efficiently.'

export function GetStarted() {
  return (
    <DefaultContentContainer>
      <div
        css={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Gradient />
        <Navbar />
        <div
          css={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [belowBreakpoint.sm]: {
              alignItems: 'center',
            },
          }}
        >
          <div
            css={{
              width: '60%',
              [belowBreakpoint.md]: {
                width: '80%',
              },
              [belowBreakpoint.sm]: {
                width: '100%',
              },
            }}
          >
            <Text type="display">{DISPLAY_TEXT}</Text>
            <Text
              type="paragraph"
              css={{
                marginTop: '26px',
              }}
            >
              {DESCRIPTION_TEXT}
            </Text>
            <Button
              label="Get Started →"
              css={{
                marginTop: '64px',
                [belowBreakpoint.sm]: { marginTop: '32px' },
              }}
            />
          </div>
        </div>
      </div>
    </DefaultContentContainer>
  )
}
