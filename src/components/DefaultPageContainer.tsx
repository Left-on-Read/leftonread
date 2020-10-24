/** @jsx jsx */
import * as React from 'react'
import { jsx } from '@emotion/core'
import { belowBreakpoint } from '../theme'

export function DefaultPageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO(teddy): This padding needs to be responsive
  return (
    <div
      css={{
        padding: '0 128px',
        [belowBreakpoint.lg]: {
          padding: '0 64px',
        },
        [belowBreakpoint.sm]: {
          padding: '0 32px',
        },
      }}
    >
      {children}
    </div>
  )
}
