/** @jsx jsx */
import * as React from 'react'
import { jsx } from '@emotion/core'

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
      }}
    >
      {children}
    </div>
  )
}
