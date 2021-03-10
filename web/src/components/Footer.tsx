/** @jsx jsx */
import { jsx } from '@emotion/core'
import { DefaultContentContainer } from './DefaultContentContainer'
import Theme from '../theme'
import Link from 'next/link'

// NOTE(teddy): This is probably going to require a refactor to a column structure once we have more footer content.
export function Footer() {
  return (
    <footer
      css={{
        paddingTop: '80px',
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
              width: '100%',
            }}
          >
            <Link href="/">
              <img
                src={require('../assets/ICON.png')}
                css={{
                  width: '64px',
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
              }}
            >
              <a
                css={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                href="https://github.com/Left-on-Read/leftonread/issues/new?&labels=contact-us&template=contact_us.md"
              >
                Contact Us
              </a>
              <Link as="/privacy" href="/PrivacyPolicy">
                <div>Privacy Policy</div>
              </Link>
              <Link as="/terms" href="/TermsOfService">
                <div>Terms of Service</div>
              </Link>
            </div>
          </div>
          <div
            css={{
              marginTop: '48px',
            }}
          >
            © Left on Read 2021
          </div>
        </div>
      </DefaultContentContainer>
    </footer>
  )
}
