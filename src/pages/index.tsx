/** @jsx jsx */
import { jsx } from '@emotion/core'

import { DefaultPageContainer } from '../components/DefaultPageContainer'
import { Navbar } from '../components/Navbar'
import Button from '../components/Button'

const HEADER_TEXT = 'What can you learn from your texts?'
const DESCRIPTION_TEXT =
  'Trillions of text messages are sent daily between billions of people. See how you can communicate more effectively and efficiently.'

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
          }}
        >
          <div
            css={{
              width: '60%',
            }}
          >
            <div
              css={{
                fontSize: '72px',
                fontWeight: 500,
              }}
            >
              {HEADER_TEXT}
            </div>
            <div
              css={{
                marginTop: '26px',
                fontSize: '26px',
                fontWeight: 300,
              }}
            >
              {DESCRIPTION_TEXT}
            </div>
            <Button label="Get Started →" css={{ marginTop: '64px' }} />
          </div>
        </div>
      </div>
    </DefaultPageContainer>
  )
}
