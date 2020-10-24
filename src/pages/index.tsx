/** @jsx jsx */
import { jsx } from '@emotion/core'

import { DefaultPageContainer } from '../components/DefaultPageContainer'
import { Navbar } from '../components/Navbar'
import Button from '../components/Button'
import { belowBreakpoint } from '../theme'

const HEADER_TEXT = 'What can you learn from your texts?'
const DESCRIPTION_TEXT =
  'Trillions of text messages are sent daily between billions of people. See how you can communicate more effectively and efficiently.'

// TODO(teddy): Add a minheight
export default function Landing() {
  return (
    <DefaultPageContainer>
      <div
        css={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            <div
              css={{
                fontWeight: 500,
                fontSize: '80px',
                [belowBreakpoint.lg]: {
                  fontSize: '64px',
                },
                [belowBreakpoint.md]: {
                  fontSize: '58px',
                },
                [belowBreakpoint.sm]: {
                  fontSize: '50px',
                },
              }}
            >
              {HEADER_TEXT}
            </div>
            <div
              css={{
                marginTop: '26px',
                fontSize: '26px',
                [belowBreakpoint.sm]: {
                  fontSize: '20px',
                },
                fontWeight: 300,
              }}
            >
              {DESCRIPTION_TEXT}
            </div>
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
    </DefaultPageContainer>
  )
}
