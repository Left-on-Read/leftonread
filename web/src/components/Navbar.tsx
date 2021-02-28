/** @jsx jsx */
import { jsx } from '@emotion/core'
import IconTextLogo from '../assets/ICON_TEXT_LOGO.svg'
import { belowBreakpoint } from '../theme'
import { useRouter } from 'next/router'

import * as React from 'react'

export function Navbar() {
  const router = useRouter()

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
        </div>
      </div>
    </>
  )
}
