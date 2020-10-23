/** @jsx jsx */
import { jsx } from '@emotion/core'
import IconTextLogo from '../assets/ICON_TEXT_LOGO.svg'

// TODO(teddy): Once we implement more sections, turn these into working links
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
        }}
      />
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '22px',
          fontWeight: 300,
        }}
      >
        <div>About</div>
        <div
          css={{
            margin: '0 64px',
          }}
        >
          Download
        </div>
        <div>Contact Us</div>
      </div>
    </div>
  )
}
