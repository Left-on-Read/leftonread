/** @jsx jsx */
import { jsx } from '@emotion/core'
import IconTextLogo from '../assets/ICON_TEXT_LOGO.svg'
import { belowBreakpoint } from '../theme'

// TODO(teddy): Once we implement more sections, turn these into working links
// TODO(teddy): Need to implement mobile navbar
export function Navbar() {
  return (
    <div
      css={{
        height: '80px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <IconTextLogo
        css={{
          width: '350px',
          [belowBreakpoint.lg]: {
            width: '300px',
          },
          [belowBreakpoint.md]: {
            width: '250px',
          },
          [belowBreakpoint.sm]: {
            display: 'none',
          },
        }}
      />
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '22px',
          fontWeight: 300,
          [belowBreakpoint.md]: {
            display: 'none',
          },
        }}
      >
        <div>About</div>
        <div
          css={{
            margin: '0 64px',
            [belowBreakpoint.lg]: {
              margin: '0 32px',
            },
          }}
        >
          Download
        </div>
        <div>Contact Us</div>
      </div>
    </div>
  )
}
