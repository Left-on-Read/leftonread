/** @jsx jsx */
import { jsx } from '@emotion/core'
import { DefaultContentContainer } from './DefaultContentContainer'
import Link from 'next/link'
import Theme, { belowBreakpoint } from '../theme'

// NOTE(teddy): This is probably going to require a refactor to a column structure once we have more footer content.
export function Footer() {
  return (
    <footer
      css={{
        marginTop: '20px',
        paddingTop: '40px',
        paddingBottom: '20px',
        backgroundColor: Theme.primary.faded,
      }}
    >
      <DefaultContentContainer>
        <div
          css={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            css={{
              display: 'flex',
            }}
          >
            <Link href="/">
              <img
                src={require('../assets/ICON.png')}
                css={{
                  width: '66px',
                  height: '62.4px',
                }}
              />
            </Link>
            <div
              css={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                fontSize: '18px',
                cursor: 'pointer',
                [belowBreakpoint.sm]: {
                  flexDirection: 'column',
                  lineHeight: '25px',
                },
              }}
            >
              <a
                css={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                href="https://github.com/Left-on-Read/leftonread/issues/new?&labels=contact-us&template=contact_us.md"
              >
                Feedback
              </a>
              <a
                css={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                href="mailto:alex.danilowicz@gmail.com"
              >
                Contact Us
              </a>
              <Link as="/privacy" href="/PrivacyPolicy">
                <div>Privacy Policy</div>
              </Link>
              <Link as="/terms" href="/TermsOfService">
                <div>Terms</div>
              </Link>
            </div>
          </div>
          <div
            css={{
              marginTop: '28px',
            }}
          >
            © Left on Read 2021
          </div>
        </div>
      </DefaultContentContainer>
    </footer>
  )
}
