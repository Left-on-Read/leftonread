/** @jsx jsx */
import { jsx } from '@emotion/core'

import { Navbar } from '../Navbar'
import Button from '../Button'
import { belowBreakpoint } from '../../theme'
import { Gradient } from '../Gradient'
import { DefaultContentContainer } from '../DefaultContentContainer'

const styles = {
  headerText: {
    fontWeight: 800,
    textStroke: '1px black',
    color: 'rgba(0, 0, 0, .72)',
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
  },
  descriptionText: {
    marginTop: '26px',
    fontSize: '26px',
    [belowBreakpoint.sm]: {
      fontSize: '20px',
    },
    fontWeight: 300,
  },
}

const HEADER_TEXT = 'What can you learn from your texts?'
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
            <div css={styles.headerText}>{HEADER_TEXT}</div>
            <div css={styles.descriptionText}>{DESCRIPTION_TEXT}</div>
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
