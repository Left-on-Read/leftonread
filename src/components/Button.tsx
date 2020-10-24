/** @jsx jsx */
import { jsx } from '@emotion/core'

import Theme, { belowBreakpoint } from '../theme'

export default function Button({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <button
      className={className}
      css={{
        backgroundColor: Theme.primary,
        padding: '16px 32px',
        fontSize: '26px',
        fontWeight: 300,
        borderRadius: '10px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Roboto',
        [belowBreakpoint.sm]: {
          padding: '12px 26px',
          fontSize: '22px',
        },
      }}
    >
      {label}
    </button>
  )
}
