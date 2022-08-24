import Link from 'next/link'

import Theme, { belowBreakpoint } from '../theme'
import { DefaultContentContainer } from './DefaultContentContainer'
import { handleDownload } from './sections/GetNotified'

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
              alignItems: 'center',
            }}
          >
            <Link href="/">
              <img
                src={require('../assets/ICON.png')}
                css={{
                  width: Theme.footer.images.md.width,
                  height: Theme.footer.images.md.height,
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
              <div onClick={handleDownload}>Download</div>
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
                href="mailto:help.leftonread@gmail.com"
              >
                Contact Us
              </a>
              <Link href="/privacy">
                <div>Privacy Policy</div>
              </Link>
              <Link href="/terms">
                <div>Terms</div>
              </Link>
            </div>
            <a href="https://github.com/Left-on-Read/leftonread">
              <img
                src={require('../assets/GitHub_Icon.png')}
                css={{
                  color: 'violet',
                  width: Theme.footer.images.sm.width,
                  height: Theme.footer.images.sm.width,
                }}
              />
            </a>
          </div>
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              marginTop: '28px',
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
            <div
              css={{
                textAlign: 'center',
              }}
            >
              © Left on Read 2022
            </div>
          </div>
        </div>
      </DefaultContentContainer>
    </footer>
  )
}
