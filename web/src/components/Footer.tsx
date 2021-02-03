/** @jsx jsx */
import { jsx } from '@emotion/core'
import { DefaultContentContainer } from './DefaultContentContainer'
import Theme from '../theme'

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
            <img
              src={require('../assets/ICON.png')}
              css={{
                width: '64px',
              }}
            />
            <div
              css={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                fontSize: '18px',
              }}
            >
              <div>Contact Us</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
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
