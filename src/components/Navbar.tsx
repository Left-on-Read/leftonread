/** @jsx jsx */
import { jsx } from '@emotion/core'
import IconTextLogo from '../assets/ICON_TEXT_LOGO.svg'
import { belowBreakpoint } from '../theme'
import { useRouter } from 'next/router'

import * as React from 'react'

// TODO(teddy): Once we implement more sections, turn these into working links
// TODO(teddy): Need to implement mobile navbar
export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const navigateHome = () => {
    router.push('/')
  }

  return (
    <>
      <div
        css={{
          height: '70px',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <IconTextLogo
          css={{
            width: '350px',
            [belowBreakpoint.lg]: {
              width: '300px',
            },
            [belowBreakpoint.md]: {
              display: 'none',
            },
            cursor: 'pointer',
          }}
          onClick={navigateHome}
        />
        <img
          src={require('../assets/ICON.png')}
          css={{
            width: '64px',
            display: 'none',
            [belowBreakpoint.md]: {
              display: 'block',
            },
            cursor: 'pointer',
          }}
          onClick={navigateHome}
        />
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '22px',
            fontWeight: 300,
            [belowBreakpoint.sm]: {
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
    </>
  )
}
