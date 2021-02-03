/** @jsx jsx */
import { jsx } from '@emotion/core'

function hexToRGBA(hex: string, alpha: number | string) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}

export default function HighlightedText({
  text,
  color,
  weight,
}: {
  text: string
  color: string
  weight?: number
}) {
  const highlightColor = hexToRGBA(color, 0.7)
  return (
    <span
      css={[
        {
          backgroundImage: `linear-gradient(
            to bottom,
            transparent,
            transparent 65%,
            ${highlightColor} 65%,
            ${highlightColor} 86%,
            transparent 86%,
            transparent
          )`,
        },
        weight && {
          fontWeight: weight,
        },
      ]}
    >
      {text}
    </span>
  )
}
